import { useState } from 'react'
import type { AppSettings } from '../hooks/useSettings'
import { formatNumber } from '../parser/bankParser'
import type { MonthInfo } from '../utils/monthUtils'
import { ConfirmDialog } from './ConfirmDialog'

interface Props {
  open: boolean
  onClose: () => void
  months: MonthInfo[]
  undatedCount: number
  totalCount: number
  selectedMonth: string | null
  onSelectMonth: (key: string | null) => void
  settings: AppSettings
  onUpdateSettings: (partial: Partial<AppSettings>) => void
  onClearAll: () => void
  bankName?: string | null
}

export function Sidebar({
  open,
  onClose,
  months,
  undatedCount,
  totalCount,
  selectedMonth,
  onSelectMonth,
  settings,
  onUpdateSettings,
  onClearAll,
  bankName,
}: Props) {
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const handleSelectMonth = (key: string | null) => {
    onSelectMonth(key)
    if (window.innerWidth < 1024) onClose()
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity lg:hidden ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden={!open}
      />

      <aside
        className={`fixed top-0 right-0 z-50 h-dvh bg-white border-l border-slate-200 shadow-2xl flex flex-col transition-all duration-300 ease-out lg:relative lg:shadow-none lg:shrink-0 ${
          open
            ? 'translate-x-0 w-[min(100vw-3rem,320px)] lg:w-72'
            : 'translate-x-full w-[min(100vw-3rem,320px)] lg:translate-x-0 lg:w-0 lg:border-0 lg:overflow-hidden lg:pointer-events-none'
        }`}
        aria-label="القائمة الجانبية"
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100 bg-brand-700 text-white shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-brand-600 transition-colors"
            aria-label="إغلاق القائمة"
          >
            ✕
          </button>
          <h2 className="font-bold text-base">القائمة</h2>
          <div className="w-8" />
        </div>

        <div className="flex-1 overflow-y-auto safe-bottom">
          <section className="p-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
              الأشهر المحفوظة
            </h3>
            <nav className="space-y-1">
              <MonthButton
                label="جميع الأشهر"
                count={totalCount}
                active={selectedMonth === null}
                onClick={() => handleSelectMonth(null)}
              />
              {months.map((month) => (
                <MonthButton
                  key={month.key}
                  label={month.label}
                  count={month.count}
                  active={selectedMonth === month.key}
                  onClick={() => handleSelectMonth(month.key)}
                />
              ))}
              {undatedCount > 0 && (
                <MonthButton
                  label="بدون تاريخ"
                  count={undatedCount}
                  active={selectedMonth === 'undated'}
                  onClick={() => handleSelectMonth('undated')}
                />
              )}
            </nav>
          </section>

          <section className="p-4 border-t border-slate-100">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
              الإعدادات
            </h3>
            <div className="space-y-3">
              <SettingToggle
                label="إظهار الرصيد"
                description="عرض الرصيد المتبقي في كل معاملة"
                checked={settings.showBalance}
                onChange={(v) => onUpdateSettings({ showBalance: v })}
              />
              <SettingToggle
                label="إظهار المرجع"
                description="عرض الرقم المرجعي للتحويلات"
                checked={settings.showReference}
                onChange={(v) => onUpdateSettings({ showReference: v })}
              />
            </div>
          </section>

          <section className="p-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="w-full py-3 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
            >
              مسح جميع البيانات
            </button>
          </section>
        </div>

        <ConfirmDialog
          open={showClearConfirm}
          title="مسح جميع البيانات"
          message="هل أنت متأكد من مسح جميع المعاملات المحفوظة؟ لا يمكن التراجع عن هذا الإجراء."
          confirmLabel="نعم، امسح الكل"
          cancelLabel="إلغاء"
          danger
          onConfirm={() => {
            onClearAll()
            setShowClearConfirm(false)
            onClose()
          }}
          onCancel={() => setShowClearConfirm(false)}
        />

        <div className="px-4 py-3 border-t border-slate-100 text-center shrink-0">
          <p className="text-[10px] text-slate-400">
            {bankName ? `${bankName} · ` : ''}محلل رسائل البنك
          </p>
        </div>
      </aside>
    </>
  )
}

function MonthButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors ${
        active
          ? 'bg-brand-50 text-brand-700 font-semibold border border-brand-200'
          : 'text-slate-600 hover:bg-slate-50 border border-transparent'
      }`}
    >
      <span>{label}</span>
      <span
        className={`text-xs tabular-nums px-2 py-0.5 rounded-full ${
          active ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-500'
        }`}
        dir="ltr"
      >
        {formatNumber(count)}
      </span>
    </button>
  )
}

function SettingToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer group">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <p className="text-xs text-slate-400 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative shrink-0 w-11 h-6 rounded-full transition-colors ${
          checked ? 'bg-brand-600' : 'bg-slate-200'
        }`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            checked ? 'right-0.5' : 'right-[calc(100%-1.375rem)]'
          }`}
        />
      </button>
    </label>
  )
}
