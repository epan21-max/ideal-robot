import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { AnimeItem } from '../lib/api';

export type Theme = 'light' | 'dark' | 'system';
export type FontTheme = 'inter' | 'grotesk' | 'playfair' | 'mono' | 'elegant';
export type ColorTheme = 'midnight' | 'rose' | 'forest' | 'ocean' | 'sunset' | 'lavender' | 'crimson' | 'gold' | 'mint' | 'grape';
export type DesignStyle = 'liquid' | 'neo' | 'soft-neo' | 'neon' | 'mono';

export type InboxMessage = {
  id: string;
  title: string;
  body: string;
  time: number;
  read?: boolean;
  type?: 'welcome' | 'update' | 'info';
};

type Ctx = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  resolvedTheme: 'light' | 'dark';
  font: FontTheme;
  setFont: (f: FontTheme) => void;
  colorTheme: ColorTheme;
  setColorTheme: (c: ColorTheme) => void;
  designStyle: DesignStyle;
  setDesignStyle: (s: DesignStyle) => void;
  neonColor: string;
  setNeonColor: (c: string) => void;
  animationsEnabled: boolean;
  setAnimationsEnabled: (v: boolean) => void;
  favorites: AnimeItem[];
  toggleFavorite: (a: AnimeItem) => void;
  isFavorite: (slug: string) => boolean;
  clearFavorites: () => void;
  inbox: InboxMessage[];
  markRead: (id: string) => void;
  markAllRead: () => void;
  deleteMessage: (id: string) => void;
  unreadCount: number;
  pushInbox: (m: Omit<InboxMessage, 'id' | 'time'>) => void;
};

const AppCtx = createContext<Ctx | null>(null);

const LS = {
  theme: 'eds.theme',
  font: 'eds.font',
  colorTheme: 'eds.colorTheme',
  designStyle: 'eds.designStyle',
  neonColor: 'eds.neonColor',
  animations: 'eds.animations',
  fav: 'eds.favorites',
  inbox: 'eds.inbox',
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, val: T) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!m) return null;
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}

const defaultInbox: InboxMessage[] = [
  {
    id: 'welcome',
    title: 'Welcome to EpanDStream',
    body: 'Discover and stream your favorite anime with a beautiful, premium experience. Tap the dynamic island for more.',
    time: Date.now() - 1000 * 60 * 5,
    read: false,
    type: 'welcome',
  },
  {
    id: 'update-1',
    title: 'New: Liquid Glass UI',
    body: 'We just shipped a brand-new liquid glass design with a flying dynamic island. Enjoy smoother animations.',
    time: Date.now() - 1000 * 60 * 60 * 3,
    read: false,
    type: 'update',
  },
  {
    id: 'info-1',
    title: 'Tip: Add favorites',
    body: 'Tap the heart on any anime card to save it to your favorites collection.',
    time: Date.now() - 1000 * 60 * 60 * 24,
    read: true,
    type: 'info',
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => read(LS.theme, 'dark' as Theme));
  const [font, setFontState] = useState<FontTheme>(() => read(LS.font, 'inter' as FontTheme));
  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => read(LS.colorTheme, 'midnight' as ColorTheme));
  const [designStyle, setDesignStyleState] = useState<DesignStyle>(() => read(LS.designStyle, 'liquid' as DesignStyle));
  const [neonColor, setNeonColorState] = useState<string>(() => read(LS.neonColor, '#00f0ff'));
  const [animationsEnabled, setAnimationsEnabledState] = useState<boolean>(() => read(LS.animations, true));
  const [favorites, setFavorites] = useState<AnimeItem[]>(() => read(LS.fav, [] as AnimeItem[]));
  const [inbox, setInbox] = useState<InboxMessage[]>(() => read(LS.inbox, defaultInbox));

  const [systemDark, setSystemDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const h = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  const resolvedTheme: 'light' | 'dark' =
    theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;

  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', resolvedTheme === 'dark' ? '#000000' : '#ffffff');
  }, [resolvedTheme]);

  useEffect(() => {
    document.body.classList.remove('font-theme-inter','font-theme-grotesk','font-theme-playfair','font-theme-mono','font-theme-elegant');
    document.body.classList.add(`font-theme-${font}`);
  }, [font]);

  // Apply color theme + design style + custom neon color as data attributes & CSS vars
  useEffect(() => {
    document.body.setAttribute('data-color-theme', colorTheme);
  }, [colorTheme]);

  useEffect(() => {
    document.body.setAttribute('data-style', designStyle);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta && designStyle === 'neon') meta.setAttribute('content', '#06060c');
  }, [designStyle]);

  useEffect(() => {
    document.documentElement.style.setProperty('--neon-color', neonColor);
    // derive glow rgba from hex
    const rgb = hexToRgb(neonColor);
    if (rgb) document.documentElement.style.setProperty('--neon-glow', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.55)`);
  }, [neonColor]);

  useEffect(() => {
    document.body.setAttribute('data-animations', animationsEnabled ? 'on' : 'off');
  }, [animationsEnabled]);

  const setTheme = (t: Theme) => { setThemeState(t); write(LS.theme, t); };
  const setFont = (f: FontTheme) => { setFontState(f); write(LS.font, f); };
  const setColorTheme = (c: ColorTheme) => { setColorThemeState(c); write(LS.colorTheme, c); };
  const setDesignStyle = (s: DesignStyle) => { setDesignStyleState(s); write(LS.designStyle, s); };
  const setNeonColor = (c: string) => { setNeonColorState(c); write(LS.neonColor, c); };
  const setAnimationsEnabled = (v: boolean) => { setAnimationsEnabledState(v); write(LS.animations, v); };

  const toggleFavorite = useCallback((a: AnimeItem) => {
    setFavorites(prev => {
      const exists = prev.find(p => p.slug === a.slug);
      const next = exists ? prev.filter(p => p.slug !== a.slug) : [a, ...prev];
      write(LS.fav, next);
      return next;
    });
  }, []);

  const isFavorite = useCallback((slug: string) => favorites.some(f => f.slug === slug), [favorites]);

  const clearFavorites = () => { setFavorites([]); write(LS.fav, []); };

  const markRead = (id: string) => {
    setInbox(prev => {
      const next = prev.map(m => m.id === id ? { ...m, read: true } : m);
      write(LS.inbox, next);
      return next;
    });
  };

  const markAllRead = () => {
    setInbox(prev => {
      const next = prev.map(m => ({ ...m, read: true }));
      write(LS.inbox, next);
      return next;
    });
  };

  const deleteMessage = (id: string) => {
    setInbox(prev => {
      const next = prev.filter(m => m.id !== id);
      write(LS.inbox, next);
      return next;
    });
  };

  const pushInbox = (m: Omit<InboxMessage, 'id' | 'time'>) => {
    setInbox(prev => {
      const next = [{ ...m, id: Math.random().toString(36).slice(2), time: Date.now(), read: false }, ...prev];
      write(LS.inbox, next);
      return next;
    });
  };

  const unreadCount = inbox.filter(m => !m.read).length;

  return (
    <AppCtx.Provider value={{
      theme, setTheme, resolvedTheme,
      font, setFont,
      colorTheme, setColorTheme,
      designStyle, setDesignStyle,
      neonColor, setNeonColor,
      animationsEnabled, setAnimationsEnabled,
      favorites, toggleFavorite, isFavorite, clearFavorites,
      inbox, markRead, markAllRead, deleteMessage, unreadCount, pushInbox
    }}>
      {children}
    </AppCtx.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
