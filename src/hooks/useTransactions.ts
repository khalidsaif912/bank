import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FilterType, ParsedTransaction, Summary, TabStats } from '../parser/types'
import type { BankInfo } from '../parser/bankDetector'
import {
  detectBankFromMessages,
  detectBankFromTransactions,
} from '../parser/bankDetector'
import {
  assignStorageMonthForSalaryBatch,
  formatStorageMonthMessage,
} from '../utils/salaryBatch'
import {
  countUndated,
  filterByMonth,
  getAvailableMonths,
} from '../utils/monthUtils'
import {
  deduplicateTransactions,
  parseBankMessages,
  sortTransactions,
} from '../parser/bankParser'

const STORAGE_KEY = 'bank-sms-transactions'
const BANK_STORAGE_KEY = 'bank-sms-bank-info'

function computeSummary(transactions: ParsedTransaction[]): Summary {
  let totalDeposits = 0
  let totalDebits = 0
  let totalWithdrawals = 0
  let latestBalance: number | null = null

  for (const tx of transactions) {
    if (tx.type === 'deposit' || tx.type === 'transfer_in' || tx.type === 'salary') {
      totalDeposits += tx.amount
    } else if (tx.type === 'debit') {
      totalDebits += tx.amount
    } else if (
      tx.type === 'withdrawal' ||
      tx.type === 'transfer_out' ||
      tx.type === 'loan'
    ) {
      totalWithdrawals += tx.amount
    }
    if (tx.balance !== null) {
      latestBalance = tx.balance
    }
  }

  return {
    totalDeposits,
    totalDebits,
    totalWithdrawals,
    netChange: totalDeposits - totalDebits - totalWithdrawals,
    count: transactions.length,
    latestBalance,
  }
}

function countUniqueCounterparties(transactions: ParsedTransaction[]): number {
  const names = new Set(
    transactions.map((tx) => tx.counterparty.toLowerCase().trim()).filter(Boolean),
  )
  return names.size
}

function getTransactionsForFilter(
  transactions: ParsedTransaction[],
  filter: FilterType,
): ParsedTransaction[] {
  if (filter === 'all') return transactions
  return transactions.filter((tx) => tx.type === filter)
}

export function computeTabStats(
  transactions: ParsedTransaction[],
  filter: FilterType,
): TabStats {
  const txs = getTransactionsForFilter(transactions, filter)

  let totalDeposits = 0
  let totalDebits = 0
  let totalWithdrawals = 0

  for (const tx of txs) {
    if (tx.type === 'deposit' || tx.type === 'transfer_in' || tx.type === 'salary') {
      totalDeposits += tx.amount
    } else if (tx.type === 'debit') {
      totalDebits += tx.amount
    } else if (
      tx.type === 'withdrawal' ||
      tx.type === 'transfer_out' ||
      tx.type === 'loan'
    ) {
      totalWithdrawals += tx.amount
    }
  }

  return {
    totalAmount: txs.reduce((sum, tx) => sum + tx.amount, 0),
    totalDeposits,
    totalDebits,
    totalWithdrawals,
    transactionCount: txs.length,
    operationsCount: countUniqueCounterparties(txs),
  }
}

export function useTransactions(selectedMonth: string | null = null) {
  const [transactions, setTransactions] = useState<ParsedTransaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [filter, setFilter] = useState<FilterType>('all')
  const [search, setSearch] = useState('')
  const [lastParseInfo, setLastParseInfo] = useState<{
    added: number
    failed: number
    skipped: number
    storageMonth: string | null
    storageMessage: string | null
  } | null>(null)
  const [bankInfo, setBankInfo] = useState<BankInfo | null>(() => {
    try {
      const saved = localStorage.getItem(BANK_STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    if (bankInfo) {
      localStorage.setItem(BANK_STORAGE_KEY, JSON.stringify(bankInfo))
    } else {
      localStorage.removeItem(BANK_STORAGE_KEY)
    }
  }, [bankInfo])

  useEffect(() => {
    if (!bankInfo && transactions.length > 0) {
      const detected = detectBankFromTransactions(transactions)
      if (detected) setBankInfo(detected)
    }
  }, [transactions, bankInfo])

  const parseAndAdd = useCallback((text: string) => {
    const result = parseBankMessages(text)
    let sorted = sortTransactions(deduplicateTransactions(result.transactions))

    const { transactions: withMonth, storageMonth } =
      assignStorageMonthForSalaryBatch(sorted, text)
    sorted = withMonth

    const detected =
      detectBankFromMessages(text) ??
      detectBankFromTransactions(sorted)
    if (detected) setBankInfo(detected)

    setTransactions((prev) => {
      const merged = deduplicateTransactions([...sorted, ...prev])
      return sortTransactions(merged)
    })

    setLastParseInfo({
      added: result.transactions.length,
      failed: result.failed.length,
      skipped: result.skipped.length,
      storageMonth,
      storageMessage: storageMonth
        ? formatStorageMonthMessage(storageMonth)
        : null,
    })

    return { ...result, storageMonth }
  }, [])

  const clearAll = useCallback(() => {
    setTransactions([])
    setBankInfo(null)
    setLastParseInfo(null)
  }, [])

  const monthFiltered = useMemo(
    () => filterByMonth(transactions, selectedMonth),
    [transactions, selectedMonth],
  )

  const availableMonths = useMemo(
    () => getAvailableMonths(transactions),
    [transactions],
  )

  const undatedCount = useMemo(() => countUndated(transactions), [transactions])

  const filtered = useMemo(() => {
    return monthFiltered.filter((tx) => {
      if (filter !== 'all' && tx.type !== filter) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          tx.counterparty.toLowerCase().includes(q) ||
          tx.raw.toLowerCase().includes(q) ||
          (tx.reference?.toLowerCase().includes(q) ?? false)
        )
      }
      return true
    })
  }, [monthFiltered, filter, search])

  const summary = useMemo(() => computeSummary(monthFiltered), [monthFiltered])

  const activeTabStats = useMemo(
    () => computeTabStats(filtered, filter),
    [filtered, filter],
  )

  const groupedByDate = useMemo(() => {
    const groups = new Map<string, ParsedTransaction[]>()
    for (const tx of filtered) {
      const key = tx.date ?? 'بدون تاريخ'
      const list = groups.get(key) ?? []
      list.push(tx)
      groups.set(key, list)
    }
    return groups
  }, [filtered])

  return {
    transactions,
    filtered,
    groupedByDate,
    filter,
    setFilter,
    search,
    setSearch,
    parseAndAdd,
    clearAll,
    summary,
    activeTabStats,
    availableMonths,
    undatedCount,
    monthFiltered,
    bankInfo,
    lastParseInfo,
  }
}
