import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchComic } from '../../lib/api';
import Loader from '../../components/Loader';
import { Search, ArrowLeft, BookOpen } from 'lucide-react';

export default function ComicSearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(query);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    searchComic(query).then(res => {
      setResults(res.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/s/comic/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3 pb-20 md:pb-4">
      <button onClick={() => navigate('/s/comic/')} className="flex items-center gap-2 text-text-secondary hover:text-purple font-mono text-xs mb-4 transition-colors">
        <ArrowLeft size={14} /> Kembali
      </button>

      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Search size={22} className="text-purple" />
        Cari <span className="text-purple">Komik</span>
      </h1>

      <form onSubmit={handleSearch} className="flex mb-5 border-2 border-black shadow-[3px_3px_0px_#000]">
        <input
          type="text"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder="Masukkan judul komik..."
          className="flex-1 px-4 py-3 bg-surface text-sm outline-none text-text-primary placeholder:text-text-secondary font-mono"
          autoFocus
        />
        <button type="submit" className="px-5 bg-purple text-white font-mono font-bold border-l-2 border-black">
          <Search size={16} />
        </button>
      </form>

      {loading ? <Loader /> : (
        <>
          {query && (
            <p className="font-mono text-xs text-text-secondary mb-4">
              Hasil pencarian untuk: <span className="text-purple font-bold">"{query}"</span> ({results.length} hasil)
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {results.map((item: any, i: number) => (
              <div
                key={`${item.slug}-${i}`}
                onClick={() => navigate(`/s/comic/detail/${item.slug}`)}
                className="group cursor-pointer neo-card overflow-hidden animate-fadeIn flex gap-3"
              >
                <div className="relative w-24 sm:w-28 flex-shrink-0 overflow-hidden">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" fill="%231E2D4A"><rect width="300" height="200"/></svg>'; }}
                  />
                </div>
                <div className="flex-1 py-3 pr-3 min-w-0">
                  <h3 className="font-bold text-sm leading-tight line-clamp-2 group-hover:text-purple transition-colors mb-2">
                    {item.title}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {item.type && <span className="neo-tag bg-purple text-white">{item.type}</span>}
                    {item.genre && <span className="neo-tag bg-surface-light text-text-secondary">{item.genre}</span>}
                  </div>
                  {item.description && (
                    <p className="font-mono text-[10px] text-text-secondary line-clamp-1">{item.description}</p>
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
              <BookOpen size={32} className="mx-auto mb-3 text-purple" />
              <p className="font-mono text-sm text-text-secondary">Masukkan judul komik untuk mulai mencari</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
