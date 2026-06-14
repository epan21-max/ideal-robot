import { useEffect, useState } from 'react';
import { donghuaApi } from '../lib/donghua';
import { useRouter } from '../context/RouterContext';
import { useApp } from '../context/AppContext';
import { ChevronLeftIcon, HeartIcon, HeartFillIcon, PlayIcon, StarIcon, ClockIcon, TagIcon, TvIcon, LayersIcon } from '../components/Icon';

export function DonghuaDetailPage({ slug }: { slug: string }) {
  const { back, navigate } = useRouter();
  const { isFavorite, toggleFavorite } = useApp();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let m = true;
    (async () => {
      setLoading(true);
      try {
        const d = await donghuaApi.detail(slug);
        if (m) setData(d);
      } catch (e) { console.error(e); }
      finally { if (m) setLoading(false); }
    })();
    window.scrollTo({ top: 0, behavior: 'instant' as any });
    return () => { m = false; };
  }, [slug]);

  if (loading) {
    return (
      <div className="px-4 pt-20">
        <div className="aspect-[16/9] rounded-3xl skeleton mb-4" />
        <div className="space-y-3"><div className="h-8 skeleton rounded w-2/3" /><div className="h-3 skeleton rounded w-full" /></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="px-4 pt-20 text-center text-[var(--muted)]">
        <p>Failed to load donghua.</p>
        <button onClick={back} className="mt-4 text-[var(--accent)]">Go back</button>
      </div>
    );
  }

  const poster = data.poster;
  const title = data.title || 'Untitled';
  const synopsis = data.synopsis || '';
  const score = data.rating;
  const status = data.status;
  const episodesCount = data.episodes_count;
  const studio = data.studio;
  const released = data.released || data.released_on;
  const genres = data.genres || [];
  const fav = isFavorite(slug);
  const episodes: any[] = data.episodes_list || [];

  return (
    <div className="pb-32">
      {/* Hero */}
      <div className="relative w-full h-[55vh] min-h-[420px] overflow-hidden">
        {poster && (
          <>
            <img src={poster} alt={title} className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-50" />
            <img src={poster} alt={title} className="absolute inset-0 w-full h-full object-contain animate-fade-in" />
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--app-bg)] via-[var(--app-bg)]/40 to-transparent" />
        <button onClick={back} className="absolute top-[max(env(safe-area-inset-top),12px)] left-4 z-20 liquid-glass-strong w-10 h-10 rounded-full flex items-center justify-center"><ChevronLeftIcon size={18} /></button>
        <button onClick={() => toggleFavorite({ title, poster, slug, type: 'Donghua' })} className="absolute top-[max(env(safe-area-inset-top),12px)] right-4 z-20 liquid-glass-strong w-10 h-10 rounded-full flex items-center justify-center">
          {fav ? <HeartFillIcon size={16} className="text-red-500" /> : <HeartIcon size={16} />}
        </button>
      </div>

      <div className="px-4 -mt-12 relative z-10 animate-slide-up">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">{title}</h1>
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {score && <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full liquid-glass"><StarIcon size={11} className="text-yellow-500" /> {score}</span>}
          {status && <span className="text-xs font-semibold px-2.5 py-1 rounded-full liquid-glass">{status}</span>}
          {episodesCount && <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full liquid-glass"><LayersIcon size={11} /> {episodesCount}</span>}
        </div>

        {episodes.length > 0 && (
          <div className="mt-4 flex gap-2">
            <button onClick={() => { const ep = episodes[0]; if (ep?.slug) navigate({ name: 'donghua-episode', slug: ep.slug }); }} className="flex-1 bg-[var(--app-fg)] text-[var(--app-bg)] font-semibold text-sm px-4 py-3 rounded-2xl inline-flex items-center justify-center gap-2">
              <PlayIcon size={14} /> Watch Now
            </button>
            <button onClick={() => toggleFavorite({ title, poster, slug, type: 'Donghua' })} className="liquid-glass-strong w-12 h-12 rounded-2xl flex items-center justify-center">
              {fav ? <HeartFillIcon size={16} className="text-red-500" /> : <HeartIcon size={16} />}
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 mt-5">
          {studio && <MetaCard icon={<TvIcon size={14} />} label="Studio" value={String(studio)} />}
          {released && <MetaCard icon={<ClockIcon size={14} />} label="Released" value={String(released)} />}
        </div>

        {genres.length > 0 && (
          <div className="mt-5">
            <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-2 flex items-center gap-1.5"><TagIcon size={11} /> Genres</div>
            <div className="flex flex-wrap gap-1.5">
              {genres.map((g: any, i: number) => (
                <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-full liquid-glass">{g.name || g.title || g}</span>
              ))}
            </div>
          </div>
        )}

        {synopsis && (
          <div className="mt-5">
            <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Synopsis</div>
            <p className="text-sm leading-relaxed text-[var(--app-fg)]/85">{synopsis}</p>
          </div>
        )}

        {episodes.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold tracking-tight">Episodes</h3>
              <span className="text-xs text-[var(--muted)]">{episodes.length} total</span>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-2 gap-2 stagger">
              {episodes.map((ep, i) => {
                const epSlug = ep.slug || '';
                const rawTitle = ep.episode || ep.title || '';
                const parsedNum = rawTitle ? rawTitle.match(/episode\s+(\d+)/i)?.[1] : null;
                const displayTitle = parsedNum ? `EP ${parsedNum}` : `EP ${episodes.length - i}`;
                const fullTitle = rawTitle || `Episode ${parsedNum || episodes.length - i}`;
                return (
                  <button
                    key={i}
                    onClick={() => epSlug && navigate({ name: 'donghua-episode', slug: epSlug })}
                    title={fullTitle}
                    className="liquid-glass group rounded-2xl p-3 flex flex-col items-center justify-center text-center hover:bg-[var(--accent)] hover:text-white active:scale-95 transition-all shadow-sm relative overflow-hidden min-h-[58px]"
                  >
                    <span className="text-xs font-black tracking-tight">{displayTitle}</span>
                    <span className="text-[10px] opacity-70 truncate w-full mt-0.5 hidden md:block">
                      {fullTitle}
                    </span>
                    <span className="text-[9px] opacity-50 truncate w-full block md:hidden">
                      {ep.date || 'Sub Indo'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MetaCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="liquid-glass rounded-2xl p-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[var(--muted)] mb-1">{icon} {label}</div>
      <div className="text-sm font-semibold truncate">{value}</div>
    </div>
  );
}
