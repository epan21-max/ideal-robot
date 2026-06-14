import { useEffect, useMemo, useState } from 'react';
import bannerCons from '@/assets/image.png';
import { useRouter } from '../context/RouterContext';
import { useApp } from '../context/AppContext';
import {
  CalendarIcon,
  CheckIcon,
  GridIcon,
  HeartIcon,
  PlayIcon,
  SearchIcon,
  SparklesIcon,
  TagIcon,
  TvIcon,
} from '../components/Icon';

export function HomePage() {
  const { navigate } = useRouter();
  const { favorites, resolvedTheme, designStyle, colorTheme } = useApp();
  const [online, setOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  const today = useMemo(() => new Date().toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'short'
  }), []);

  return (
    <div className="min-h-screen px-4 pt-20 pb-28">
      {/* Lightweight home keeps first paint fast on low-end devices. */}
      <section className="home-banner relative overflow-hidden rounded-[30px] px-5 pt-8 pb-6 text-white bg-black animate-page-in">
        <div className="absolute inset-0 opacity-70">
          <img src={bannerCons} alt="Banner" />
        </div>
        <div className="absolute -right-20 -top-20 w-48 h-48 rounded-full blur-3xl" style={{ background: 'var(--blob-a)' }} />
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] px-2.5 py-1 rounded-full bg-white/12 backdrop-blur-md border border-white/10 mb-4">
            <SparklesIcon size={13} /> EPANDSTREAM LITE HOME
          </div>
          <h1 className="text-4xl font-black leading-[0.98] tracking-tight">
            Stream faster.<br />Choose your world.
          </h1>
          <p className="mt-3 text-sm text-white/75 leading-relaxed max-w-[20rem]">
            Homepage dibuat lebih ringan agar cepat dibuka di device lemah. Pilih Anime atau Donghua untuk mulai menjelajah.
          </p>

          <div className="grid grid-cols-2 gap-2 mt-5">
            <button
              onClick={() => navigate({ name: 'anime' })}
              className="bg-white text-black rounded-2xl py-3 px-3 font-extrabold text-sm inline-flex items-center justify-center gap-2 shadow-xl"
            >
              <PlayIcon size={14} /> To Anime
            </button>
            <button
              onClick={() => navigate({ name: 'donghua' })}
              className="rounded-2xl py-3 px-3 font-extrabold text-sm inline-flex items-center justify-center gap-2 bg-white/12 backdrop-blur-md border border-white/10"
            >
              <TvIcon size={15} /> To Donghua
            </button>
          </div>
        </div>
      </section>

      <section className="mt-5 animate-fade-in-up">
        <div className="flex items-end justify-between mb-3">
          <div>
            <div className="text-xs uppercase tracking-widest text-[var(--muted)]">Information / Status</div>
            <h2 className="text-xl font-extrabold tracking-tight">System Overview</h2>
          </div>
          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${online ? 'bg-emerald-500/15 text-emerald-500' : 'bg-red-500/15 text-red-500'}`}>
            {online ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <StatusItem icon={<CheckIcon size={14} />} label="Network" value={online ? 'Ready' : 'Offline'} />
          <StatusItem icon={<CalendarIcon size={14} />} label="Today" value={today} />
          <StatusItem icon={<HeartIcon size={14} />} label="Favorites" value={`${favorites.length} saved`} />
          <StatusItem icon={<SparklesIcon size={14} />} label="Style" value={`${designStyle} / ${colorTheme}`} />
        </div>
      </section>

      <section className="mt-6 animate-fade-in-up">
        <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-3">Quick Actions</div>
        <div className="grid grid-cols-2 gap-2">
          <ActionButton icon={<SearchIcon size={17} />} label="Search Anime" sub="Find titles fast" onClick={() => navigate({ name: 'search' })} />
          <ActionButton icon={<SearchIcon size={17} />} label="Search Donghua" sub="Chinese animation" onClick={() => navigate({ name: 'donghua-search' })} />
          <ActionButton icon={<GridIcon size={17} />} label="Anime Library" sub="Ongoing & completed" onClick={() => navigate({ name: 'library', tab: 'ongoing' })} />
          <ActionButton icon={<GridIcon size={17} />} label="Donghua Library" sub="Ongoing & completed" onClick={() => navigate({ name: 'donghua-library', tab: 'ongoing' })} />
          <ActionButton icon={<TagIcon size={17} />} label="Anime Genres" sub="Browse by mood" onClick={() => navigate({ name: 'genre' })} />
          <ActionButton icon={<TagIcon size={17} />} label="Donghua Genres" sub="Cultivation & more" onClick={() => navigate({ name: 'donghua-genre' })} />
        </div>
      </section>

      <section className="mt-6 liquid-glass rounded-3xl p-4 animate-fade-in-up">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center shrink-0">
            <SparklesIcon size={18} />
          </div>
          <div>
            <h3 className="text-sm font-extrabold tracking-tight">Performance Mode</h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed mt-1">
              Homepage tidak lagi memuat poster dan carousel berat saat pertama dibuka. Konten gambar baru dimuat setelah masuk ke Anime atau Donghua.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] font-bold text-[var(--muted)]">
              <span className="px-2 py-1 rounded-full bg-[var(--surface)]">No autoplay</span>
              <span className="px-2 py-1 rounded-full bg-[var(--surface)]">Lazy images</span>
              <span className="px-2 py-1 rounded-full bg-[var(--surface)]">Reduced first load</span>
              <span className="px-2 py-1 rounded-full bg-[var(--surface)]">{resolvedTheme} mode</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatusItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="liquid-glass rounded-2xl p-3 min-h-[76px] flex flex-col justify-between">
      <div className="text-[var(--accent)]">{icon}</div>
      <div>
        <div className="text-[10px] uppercase tracking-widest text-[var(--muted)]">{label}</div>
        <div className="text-xs font-extrabold truncate mt-0.5">{value}</div>
      </div>
    </div>
  );
}

function ActionButton({ icon, label, sub, onClick }: { icon: React.ReactNode; label: string; sub: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="liquid-glass rounded-2xl p-3 text-left min-h-[86px] flex flex-col justify-between hover:scale-[1.02] active:scale-[0.98] transition-all">
      <div className="text-[var(--accent)]">{icon}</div>
      <div>
        <div className="text-sm font-extrabold tracking-tight">{label}</div>
        <div className="text-[11px] text-[var(--muted)] mt-0.5">{sub}</div>
      </div>
    </button>
  );
}