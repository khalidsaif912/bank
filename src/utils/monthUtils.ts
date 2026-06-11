const MONTH_NAMES = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
]

export interface MonthInfo {
  key: string
  label: string
  count: number
}

export function formatMonthLabel(key: string): string {
  const [year, month] = key.split('-')
  return `${MONTH_NAMES[parseInt(month, 10) - 1]} ${year}`
}

export function getMonthKey(
  tx: { date: string | null; storageMonth?: string | null },
): string | null {
  return tx.storageMonth ?? (tx.date ? tx.date.slice(0, 7) : null)
}

export function getAvailableMonths(
  transactions: { date: string | null; storageMonth?: string | null }[],
): MonthInfo[] {
  const counts = new Map<string, number>()

  for (const tx of transactions) {
    const key = getMonthKey(tx)
    if (!key) continue
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  return Array.from(counts.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, count]) => ({
      key,
      label: formatMonthLabel(key),
      count,
    }))
}

export function countUndated(
  transactions: { date: string | null; storageMonth?: string | null }[],
): number {
  return transactions.filter((tx) => !getMonthKey(tx)).length
}

export function filterByMonth<
  T extends { date: string | null; storageMonth?: string | null },
>(transactions: T[], selectedMonth: string | null): T[] {
  if (!selectedMonth) return transactions
  if (selectedMonth === 'undated') {
    return transactions.filter((tx) => !getMonthKey(tx))
  }
  return transactions.filter((tx) => getMonthKey(tx) === selectedMonth)
}
