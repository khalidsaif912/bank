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

  it('parses OMR format with split balance line', () => {
    const text = `تم خصم OMR 30.000 من حسابك 017**1058 في 11-06 2026 19:40.
رصيدك الآنOMR 106.148.`
    const { transactions, failed } = parseBankMessages(text)

    expect(failed.length).toBe(0)
    expect(transactions.length).toBe(1)

    const tx = transactions[0]
    expect(tx.type).toBe('debit')
    expect(tx.amount).toBe(30)
    expect(tx.balance).toBe(106.148)
    expect(tx.counterparty).toContain('017**1058')
    expect(tx.date).toBe('2026-06-11')
    expect(tx.time).toBe('19:40:00')
  })
})
