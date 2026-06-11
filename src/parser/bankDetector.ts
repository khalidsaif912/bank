export interface BankInfo {
  id: string
  nameAr: string
  nameEn: string
  accent: string
  accentLight: string
}

interface BankPattern {
  id: string
  nameAr: string
  nameEn: string
  accent: string
  accentLight: string
  patterns: RegExp[]
  priority: number
}

const BANKS: BankPattern[] = [
  {
    id: 'nizwa',
    nameAr: 'بنك نزوى',
    nameEn: 'Bank Nizwa',
    accent: '#047857',
    accentLight: '#059669',
    priority: 10,
    patterns: [
      /banknizwa/i,
      /بنك\s*نزوى/i,
      /nizwa\s*bank/i,
    ],
  },
  {
    id: 'muscat',
    nameAr: 'بنك مسقط',
    nameEn: 'Bank Muscat',
    accent: '#003366',
    accentLight: '#004d99',
    priority: 10,
    patterns: [
      /bankmuscat/i,
      /بنك\s*مسقط/i,
      /bank\s*muscat/i,
    ],
  },
  {
    id: 'nbo',
    nameAr: 'البنك الوطني العماني',
    nameEn: 'NBO',
    accent: '#004B87',
    accentLight: '#0066b3',
    priority: 10,
    patterns: [
      /nationalbankoman/i,
      /\bnbo\.om/i,
      /البنك\s*الوطني\s*العماني/i,
    ],
  },
  {
    id: 'ahli',
    nameAr: 'البنك الأهلي',
    nameEn: 'Ahli Bank',
    accent: '#8B0000',
    accentLight: '#b22222',
    priority: 10,
    patterns: [/ahlibank/i, /البنك\s*الأهلي/i, /ahli\s*bank/i],
  },
  {
    id: 'hsbc',
    nameAr: 'إتش إس بي سي عُمان',
    nameEn: 'HSBC Oman',
    accent: '#DB0011',
    accentLight: '#ee0028',
    priority: 10,
    patterns: [/hsbc/i, /إتش\s*إس\s*بي\s*سي/i],
  },
  {
    id: 'sohar',
    nameAr: 'بنك صحار الدولي',
    nameEn: 'Sohar International',
    accent: '#1a5276',
    accentLight: '#2874a6',
    priority: 10,
    patterns: [/soharinternational/i, /بنك\s*صحار/i, /sohar\s*bank/i],
  },
  {
    id: 'meethaq',
    nameAr: 'ميثاق',
    nameEn: 'Meethaq',
    accent: '#00695c',
    accentLight: '#00897b',
    priority: 10,
    patterns: [/meethaq/i, /ميثاق/i],
  },
  {
    id: 'alizz',
    nameAr: 'Alizz الإسلامي',
    nameEn: 'Alizz Islamic Bank',
    accent: '#4a148c',
    accentLight: '#6a1b9a',
    priority: 10,
    patterns: [/alizzislamic/i, /alizz\s*bank/i, /العز\s*الإسلامي/i],
  },
]

const SALARY_LINE = /(?:تم\s*)?ا?يداع\s*راتب(?:ك)?\s*الشهري/i

function toBankInfo(bank: BankPattern): BankInfo {
  return {
    id: bank.id,
    nameAr: bank.nameAr,
    nameEn: bank.nameEn,
    accent: bank.accent,
    accentLight: bank.accentLight,
  }
}

function matchBank(text: string): BankPattern | null {
  for (const bank of BANKS) {
    for (const pattern of bank.patterns) {
      if (pattern.test(text)) return bank
    }
  }
  return null
}

function extractBankFromSalaryLine(line: string): BankInfo | null {
  if (!SALARY_LINE.test(line)) return null

  const fromMatch = line.match(
    /(?:من|عبر|لدى|through|from)\s+(بنك\s+[\u0600-\u06FF\s]+?)(?:\.|,|\s+الرصيد|$)/i,
  )
  if (fromMatch) {
    const name = fromMatch[1].trim()
    for (const bank of BANKS) {
      if (bank.patterns.some((p) => p.test(name))) return toBankInfo(bank)
    }
    return {
      id: 'custom',
      nameAr: name,
      nameEn: name,
      accent: '#047857',
      accentLight: '#059669',
    }
  }

  const matched = matchBank(line)
  return matched ? toBankInfo(matched) : null
}

export function detectBankFromMessages(text: string): BankInfo | null {
  const lines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean)
  let best: (BankInfo & { priority: number }) | null = null

  for (const line of lines) {
    const salaryHit = extractBankFromSalaryLine(line)
    if (salaryHit) {
      const priority = 30
      if (!best || priority > best.priority) {
        best = { ...salaryHit, priority }
      }
    }

    for (const bank of BANKS) {
      for (const pattern of bank.patterns) {
        if (pattern.test(line)) {
          const isSalary = SALARY_LINE.test(line)
          const priority = bank.priority + (isSalary ? 25 : 0)
          if (!best || priority > best.priority) {
            best = { ...toBankInfo(bank), priority }
          }
        }
      }
    }
  }

  if (!best) return null
  const { priority: _, ...info } = best
  return info
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
