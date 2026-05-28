import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchAnime } from '../../lib/api';
import AnimeCard from '../../components/AnimeCard';
import Loader from '../../components/Loader';
import { Search, ArrowLeft } from 'lucide-react';

export default function AnimeSearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(query);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    searchAnime(query).then(res => {
      setResults(res.data?.animeList || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/s/anime/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3 pb-20 md:pb-4">
      <button onClick={() => navigate('/s/anime/')} className="flex items-center gap-2 text-text-secondary hover:text-primary font-mono text-xs mb-4 transition-colors">
        <ArrowLeft size={14} /> Kembali
      </button>

      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Search size={22} className="text-primary" />
        Cari <span className="text-primary">Anime</span>
      </h1>

      <form onSubmit={handleSearch} className="flex mb-5 border-2 border-black shadow-[3px_3px_0px_#000]">
        <input
          type="text"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder="Masukkan judul anime..."
          className="flex-1 px-4 py-3 bg-surface text-sm outline-none text-text-primary placeholder:text-text-secondary font-mono"
          autoFocus
        />
        <button type="submit" className="px-5 bg-primary text-white font-mono font-bold border-l-2 border-black">
          <Search size={16} />
        </button>
      </form>

      {loading ? (
        <Loader />
      ) : (
        <>
          {query && (
            <p className="font-mono text-xs text-text-secondary mb-4">
              Hasil pencarian untuk: <span className="text-primary font-bold">"{query}"</span> ({results.length} hasil)
            </p>
          )}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {results.map((item: any) => (
              <AnimeCard
                key={item.animeId}
                title={item.title?.replace(' Subtitle Indonesia', '') || item.title}
                poster={item.poster}
                slug={item.animeId}
                type="anime"
                score={item.score}
                status={item.status}
              />
            ))}
          </div>
          {query && results.length === 0 && !loading && (
            <div className="neo-card p-8 text-center">
              <Search size={32} className="mx-auto mb-3 text-text-secondary" />
              <p className="font-mono text-sm text-text-secondary">Tidak ditemukan hasil untuk "{query}"</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
