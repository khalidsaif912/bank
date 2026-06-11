import type { BankInfo } from '../parser/bankDetector'

interface Props {
  bank: BankInfo | null
  monthLabel: string | null
  onMenuClick: () => void
}

export function HeaderBanner({ bank, monthLabel, onMenuClick }: Props) {
  const accent = bank?.accent ?? '#047857'
  const accentLight = bank?.accentLight ?? '#059669'

  return (
    <header
      className="sticky top-0 z-20 text-white shadow-lg overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${accent} 0%, ${accentLight} 55%, ${accent}dd 100%)`,
      }}
    >
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative max-w-3xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-sm transition-colors text-lg shrink-0"
            aria-label="فتح القائمة"
          >
            ☰
          </button>

          <div className="flex-1 min-w-0 flex items-center gap-3">
            {bank ? (
              <>
                <div
                  className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 border border-white/30 shadow-inner"
                >
                  <span className="text-lg font-bold">
                    {(bank.nameAr.replace(/^بنك\s*/, '').charAt(0) ||
                      bank.nameAr.charAt(0)).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 text-right">
                  <h1 className="text-base font-bold leading-tight truncate">
                    {bank.nameAr}
                  </h1>
                  <p className="text-[11px] text-white/75 truncate mt-0.5">
                    {bank.nameEn}
                    {monthLabel ? ` · ${monthLabel}` : ' · جميع الأشهر'}
                  </p>
                </div>
              </>
            ) : (
              <div className="min-w-0 text-right flex-1">
                <h1 className="text-base font-bold leading-tight">
                  محلل رسائل البنك
                </h1>
                <p className="text-[11px] text-white/75 mt-0.5">
                  {monthLabel
                    ? monthLabel
                    : 'الصق رسائل الراتب لتحديد البنك تلقائياً'}
                </p>
              </div>
            )}
          </div>

          <div className="w-10 shrink-0 flex justify-center">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm border border-white/20">
              🏦
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
