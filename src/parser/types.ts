export type TransactionType =
  | 'deposit'
  | 'debit'
  | 'withdrawal'
  | 'transfer_in'
  | 'transfer_out'
  | 'salary'
  | 'loan'
  | 'unknown'

export interface ParsedTransaction {
  id: string
  type: TransactionType
  amount: number
  balance: number | null
  counterparty: string
  date: string | null
  time: string | null
  reference: string | null
  storageMonth: string | null
  raw: string
  parsed: boolean
}

export interface ParseResult {
  transactions: ParsedTransaction[]
  skipped: string[]
  failed: string[]
}

export type FilterType = 'all' | TransactionType

export interface Summary {
  totalDeposits: number
  totalDebits: number
  totalWithdrawals: number
  netChange: number
  count: number
  latestBalance: number | null
}

export interface TabStats {
  totalAmount: number
  totalDeposits: number
  totalDebits: number
  totalWithdrawals: number
  transactionCount: number
  operationsCount: number
}
