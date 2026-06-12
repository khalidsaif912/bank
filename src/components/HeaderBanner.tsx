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
          className="absolute -left-6 -bottom-4 w-28 h-28 opacity-15 object-contain pointer-events-none"
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
                <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center shrink-0 border border-white/40 shadow-md overflow-hidden p-1">
                  {bank.logoFile ? (
                    <img
                      src={getBankLogoUrl(bank.logoFile)}
                      alt={bank.nameAr}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-lg font-bold text-slate-700">
                      {(bank.nameAr.replace(/^بنك\s*/, '').charAt(0) ||
                        bank.nameAr.charAt(0)).toUpperCase()}
                    </span>
                  )}
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
              <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 whitespace-nowrap text-[10px] bg-black/70 text-white px-2 py-1 rounded-lg">
                {shareTip}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
