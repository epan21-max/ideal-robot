import { useEffect, useRef, useState } from 'react';
import { api, normalizeAnime, AnimeItem } from '../lib/api';
import { AnimeCard } from '../components/AnimeCard';
import { GridSkeleton } from '../components/Skeleton';
import { SearchIcon, CloseIcon, TagIcon } from '../components/Icon';
import { useRouter } from '../context/RouterContext';

const suggestions = ['Boruto', 'Naruto', 'One Piece', 'Solo Leveling', 'Demon Slayer', 'Jujutsu Kaisen', 'Bleach', 'Attack on Titan'];

export function SearchPage() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<AnimeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('eds.recent') || '[]'); } catch { return []; }
  });
  const { navigate } = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<any>(null);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(q), 400);
    return () => clearTimeout(debounceRef.current);
  }, [q]);

  const doSearch = async (query: string) => {
    setLoading(true);
    try {
      const data = await api.search(query.trim());
      const list = Array.isArray(data) ? data : (data?.animeList || data?.results || data?.anime || data?.data || []);
      setResults(list.map(normalizeAnime));
      const next = [query, ...recent.filter(r => r !== query)].slice(0, 6);
      setRecent(next);
      localStorage.setItem('eds.recent', JSON.stringify(next));
    } catch (e) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 pt-20">
      <div className="mb-4 animate-fade-in-up">
        <h1 className="text-3xl font-extrabold tracking-tight mb-3">Search</h1>
        <div className="liquid-glass-strong rounded-2xl flex items-center px-3 h-12">
          <SearchIcon size={18} className="text-[var(--muted)]" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search anime..."
            className="flex-1 bg-transparent outline-none px-3 text-sm placeholder:text-[var(--muted)]"
            autoFocus
          />
          {q && (
            <button onClick={() => setQ('')} className="w-7 h-7 rounded-full bg-[var(--surface)] flex items-center justify-center">
              <CloseIcon size={14} />
            </button>
          )}
        </div>
      </div>

      {!q && (
        <>
          {recent.length > 0 && (
            <div className="mb-5 animate-fade-in-up">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs uppercase tracking-widest text-[var(--muted)]">Recent</h3>
                <button onClick={() => { setRecent([]); localStorage.removeItem('eds.recent'); }} className="text-xs text-[var(--accent)]">Clear</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recent.map(r => (
                  <button key={r} onClick={() => setQ(r)} className="text-xs font-medium px-3 py-1.5 rounded-full liquid-glass">{r}</button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-5 animate-fade-in-up">
            <h3 className="text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Popular searches</h3>
            <div className="flex flex-wrap gap-2">
              {suggestions.map(s => (
                <button key={s} onClick={() => setQ(s)} className="text-xs font-medium px-3 py-1.5 rounded-full bg-[var(--surface)] hover:bg-[var(--surface-hover)]">{s}</button>
              ))}
            </div>
          </div>

          <button onClick={() => navigate({ name: 'genre' })} className="w-full liquid-glass rounded-2xl p-4 flex items-center gap-3 animate-fade-in-up">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white">
              <TagIcon size={18} />
            </div>
            <div className="text-left flex-1">
              <div className="text-sm font-semibold">Browse by Genre</div>
              <div className="text-xs text-[var(--muted)]">Action, Romance, Comedy & more</div>
            </div>
          </button>
        </>
      )}

      {q && (
        <>
          {loading ? <GridSkeleton count={9} /> : results.length === 0 ? (
            <div className="text-center py-20 text-[var(--muted)] animate-fade-in">
              <div className="text-sm">No results for "{q}"</div>
            </div>
          ) : (
            <>
              <div className="text-xs text-[var(--muted)] mb-3">{results.length} results</div>
              <div className="grid grid-cols-3 gap-3 stagger">
                {results.map((a, i) => <AnimeCard key={a.slug || i} anime={a} />)}
              </div>
            </>
          )}
        </>
      )}

      <div className="h-32" />
    </div>
  );
}
