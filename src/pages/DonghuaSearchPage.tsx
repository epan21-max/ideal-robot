import { useEffect, useRef, useState } from 'react';
import { donghuaApi, normalizeDonghua, DonghuaItem } from '../lib/donghua';
import { useRouter } from '../context/RouterContext';
import { SearchIcon, CloseIcon, TagIcon } from '../components/Icon';

const suggestions = ['Coiling Dragon', 'Soul Land', 'Battle Through the Heavens', 'A Will Eternal', 'Potions', 'Martial Universe', 'Swallowed Star', 'Perfect World'];

export function DonghuaSearchPage() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<DonghuaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem('eds.donghua.recent') || '[]'); } catch { return []; } });
  const { navigate } = useRouter();
  const debounceRef = useRef<any>(null);

  useEffect(() => {
    if (!q.trim()) { setResults([]); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(q), 400);
    return () => clearTimeout(debounceRef.current);
  }, [q]);

  const doSearch = async (query: string) => {
    setLoading(true);
    try {
      const data = await donghuaApi.search(query.trim());
      const list = Array.isArray(data) ? data : (data?.data || data?.results || []);
      setResults(list.map(normalizeDonghua));
      const next = [query, ...recent.filter(r => r !== query)].slice(0, 6);
      setRecent(next);
      localStorage.setItem('eds.donghua.recent', JSON.stringify(next));
    } catch { setResults([]); }
    finally { setLoading(false); }
  };

  return (
    <div className="px-4 pt-20">
      <div className="mb-4 animate-fade-in-up">
        <h1 className="text-3xl font-extrabold tracking-tight mb-3">Search Donghua</h1>
        <div className="liquid-glass-strong rounded-2xl flex items-center px-3 h-12">
          <SearchIcon size={18} className="text-[var(--muted)]" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search donghua..." className="flex-1 bg-transparent outline-none px-3 text-sm placeholder:text-[var(--muted)]" autoFocus />
          {q && <button onClick={() => setQ('')} className="w-7 h-7 rounded-full bg-[var(--surface)] flex items-center justify-center"><CloseIcon size={14} /></button>}
        </div>
      </div>
      {!q && (
        <>
          {recent.length > 0 && (
            <div className="mb-5 animate-fade-in-up">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs uppercase tracking-widest text-[var(--muted)]">Recent</h3>
                <button onClick={() => { setRecent([]); localStorage.removeItem('eds.donghua.recent'); }} className="text-xs text-[var(--accent)]">Clear</button>
              </div>
              <div className="flex flex-wrap gap-2">{recent.map(r => <button key={r} onClick={() => setQ(r)} className="text-xs font-medium px-3 py-1.5 rounded-full liquid-glass">{r}</button>)}</div>
            </div>
          )}
          <div className="mb-5 animate-fade-in-up">
            <h3 className="text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Popular</h3>
            <div className="flex flex-wrap gap-2">{suggestions.map(s => <button key={s} onClick={() => setQ(s)} className="text-xs font-medium px-3 py-1.5 rounded-full bg-[var(--surface)] hover:bg-[var(--surface-hover)]">{s}</button>)}</div>
          </div>
          <button onClick={() => navigate({ name: 'donghua-genre' })} className="w-full liquid-glass rounded-2xl p-4 flex items-center gap-3 animate-fade-in-up">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white"><TagIcon size={18} /></div>
            <div className="text-left flex-1"><div className="text-sm font-semibold">Browse by Genre</div><div className="text-xs text-[var(--muted)]">Action, Fantasy, Xianxia & more</div></div>
          </button>
        </>
      )}
      {q && (
        loading ? (
          <div className="grid grid-cols-3 gap-3">{Array.from({ length: 9 }).map((_, i) => <div key={i} className="space-y-2"><div className="aspect-[2/3] rounded-2xl skeleton" /><div className="h-3 skeleton rounded w-3/4" /></div>)}</div>
        ) : results.length === 0 ? (
          <div className="text-center py-20 text-[var(--muted)] animate-fade-in"><div className="text-sm">No results for "{q}"</div></div>
        ) : (
          <>
            <div className="text-xs text-[var(--muted)] mb-3">{results.length} results</div>
            <div className="grid grid-cols-3 gap-3 stagger">
              {results.map((a, i) => (
                <button key={(a.slug || '') + i} onClick={() => a.slug && navigate({ name: 'donghua-detail', slug: a.slug })} className="group text-left">
                  <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-[var(--surface)]">
                    {a.poster && <img src={a.poster} alt={a.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0" />
                  </div>
                  <div className="mt-2 px-0.5"><div className="text-xs font-semibold line-clamp-2 leading-tight">{a.title}</div></div>
                </button>
              ))}
            </div>
          </>
        )
      )}
      <div className="h-32" />
    </div>
  );
}
