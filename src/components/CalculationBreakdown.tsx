import { useState, type FC } from 'react';
import { ChevronDown, ChevronUp, Calculator, HelpCircle } from 'lucide-react';
import { CalculationStep } from '../lib/interest';

interface CalculationBreakdownProps {
  steps: CalculationStep[];
  mode: 'percentage' | 'rupees';
  isValid: boolean;
}

export const CalculationBreakdown: FC<CalculationBreakdownProps> = ({
  steps,
  mode,
  isValid,
}) => {
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(true);

  if (!isValid || steps.length === 0) {
    return null;
  }

  return (
    <div
      id="calculation-breakdown"
      className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-fintech transition-all duration-200"
    >
      {/* Header with mobile accordion toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/40">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Step-by-Step Calculation</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {mode === 'percentage'
                ? 'Standard annual simple interest breakdown'
                : 'Unit-by-unit monthly rate breakdown'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpenMobile((prev) => !prev)}
          aria-expanded={isOpenMobile}
          aria-controls="breakdown-timeline"
          className="sm:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
        >
          {isOpenMobile ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Timeline Steps */}
      <div
        id="breakdown-timeline"
        className={`mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 transition-all duration-300 ${
          isOpenMobile ? 'block' : 'hidden sm:block'
        }`}
      >
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3 before:top-2 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1;
            return (
              <div key={step.id} className="relative group">
                {/* Timeline node badge */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-0.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all duration-200 ${
                    isLast
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-500/20 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 group-hover:border-emerald-500'
                  }`}
                >
                  {step.stepNumber}
                </div>

                <div className="bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl p-3 sm:p-3.5 border border-slate-200/50 dark:border-slate-800/60 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/70">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {step.title}
                    </span>
                    <span
                      className={`text-xs sm:text-sm font-bold tabular-nums font-mono ${
                        isLast
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {step.resultDisplay}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-800">
                      {step.formula}
                    </span>
                    <span className="hidden sm:inline text-[11px] italic">
                      {step.explanation}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Small explainer note */}
        <div className="mt-5 p-3 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/15 flex items-start gap-2 text-slate-600 dark:text-slate-300">
          <HelpCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed">
            {mode === 'percentage'
              ? 'Simple interest does not compound: the interest is charged exclusively on the initial principal across all months.'
              : 'Informal rupee lending rates are computed monthly per base unit. For example, "₹2 interest" means ₹2 per ₹100 every single month (24% per year).'}
          </p>
        </div>
      </div>
    </div>
  );
};
