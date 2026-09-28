import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <button
      type="button"
      onClick={() => setIsDark((prev) => !prev)}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all duration-200 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 animate-fade-in" />
      ) : (
        <Moon className="w-4 h-4 text-slate-700 animate-fade-in" />
      )}
    </button>
  );
}
