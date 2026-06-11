import type { ParsedTransaction } from '../parser/types'
import {
  TYPE_LABELS,
  formatAmount,
  formatDate,
} from '../parser/bankParser'

interface Props {
  transaction: ParsedTransaction
  showBalance?: boolean
  showReference?: boolean
}

const TYPE_STYLES: Record<string, { badge: string; sign: string; icon: string }> = {
  deposit: { badge: 'bg-emerald-100 text-emerald-700', sign: '+', icon: '↓' },
  debit: { badge: 'bg-red-100 text-red-700', sign: '-', icon: '↑' },
  withdrawal: { badge: 'bg-amber-100 text-amber-700', sign: '-', icon: '↑' },
  transfer_in: { badge: 'bg-blue-100 text-blue-700', sign: '+', icon: '⇄' },
  transfer_out: { badge: 'bg-orange-100 text-orange-700', sign: '-', icon: '⇄' },
  salary: { badge: 'bg-teal-100 text-teal-700', sign: '+', icon: '💰' },
  loan: { badge: 'bg-purple-100 text-purple-700', sign: '-', icon: '📋' },
  unknown: { badge: 'bg-slate-100 text-slate-600', sign: '', icon: '?' },
}

function getCounterpartyLabel(tx: ParsedTransaction): string {
  switch (tx.type) {
    case 'deposit':
    case 'transfer_in':
    case 'salary':
      return `من: ${tx.counterparty}`
    case 'withdrawal':
    case 'transfer_out':
      return `إلى: ${tx.counterparty}`
    case 'debit':
      return `التاجر: ${tx.counterparty}`
    case 'loan':
      return tx.counterparty
    default:
      return tx.counterparty
  }
}

export function TransactionCard({
  transaction: tx,
  showBalance = true,
  showReference = true,
}: Props) {
  const style = TYPE_STYLES[tx.type] ?? TYPE_STYLES.unknown
  const isIncoming = ['deposit', 'transfer_in', 'salary'].includes(tx.type)

  return (
    <article className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div
            className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg ${style.badge}`}
          >
            {style.icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${style.badge}`}>
                {TYPE_LABELS[tx.type]}
              </span>
              {(tx.date || tx.time) && (
                <span className="text-xs text-slate-400">
                  {formatDate(tx.date, tx.time)}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-slate-800 mt-1 truncate">
              {getCounterpartyLabel(tx)}
            </h3>
            {showReference && tx.reference && (
              <p className="text-xs text-slate-400 mt-0.5 truncate">
                مرجع: {tx.reference}
              </p>
            )}
          </div>
        </div>
        <div className="text-left shrink-0" dir="ltr">
          <p
            className={`text-lg font-bold tabular-nums ${
              isIncoming ? 'text-deposit' : 'text-debit'
            }`}
          >
            {style.sign}
            {formatAmount(tx.amount)}
          </p>
          {showBalance && tx.balance !== null && (
            <p className="text-xs text-slate-400 tabular-nums mt-0.5">
              رصيد: {formatAmount(tx.balance)}
            </p>
          )}
        </div>
      </div>
    </article>
  )
}
