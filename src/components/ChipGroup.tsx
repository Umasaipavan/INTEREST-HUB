
export interface ChipOption<T> {
  label: string;
  value: T;
  badge?: string;
}

interface ChipGroupProps<T> {
  options: ChipOption<T>[];
  selectedValue?: T;
  onSelect: (value: T) => void;
  className?: string;
  size?: 'sm' | 'md';
  ariaLabel?: string;
}

export function ChipGroup<T extends string | number>({
  options,
  selectedValue,
  onSelect,
  className = '',
  size = 'md',
  ariaLabel,
}: ChipGroupProps<T>) {
  const isSm = size === 'sm';

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`flex flex-wrap gap-2 items-center ${className}`}
    >
      {options.map((option) => {
        const isSelected = selectedValue === option.value;

        return (
          <button
            key={String(option.value)}
            type="button"
            onClick={() => onSelect(option.value)}
            className={`
              inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 active:scale-95
              focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900
              ${isSm ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-xs sm:text-sm'}
              ${
                isSelected
                  ? 'bg-emerald-600 text-white font-semibold shadow-sm shadow-emerald-600/30'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/80 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60'
              }
            `}
          >
            <span>{option.label}</span>
            {option.badge && (
              <span className="ml-1 text-[10px] px-1 py-0.2 rounded bg-black/10 dark:bg-white/10">
                {option.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
