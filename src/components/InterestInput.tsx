import { useId, type FC } from 'react';
import { AlertCircle, Percent, IndianRupee } from 'lucide-react';
import { InterestMode, RupeeInterestBase } from '../lib/interest';
import { ChipGroup, ChipOption } from './ChipGroup';

interface InterestInputProps {
  mode: InterestMode;

  // Percentage mode props
  percentageRate: string;
  percentageRateNum: number;
  percentageError?: string;
  onPercentageChange: (rate: string) => void;
  onSelectPercentagePreset: (rate: number) => void;

  // Rupee mode props
  rupeeAmount: string;
  rupeeAmountNum: number;
  rupeeError?: string;
  rupeeBase: RupeeInterestBase;
  onRupeeAmountChange: (amount: string) => void;
  onRupeeBaseChange: (base: RupeeInterestBase) => void;
  onSelectRupeePreset: (amount: number) => void;
}

const PERCENTAGE_PRESETS: ChipOption<number>[] = [
  { label: '2%', value: 2 },
  { label: '5%', value: 5 },
  { label: '8.5%', value: 8.5 },
  { label: '12%', value: 12 },
  { label: '18%', value: 18 },
  { label: '24%', value: 24 },
];

const RUPEE_PRESETS: ChipOption<number>[] = [
  { label: '₹1', value: 1 },
  { label: '₹2', value: 2 },
  { label: '₹3', value: 3 },
  { label: '₹5', value: 5 },
  { label: '₹10', value: 10 },
];

const BASE_OPTIONS: { label: string; value: RupeeInterestBase; desc: string }[] = [
  { label: 'Per ₹100', value: 100, desc: 'Most common (sowkar / village)' },
  { label: 'Per ₹1,000', value: 1000, desc: 'Per thousand monthly' },
  { label: 'Per ₹10,000', value: 10000, desc: 'Large scale private loans' },
];

export const InterestInput: FC<InterestInputProps> = ({
  mode,
  percentageRate,
  percentageRateNum,
  percentageError,
  onPercentageChange,
  onSelectPercentagePreset,
  rupeeAmount,
  rupeeAmountNum,
  rupeeError,
  rupeeBase,
  onRupeeAmountChange,
  onRupeeBaseChange,
  onSelectRupeePreset,
}) => {
  const percentInputId = useId();
  const rupeeInputId = useId();
  const percentErrorId = `${percentInputId}-error`;
  const rupeeErrorId = `${rupeeInputId}-error`;

  return (
    <div className="space-y-4">
      {mode === 'percentage' ? (
        <div className="space-y-2 animate-fade-in">
          <div className="flex items-center justify-between">
            <label
              htmlFor={percentInputId}
              className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              Interest Rate (% p.a.)
            </label>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/40">
              % per year
            </span>
          </div>

          <div className="relative rounded-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <Percent className="w-5 h-5" />
            </div>

            <input
              id={percentInputId}
              type="text"
              inputMode="decimal"
              value={percentageRate}
              onChange={(e) => onPercentageChange(e.target.value)}
              placeholder="Enter rate (e.g. 12)"
              aria-invalid={!!percentageError}
              aria-describedby={percentageError ? percentErrorId : undefined}
              className={`w-full pl-11 pr-16 py-3.5 bg-white dark:bg-slate-900 border rounded-2xl text-lg sm:text-xl font-bold tabular-nums text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-600 placeholder:text-sm sm:placeholder:text-base placeholder:font-normal shadow-sm transition-all duration-150 outline-none ${
                percentageError
                  ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                  : 'border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10'
              }`}
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 font-semibold text-sm">
              % p.a.
            </div>
          </div>

          {percentageError && (
            <div
              id={percentErrorId}
              role="alert"
              className="flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400 animate-slide-up"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{percentageError}</span>
            </div>
          )}

          <div className="pt-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Common rates:</span>
            </div>
            <ChipGroup
              options={PERCENTAGE_PRESETS}
              selectedValue={percentageRate ? percentageRateNum : undefined}
              onSelect={onSelectPercentagePreset}
              ariaLabel="Quick select percentage rates"
              size="sm"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          {/* Rupee Amount Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor={rupeeInputId}
                className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Rupee Interest (₹ per month)
              </label>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/40">
                per month
              </span>
            </div>

            <div className="relative rounded-2xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <IndianRupee className="w-5 h-5" />
              </div>

              <input
                id={rupeeInputId}
                type="text"
                inputMode="decimal"
                value={rupeeAmount}
                onChange={(e) => onRupeeAmountChange(e.target.value)}
                placeholder="Enter amount (e.g. 2)"
                aria-invalid={!!rupeeError}
                aria-describedby={rupeeError ? rupeeErrorId : undefined}
                className={`w-full pl-11 pr-28 py-3.5 bg-white dark:bg-slate-900 border rounded-2xl text-lg sm:text-xl font-bold tabular-nums text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-600 placeholder:text-sm sm:placeholder:text-base placeholder:font-normal shadow-sm transition-all duration-150 outline-none ${
                  rupeeError
                    ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                    : 'border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10'
                }`}
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 font-semibold text-xs sm:text-sm">
                / ₹{rupeeBase.toLocaleString('en-IN')} / mo
              </div>
            </div>

            {rupeeError && (
              <div
                id={rupeeErrorId}
                role="alert"
                className="flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400 animate-slide-up"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{rupeeError}</span>
              </div>
            )}

            <div className="pt-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Common market rates:</span>
              </div>
              <ChipGroup
                options={RUPEE_PRESETS}
                selectedValue={rupeeAmount ? rupeeAmountNum : undefined}
                onSelect={onSelectRupeePreset}
                ariaLabel="Quick select rupee rates"
                size="sm"
              />
            </div>
          </div>

          {/* Interest Base Selector */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Interest Base
              </label>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                Rate calculated per:
              </span>
            </div>

            <div
              role="radiogroup"
              aria-label="Interest base denominator"
              className="grid grid-cols-3 gap-2"
            >
              {BASE_OPTIONS.map((opt) => {
                const isSelected = rupeeBase === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => onRupeeBaseChange(opt.value)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-semibold shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-bold">{opt.label}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate w-full mt-0.5">
                      {opt.value === 100 ? 'Standard' : opt.value === 1000 ? '₹1K base' : '₹10K base'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
