import { useEffect, useState } from 'react';
import { donghuaApi, normalizeDonghua, DonghuaItem } from '../lib/donghua';
import { useRouter } from '../context/RouterContext';
import { TagIcon, ChevronLeftIcon } from '../components/Icon';

export function DonghuaGenreDetailPage({ slug, genreName }: { slug: string; genreName?: string }) {
  const { back, navigate } = useRouter();
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<DonghuaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    load(1, true);
  }, [slug]);

  const load = async (p: number, reset = false) => {
    if (reset) setLoading(true); else setLoadingMore(true);
    try {
      const data = await donghuaApi.genreDetail(slug, p);
      const list = (data?.data || data?.ongoing_donghua || data?.completed_donghua || data?.results || (Array.isArray(data) ? data : [])).map(normalizeDonghua);
      setItems(prev => reset ? list : [...prev, ...list]);
      if (list.length === 0 || list.length < 10) setHasMore(false);
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    const next = page + 1;
    setPage(next);
    load(next);
  };

  const formattedTitle = genreName || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="px-4 pt-20 pb-32">
      {/* Top sticky bar */}
      <div className="sticky top-0 z-30 pt-[max(env(safe-area-inset-top),12px)] pb-3 bg-[var(--app-bg)]/80 backdrop-blur-md -mx-4 px-4 flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button onClick={back} className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center shrink-0">
            <ChevronLeftIcon size={18} />
          </button>
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] flex items-center gap-1">
              <TagIcon size={10} /> Donghua Genre
            </div>
            <h1 className="text-xl font-bold tracking-tight truncate">{formattedTitle}</h1>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="aspect-[2/3] rounded-2xl skeleton" />
              <div className="h-3 skeleton rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-[var(--muted)] animate-fade-in">
          <TagIcon size={32} className="mx-auto mb-2 opacity-50" />
          <div className="text-sm font-semibold">No donghua found in this genre</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3 stagger">
            {items.map((a, i) => (
              <button key={(a.slug || '') + i} onClick={() => a.slug && navigate({ name: 'donghua-detail', slug: a.slug })} className="group text-left">
                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-[var(--surface)]">
                  {a.poster && <img src={a.poster} alt={a.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0" />
                  {a.status && <span className="absolute top-2 left-2 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-black/60 text-white backdrop-blur">{a.status}</span>}
                </div>
                <div className="mt-2 px-0.5">
                  <div className="text-xs font-semibold line-clamp-2 leading-tight">{a.title}</div>
                  {a.episodes_count && <div className="text-[10px] text-[var(--muted)] mt-0.5">{a.episodes_count}</div>}
                </div>
              </button>
            ))}
          </div>
          {hasMore && (
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="w-full mt-6 py-3.5 rounded-2xl liquid-glass text-sm font-bold shadow-lg disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              {loadingMore ? 'Loading episodes…' : 'Load more'}
            </button>
          )}
        </>
      )}
    </div>
  );
}
