import type { Summary } from '../parser/types'
import { formatAmount } from '../parser/bankParser'

interface Props {
  summary: Summary
  showBalance?: boolean
}

export function SummaryCards({ summary, showBalance = true }: Props) {
  const cards = [
    {
      label: 'إجمالي الإيداعات',
      value: summary.totalDeposits,
      color: 'text-deposit',
      bg: 'bg-emerald-50',
    },
    {
      label: 'إجمالي الخصومات',
      value: summary.totalDebits,
      color: 'text-debit',
      bg: 'bg-red-50',
    },
    {
      label: 'إجمالي السحوبات',
      value: summary.totalWithdrawals,
      color: 'text-withdraw',
      bg: 'bg-amber-50',
    },
    {
      label: 'آخر رصيد',
      value: summary.latestBalance ?? 0,
      color: 'text-brand-700',
      bg: 'bg-brand-50',
      hide: !showBalance || summary.latestBalance === null,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards
        .filter((c) => !c.hide)
        .map((card) => (
          <div
            key={card.label}
            className={`${card.bg} rounded-2xl p-4 shadow-sm border border-white/60`}
          >
            <p className="text-xs text-slate-500 font-medium mb-1">{card.label}</p>
            <p className={`text-lg font-bold tabular-nums ${card.color}`} dir="ltr">
              {formatAmount(card.value)}
              <span className="text-xs font-normal text-slate-400 mr-1">ر.ع</span>
            </p>
          </div>
        ))}
    </div>
  )
}
