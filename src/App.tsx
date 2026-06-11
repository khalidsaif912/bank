import { useMemo, useState } from 'react'
import { FilterTabs, TabStatsSummary } from './components/FilterTabs'
import { HeaderBanner } from './components/HeaderBanner'
import { PastePanel } from './components/PastePanel'
import { Sidebar } from './components/Sidebar'
import { SummaryCards } from './components/SummaryCards'
import { TransactionList } from './components/TransactionList'
import { useSettings } from './hooks/useSettings'
import { useTransactions, computeTabStats } from './hooks/useTransactions'
import { formatAmount, formatNumber } from './parser/bankParser'
import { formatMonthLabel } from './utils/monthUtils'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { settings, updateSettings, setSelectedMonth } = useSettings()

  const {
    transactions,
    monthFiltered,
    filtered,
    groupedByDate,
    filter,
    setFilter,
    search,
    setSearch,
    parseAndAdd,
    clearAll,
    summary,
    activeTabStats,
    availableMonths,
    undatedCount,
    bankInfo,
    lastParseInfo,
  } = useTransactions(settings.selectedMonth)

  const tabStats = useMemo(() => {
    const filters = [
      'all',
      'deposit',
      'debit',
      'withdrawal',
      'transfer_in',
      'transfer_out',
      'salary',
    ] as const
    const map: Record<string, ReturnType<typeof computeTabStats>> = {}
    for (const f of filters) {
      map[f] = computeTabStats(monthFiltered, f)
    }
    return map
  }, [monthFiltered])

  const monthLabel = settings.selectedMonth
    ? settings.selectedMonth === 'undated'
      ? 'بدون تاريخ'
      : formatMonthLabel(settings.selectedMonth)
    : null

  const handleParse = (text: string) => {
    const result = parseAndAdd(text)
    if (result.storageMonth) {
      setSelectedMonth(result.storageMonth)
    }
    return result
  }

  return (
    <div className="min-h-dvh flex flex-row-reverse">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        months={availableMonths}
        undatedCount={undatedCount}
        totalCount={transactions.length}
        selectedMonth={settings.selectedMonth}
        onSelectMonth={setSelectedMonth}
        settings={settings}
        onUpdateSettings={updateSettings}
        onClearAll={clearAll}
        bankName={bankInfo?.nameAr}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <HeaderBanner
          bank={bankInfo}
          monthLabel={monthLabel}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-4 space-y-4 safe-bottom">
          <SummaryCards summary={summary} showBalance={settings.showBalance} />

          <PastePanel onParse={handleParse} lastInfo={lastParseInfo} />

          <div className="relative">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث بالاسم أو التاجر..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pr-10 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 shadow-sm"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
              🔍
            </span>
          </div>

          <FilterTabs active={filter} onChange={setFilter} tabStats={tabStats} />

          <TabStatsSummary filter={filter} stats={activeTabStats} />

          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              {formatNumber(activeTabStats.transactionCount)} معاملة ·{' '}
              {formatNumber(activeTabStats.operationsCount)} عملية
            </span>
            {summary.netChange !== 0 && (
              <span className={summary.netChange > 0 ? 'text-deposit' : 'text-debit'}>
                صافي: {summary.netChange > 0 ? '+' : ''}
                {formatAmount(summary.netChange)} ر.ع
              </span>
            )}
          </div>

          <TransactionList
            grouped={groupedByDate}
            total={filtered.length}
            showBalance={settings.showBalance}
            showReference={settings.showReference}
          />
        </main>
      </div>
    </div>
  )
}

export default App
