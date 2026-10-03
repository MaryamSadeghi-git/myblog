'use client';

import { useEffect, useState } from 'react';

type ThemeMode = 'dark' | 'light';

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  const saved = window.localStorage.getItem('theme') as ThemeMode | null;
  if (saved === 'light' || saved === 'dark') return saved;
  return 'dark';
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>('dark');

  useEffect(() => {
    const t = getInitialTheme();
    setTheme(t);
    document.documentElement.setAttribute('data-theme', t);
  }, []);

  function toggle() {
    const next: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    window.localStorage.setItem('theme', next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-card hover:bg-bg-card-hover border border-border-subtle text-text-main text-sm font-semibold transition-colors"
      aria-label="Toggle theme"
    >
      <span className="w-2 h-2 rounded-full bg-accent-orange" />
      <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
    </button>
  );
}
