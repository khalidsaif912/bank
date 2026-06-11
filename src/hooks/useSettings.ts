import { useCallback, useEffect, useState } from 'react'

export interface AppSettings {
  showBalance: boolean
  showReference: boolean
  selectedMonth: string | null
}

const STORAGE_KEY = 'bank-sms-settings'

const DEFAULT_SETTINGS: AppSettings = {
  showBalance: true,
  showReference: true,
  selectedMonth: null,
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS
    } catch {
      return DEFAULT_SETTINGS
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }))
  }, [])

  const setSelectedMonth = useCallback((month: string | null) => {
    setSettings((prev) => ({ ...prev, selectedMonth: month }))
  }, [])

  return { settings, updateSettings, setSelectedMonth }
}
