import { useState } from 'react'
import type { BankInfo } from '../data/omanBanks'
import { getBankLogoUrl } from '../data/omanBanks'

interface Props {
  bank: BankInfo | null
  monthLabel: string | null
  onMenuClick: () => void
}

export function HeaderBanner({ bank, monthLabel, onMenuClick }: Props) {
  const [shareTip, setShareTip] = useState<string | null>(null)
  const accent = bank?.accent ?? '#047857'
  const accentLight = bank?.accentLight ?? '#059669'

  const handleShare = async () => {
    const url = window.location.href
    const title = bank?.nameAr ?? 'محلل رسائل البنك'
    const text = 'تطبيق لتحليل رسائل البنك وتتبع الإيداعات والخصومات'

    const showTip = (msg: string) => {
      setShareTip(msg)
      setTimeout(() => setShareTip(null), 2500)
    }

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
        return
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
      }
    }

    try {
      await navigator.clipboard.writeText(url)
      showTip('تم نسخ الرابط')
    } catch {
      showTip('تعذر المشاركة')
    }
  }

  const subtitle = bank
    ? `${bank.nameEn}${monthLabel ? ` · ${monthLabel}` : ' · جميع الأشهر'}`
    : monthLabel
      ? monthLabel
      : 'الصق رسائل الراتب لتحديد البنك تلقائياً'

  return (
    <header
      className="sticky top-0 z-20 text-white shadow-lg overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${accent} 0%, ${accentLight} 55%, ${accent}dd 100%)`,
      }}
    >
      {bank?.logoFile && (
        <img
          src={getBankLogoUrl(bank.logoFile)}
          alt=""
          className="absolute -left-8 -bottom-6 w-36 h-36 opacity-10 object-contain pointer-events-none"
          draggable={false}
        />
      )}

      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative max-w-3xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-sm transition-colors text-lg shrink-0"
            aria-label="فتح القائمة"
          >
            ☰
          </button>

          <div className="flex-1 min-w-0 flex justify-center sm:justify-start">
            {bank ? (
              <div className="flex items-center gap-2.5 sm:gap-3 bg-white/95 text-slate-800 rounded-2xl px-2.5 sm:px-4 py-2 sm:py-2.5 shadow-lg border border-white/50 min-w-0 max-w-full">
                {bank.logoFile ? (
                  <div className="shrink-0 w-11 h-11 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl bg-white p-1 sm:p-1.5 shadow-inner ring-1 ring-black/5">
                    <img
                      src={getBankLogoUrl(bank.logoFile)}
                      alt={bank.nameAr}
                      className="max-w-full max-h-full w-auto h-auto object-contain"
                    />
                  </div>
                ) : (
                  <div
                    className="shrink-0 w-11 h-11 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-lg sm:text-xl font-bold text-white shadow-inner"
                    style={{ background: `linear-gradient(135deg, ${accent}, ${accentLight})` }}
                  >
                    {(bank.nameAr.replace(/^بنك\s*/, '').charAt(0) ||
                      bank.nameAr.charAt(0)).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0 flex-1 text-right border-r-2 border-slate-100 pr-2.5 sm:pr-3">
                  <h1 className="text-sm sm:text-base font-bold leading-tight truncate text-slate-900">
                    {bank.nameAr}
                  </h1>
                  <p className="text-[10px] sm:text-xs text-slate-500 truncate mt-0.5">
                    {subtitle}
                  </p>
                </div>
              </div>
            ) : (
              <div className="min-w-0 text-right flex-1 px-1">
                <h1 className="text-base font-bold leading-tight">
                  محلل رسائل البنك
                </h1>
                <p className="text-[11px] text-white/75 mt-0.5 truncate">
                  {subtitle}
                </p>
              </div>
            )}
          </div>

          <div className="relative shrink-0">
            <button
              type="button"
              onClick={handleShare}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-sm transition-colors text-lg"
              aria-label="مشاركة التطبيق"
              title="مشاركة"
            >
              ↗
            </button>
            {shareTip && (
              <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 whitespace-nowrap text-[10px] bg-black/70 text-white px-2 py-1 rounded-lg z-30">
                {shareTip}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
