import React, { useEffect, useRef, useState } from 'react';
import { DotsIcon, InboxIcon, InfoIcon, SettingsIcon, CloseIcon, SunIcon, MoonIcon, TypeIcon, CheckIcon, TrashIcon, BellIcon, SparklesIcon, HeartIcon, ChevronLeftIcon } from './Icon';
import { useApp, FontTheme, Theme, ColorTheme, DesignStyle } from '../context/AppContext';
import { useRouter as useAppRouter } from '../context/RouterContext';
import iconWebs from '@/assets/epandstream.png';

type Panel = 'menu' | 'inbox' | 'about' | 'settings' | null;

export function DynamicIsland() {
  const [panel, setPanel] = useState<Panel>(null);
  const { unreadCount, resolvedTheme, designStyle, neonColor } = useApp();
  const open = panel !== null;
  const ref = useRef<HTMLDivElement>(null);

  // Style-aware modal backdrop
  const darkBg = resolvedTheme === 'dark';
  const backdropBg = (() => {
    if (designStyle === 'neon') return 'rgba(6,6,12,0.72)';
    if (designStyle === 'neo') return darkBg ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)';
    return darkBg ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.4)';
  })();
  const backdropBlur = (() => {
    if (designStyle === 'neo' || designStyle === 'soft-neo') return 'blur(8px)';
    if (designStyle === 'neon') return `blur(22px) saturate(160%)`;
    return 'blur(30px) saturate(150%)';
  })();

  // Lock body scroll when island open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      if (scrollY) window.scrollTo(0, -parseInt(scrollY || '0'));
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPanel(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      {/* Backdrop blur over entire app */}
      <div
        aria-hidden={!open}
        onClick={() => setPanel(null)}
        className="fixed inset-0 z-[90]"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
          backdropFilter: open ? backdropBlur : 'blur(0px)',
          WebkitBackdropFilter: open ? backdropBlur : 'blur(0px)',
          background: open
            ? backdropBg
            : 'transparent',
          boxShadow: designStyle === 'neon' && open ? `inset 0 0 120px ${neonColor}22` : undefined,
        }}
      />

      {/* Floating Dynamic Island */}
      <div
        ref={ref}
        className="fixed z-[100] left-1/2 -translate-x-1/2"
        style={{
          top: 'max(env(safe-area-inset-top, 0px), 10px)',
        }}
      >
        <div
          className="island-glass text-white overflow-hidden"
          style={{
            borderRadius: open ? 28 : 999,
            width: open ? 'min(92vw, 380px)' : 'auto',
            transition: 'all 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transformOrigin: 'top center',
          }}
        >
          {/* Collapsed bar */}
          {!open && (
            <button
              onClick={() => setPanel('menu')}
              aria-label="Open menu"
              className="flex items-center gap-2 px-3 py-2 animate-fade-in whitespace-nowrap"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
                <img src={iconWebs} alt="EpanDStream" className="w-7 h-7 rounded-full" />
              </div>
              <span className="text-[13px] font-semibold tracking-tight">EpanDStream</span>
              <span className="ml-1 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center relative">
                <DotsIcon size={16} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-black/80" style={{ animation: 'pulse-glow 2s ease-in-out infinite' }} />
                )}
              </span>
            </button>
          )}

          {/* Expanded */}
          {open && (
            <div style={{ animation: 'islandOpen 0.55s cubic-bezier(0.22, 1, 0.36, 1) both' }}>
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <div className="flex items-center gap-2 min-w-0">
                  {panel !== 'menu' && (
                    <button
                      onClick={() => setPanel('menu')}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 active:bg-white/20 flex items-center justify-center shrink-0 transition-colors"
                    >
                      <ChevronLeftIcon size={16} />
                    </button>
                  )}
                  <div className="min-w-0">
                    <div className="text-[11px] uppercase tracking-widest text-white/50">
                      {panel === 'menu' && 'Quick Menu'}
                      {panel === 'inbox' && 'Inbox'}
                      {panel === 'about' && 'About'}
                      {panel === 'settings' && 'Settings'}
                    </div>
                    <div className="text-sm font-semibold truncate">
                      {panel === 'menu' && 'EpanDStream'}
                      {panel === 'inbox' && `${unreadCount} unread`}
                      {panel === 'about' && 'App & Developer'}
                      {panel === 'settings' && 'Personalize'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setPanel(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 active:bg-white/20 flex items-center justify-center shrink-0 transition-colors"
                >
                  <CloseIcon size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="max-h-[70vh] overflow-y-auto no-scrollbar" style={{ animation: 'contentFadeIn 0.4s 0.15s both' }}>
                {panel === 'menu' && <MenuPanel onSelect={setPanel} unreadCount={unreadCount} />}
                {panel === 'inbox' && <InboxPanel />}
                {panel === 'about' && <AboutPanel />}
                {panel === 'settings' && <SettingsPanel />}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function MenuPanel({ onSelect, unreadCount }: { onSelect: (p: Panel) => void; unreadCount: number }) {
  const { navigate, route } = useAppRouter();
  const isDonghua = route.name.startsWith('donghua');
  const items = [
    { key: 'inbox', label: 'Inbox', sub: `${unreadCount} unread message${unreadCount === 1 ? '' : 's'}`, icon: <InboxIcon size={18} />, badge: unreadCount },
    { key: 'about', label: 'About', sub: 'App info & developer', icon: <InfoIcon size={18} />, badge: 0 },
    { key: 'settings', label: 'Settings', sub: 'Theme, font & more', icon: <SettingsIcon size={18} />, badge: 0 },
  ];
  return (
    <div className="p-2">
      {/* Mode switcher */}
      <div style={{ animation: `staggerItem 0.35s 0s both` }}>
        <div className="text-[10px] uppercase tracking-widest text-white/40 px-3 mb-1.5">Content</div>
        <div className="liquid-glass rounded-2xl p-1 mx-1 mb-3 flex">
          <button
            onClick={() => { navigate({ name: 'home' }); onSelect(null); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 ${!isDonghua ? 'bg-white/15' : 'text-white/50'}`}
          >
            Anime
          </button>
          <button
            onClick={() => { navigate({ name: 'donghua' }); onSelect(null); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 ${isDonghua ? 'bg-white/15' : 'text-white/50'}`}
          >
            Donghua
          </button>
        </div>
      </div>
      {items.map((i, idx) => (
        <button
          key={i.key}
          onClick={() => onSelect(i.key as Panel)}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-white/5 active:bg-white/10 text-left transition-all duration-200"
          style={{ animation: `staggerItem 0.35s ${(idx + 1) * 0.06}s both` }}
        >
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            {i.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold">{i.label}</div>
            <div className="text-xs text-white/50 truncate">{i.sub}</div>
          </div>
          {i.badge > 0 && (
            <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">{i.badge}</span>
          )}
        </button>
      ))}
    </div>
  );
}

function InboxPanel() {
  const { inbox, markRead, markAllRead, deleteMessage } = useApp();
  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[11px] uppercase tracking-widest text-white/40">{inbox.length} messages</span>
        {inbox.some(m => !m.read) && (
          <button onClick={markAllRead} className="text-[12px] text-blue-400 font-medium flex items-center gap-1">
            <CheckIcon size={14} /> Mark all read
          </button>
        )}
      </div>
      {inbox.length === 0 ? (
        <div className="text-center py-10 text-white/40">
          <BellIcon size={32} />
          <div className="text-sm mt-2">No messages</div>
        </div>
      ) : (
        <div className="space-y-2">
          {inbox.map((m, idx) => (
            <div
              key={m.id}
              onClick={() => !m.read && markRead(m.id)}
              className="p-3 rounded-2xl border transition-all cursor-pointer duration-200 active:scale-[0.98]"
              style={{
                background: m.read ? 'rgba(255,255,255,0.05)' : 'rgba(59,130,246,0.1)',
                borderColor: m.read ? 'rgba(255,255,255,0.05)' : 'rgba(96,165,250,0.2)',
                animation: `staggerItem 0.35s ${idx * 0.05}s both`,
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 min-w-0 flex-1">
                  {!m.read && <span className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />}
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">{m.title}</div>
                    <div className="text-xs text-white/60 mt-0.5">{m.body}</div>
                    <div className="text-[10px] text-white/40 mt-1">{timeAgo(m.time)}</div>
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); deleteMessage(m.id); }} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 active:bg-white/15 flex items-center justify-center shrink-0 transition-colors">
                  <TrashIcon size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AboutPanel() {
  return (
    <div className="p-4 space-y-4">
      <div className="text-center py-4" style={{ animation: 'staggerItem 0.4s 0.1s both' }}>
        <div className="mx-auto w-16 h-16 rounded-2xl from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center mb-3 shadow-xl">
          <img src={iconWebs} Alt="EpanDStream" className="w-16 h-16 rounded-2xl" />
        </div>
        <div className="text-lg font-bold tracking-tight">EpanDStream</div>
        <div className="text-xs text-white/50 mt-0.5">Version 3.0.2 · Premium Edition</div>
      </div>
      <div className="bg-white/5 rounded-2xl p-3 space-y-2" style={{ animation: 'staggerItem 0.4s 0.2s both' }}>
        <Row label="Developer" value="EpannXD" />
        <Row label="API Provider" value="Sankavollerei" />
        <Row label="UI Framework" value="React + Tailwind" />
      </div>
      <div className="bg-white/5 rounded-2xl p-3" style={{ animation: 'staggerItem 0.4s 0.3s both' }}>
        <div className="text-[11px] uppercase tracking-widest text-white/40 mb-1">About</div>
        <p className="text-xs text-white/70 leading-relaxed">
          EpanDStream is a premium anime & donghua streaming experience inspired by Apple's design language.
          Browse, search, favorite, and stream your favorite content in stunning liquid glass UI.
        </p>
      </div>
      <div className="flex items-center justify-center gap-1 text-[11px] text-white/40" style={{ animation: 'staggerItem 0.4s 0.4s both' }}>
        Made with <HeartIcon size={12} className="text-red-500" /> · 2026
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-white/50">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function SettingsPanel() {
  const {
    theme, setTheme, font, setFont,
    colorTheme, setColorTheme,
    designStyle, setDesignStyle,
    neonColor, setNeonColor,
  } = useApp();

  const themes: { key: Theme; label: string; icon: React.ReactNode }[] = [
    { key: 'light', label: 'Light', icon: <SunIcon size={16} /> },
    { key: 'dark', label: 'Dark', icon: <MoonIcon size={16} /> },
    { key: 'system', label: 'Auto', icon: <SparklesIcon size={16} /> },
  ];

  const fonts: { key: FontTheme; label: string; sample: string; cls: string }[] = [
    { key: 'inter', label: 'Inter', sample: 'Aa', cls: 'font-theme-inter' },
    { key: 'grotesk', label: 'Grotesk', sample: 'Aa', cls: 'font-theme-grotesk' },
    { key: 'playfair', label: 'Playfair', sample: 'Aa', cls: 'font-theme-playfair' },
    { key: 'mono', label: 'Mono', sample: 'Aa', cls: 'font-theme-mono' },
    { key: 'elegant', label: 'Elegant', sample: 'Aa', cls: 'font-theme-elegant' },
  ];

  const colorThemes: { key: ColorTheme; label: string; color: string }[] = [
    { key: 'midnight', label: 'Midnight', color: '#0a84ff' },
    { key: 'rose', label: 'Rose', color: '#ff375f' },
    { key: 'forest', label: 'Forest', color: '#30d158' },
    { key: 'ocean', label: 'Ocean', color: '#64d2ff' },
    { key: 'sunset', label: 'Sunset', color: '#ff9f0a' },
    { key: 'lavender', label: 'Lavender', color: '#bf5af2' },
    { key: 'crimson', label: 'Crimson', color: '#ff453a' },
    { key: 'gold', label: 'Gold', color: '#ffd60a' },
    { key: 'mint', label: 'Mint', color: '#63e6e2' },
    { key: 'grape', label: 'Grape', color: '#7c5cfc' },
  ];

  const styles: { key: DesignStyle; label: string }[] = [
    { key: 'liquid', label: 'Liquid' },
    { key: 'neo', label: 'Neo' },
    { key: 'soft-neo', label: 'Soft Neo' },
    { key: 'neon', label: 'Neon' },
    { key: 'mono', label: 'Mono' },
  ];

  const neonPresets = ['#00f0ff', '#ff00e5', '#a855f7', '#22ff88', '#ff5e3a', '#ffd60a', '#3a86ff', '#ffffff'];

  const activeBtn = (active: boolean) =>
    `flex flex-col items-center justify-center gap-1 py-2.5 rounded-2xl border transition-all duration-300 ${active ? 'bg-blue-500/20 border-blue-400/40 scale-105' : 'bg-white/5 border-white/5 hover:bg-white/10 active:scale-95'}`;

  return (
    <div className="p-4 space-y-5">
      {/* Appearance (Light/Dark/Auto) */}
      <section style={{ animation: 'staggerItem 0.4s 0.05s both' }}>
        <div className="text-[11px] uppercase tracking-widest text-white/40 mb-2 px-1">Appearance</div>
        <div className="grid grid-cols-3 gap-2">
          {themes.map(t => (
            <button key={t.key} onClick={() => setTheme(t.key)} className={activeBtn(theme === t.key)}>
              {t.icon}
              <span className="text-xs font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Color Theme */}
      <section style={{ animation: 'staggerItem 0.4s 0.1s both' }}>
        <div className="text-[11px] uppercase tracking-widest text-white/40 mb-2 px-1 flex items-center justify-between">
          <span>Color Theme</span>
          <span className="text-[10px] text-white/60 normal-case tracking-normal">{colorThemes.find(c => c.key === colorTheme)?.label}</span>
        </div>
        <div className="grid grid-cols-5 gap-2.5">
          {colorThemes.map(c => (
            <button
              key={c.key}
              onClick={() => setColorTheme(c.key)}
              className="flex flex-col items-center gap-1 group"
              title={c.label}
            >
              <span
                className={`w-9 h-9 rounded-full transition-all duration-300 ${colorTheme === c.key ? 'ring-2 ring-white ring-offset-2 ring-offset-[var(--island-bg)] scale-110' : 'group-hover:scale-110'}`}
                style={{ background: `radial-gradient(circle at 30% 30%, ${c.color}, ${c.color}99)` }}
              />
            </button>
          ))}
        </div>
      </section>

      {/* Design Style */}
      <section style={{ animation: 'staggerItem 0.4s 0.15s both' }}>
        <div className="text-[11px] uppercase tracking-widest text-white/40 mb-2 px-1">Design Style</div>
        <div className="grid grid-cols-3 gap-2">
          {styles.map(s => {
            const active = designStyle === s.key;
            return (
              <button key={s.key} onClick={() => setDesignStyle(s.key)} className={activeBtn(active)}>
                <StyleMiniPreview style={s.key} active={active} />
                <span className="text-[10px] font-medium">{s.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Custom Glow Color (especially for Neon) */}
      <section
        className="overflow-hidden transition-all duration-500"
        style={{
          animation: 'staggerItem 0.4s 0.2s both',
          maxHeight: designStyle === 'neon' ? 400 : 0,
          opacity: designStyle === 'neon' ? 1 : 0,
          marginTop: designStyle === 'neon' ? undefined : -20,
        }}
      >
        <div className="text-[11px] uppercase tracking-widest text-white/40 mb-2 px-1 flex items-center gap-1.5">
          <SparklesIcon size={12} /> Custom Glow
        </div>
        <div className="flex items-center gap-2 mb-2.5">
          <label className="relative w-12 h-12 rounded-2xl overflow-hidden border border-white/15 cursor-pointer shrink-0" style={{ background: neonColor, boxShadow: `0 0 16px ${neonColor}99` }}>
            <input
              type="color"
              value={neonColor}
              onChange={(e) => setNeonColor(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </label>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold uppercase tracking-wider">{neonColor}</div>
            <div className="text-[10px] text-white/50">Tap to pick a custom neon color</div>
          </div>
        </div>
        <div className="grid grid-cols-8 gap-1.5">
          {neonPresets.map(p => (
            <button
              key={p}
              onClick={() => setNeonColor(p)}
              className={`aspect-square rounded-lg transition-all duration-200 ${neonColor.toLowerCase() === p.toLowerCase() ? 'ring-2 ring-white scale-110' : 'hover:scale-110'}`}
              style={{ background: p, boxShadow: `0 0 10px ${p}88` }}
            />
          ))}
        </div>
      </section>

      {/* Typeface */}
      <section style={{ animation: 'staggerItem 0.4s 0.2s both' }}>
        <div className="text-[11px] uppercase tracking-widest text-white/40 mb-2 px-1 flex items-center gap-1.5">
          <TypeIcon size={12} /> Typeface
        </div>
        <div className="grid grid-cols-5 gap-2">
          {fonts.map(f => (
            <button key={f.key} onClick={() => setFont(f.key)} className={`flex flex-col items-center gap-1 py-2.5 rounded-2xl border transition-all duration-300 ${font === f.key ? 'bg-blue-500/20 border-blue-400/40 scale-105' : 'bg-white/5 border-white/5 hover:bg-white/10 active:scale-95'}`}>
              <span className={`text-xl ${f.cls}`}>{f.sample}</span>
            <span className="text-[9px] font-medium uppercase tracking-wider">{f.label}</span>
          </button>
          ))}
        </div>
      </section>

      {/* Reset to default */}
      <section style={{ animation: 'staggerItem 0.4s 0.25s both' }}>
        <button
          onClick={() => {
            setTheme('dark');
            setFont('inter');
            setColorTheme('midnight');
            setDesignStyle('liquid');
            setNeonColor('#00f0ff');
          }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-red-400/30 bg-red-500/10 text-red-300 text-xs font-bold hover:bg-red-500/20 active:scale-95 transition-all"
        >
          <TrashIcon size={14} /> Reset to Default
        </button>
      </section>
    </div>
  );
}

/* Mini live preview that mirrors the chosen design style */
function StyleMiniPreview({ style, active }: { style: DesignStyle; active: boolean }) {
  const base = 'w-7 h-5 rounded-md transition-all duration-300';
  if (style === 'neo') {
    return <span className={base} style={{ background: active ? '#fff' : '#9a9aa3', border: '1.5px solid #fff', boxShadow: '2.5px 2.5px 0 #fff' }} />;
  }
  if (style === 'soft-neo') {
    return <span className={base} style={{ background: 'rgba(10,132,255,0.4)', border: '1px solid #fff', borderRadius: 8 }} />;
  }
  if (style === 'neon') {
    return <span className={base} style={{ background: '#0a0a1a', border: '1px solid var(--neon-color)', boxShadow: `0 0 8px var(--neon-glow)` }} />;
  }
  if (style === 'mono') {
    return <span className={base} style={{ background: 'transparent', border: '1px solid #8a8a8e' }} />;
  }
  // liquid
  return <span className={base} style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.25)', boxShadow: '0 4px 10px rgba(0,0,0,0.4)' }} />;
}

function timeAgo(t: number) {
  const diff = Math.floor((Date.now() - t) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
