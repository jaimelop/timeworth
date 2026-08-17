import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark' | 'system';

const THEME_STORAGE_KEY = 'timeworth_theme_v1';

interface ThemeState {
  theme: ThemeMode;
  /** The resolved theme — always 'light' or 'dark', never 'system' */
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: ThemeMode) => void;
}

function getSystemPreference(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveTheme(theme: ThemeMode): 'light' | 'dark' {
  if (theme === 'system') return getSystemPreference();
  return theme;
}

function applyThemeToDOM(resolved: 'light' | 'dark'): void {
  const root = document.documentElement;
  if (resolved === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

function loadPersistedTheme(): ThemeMode {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
  } catch {
    // localStorage unavailable
  }
  return 'dark'; // default to Neon Night
}

const initialTheme = loadPersistedTheme();
const initialResolved = resolveTheme(initialTheme);

// Apply immediately to prevent FOUC
applyThemeToDOM(initialResolved);

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: initialTheme,
  resolvedTheme: initialResolved,

  setTheme: (theme: ThemeMode) => {
    const resolved = resolveTheme(theme);
    applyThemeToDOM(resolved);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // localStorage unavailable
    }

    set({ theme, resolvedTheme: resolved });
  },
}));

// Listen for system preference changes when in "system" mode
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', () => {
    const state = useThemeStore.getState();
    if (state.theme === 'system') {
      const resolved = getSystemPreference();
      applyThemeToDOM(resolved);
      useThemeStore.setState({ resolvedTheme: resolved });
    }
  });
}
