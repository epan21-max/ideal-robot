import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchNovel } from '../../lib/api';
import Loader from '../../components/Loader';
import { Search, ArrowLeft, Feather, Star } from 'lucide-react';

export default function NovelSearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(query);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    searchNovel(query).then(res => {
      setResults(res.data?.results || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/s/novel/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3 pb-20 md:pb-4">
      <button onClick={() => navigate('/s/novel/')} className="flex items-center gap-2 text-text-secondary hover:text-accent font-mono text-xs mb-4 transition-colors">
        <ArrowLeft size={14} /> Kembali
      </button>

      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Search size={22} className="text-accent" />
        Cari <span className="text-accent">Novel</span>
      </h1>

      <form onSubmit={handleSearch} className="flex mb-5 border-2 border-black shadow-[3px_3px_0px_#000]">
        <input
          type="text"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder="Masukkan judul novel..."
          className="flex-1 px-4 py-3 bg-surface text-sm outline-none text-text-primary placeholder:text-text-secondary font-mono"
          autoFocus
        />
        <button type="submit" className="px-5 bg-accent text-black font-mono font-bold border-l-2 border-black">
          <Search size={16} />
        </button>
      </form>

      {loading ? <Loader /> : (
        <>
          {query && (
            <p className="font-mono text-xs text-text-secondary mb-4">
              Hasil pencarian untuk: <span className="text-accent font-bold">"{query}"</span> ({results.length} hasil)
            </p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {results.map((item: any, i: number) => (
              <div
                key={`${item.slug}-${i}`}
                onClick={() => navigate(`/s/novel/detail/${item.slug}`)}
                className="group cursor-pointer neo-card overflow-hidden animate-fadeIn"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={item.poster}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const el = e.target as HTMLImageElement;
                      el.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" fill="%231E2D4A"><rect width="300" height="400"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23A0AEC0" font-family="monospace" font-size="12">No Image</text></svg>';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                      <div className="neo-tag bg-accent text-black flex items-center gap-1">
                        <Feather size={10} /> Detail
                      </div>
                    </div>
                  </div>
                  {item.type && (
                    <div className="absolute top-2 left-2 neo-tag bg-accent text-black text-[8px]">
                      {item.type}
                    </div>
                  )}
                  {item.rating && (
                    <div className="absolute top-2 right-2 neo-tag bg-surface text-text-primary flex items-center gap-1 text-[8px]">
                      <Star size={8} /> {item.rating}
                    </div>
                  )}
                </div>
                <div className="p-2.5">
                  <h3 className="font-bold text-xs leading-tight line-clamp-2 group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>
                  {item.status && (
                    <span className="font-mono text-[9px] text-text-secondary mt-1 block">{item.status}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          {query && results.length === 0 && !loading && (
            <div className="neo-card p-8 text-center">
              <Search size={32} className="mx-auto mb-3 text-text-secondary" />
              <p className="font-mono text-sm text-text-secondary">Tidak ditemukan hasil untuk "{query}"</p>
            </div>
          )}
          {!query && (
            <div className="neo-card p-8 text-center">
              <Feather size={32} className="mx-auto mb-3 text-accent" />
              <p className="font-mono text-sm text-text-secondary">Masukkan judul novel untuk mulai mencari</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
