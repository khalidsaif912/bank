import type { ReactNode } from 'react'
import type { BankInfo } from '../data/omanBanks'
import { getBankLogoUrl } from '../data/omanBanks'

interface Props {
  bank: BankInfo | null
  children: ReactNode
}

export function BankTheme({ bank, children }: Props) {
  const tint = bank?.bgTint ?? '#f8fafc'
  const accent = bank?.accent ?? '#047857'

  return (
    <div
      className="relative min-h-dvh flex flex-col min-w-0"
      style={{ backgroundColor: tint }}
    >
      {bank?.logoFile && (
        <div
          className="fixed inset-0 pointer-events-none overflow-hidden z-0"
          aria-hidden
        >
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(165deg, ${accent}12 0%, transparent 45%, ${accent}08 100%)`,
            }}
          />
          <img
            src={getBankLogoUrl(bank.logoFile)}
            alt=""
            className="absolute -left-8 top-24 w-[min(70vw,320px)] opacity-[0.06] select-none"
            draggable={false}
          />
          <img
            src={getBankLogoUrl(bank.logoFile)}
            alt=""
            className="absolute -right-12 bottom-32 w-[min(55vw,260px)] opacity-[0.04] rotate-12 select-none"
            draggable={false}
          />
        </div>
      )}

      <div className="relative z-10 flex flex-col min-h-dvh min-w-0">{children}</div>
    </div>
  )
}
