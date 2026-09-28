import {
  Wallet,
  RotateCcw,
  Sparkles,
  ArrowRightLeft,
  BookOpen,
} from 'lucide-react';
import { useInterestCalculator } from './hooks/useInterestCalculator';
import { AmountInput } from './components/AmountInput';
import { InterestTypeSelector } from './components/InterestTypeSelector';
import { InterestInput } from './components/InterestInput';
import { DurationInput } from './components/DurationInput';
import { ResultCard } from './components/ResultCard';
import { CalculationBreakdown } from './components/CalculationBreakdown';
import { ThemeToggle } from './components/ThemeToggle';

export function App() {
  const {
    mode,
    setMode,
    principalRaw,
    principalNum,
    principalError,
    setPrincipal,
    selectPrincipalPreset,
    percentageRateRaw,
    percentageRateNum,
    percentageRateError,
    setPercentageRate,
    selectPercentagePreset,
    rupeeAmountRaw,
    rupeeAmountNum,
    rupeeAmountError,
    rupeeBase,
    setRupeeAmount,
    setRupeeBase,
    selectRupeePreset,
    durationRaw,
    durationNum,
    durationUnit,
    durationError,
    setDuration,
    setDurationUnit,
    selectDurationPreset,
    isValid,
    result,
    resetAll,
    loadSampleData,
  } = useInterestCalculator();

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 pb-24 lg:pb-12 transition-colors duration-200">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-slate-200 dark:to-emerald-400 bg-clip-text text-transparent">
                  InterestHub
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 uppercase tracking-wider">
                  India
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Know exactly what your money earns or costs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetAll}
              title="Clear all inputs and reset calculator"
              className="px-3 py-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 flex items-center gap-1.5 text-xs font-semibold active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Reset</span>
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Header Banner */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200/50 dark:border-emerald-800/40 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Simple Interest Calculator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Money Interest Calculator
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Calculate interest in standard bank % (p.a.) or Indian market rupee rate (₹ per ₹100 / ₹1,000 / month).
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 shrink-0">
            <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg">
              <ArrowRightLeft className="w-3 h-3 text-emerald-500" />
              Instant Mode Switch
            </span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Inputs Form Card (7 cols on desktop) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-fintech space-y-6">
              {/* Principal Amount Input */}
              <AmountInput
                value={principalRaw}
                numericValue={principalNum}
                error={principalError}
                onChange={setPrincipal}
                onSelectPreset={selectPrincipalPreset}
              />

              <div className="border-t border-slate-100 dark:border-slate-800/80" />

              {/* Interest Mode Selector */}
              <InterestTypeSelector
                mode={mode}
                onChange={setMode}
              />

              {/* Interest Rate / Rupee Amount Input */}
              <InterestInput
                mode={mode}
                percentageRate={percentageRateRaw}
                percentageRateNum={percentageRateNum}
                percentageError={percentageRateError}
                onPercentageChange={setPercentageRate}
                onSelectPercentagePreset={selectPercentagePreset}
                rupeeAmount={rupeeAmountRaw}
                rupeeAmountNum={rupeeAmountNum}
                rupeeError={rupeeAmountError}
                rupeeBase={rupeeBase}
                onRupeeAmountChange={setRupeeAmount}
                onRupeeBaseChange={setRupeeBase}
                onSelectRupeePreset={selectRupeePreset}
              />

              <div className="border-t border-slate-100 dark:border-slate-800/80" />

              {/* Duration Input */}
              <DurationInput
                duration={durationRaw}
                durationNum={durationNum}
                unit={durationUnit}
                error={durationError}
                onChange={setDuration}
                onUnitChange={setDurationUnit}
                onSelectPreset={selectDurationPreset}
              />
            </div>

            {/* Step-by-Step Plain-Language Breakdown (Collapsible) */}
            <CalculationBreakdown
              steps={result.steps}
              mode={mode}
              isValid={isValid}
            />
          </div>

          {/* Right Column: Sticky Results Section (5 cols on desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <ResultCard
              result={result}
              isValid={isValid}
              onLoadSample={loadSampleData}
            />

            {/* Quick Education / Demystifying "₹2 Interest" Card */}
            <div className="bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                <BookOpen className="w-4 h-4 text-emerald-500" />
                <span>Did you know? The "₹2 Interest" Myth</span>
              </div>
              <p className="leading-relaxed">
                When informal lenders or friends say <strong className="text-slate-800 dark:text-slate-200">"₹2 interest per month"</strong>, many people think it is 2% interest.
              </p>
              <p className="leading-relaxed">
                In reality, <strong>₹2 per ₹100 per month equals 24% per year</strong>! That is more than double a typical bank personal loan or triple a gold loan. Always check the equivalent annual rate above.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Accessible Footer */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-8 border-t border-slate-200/60 dark:border-slate-800/60 mt-16 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-500">
        <div>
          <p>© {new Date().getFullYear()} InterestHub. Built for Indian savers, borrowers, and businesses.</p>
          <p className="mt-0.5">Calculations follow standard Simple Interest (I = P × R × T / 100) and Indian monthly informal rupee models.</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Active Fintech Engine
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
