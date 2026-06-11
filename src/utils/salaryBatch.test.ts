import { describe, it, expect } from 'vitest'
import { assignStorageMonthForSalaryBatch, batchContainsSalary } from './salaryBatch'
import type { ParsedTransaction } from '../parser/types'

function makeTx(date: string | null): ParsedTransaction {
  return {
    id: '1',
    type: 'debit',
    amount: 10,
    balance: 100,
    counterparty: 'test',
    date,
    time: null,
    reference: null,
    storageMonth: null,
    raw: 'test',
    parsed: true,
  }
}

describe('salaryBatch', () => {
  it('detects salary in text', () => {
    expect(batchContainsSalary('تم إيداع راتبك الشهري 902.700')).toBe(true)
    expect(batchContainsSalary('تم خصm 1.000')).toBe(false)
  })

  it('assigns next month when salary is in batch', () => {
    const txs = [makeTx('2026-06-11'), makeTx('2026-06-01')]
    const salaryText = 'تم إيداع راتبك الشهري 902.700 في حسابك'
    const { storageMonth, transactions } = assignStorageMonthForSalaryBatch(
      txs,
      `${salaryText}\n${txs[0].raw}`,
    )
    expect(storageMonth).toBe('2026-07')
    expect(transactions.every((tx) => tx.storageMonth === '2026-07')).toBe(true)
  })

  it('does not assign month without salary', () => {
    const txs = [makeTx('2026-06-11')]
    const { storageMonth, transactions } = assignStorageMonthForSalaryBatch(
      txs,
      txs[0].raw,
    )
    expect(storageMonth).toBeNull()
    expect(transactions[0].storageMonth).toBeNull()
  })
})
