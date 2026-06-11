import { useState } from 'react'
import { SAMPLE_MESSAGES } from '../data/sampleMessages'
import { formatNumber } from '../parser/bankParser'

interface Props {
  onParse: (text: string) => { storageMonth: string | null }
  lastInfo: {
    added: number
    failed: number
    skipped: number
    storageMonth: string | null
    storageMessage: string | null
  } | null
}

export function PastePanel({ onParse, lastInfo }: Props) {
  const [text, setText] = useState('')
  const [expanded, setExpanded] = useState(true)

  const handleSubmit = () => {
    if (!text.trim()) return
    onParse(text)
    setText('')
  }

  const handleLoadSample = () => {
    setText(SAMPLE_MESSAGES)
    setExpanded(true)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-right hover:bg-slate-50 transition-colors"
      >
        <span className="text-brand-700 text-xl">{expanded ? '−' : '+'}</span>
        <div>
          <h2 className="font-semibold text-slate-800">إضافة رسائل جديدة</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            الصق رسائل البنك هنا للتحليل
          </p>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="الصق رسائل SMS البنكية هنا..."
            rows={6}
            className="w-full rounded-xl border border-slate-200 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 bg-slate-50"
            dir="rtl"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!text.trim()}
              className="flex-1 bg-brand-700 text-white rounded-xl py-3 font-semibold text-sm hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              تحليل الرسائل
            </button>
            <button
              type="button"
              onClick={handleLoadSample}
              className="px-3 rounded-xl border border-brand-200 text-brand-700 text-sm hover:bg-brand-50"
            >
              نموذج
            </button>
            <button
              type="button"
              onClick={() => setText('')}
              className="px-3 rounded-xl border border-slate-200 text-slate-500 text-sm hover:bg-slate-50"
            >
              مسح
            </button>
          </div>
        </div>
      )}

      {lastInfo && (
        <div className="px-4 pb-3 space-y-1">
          <div className="flex flex-wrap gap-3 text-xs">
            <span className="text-emerald-600 font-medium">
              ✓ {formatNumber(lastInfo.added)} معاملة
            </span>
            {lastInfo.failed > 0 && (
              <span className="text-red-500">✗ {formatNumber(lastInfo.failed)} فشل</span>
            )}
            {lastInfo.skipped > 0 && (
              <span className="text-slate-400">— {formatNumber(lastInfo.skipped)} تجاهل</span>
            )}
          </div>
          {lastInfo.storageMessage && (
            <p className="text-xs text-brand-700 bg-brand-50 rounded-lg px-3 py-2 font-medium">
              📅 {lastInfo.storageMessage}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
