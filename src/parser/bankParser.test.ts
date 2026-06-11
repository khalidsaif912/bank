import { describe, it, expect } from 'vitest'
import { parseBankMessages } from './bankParser'
import { SAMPLE_MESSAGES } from '../data/sampleMessages'

describe('bankParser', () => {
  it('parses sample messages with high accuracy', () => {
    const { transactions, failed, skipped } = parseBankMessages(SAMPLE_MESSAGES)

    expect(skipped.length).toBe(1)
    expect(failed.length).toBe(0)
    expect(transactions.length).toBe(11)

    const debit = transactions.find((t) => t.counterparty.includes('GENACOM'))
    expect(debit?.type).toBe('debit')
    expect(debit?.amount).toBe(1)

    const deposit = transactions.find((t) => t.counterparty.includes('HAMID'))
    expect(deposit?.type).toBe('deposit')
    expect(deposit?.amount).toBe(5)

    const withdrawal = transactions.find((t) => t.counterparty.includes('MUBA'))
    expect(withdrawal?.type).toBe('withdrawal')
    expect(withdrawal?.amount).toBe(8.5)

    const salary = transactions.find((t) => t.type === 'salary')
    expect(salary?.amount).toBe(902.7)

    const transferOut = transactions.find((t) => t.type === 'transfer_out')
    expect(transferOut?.amount).toBe(50)

    const transferIn = transactions.find((t) => t.type === 'transfer_in')
    expect(transferIn?.amount).toBe(30)

    const altDebit = transactions.find((t) => t.counterparty.includes('FANJA OFFSITE'))
    expect(altDebit?.type).toBe('debit')
    expect(altDebit?.amount).toBe(15)

    const mazoon = transactions.find((t) => t.counterparty.includes('Mazoon'))
    expect(mazoon?.type).toBe('debit')
    expect(mazoon?.amount).toBe(100)

    const loan = transactions.find((t) => t.type === 'loan')
    expect(loan?.amount).toBe(105.797)
  })
})
