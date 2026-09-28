import { useId, useMemo, type FC } from 'react';
import { AlertCircle, Calendar } from 'lucide-react';
import { DurationUnit } from '../lib/interest';

interface DurationInputProps {
  duration: string;
  durationNum: number;
  unit: DurationUnit;
  error?: string;
  onChange: (value: string) => void;
  onUnitChange: (unit: DurationUnit) => void;
  onSelectPreset: (value: number, unit: DurationUnit) => void;
}

const DURATION_PRESETS: { label: string; value: number; unit: DurationUnit }[] = [
  { label: '6M', value: 6, unit: 'months' },
  { label: '1Y', value: 1, unit: 'years' },
  { label: '2Y', value: 2, unit: 'years' },
  { label: '3Y', value: 3, unit: 'years' },
  { label: '5Y', value: 5, unit: 'years' },
];

export const DurationInput: FC<DurationInputProps> = ({
  duration,
  durationNum,
  unit,
  error,
  onChange,
  onUnitChange,
  onSelectPreset,
}) => {
  const inputId = useId();
  const errorId = `${inputId}-error`;

  // Calculated conversion helper
  const conversionHelper = useMemo(() => {
    if (!durationNum || durationNum <= 0) return null;
    if (unit === 'years') {
      const months = durationNum * 12;
      return `= ${months} months`;
    } else {
      const years = durationNum / 12;
      return `= ${years % 1 === 0 ? years : years.toFixed(1)} year${years === 1 ? '' : 's'}`;
    }
  }, [durationNum, unit]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor={inputId}
          className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
        >
          Duration (Tenure)
        </label>
        {conversionHelper && !error ? (
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {conversionHelper}
          </span>
        ) : !error ? (
          <span className="text-xs text-slate-400 dark:text-slate-500">
            e.g. 1 Year or 12 Months
          </span>
        ) : null}
      </div>

      <div className="flex gap-2">
        {/* Number input */}
        <div className="relative flex-1 rounded-2xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Calendar className="w-5 h-5" />
          </div>

          <input
            id={inputId}
            type="text"
            inputMode="numeric"
            value={duration}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Enter tenure (e.g. ${unit === 'years' ? '1' : '12'})`}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={`w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-900 border rounded-2xl text-lg sm:text-xl font-bold tabular-nums text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-600 placeholder:text-sm sm:placeholder:text-base placeholder:font-normal shadow-sm transition-all duration-150 outline-none ${
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                : 'border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10'
            }`}
          />
        </div>

        {/* Segmented Months / Years Toggle */}
        <div
          role="radiogroup"
          aria-label="Duration unit selector"
          className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shrink-0"
        >
          <button
            type="button"
            role="radio"
            aria-checked={unit === 'months'}
            onClick={() => onUnitChange('months')}
            className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
              unit === 'months'
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Months
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={unit === 'years'}
            onClick={() => onUnitChange('years')}
            className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
              unit === 'years'
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Years
          </button>
        </div>
      </div>

      {error && (
        <div
          id={errorId}
          role="alert"
          className="flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400 animate-slide-up"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Quick-Pick Chips */}
      <div className="pt-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Quick tenure:</span>
        </div>
        <div className="flex flex-wrap gap-2 items-center" role="group" aria-label="Duration preset chips">
          {DURATION_PRESETS.map((preset) => {
            const isSelected = duration !== '' && durationNum === preset.value && unit === preset.unit;
            return (
              <button
                key={`${preset.value}-${preset.unit}`}
                type="button"
                onClick={() => onSelectPreset(preset.value, preset.unit)}
                className={`
                  px-2.5 py-1 text-xs font-medium rounded-xl transition-all duration-150 active:scale-95
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500
                  ${
                    isSelected
                      ? 'bg-emerald-600 text-white font-semibold shadow-sm shadow-emerald-600/30'
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/80 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60'
                  }
                `}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
