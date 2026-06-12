export interface OmanBank {
  id: string
  nameAr: string
  nameEn: string
  accent: string
  accentLight: string
  bgTint: string
  logoFile: string
  keywords: string[]
  patterns: RegExp[]
  priority: number
}

export const OMAN_BANKS: OmanBank[] = [
  {
    id: 'nizwa',
    nameAr: 'بنك نزوى',
    nameEn: 'Bank Nizwa',
    accent: '#5B2D8E',
    accentLight: '#7B3FA8',
    bgTint: '#f5f0fa',
    logoFile: 'nizwa.png',
    keywords: ['نزوى', 'nizwa', 'banknizwa'],
    patterns: [/banknizwa/i, /بنك\s*نزوى/i, /nizwa\s*bank/i],
    priority: 10,
  },
  {
    id: 'muscat',
    nameAr: 'بنك مسقط',
    nameEn: 'Bank Muscat',
    accent: '#E31837',
    accentLight: '#ff4d6a',
    bgTint: '#fff1f2',
    logoFile: 'muscat.png',
    keywords: ['مسقط', 'muscat', 'bankmuscat', 'ميثاق', 'meethaq'],
    patterns: [/bankmuscat/i, /بنك\s*مسقط/i, /bank\s*muscat/i, /meethaq/i, /ميثاق/i],
    priority: 10,
  },
  {
    id: 'nbo',
    nameAr: 'البنك الوطني العماني',
    nameEn: 'National Bank of Oman',
    accent: '#004B87',
    accentLight: '#0066b3',
    bgTint: '#eff6ff',
    logoFile: 'nbo.jpg',
    keywords: ['الوطني', 'nbo', 'national bank', 'مزن', 'muzn'],
    patterns: [/nationalbankoman/i, /\bnbo\.om/i, /\bnbo\b/i, /البنك\s*الوطني/i, /muzn/i, /مزن/i],
    priority: 10,
  },
  {
    id: 'ahli',
    nameAr: 'البنك الأهلي',
    nameEn: 'Ahli Bank',
    accent: '#8B0000',
    accentLight: '#b22222',
    bgTint: '#fef2f2',
    logoFile: 'ahli.jpg',
    keywords: ['الأهلي', 'ahli', 'ahlibank'],
    patterns: [/ahlibank/i, /البنك\s*الأهلي/i, /ahli\s*bank/i, /ahli\s*islamic/i],
    priority: 10,
  },
  {
    id: 'sohar',
    nameAr: 'بنك صحار الدولي',
    nameEn: 'Sohar International',
    accent: '#1a5276',
    accentLight: '#2874a6',
    bgTint: '#f0f9ff',
    logoFile: 'sohar.jpg',
    keywords: ['صحار', 'sohar'],
    patterns: [/soharinternational/i, /banksohar/i, /بنك\s*صحار/i, /sohar\s*bank/i, /sohar\s*islamic/i],
    priority: 10,
  },
  {
    id: 'oab',
    nameAr: 'بنك عمان العربي',
    nameEn: 'Oman Arab Bank',
    accent: '#1565C0',
    accentLight: '#1e88e5',
    bgTint: '#eff6ff',
    logoFile: 'oab.jpg',
    keywords: ['عمان العربي', 'oman arab', 'oab'],
    patterns: [/oman-arabbank/i, /omanarab/i, /بنك\s*عمان\s*العربي/i, /عمان\s*العربي/i],
    priority: 10,
  },
  {
    id: 'dhofar',
    nameAr: 'بنك ظفار',
    nameEn: 'Bank Dhofar',
    accent: '#2E7D32',
    accentLight: '#43a047',
    bgTint: '#f0fdf4',
    logoFile: 'dhofar.jpg',
    keywords: ['ظفار', 'dhofar'],
    patterns: [/bankdhofar/i, /بنك\s*ظفار/i, /dhofar\s*bank/i, /dhofar\s*islamic/i],
    priority: 10,
  },
  {
    id: 'alizz',
    nameAr: 'Alizz الإسلامي',
    nameEn: 'Alizz Islamic Bank',
    accent: '#4a148c',
    accentLight: '#6a1b9a',
    bgTint: '#faf5ff',
    logoFile: 'alizz.png',
    keywords: ['alizz', 'العز', 'al izz'],
    patterns: [/alizzislamic/i, /alizz\s*bank/i, /العز\s*الإسلامي/i, /al\s*izz/i],
    priority: 10,
  },
  {
    id: 'fab',
    nameAr: 'بنك أبوظبي الأول',
    nameEn: 'First Abu Dhabi Bank',
    accent: '#003087',
    accentLight: '#0047ab',
    bgTint: '#eff6ff',
    logoFile: 'fab.png',
    keywords: ['أبوظبي الأول', 'fab', 'abu dhabi'],
    patterns: [/fab\.com/i, /first\s*abu\s*dhabi/i, /بنك\s*أبوظبي/i, /أبوظبي\s*الأول/i],
    priority: 10,
  },
  {
    id: 'hsbc',
    nameAr: 'إتش إس بي سي عُمان',
    nameEn: 'HSBC Oman',
    accent: '#DB0011',
    accentLight: '#ee0028',
    bgTint: '#fff1f2',
    logoFile: 'hsbc.svg',
    keywords: ['hsbc', 'إتش إس بي سي'],
    patterns: [/hsbc/i, /إتش\s*إس\s*بي\s*سي/i],
    priority: 10,
  },
  {
    id: 'baroda',
    nameAr: 'بنك برودا',
    nameEn: 'Bank of Baroda',
    accent: '#F57C00',
    accentLight: '#ff9800',
    bgTint: '#fff7ed',
    logoFile: 'baroda.jpg',
    keywords: ['baroda', 'برودا'],
    patterns: [/bankofbaroda/i, /بنك\s*برودا/i, /baroda/i],
    priority: 8,
  },
  {
    id: 'beirut',
    nameAr: 'بنك بيروت',
    nameEn: 'Bank of Beirut',
    accent: '#C62828',
    accentLight: '#e53935',
    bgTint: '#fef2f2',
    logoFile: 'beirut.jpg',
    keywords: ['beirut', 'بيروت'],
    patterns: [/bankofbeirut/i, /بنك\s*بيروت/i, /beirut/i],
    priority: 8,
  },
  {
    id: 'melli',
    nameAr: 'بنك مelli إيران',
    nameEn: 'Bank Melli Iran',
    accent: '#1B5E20',
    accentLight: '#2e7d32',
    bgTint: '#f0fdf4',
    logoFile: 'melli.png',
    keywords: ['melli', 'ملي', 'ميلي'],
    patterns: [/bankmelli/i, /ملي/i, /ميلي/i, /melli\s*iran/i],
    priority: 7,
  },
  {
    id: 'saderat',
    nameAr: 'بنك صادرات إيران',
    nameEn: 'Bank Saderat Iran',
    accent: '#33691E',
    accentLight: '#558b2f',
    bgTint: '#f7fee7',
    logoFile: 'saderat.png',
    keywords: ['saderat', 'صادرات'],
    patterns: [/banksaderat/i, /صادرات\s*إيران/i, /saderat/i],
    priority: 7,
  },
  {
    id: 'housing',
    nameAr: 'بنك الإسكان العماني',
    nameEn: 'Oman Housing Bank',
    accent: '#00695C',
    accentLight: '#00897b',
    bgTint: '#ecfdf5',
    logoFile: 'housing.png',
    keywords: ['الإسكان', 'housing', 'ohb'],
    patterns: [/ohb\.co/i, /housing\s*bank/i, /بنك\s*الإسكان/i, /الإسكان\s*العماني/i],
    priority: 8,
  },
  {
    id: 'odb',
    nameAr: 'بنك التنمية',
    nameEn: 'Development Bank',
    accent: '#455A64',
    accentLight: '#607d8b',
    bgTint: '#f8fafc',
    logoFile: 'odb.png',
    keywords: ['التنمية', 'development bank', 'odb'],
    patterns: [/\bodb\b/i, /development\s*bank/i, /بنك\s*التنمية/i],
    priority: 7,
  },
]

export function getBankLogoUrl(logoFile: string): string {
  return `${import.meta.env.BASE_URL}banks/${logoFile}`
}

export function toBankInfo(bank: OmanBank) {
  return {
    id: bank.id,
    nameAr: bank.nameAr,
    nameEn: bank.nameEn,
    accent: bank.accent,
    accentLight: bank.accentLight,
    bgTint: bank.bgTint,
    logoFile: bank.logoFile,
  }
}

export type BankInfo = ReturnType<typeof toBankInfo>

export function findBankById(id: string): OmanBank | undefined {
  return OMAN_BANKS.find((b) => b.id === id)
}

export function findBankByKeyword(text: string): OmanBank | null {
  const lower = text.toLowerCase()
  for (const bank of OMAN_BANKS) {
    for (const kw of bank.keywords) {
      if (lower.includes(kw.toLowerCase())) return bank
    }
  }
  return null
}
