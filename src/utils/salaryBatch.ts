import type { ParsedTransaction } from '../parser/types'
import { formatMonthLabel } from './monthUtils'

const SALARY_PATTERN = /(?:تم\s*)?ا?يداع\s*راتب(?:ك)?\s*الشهري/i

export function batchContainsSalary(text: string): boolean {
  return text.split(/\n+/).some((line) => SALARY_PATTERN.test(line.trim()))
}

export function computeNextMonthKey(reference: Date): string {
  const next = new Date(reference.getFullYear(), reference.getMonth() + 1, 1)
  const month = String(next.getMonth() + 1).padStart(2, '0')
  return `${next.getFullYear()}-${month}`
}

export function getReferenceDateFromBatch(
  transactions: ParsedTransaction[],
): Date | null {
  let latest: string | null = null
  for (const tx of transactions) {
    if (tx.date && (!latest || tx.date > latest)) latest = tx.date
  }
  if (!latest) return null
  const [year, month, day] = latest.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function assignStorageMonthForSalaryBatch(
  transactions: ParsedTransaction[],
  rawText: string,
): { transactions: ParsedTransaction[]; storageMonth: string | null } {
  if (!batchContainsSalary(rawText)) {
    return { transactions, storageMonth: null }
  }

  const reference = getReferenceDateFromBatch(transactions) ?? new Date()
  const storageMonth = computeNextMonthKey(reference)

  return {
    storageMonth,
    transactions: transactions.map((tx) => ({ ...tx, storageMonth })),
  }
}

export function getTransactionMonthKey(tx: {
  date: string | null
  storageMonth?: string | null
}): string | null {
  return tx.storageMonth ?? (tx.date ? tx.date.slice(0, 7) : null)
}

export function formatStorageMonthMessage(storageMonth: string): string {
  return `تم حفظ المعاملات لشهر ${formatMonthLabel(storageMonth)}`
}
