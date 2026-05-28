import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNovelHome } from '../../lib/api';
import Loader from '../../components/Loader';
import { Feather, Search, Tag, ChevronLeft, ChevronRight } from 'lucide-react';

export default function NovelHomePage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getNovelHome(page).then(res => {
      setData(res.data?.results || []);
      setHasNext(res.data?.pagination?.hasNext ?? false);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [page]);

  return (
    <div className="max-w-6xl mx-auto px-3 pb-20 md:pb-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">
          <span className="text-accent">Novel</span> Terbaru
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/s/novel/genres')}
            className="neo-tag bg-surface text-text-primary flex items-center gap-1 cursor-pointer"
          >
            <Tag size={10} /> Genre
          </button>
          <button
            onClick={() => navigate('/s/novel/search?q=')}
            className="neo-tag bg-accent text-black flex items-center gap-1 cursor-pointer"
          >
            <Search size={10} /> Cari
          </button>
        </div>
      </div>

      {loading ? <Loader /> : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {data.map((item: any, i: number) => (
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
                </div>
                <div className="p-2.5">
                  <h3 className="font-bold text-xs leading-tight line-clamp-2 group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>
                  {item.latest_chapter && (
                    <p className="font-mono text-[9px] text-text-secondary mt-1 line-clamp-1">
                      {item.latest_chapter.replace(/Bahasa Indonesia/gi, '').trim()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {data.length === 0 && (
            <div className="neo-card p-8 text-center">
              <Feather size={32} className="mx-auto mb-3 text-text-secondary" />
              <p className="font-mono text-sm text-text-secondary">Tidak ada novel tersedia.</p>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="neo-brutal bg-surface px-4 py-2 font-mono text-xs font-bold disabled:opacity-40 flex items-center gap-1"
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <span className="neo-tag bg-accent text-black">Halaman {page}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={!hasNext}
              className="neo-brutal bg-surface px-4 py-2 font-mono text-xs font-bold disabled:opacity-40 flex items-center gap-1"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
