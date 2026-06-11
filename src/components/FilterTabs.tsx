import type { FilterType, TabStats, TransactionType } from '../parser/types'
import { TYPE_LABELS, formatAmount, formatNumber } from '../parser/bankParser'

interface Props {
  active: FilterType
  onChange: (filter: FilterType) => void
  tabStats: Record<string, TabStats>
}

const FILTERS: FilterType[] = [
  'all',
  'deposit',
  'debit',
  'withdrawal',
  'transfer_in',
  'transfer_out',
  'salary',
]

export function FilterTabs({ active, onChange, tabStats }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
      {FILTERS.map((f) => {
        const label = f === 'all' ? 'الكل' : TYPE_LABELS[f as TransactionType]
        const stats = tabStats[f]
        const isActive = active === f

        return (
          <button
            key={f}
            type="button"
            onClick={() => onChange(f)}
            className={`shrink-0 rounded-2xl px-3 py-2 text-sm transition-all min-w-[88px] ${
              isActive
                ? 'bg-brand-700 text-white shadow-md shadow-brand-700/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-300'
            }`}
          >
            <span className="font-medium block">{label}</span>
            {stats && stats.transactionCount > 0 && (
              <span
                className={`block text-[10px] mt-0.5 leading-tight ${
                  isActive ? 'text-brand-100' : 'text-slate-400'
                }`}
              >
                {formatNumber(stats.transactionCount)} مع |{' '}
                {formatNumber(stats.operationsCount)} عمل
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

interface SummaryProps {
  filter: FilterType
  stats: TabStats
}

export function TabStatsSummary({ filter, stats }: SummaryProps) {
  if (stats.transactionCount === 0) return null

  const label = filter === 'all' ? 'الكل' : TYPE_LABELS[filter as TransactionType]

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
      <h3 className="text-sm font-semibold text-slate-700">
        ملخص تبويب «{label}»
      </h3>

      {filter === 'all' ? (
        <div className="grid grid-cols-2 gap-2">
          <StatItem
            label="مجموع الإيداعات"
            value={formatAmount(stats.totalDeposits)}
            color="text-deposit"
          />
          <StatItem
            label="مجموع الخصومات"
            value={formatAmount(stats.totalDebits)}
            color="text-debit"
          />
          <StatItem
            label="مجموع السحوبات"
            value={formatAmount(stats.totalWithdrawals)}
            color="text-withdraw"
          />
          <StatItem
            label="إجمالي الحركة"
            value={formatAmount(stats.totalAmount)}
            color="text-slate-700"
          />
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">المجموع</span>
          <span className="text-lg font-bold text-slate-800 tabular-nums" dir="ltr">
            {formatAmount(stats.totalAmount)}
            <span className="text-xs font-normal text-slate-400 mr-1">ر.ع</span>
          </span>
        </div>
      )}

      <div className="flex gap-4 pt-1 border-t border-slate-100">
        <div className="flex-1 text-center">
          <p className="text-xs text-slate-400">عدد المعاملات</p>
          <p className="text-base font-bold text-slate-800 tabular-nums" dir="ltr">
            {formatNumber(stats.transactionCount)}
          </p>
        </div>
        <div className="w-px bg-slate-100" />
        <div className="flex-1 text-center">
          <p className="text-xs text-slate-400">عدد العمليات</p>
          <p className="text-base font-bold text-slate-800 tabular-nums" dir="ltr">
            {formatNumber(stats.operationsCount)}
          </p>
        </div>
      </div>
    </div>
  )
}

function StatItem({
  label,
  value,
  color,
}: {
  label: string
  value: string
  color: string
}) {
  return (
    <div className="bg-slate-50 rounded-xl p-3">
      <p className="text-[11px] text-slate-500 mb-0.5">{label}</p>
      <p className={`text-sm font-bold tabular-nums ${color}`} dir="ltr">
        {value}
        <span className="text-[10px] font-normal text-slate-400 mr-1">ر.ع</span>
      </p>
    </div>
  )
}
