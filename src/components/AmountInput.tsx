import { useId, type FC } from 'react';
import { AlertCircle, IndianRupee } from 'lucide-react';
import { ChipGroup, ChipOption } from './ChipGroup';
import { numberToIndianWords } from '../lib/format';

interface AmountInputProps {
  value: string;
  numericValue: number;
  error?: string;
  onChange: (value: string) => void;
  onSelectPreset: (amount: number) => void;
}

const PRINCIPAL_PRESETS: ChipOption<number>[] = [
  { label: '₹10K', value: 10000 },
  { label: '₹50K', value: 50000 },
  { label: '₹1L', value: 100000 },
  { label: '₹5L', value: 500000 },
  { label: '₹10L', value: 1000000 },
];

export const AmountInput: FC<AmountInputProps> = ({
  value,
  numericValue,
  error,
  onChange,
  onSelectPreset,
}) => {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const inWords = numberToIndianWords(numericValue);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor={inputId}
          className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
        >
          Principal Amount
        </label>
        {inWords && !error ? (
          <span
            id={helperId}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 truncate max-w-[200px] sm:max-w-xs transition-opacity duration-200"
            title={inWords}
          >
            {inWords}
          </span>
        ) : !error ? (
          <span className="text-xs text-slate-400 dark:text-slate-500">
            e.g. ₹1,00,000 (1 Lakh)
          </span>
        ) : null}
      </div>

      <div className="relative rounded-2xl transition-all duration-200">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
          <IndianRupee className="w-5 h-5" />
        </div>

        <input
          id={inputId}
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter principal amount (e.g. 1,00,000)"
          aria-invalid={!!error}
          aria-describedby={error ? errorId : inWords ? helperId : undefined}
          className={`w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-900 border rounded-2xl text-lg sm:text-xl font-bold tabular-nums text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-600 placeholder:text-sm sm:placeholder:text-base placeholder:font-normal shadow-sm transition-all duration-150 outline-none ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
              : 'border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10'
          }`}
        />
      </div>

      {/* Validation error */}
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
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Quick amounts:</span>
        </div>
        <ChipGroup
          options={PRINCIPAL_PRESETS}
          selectedValue={value ? numericValue : undefined}
          onSelect={onSelectPreset}
          ariaLabel="Quick select principal amounts"
          size="sm"
        />
      </div>
    </div>
  );
};
