import { useEffect, useState } from 'react';
import { api, normalizeAnime } from '../lib/api';
import { useRouter } from '../context/RouterContext';
import { useApp } from '../context/AppContext';
import { ChevronLeftIcon, HeartIcon, HeartFillIcon, PlayIcon, StarIcon, ClockIcon, TagIcon, TvIcon, LayersIcon } from '../components/Icon';

export function DetailPage({ slug }: { slug: string }) {
  const { back, navigate } = useRouter();
  const { isFavorite, toggleFavorite } = useApp();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let m = true;
    (async () => {
      setLoading(true);
      try {
        const d = await api.detail(slug);
        if (m) setData(d);
      } catch (e) {
        console.error(e);
      } finally {
        if (m) setLoading(false);
      }
    })();
    return () => { m = false; };
  }, [slug]);

  if (loading) {
    return (
      <div className="px-4 pt-20">
        <div className="aspect-[16/9] rounded-3xl skeleton mb-4" />
        <div className="space-y-3">
          <div className="h-8 skeleton rounded w-2/3" />
          <div className="h-3 skeleton rounded w-full" />
          <div className="h-3 skeleton rounded w-3/4" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="px-4 pt-20 text-center text-[var(--muted)]">
        <p>Failed to load anime.</p>
        <button onClick={back} className="mt-4 text-[var(--accent)]">Go back</button>
      </div>
    );
  }

  const a = normalizeAnime(data);
  const poster = a.poster || a.thumbnail || data.thumbnail_url || data.poster;
  const title = data.title || data.judul || a.title || 'Untitled';
  const synopsis = typeof data.synopsis === 'string'
    ? data.synopsis
    : Array.isArray(data?.synopsis?.paragraphs)
      ? data.synopsis.paragraphs.join('\n\n')
      : (data.sinopsis || data.description || '');
  const score = data.score || data.rating || a.rating;
  const status = data.status || a.status;
  const episodesCount = data.episodes || data.episode_count || data.total_episode || data.episodes_total;
  const studio = data.studios || data.studio;
  const released = data.aired || data.release_date || data.released;
  const genres = data.genreList || data.genres || data.genre || [];
  const fav = isFavorite(slug);

  const episodes: any[] =
    data.episodeList || data.episode_lists || data.episodes || data.episode_list || data.list_episode || [];

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

        {/* Back */}
        <button onClick={back} className="absolute top-[max(env(safe-area-inset-top),12px)] left-4 z-20 liquid-glass-strong w-10 h-10 rounded-full flex items-center justify-center">
          <ChevronLeftIcon size={18} />
        </button>
        <button
          onClick={() => toggleFavorite({ ...a, slug, title, poster })}
          className="absolute top-[max(env(safe-area-inset-top),12px)] right-4 z-20 liquid-glass-strong w-10 h-10 rounded-full flex items-center justify-center"
        >
          {fav ? <HeartFillIcon size={16} className="text-red-500" /> : <HeartIcon size={16} />}
        </button>
      </div>

      <div className="px-4 -mt-12 relative z-10 animate-slide-up">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">{title}</h1>

        <div className="flex flex-wrap items-center gap-2 mt-3">
          {score && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full liquid-glass">
              <StarIcon size={11} className="text-yellow-500" /> {score}
            </span>
          )}
          {status && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full liquid-glass">{status}</span>
          )}
          {episodesCount && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full liquid-glass">
              <LayersIcon size={11} /> {episodesCount} eps
            </span>
          )}
        </div>

        {/* Play first episode */}
        {episodes.length > 0 && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => {
                // Latest episode is first in list
                const ep = episodes[0];
                const epSlug = ep.episodeId || ep.slug || ep.endpoint || extractSlug(ep.href || ep.url || '');
                if (epSlug) navigate({ name: 'episode', slug: epSlug });
              }}
              className="flex-1 bg-[var(--app-fg)] text-[var(--app-bg)] font-semibold text-sm px-4 py-3 rounded-2xl inline-flex items-center justify-center gap-2"
            >
              <PlayIcon size={14} /> Watch Now
            </button>
            <button
              onClick={() => toggleFavorite({ ...a, slug, title, poster })}
              className="liquid-glass-strong w-12 h-12 rounded-2xl flex items-center justify-center"
            >
              {fav ? <HeartFillIcon size={16} className="text-red-500" /> : <HeartIcon size={16} />}
            </button>
          </div>
        )}

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-2 mt-5">
          {studio && <MetaCard icon={<TvIcon size={14} />} label="Studio" value={String(studio)} />}
          {released && <MetaCard icon={<ClockIcon size={14} />} label="Released" value={String(released)} />}
        </div>

        {/* Genres */}
        {Array.isArray(genres) && genres.length > 0 && (
          <div className="mt-5">
            <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-2 flex items-center gap-1.5">
              <TagIcon size={11} /> Genres
            </div>
            <div className="flex flex-wrap gap-1.5">
              {genres.map((g: any, i: number) => (
                <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-full liquid-glass">
                  {g.name || g.title || g}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Synopsis */}
        {synopsis && (
          <div className="mt-5">
            <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Synopsis</div>
            <p className="text-sm leading-relaxed text-[var(--app-fg)]/85">{synopsis}</p>
          </div>
        )}

        {/* Episodes */}
        {episodes.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold tracking-tight">Episodes</h3>
              <span className="text-xs text-[var(--muted)]">{episodes.length} total</span>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-2 gap-2 stagger">
              {episodes.map((ep, i) => {
                const epSlug = ep.episodeId || ep.slug || ep.endpoint || extractSlug(ep.href || ep.url || '');
                const parsedNum = ep.eps ?? ep.episode ?? (typeof ep.title === 'string' ? ep.title.match(/episode\s+(\d+)/i)?.[1] : null) ?? (episodes.length - i);
                const displayTitle = parsedNum ? `EP ${parsedNum}` : `EP ${i + 1}`;
                const fullTitle = ep.title || ep.name || `Episode ${parsedNum || i + 1}`;
                const epDate = ep.date || ep.released_on || ep.release_date;
                return (
                  <button
                    key={i}
                    onClick={() => epSlug && navigate({ name: 'episode', slug: epSlug })}
                    title={fullTitle}
                    className="liquid-glass group rounded-2xl p-3 flex flex-col items-center justify-center text-center hover:bg-[var(--accent)] hover:text-white active:scale-95 transition-all shadow-sm relative overflow-hidden min-h-[58px]"
                  >
                    <span className="text-xs font-black tracking-tight">{displayTitle}</span>
                    <span className="text-[10px] opacity-70 truncate w-full mt-0.5 hidden md:block">
                      {fullTitle}
                    </span>
                    <span className="text-[9px] opacity-50 truncate w-full block md:hidden">
                      {epDate ? epDate.replace(/\s*,\s*\d{4}/, '') : 'Sub Indo'}
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
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[var(--muted)] mb-1">
        {icon} {label}
      </div>
      <div className="text-sm font-semibold truncate">{value}</div>
    </div>
  );
}

function extractSlug(url: string) {
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);
    return parts[parts.length - 1] || '';
  } catch {
    return '';
  }
}
