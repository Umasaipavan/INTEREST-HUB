import type { FC } from 'react';
import { Percent, IndianRupee } from 'lucide-react';
import { InterestMode } from '../lib/interest';

interface InterestTypeSelectorProps {
  mode: InterestMode;
  onChange: (mode: InterestMode) => void;
}

export const InterestTypeSelector: FC<InterestTypeSelectorProps> = ({ mode, onChange }) => {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Interest Rate Type
        </label>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {mode === 'percentage' ? '% per year (p.a.)' : 'per month (village/market)'}
        </span>
      </div>

      <div
        role="radiogroup"
        aria-label="Interest calculation mode"
        className="relative grid grid-cols-2 p-1.5 bg-slate-100 dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800"
      >
        {/* Animated Background Indicator */}
        <div
          className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200/50 dark:border-slate-700/60 transition-transform duration-250 ease-out pointer-events-none ${
            mode === 'percentage' ? 'translate-x-0' : 'translate-x-full'
          }`}
        />

        {/* Option 1: Percentage */}
        <button
          type="button"
          role="radio"
          aria-checked={mode === 'percentage'}
          onClick={() => onChange('percentage')}
          className={`relative z-10 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
            mode === 'percentage'
              ? 'text-emerald-700 dark:text-emerald-400'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Percent className="w-4 h-4" />
          <span>Percentage (%)</span>
        </button>

        {/* Option 2: Rupees */}
        <button
          type="button"
          role="radio"
          aria-checked={mode === 'rupees'}
          onClick={() => onChange('rupees')}
          className={`relative z-10 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
            mode === 'rupees'
              ? 'text-emerald-700 dark:text-emerald-400'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <IndianRupee className="w-4 h-4" />
          <span>Rupees (₹)</span>
        </button>
      </div>
    </div>
  );
};
