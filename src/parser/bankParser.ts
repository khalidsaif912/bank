import type { ParsedTransaction, ParseResult, TransactionType } from './types'

const MONTHS: Record<string, string> = {
  JAN: '01',
  FEB: '02',
  MAR: '03',
  APR: '04',
  MAY: '05',
  JUN: '06',
  JUL: '07',
  AUG: '08',
  SEP: '09',
  OCT: '10',
  NOV: '11',
  DEC: '12',
}

const CURRENCY = '(?:ر\\.?\\s*ع\\.?|OMR)\\s*'

function normalizeText(text: string): string {
  return text
    .replace(/\u0640/g, '')
    .replace(/[إأآ]/g, 'ا')
    .replace(/(?<=^|[\s])ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/\s+/g, ' ')
    .trim()
}

function parseAmount(raw: string): number {
  const cleaned = raw.replace(/[^\d.,]/g, '').replace(/,/g, '')
  return parseFloat(cleaned) || 0
}

function extractBalance(text: string): number | null {
  const patterns = [
    /الرصيد\s*المتوفر\s*(?:هو\s*)?(?:ر\.?\s*ع\.?|OMR)?\s*([\d.,]+)/i,
    /رصيدك\s*الا?ن\s*(?:OMR|ر\.?\s*ع\.?)?\s*([\d.,]+)/i,
  ]
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) return parseAmount(match[1])
  }
  return null
}

function extractReference(text: string): string | null {
  const match = text.match(
    /(?:الرقم\s*المرجعي(?:\s*هو)?|المرجعي\.?)\s*([A-Z0-9][A-Z0-9\s.]+?)(?:\s*\.|\s*الرصيد|$)/i,
  )
  return match ? match[1].replace(/\s+/g, ' ').trim() : null
}

function cleanName(name: string): string {
  return name
    .replace(/\\+/g, ' ')
    .replace(/#+/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\bOMN?\b/gi, '')
    .replace(/\bOM\b/gi, '')
    .replace(/\bDEU\b/gi, '')
    .replace(/\d{5,}/g, '')
    .trim()
}

function parseDateTime(text: string): { date: string | null; time: string | null } {
  const slashMatch = text.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/)
  if (slashMatch) {
    const [, day, month, year] = slashMatch
    return {
      date: `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`,
      time: null,
    }
  }

  const dashMatch = text.match(
    /(\d{1,2})[-/]([A-Z]{3})\s*,?\s*(\d{2}:\d{2}:\d{2})?/i,
  )
  if (dashMatch) {
    const [, day, monthStr, time] = dashMatch
    const month = MONTHS[monthStr.toUpperCase()] ?? '01'
    const year = new Date().getFullYear()
    return {
      date: `${year}-${month}-${day.padStart(2, '0')}`,
      time: time ?? null,
    }
  }

  const omrDateMatch = text.match(
    /(\d{1,2})-(\d{1,2})\s+(\d{4})\s+(\d{2}:\d{2})(?::\d{2})?/,
  )
  if (omrDateMatch) {
    const [, day, month, year, time] = omrDateMatch
    const fullTime = time.length === 5 ? `${time}:00` : time
    return {
      date: `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`,
      time: fullTime,
    }
  }

  const isoMatch = text.match(/(\d{2})-(\d{2})-(\d{4})/)
  if (isoMatch) {
    const [, day, month, year] = isoMatch
    return { date: `${year}-${month}-${day.padStart(2, '0')}`, time: null }
  }

  return { date: null, time: null }
}

function makeId(raw: string, index: number): string {
  const hash = raw.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return `tx-${hash}-${index}`
}

function buildTransaction(
  raw: string,
  index: number,
  fields: Omit<ParsedTransaction, 'id' | 'raw' | 'parsed' | 'storageMonth'>,
): ParsedTransaction {
  return {
    id: makeId(raw, index),
    raw,
    parsed: true,
    storageMonth: null,
    ...fields,
  }
}

function isJunkLine(line: string): boolean {
  const normalized = normalizeText(line)
  if (!normalized || normalized.length < 10) return true
  if (/حمل\s*التطبيق/i.test(normalized)) return true
  if (/^https?:\/\//i.test(normalized)) return true
  return false
}

function parseSalary(line: string, index: number): ParsedTransaction | null {
  const match = line.match(
    /(?:تم\s*)?ا?يداع\s*(?:راتب(?:ك)?\s*الشهري|الراتب\s*الشهري)\s*(?:OMR|ر\.?\s*ع\.?)?\s*([\d.,]+)/i,
  )
  if (!match) return null

  return buildTransaction(line, index, {
    type: 'salary',
    amount: parseAmount(match[1]),
    balance: extractBalance(line),
    counterparty: 'راتب شهري',
    date: null,
    time: null,
    reference: null,
  })
}

function parseLoan(line: string, index: number): ParsedTransaction | null {
  const match = line.match(
    /قسط\s*التمويل\s*الشخصي\s*([\d.,]+)/i,
  )
  if (!match) return null

  const dateMatch = line.match(/(\d{2}-\d{2}-\d{4})/)
  return buildTransaction(line, index, {
    type: 'loan',
    amount: parseAmount(match[1]),
    balance: null,
    counterparty: 'قسط تمويل شخصي',
    date: dateMatch ? dateMatch[1].split('-').reverse().join('-').replace(/(\d{4})-(\d{2})-(\d{2})/, '$1-$2-$3') : null,
    time: null,
    reference: line.match(/عقد\s*رقم\s*(\d+)/)?.[1] ?? null,
  })
}

function parseDeposit(line: string, index: number): ParsedTransaction | null {
  if (!/(?:تم\s*)?ا?يداع/i.test(line)) return null
  if (/راتب/i.test(line)) return null

  const amountMatch = line.match(
    new RegExp(`(?:تم\\s*)?ا?يداع\\s*${CURRENCY}?([\\d.,]+)`, 'i'),
  )
  if (!amountMatch) return null

  const amount = parseAmount(amountMatch[1])
  const balance = extractBalance(line)
  const reference = extractReference(line)
  const { date, time } = parseDateTime(line)

  let counterparty = 'إيداع'
  let type: TransactionType = 'deposit'

  const senderMatch = line.match(/\sمن\s+(.+?)(?:\.\s*الرصيد|$)/i)
  if (senderMatch) {
    counterparty = cleanName(senderMatch[1])
  } else if (/التحويل\s*المحلي/i.test(line)) {
    type = 'transfer_in'
    counterparty = reference ? `تحويل محلي (${reference})` : 'تحويل محلي'
  } else if (reference) {
    counterparty = `مرجع: ${reference}`
  }

  return buildTransaction(line, index, {
    type,
    amount,
    balance,
    counterparty,
    date,
    time,
    reference,
  })
}

function parseWithdrawal(line: string, index: number): ParsedTransaction | null {
  if (!/تم\s*سحب/i.test(line)) return null

  const amountMatch = line.match(
    new RegExp(`تم\\s*سحب\\s*${CURRENCY}?([\\d.,]+)`, 'i'),
  )
  if (!amountMatch) return null

  const amount = parseAmount(amountMatch[1])
  const balance = extractBalance(line)
  const { date, time } = parseDateTime(line)

  const toMatch = line.match(/\s(?:الى|الي|إلى)\s+(.+?)(?:\.\s*الرصيد|$)/i)
  if (toMatch) {
    return buildTransaction(line, index, {
      type: 'withdrawal',
      amount,
      balance,
      counterparty: cleanName(toMatch[1]),
      date,
      time,
      reference: null,
    })
  }

  const fromMatch = line.match(
    new RegExp(`تم\\s*سحب\\s*${CURRENCY}?[\\d.,]+\\s*من\\s+(.+?)(?:\\s+في\\s|\\s+الرصيد|$)`, 'i'),
  )
  if (fromMatch) {
    return buildTransaction(line, index, {
      type: 'debit',
      amount,
      balance,
      counterparty: cleanName(fromMatch[1]),
      date,
      time,
      reference: null,
    })
  }

  return buildTransaction(line, index, {
    type: 'withdrawal',
    amount,
    balance,
    counterparty: 'سحب',
    date,
    time,
    reference: null,
  })
}

function parseDebit(line: string, index: number): ParsedTransaction | null {
  if (!/(?:تم\s*)?(?:ال)?خصم/i.test(line)) return null
  if (/التحويل\s*الداخلي/i.test(line)) return null

  const amountMatch = line.match(
    new RegExp(`(?:تم\\s*)?(?:ال)?خصم\\s*${CURRENCY}?([\\d.,]+)`, 'i'),
  )
  if (!amountMatch) return null

  const amount = parseAmount(amountMatch[1])
  const balance = extractBalance(line)
  const { date, time } = parseDateTime(line)

  const merchantMatch = line.match(
    /(?:من\s*)?(?:حساب(?:ك)?\s*)?رقم\s+(.+?)(?:\s+في\s|\s+\d{1,2}[-/]\d|\s+الرصيد|$)/i,
  )
  const accountMatch = line.match(/من\s+حساب(?:ك)?\s+(\S+)\s+في/i)

  let counterparty = 'خصم'
  if (merchantMatch) {
    counterparty = cleanName(merchantMatch[1])
  } else if (accountMatch) {
    counterparty = `حساب ${accountMatch[1]}`
  }

  return buildTransaction(line, index, {
    type: 'debit',
    amount,
    balance,
    counterparty,
    date,
    time,
    reference: null,
  })
}

function parseInternalTransfer(line: string, index: number): ParsedTransaction | null {
  if (!/(?:تم\s*)?(?:ال)?خصم/i.test(line)) return null
  if (!/التحويل\s*الداخلي/i.test(line)) return null

  const amountMatch = line.match(
    new RegExp(`(?:تم\\s*)?(?:ال)?خصم\\s*${CURRENCY}?([\\d.,]+)`, 'i'),
  )
  if (!amountMatch) return null

  return buildTransaction(line, index, {
    type: 'transfer_out',
    amount: parseAmount(amountMatch[1]),
    balance: extractBalance(line),
    counterparty: 'تحويل داخلي',
    date: null,
    time: null,
    reference: extractReference(line),
  })
}

function parseLine(raw: string, index: number): ParsedTransaction | null {
  const line = normalizeText(raw)

  return (
    parseSalary(line, index) ??
    parseLoan(line, index) ??
    parseInternalTransfer(line, index) ??
    parseDeposit(line, index) ??
    parseWithdrawal(line, index) ??
    parseDebit(line, index)
  )
}

function mergeMessageLines(lines: string[]): string[] {
  const merged: string[] = []
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]
    const next = lines[i + 1]?.trim()
    if (next && /^رصيدك\s*(?:الآن|الان)/i.test(next)) {
      line = `${line} ${next}`
      i++
    }
    merged.push(line)
  }
  return merged
}

export function parseBankMessages(text: string): ParseResult {
  const lines = mergeMessageLines(
    text
      .split(/\n+/)
      .map((l) => l.trim())
      .filter(Boolean),
  )

  const transactions: ParsedTransaction[] = []
  const skipped: string[] = []
  const failed: string[] = []

  lines.forEach((line, index) => {
    if (isJunkLine(line)) {
      skipped.push(line)
      return
    }

    const parsed = parseLine(line, index)
    if (parsed) {
      transactions.push(parsed)
    } else {
      failed.push(line)
    }
  })

  return { transactions, skipped, failed }
}

export function deduplicateTransactions(
  transactions: ParsedTransaction[],
): ParsedTransaction[] {
  const seen = new Set<string>()
  return transactions.filter((tx) => {
    const key = `${tx.type}|${tx.amount}|${tx.counterparty}|${tx.date}|${tx.time}|${tx.balance}|${tx.storageMonth}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function sortTransactions(
  transactions: ParsedTransaction[],
): ParsedTransaction[] {
  return [...transactions].sort((a, b) => {
    if (a.date && b.date && a.date !== b.date) {
      return b.date.localeCompare(a.date)
    }
    if (a.time && b.time && a.time !== b.time) {
      return b.time.localeCompare(a.time)
    }
    return b.amount - a.amount
  })
}

export const TYPE_LABELS: Record<TransactionType, string> = {
  deposit: 'إيداع',
  debit: 'خصم',
  withdrawal: 'سحب',
  transfer_in: 'تحويل وارد',
  transfer_out: 'تحويل صادر',
  salary: 'راتب',
  loan: 'قسط تمويل',
  unknown: 'غير معروف',
}

export function formatNumber(value: number, decimals = 0): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function formatAmount(amount: number): string {
  return formatNumber(amount, 3)
}

export function formatDate(date: string | null, time: string | null): string {
  if (!date) return ''
  const parts = date.split('-')
  const formatted = `${parts[2]}/${parts[1]}/${parts[0]}`
  return time ? `${formatted} ${time}` : formatted
}
