import { useMemo } from 'react'
import { formatNumber } from '../parser/bankParser'
import type { ParsedTransaction } from '../parser/types'
import { TransactionCard } from './TransactionCard'

interface Props {
  grouped: Map<string, ParsedTransaction[]>
  total: number
  showBalance?: boolean
  showReference?: boolean
}

function formatGroupDate(dateKey: string): string {
  if (dateKey === 'بدون تاريخ') return dateKey
  const [year, month, day] = dateKey.split('-')
  const months = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
  ]
  return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`
}

export function TransactionList({
  grouped,
  total,
  showBalance = true,
  showReference = true,
}: Props) {
  const entries = useMemo(() => Array.from(grouped.entries()), [grouped])

  if (total === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="text-5xl mb-4 opacity-30">📱</div>
        <h3 className="font-semibold text-slate-600">لا توجد معاملات</h3>
        <p className="text-sm text-slate-400 mt-1">
          الصق رسائل البنك أعلاه لبدء التحليل
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {entries.map(([date, txs]) => (
        <section key={date}>
          <h3 className="text-sm font-semibold text-slate-500 mb-3 sticky top-[72px] bg-surface/90 backdrop-blur-sm py-1 z-10">
            {formatGroupDate(date)}
            <span className="text-slate-300 font-normal mr-2">({formatNumber(txs.length)})</span>
          </h3>
          <div className="space-y-2">
            {txs.map((tx) => (
              <TransactionCard
                key={tx.id}
                transaction={tx}
                showBalance={showBalance}
                showReference={showReference}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
