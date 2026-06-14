import { useEffect, useState } from 'react';
import { donghuaApi, normalizeDonghua, DonghuaItem } from '../lib/donghua';
import { useRouter } from '../context/RouterContext';
import { TagIcon } from '../components/Icon';

export function DonghuaLibraryPage() {
  const { route, navigate } = useRouter();
  const routeTab = (route.name === 'donghua-library' && route.tab) || 'ongoing';
  const [tab, setTab] = useState<'ongoing' | 'completed'>(routeTab);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<DonghuaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => { setTab(routeTab); }, [routeTab]);

  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    load(1, true);
  }, [tab]);

  const load = async (p: number, reset = false) => {
    if (reset) setLoading(true); else setLoadingMore(true);
    try {
      const data = tab === 'ongoing' ? await donghuaApi.ongoing(p) : await donghuaApi.completed(p);
      const list = (data?.ongoing_donghua || data?.completed_donghua || data?.animeList || []).map(normalizeDonghua);
      setItems(prev => reset ? list : [...prev, ...list]);
      if (list.length === 0) setHasMore(false);
    } catch (e) { setHasMore(false); }
    finally { setLoading(false); setLoadingMore(false); }
  };

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    const next = page + 1;
    setPage(next);
    load(next);
  };

  return (
    <div className="px-4 pt-20">
      <div className="flex items-center justify-between mb-4 animate-fade-in-up">
        <h1 className="text-3xl font-extrabold tracking-tight">Donghua</h1>
        <button onClick={() => navigate({ name: 'donghua-genre' })} className="liquid-glass rounded-full w-10 h-10 flex items-center justify-center">
          <TagIcon size={16} />
        </button>
      </div>

      <div className="liquid-glass rounded-2xl p-1 flex mb-4 animate-fade-in-up">
        {(['ongoing','completed'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 text-sm font-semibold py-2 rounded-xl transition ${tab === t ? 'bg-[var(--app-fg)] text-[var(--app-bg)]' : 'text-[var(--muted)]'}`}>
            {t === 'ongoing' ? 'Ongoing' : 'Completed'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-3">{Array.from({ length: 9 }).map((_, i) => <div key={i} className="space-y-2"><div className="aspect-[2/3] rounded-2xl skeleton" /><div className="h-3 skeleton rounded w-3/4" /></div>)}</div>
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
            <button onClick={loadMore} disabled={loadingMore} className="w-full mt-5 py-3 rounded-2xl liquid-glass text-sm font-semibold disabled:opacity-50">
              {loadingMore ? 'Loading…' : 'Load more'}
            </button>
          )}
        </>
      )}
      <div className="h-32" />
    </div>
  );
}
