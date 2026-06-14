import { useEffect, useState } from 'react';
import { api, normalizeAnime, AnimeItem } from '../lib/api';
import { AnimeCard } from '../components/AnimeCard';
import { GridSkeleton } from '../components/Skeleton';
import { useRouter } from '../context/RouterContext';
import { TagIcon } from '../components/Icon';

export function LibraryPage() {
  const { route, navigate } = useRouter();
  const routeTab = (route.name === 'library' && route.tab) || 'ongoing';
  const [tab, setTab] = useState<'ongoing' | 'complete'>(routeTab);

  useEffect(() => {
    setTab(routeTab);
  }, [routeTab]);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<AnimeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    load(1, tab, true);
  }, [tab]);

  const load = async (p: number, t: 'ongoing' | 'complete', reset = false) => {
    if (reset) setLoading(true); else setLoadingMore(true);
    try {
      const data = t === 'ongoing' ? await api.ongoing(p) : await api.complete(p);
      const list = (data?.animeList || data?.anime || data?.list || data?.results || (Array.isArray(data) ? data : [])).map(normalizeAnime);
      setItems(prev => reset ? list : [...prev, ...list]);
      if (list.length === 0) setHasMore(false);
    } catch (e) {
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
    load(next, tab);
  };

  return (
    <div className="px-4 pt-20">
      <div className="flex items-center justify-between mb-4 animate-fade-in-up">
        <h1 className="text-3xl font-extrabold tracking-tight">Library</h1>
        <button onClick={() => navigate({ name: 'genre' })} className="liquid-glass rounded-full w-10 h-10 flex items-center justify-center">
          <TagIcon size={16} />
        </button>
      </div>

      <div className="liquid-glass rounded-2xl p-1 flex mb-4 animate-fade-in-up">
        {(['ongoing','complete'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 text-sm font-semibold py-2 rounded-xl transition ${tab === t ? 'bg-[var(--app-fg)] text-[var(--app-bg)]' : 'text-[var(--muted)]'}`}
          >
            {t === 'ongoing' ? 'Ongoing' : 'Completed'}
          </button>
        ))}
      </div>

      {loading ? <GridSkeleton count={9} /> : (
        <>
          <div className="grid grid-cols-3 gap-3 stagger">
            {items.map((a, i) => <AnimeCard key={(a.slug || '') + i} anime={a} />)}
          </div>
          {hasMore && (
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="w-full mt-5 py-3 rounded-2xl liquid-glass text-sm font-semibold disabled:opacity-50"
            >
              {loadingMore ? 'Loading…' : 'Load more'}
            </button>
          )}
        </>
      )}

      <div className="h-32" />
    </div>
  );
}
