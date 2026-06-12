import {
  OMAN_BANKS,
  findBankByKeyword,
  toBankInfo,
  type BankInfo,
} from '../data/omanBanks'

export type { BankInfo }

const SALARY_LINE =
  /(?:تم\s*)?ا?يداع\s*راتب(?:ك)?\s*الشهري|راتب(?:ك)?\s*الشهري|راتب\s*شهري|monthly\s*salary/i

function matchBankInText(text: string) {
  for (const bank of OMAN_BANKS) {
    for (const pattern of bank.patterns) {
      if (pattern.test(text)) return bank
    }
  }
  return null
}

function extractBankFromSalaryLine(line: string): BankInfo | null {
  if (!SALARY_LINE.test(line)) return null

  const fromMatch = line.match(
    /(?:من|عبر|لدى|through|from|بواسطة)\s+((?:بنك\s+)?[\u0600-\u06FFa-zA-Z\s]+?)(?:\.|,|\s+الرصيد|\s+في\s+حساب|$)/i,
  )
  if (fromMatch) {
    const name = fromMatch[1].trim()
    const byKeyword = findBankByKeyword(name)
    if (byKeyword) return toBankInfo(byKeyword)

    const byPattern = matchBankInText(name)
    if (byPattern) return toBankInfo(byPattern)

    return {
      id: 'custom',
      nameAr: name,
      nameEn: name,
      accent: '#047857',
      accentLight: '#059669',
      bgTint: '#ecfdf5',
      logoFile: '',
    }
  }

  const byKeyword = findBankByKeyword(line)
  if (byKeyword) return toBankInfo(byKeyword)

  const matched = matchBankInText(line)
  return matched ? toBankInfo(matched) : null
}

export function detectBankFromMessages(text: string): BankInfo | null {
  const lines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean)
  let best: (BankInfo & { priority: number }) | null = null

  const setBest = (info: BankInfo, priority: number) => {
    if (!best || priority > best.priority) {
      best = { ...info, priority }
    }
  }

  for (const line of lines) {
    const salaryHit = extractBankFromSalaryLine(line)
    if (salaryHit) setBest(salaryHit, 50)

    const keywordHit = findBankByKeyword(line)
    if (keywordHit) {
      const isSalary = SALARY_LINE.test(line)
      setBest(toBankInfo(keywordHit), keywordHit.priority + (isSalary ? 40 : 0))
    }

    for (const bank of OMAN_BANKS) {
      for (const pattern of bank.patterns) {
        if (pattern.test(line)) {
          const isSalary = SALARY_LINE.test(line)
          setBest(toBankInfo(bank), bank.priority + (isSalary ? 35 : 0))
        }
      }
    }
  }

  if (!best) return null
  const { id, nameAr, nameEn, accent, accentLight, bgTint, logoFile } = best
  return { id, nameAr, nameEn, accent, accentLight, bgTint, logoFile }
}

export function detectBankFromTransactions(
  transactions: { raw: string; type: string }[],
): BankInfo | null {
  const salaryLines = transactions
    .filter((tx) => tx.type === 'salary')
    .map((tx) => tx.raw)

  for (const line of salaryLines) {
    const hit = extractBankFromSalaryLine(line)
    if (hit) return hit
  }

  const allText = transactions.map((tx) => tx.raw).join('\n')
  return detectBankFromMessages(allText)
}
