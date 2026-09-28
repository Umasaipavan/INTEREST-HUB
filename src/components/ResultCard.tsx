import { useEffect, useState, useRef, type FC } from 'react';
import {
  TrendingUp,
  Coins,
  CalendarDays,
  ShieldCheck,
  Sparkles,
  Layers,
} from 'lucide-react';
import { CalculationResult } from '../lib/interest';
import { formatCurrency, formatIndianNumber } from '../lib/format';

interface ResultCardProps {
  result: CalculationResult;
  isValid: boolean;
  onLoadSample?: () => void;
}

/**
 * Animated number count-up hook respecting prefers-reduced-motion.
 */
function useCountUp(targetValue: number, durationMs = 350): number {
  const [displayValue, setDisplayValue] = useState<number>(targetValue);
  const startValueRef = useRef<number>(targetValue);
  const startTimeRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Check user's motion preference
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setDisplayValue(targetValue);
      startValueRef.current = targetValue;
      return;
    }

    const start = startValueRef.current;
    const diff = targetValue - start;
    if (diff === 0) return;

    startTimeRef.current = null;

    const step = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / durationMs, 1);
      // easeOutCubic curve for natural deceleration
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + diff * ease);

      setDisplayValue(current);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        setDisplayValue(targetValue);
        startValueRef.current = targetValue;
      }
    };

    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [targetValue, durationMs]);

  return displayValue;
}

export const ResultCard: FC<ResultCardProps> = ({ result, isValid, onLoadSample }) => {
  const animatedTotal = useCountUp(isValid ? result.totalAmount : 0);
  const animatedInterest = useCountUp(isValid ? result.totalInterest : 0);
  const animatedMonthly = useCountUp(isValid ? result.monthlyInterest : 0);

  const principalShare = isValid ? Math.max(0, Math.min(100, result.principalSharePercent)) : 100;
  const interestShare = isValid ? Math.max(0, Math.min(100, result.interestSharePercent)) : 0;

  return (
    <div className="space-y-4">
      {/* Main Result Card */}
      <div
        aria-live="polite"
        className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-fintech-lg relative overflow-hidden transition-all duration-300"
      >
        {/* Subtle decorative glow */}
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {isValid ? (
          <div className="relative space-y-6">
            {/* Header / Hero Amount */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Total Repayment Amount
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/60 dark:border-emerald-800/60 px-2 py-0.5 rounded-full">
                  Instant Live Sync
                </span>
              </div>

              <div className="flex items-baseline gap-1 text-slate-900 dark:text-white">
                <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight tabular-nums">
                  ₹{formatIndianNumber(animatedTotal)}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Principal ₹{formatIndianNumber(result.principal)} + Total Interest ₹{formatIndianNumber(result.totalInterest)}
              </p>
            </div>

            {/* Insight Pill: The Equivalent Rate Chip */}
            {result.equivalentRateInsight && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div className="text-xs font-semibold">
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider text-[10px] block mb-0.5">
                    Rate Equivalence
                  </span>
                  <span>{result.equivalentRateInsight}</span>
                </div>
              </div>
            )}

            {/* Stat Cards Grid: 3 metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Interest Earned */}
              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 rounded-2xl p-3.5 space-y-1">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="text-xs font-medium">Total Interest</span>
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  ₹{formatIndianNumber(animatedInterest)}
                </div>
                <div className="text-[10px] text-slate-400">
                  {interestShare.toFixed(1)}% of total
                </div>
              </div>

              {/* Monthly Interest */}
              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 rounded-2xl p-3.5 space-y-1">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="text-xs font-medium">Monthly Cost</span>
                  <CalendarDays className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <div className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 tabular-nums">
                  ₹{formatIndianNumber(animatedMonthly)}
                </div>
                <div className="text-[10px] text-slate-400">
                  per calendar month
                </div>
              </div>

              {/* Principal Card */}
              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 rounded-2xl p-3.5 space-y-1">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="text-xs font-medium">Principal</span>
                  <Coins className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 tabular-nums">
                  {formatCurrency(result.principal, true)}
                </div>
                <div className="text-[10px] text-slate-400">
                  {principalShare.toFixed(1)}% of total
                </div>
              </div>
            </div>

            {/* Horizontal Stacked Bar: Principal vs Interest Share */}
            <div className="space-y-2 pt-1">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-500 inline-block" />
                  Principal ({principalShare.toFixed(1)}%)
                </span>
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  Interest ({interestShare.toFixed(1)}%)
                </span>
              </div>

              <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex p-0.5">
                <div
                  style={{ width: `${principalShare}%` }}
                  className="h-full bg-slate-400 dark:bg-slate-500 rounded-l-full transition-all duration-300 ease-out"
                  title={`Principal: ${principalShare.toFixed(1)}%`}
                />
                <div
                  style={{ width: `${interestShare}%` }}
                  className="h-full bg-emerald-500 rounded-r-full transition-all duration-300 ease-out shadow-sm"
                  title={`Interest: ${interestShare.toFixed(1)}%`}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 px-2 text-center space-y-5">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
              <Sparkles className="w-7 h-7" />
            </div>

            <div className="space-y-1.5 max-w-sm mx-auto">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Enter Details to Calculate
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Fill in the principal amount, interest rate, and duration on the left. Your total, monthly interest, and full breakdown will appear here in real time.
              </p>
            </div>

            {/* Quick 3-step checklist guide */}
            <div className="grid grid-cols-1 gap-2 text-left max-w-xs mx-auto text-xs bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-400 font-bold flex items-center justify-center text-[10px] shrink-0">1</span>
                <span>Enter Principal (e.g. ₹1 Lakh)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-400 font-bold flex items-center justify-center text-[10px] shrink-0">2</span>
                <span>Choose % p.a. or ₹ per month</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-400 font-bold flex items-center justify-center text-[10px] shrink-0">3</span>
                <span>Set Tenure in Months or Years</span>
              </div>
            </div>

            {onLoadSample && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={onLoadSample}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all duration-150 active:scale-95 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Try Sample (₹1L @ 12%)</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Sticky Summary Bar (rendered at bottom on small viewports) */}
      {isValid && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3.5 px-4 shadow-lg flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
              Total Repayment
            </span>
            <div className="text-lg font-extrabold text-slate-900 dark:text-white tabular-nums">
              ₹{formatIndianNumber(animatedTotal)}
            </div>
          </div>

          <div className="flex items-center gap-3 text-right">
            <div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
                Interest
              </span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                +₹{formatIndianNumber(animatedInterest)}
              </span>
            </div>
            <a
              href="#calculation-breakdown"
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1 active:scale-95"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Steps</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
