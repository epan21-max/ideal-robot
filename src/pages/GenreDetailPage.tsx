import { useEffect, useState } from 'react';
import { api, normalizeAnime, AnimeItem } from '../lib/api';
import { AnimeCard } from '../components/AnimeCard';
import { GridSkeleton } from '../components/Skeleton';
import { useRouter } from '../context/RouterContext';
import { TagIcon, ChevronLeftIcon } from '../components/Icon';

export function GenreDetailPage({ slug, genreName }: { slug: string; genreName?: string }) {
  const { back } = useRouter();
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<AnimeItem[]>([]);
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
      const data = await api.genreDetail(slug, p);
      const list = (data?.animeList || data?.anime || data?.results || data?.data || (Array.isArray(data) ? data : [])).map(normalizeAnime);
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
              <TagIcon size={10} /> Anime Genre
            </div>
            <h1 className="text-xl font-bold tracking-tight truncate">{formattedTitle}</h1>
          </div>
        </div>
      </div>

      {loading ? <GridSkeleton count={9} /> : items.length === 0 ? (
        <div className="text-center py-20 text-[var(--muted)] animate-fade-in">
          <TagIcon size={32} className="mx-auto mb-2 opacity-50" />
          <div className="text-sm font-semibold">No anime found in this genre</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3 stagger">
            {items.map((a, i) => <AnimeCard key={(a.slug || '') + i} anime={a} />)}
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
