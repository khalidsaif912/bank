import { describe, it, expect } from 'vitest'
import { detectBankFromMessages } from './bankDetector'
import { SAMPLE_MESSAGES } from '../data/sampleMessages'

describe('bankDetector', () => {
  it('detects Bank Nizwa from promo URL in messages', () => {
    const bank = detectBankFromMessages(SAMPLE_MESSAGES)
    expect(bank?.nameAr).toBe('بنك نزوى')
    expect(bank?.nameEn).toBe('Bank Nizwa')
  })

  it('detects bank from salary line with explicit name', () => {
    const text =
      'تم إيداع راتبك الشهري 1500.000 من بنك مسقط في حسابك. الرصيد المتوفر هو 5000.000 ر.ع'
    const bank = detectBankFromMessages(text)
    expect(bank?.nameAr).toBe('بنك مسقط')
  })
})
