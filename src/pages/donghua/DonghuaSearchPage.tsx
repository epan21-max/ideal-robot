import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchDonghua } from '../../lib/api';
import Loader from '../../components/Loader';
import { Search, ArrowLeft, Play } from 'lucide-react';

export default function DonghuaSearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(query);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    searchDonghua(query).then(res => {
      setResults(res.data || res.results || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/s/donghua/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3 pb-20 md:pb-4">
      <button onClick={() => navigate('/s/donghua/')} className="flex items-center gap-2 text-text-secondary hover:text-secondary font-mono text-xs mb-4 transition-colors">
        <ArrowLeft size={14} /> Kembali
      </button>

      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Search size={22} className="text-secondary" />
        Cari <span className="text-secondary">Donghua</span>
      </h1>

      <form onSubmit={handleSearch} className="flex mb-5 border-2 border-black shadow-[3px_3px_0px_#000]">
        <input
          type="text"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder="Masukkan judul donghua..."
          className="flex-1 px-4 py-3 bg-surface text-sm outline-none text-text-primary placeholder:text-text-secondary font-mono"
          autoFocus
        />
        <button type="submit" className="px-5 bg-secondary text-white font-mono font-bold border-l-2 border-black">
          <Search size={16} />
        </button>
      </form>

      {loading ? <Loader /> : (
        <>
          {query && (
            <p className="font-mono text-xs text-text-secondary mb-4">
              Hasil pencarian untuk: <span className="text-secondary font-bold">"{query}"</span> ({results.length} hasil)
            </p>
          )}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {results.map((item: any, i: number) => (
              <div
                key={i}
                onClick={() => navigate(`/s/donghua/detail/${item.slug}`)}
                className="group cursor-pointer neo-card overflow-hidden animate-fadeIn"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={item.poster}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                      <div className="neo-tag bg-secondary text-white flex items-center gap-1">
                        <Play size={10} /> Detail
                      </div>
                    </div>
                  </div>
                  {item.status && (
                    <div className={`absolute top-2 left-2 neo-tag ${item.status === 'Ongoing' ? 'bg-success text-black' : 'bg-purple text-white'}`}>
                      {item.status}
                    </div>
                  )}
                </div>
                <div className="p-2.5">
                  <h3 className="font-bold text-xs leading-tight line-clamp-2 group-hover:text-secondary transition-colors">
                    {item.title}
                  </h3>
                  {item.type && <span className="font-mono text-[10px] text-text-secondary mt-1 block">{item.type}</span>}
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
        </>
      )}
    </div>
  );
}
