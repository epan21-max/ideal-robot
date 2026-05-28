import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getComicHome } from '../../lib/api';
import Loader from '../../components/Loader';
import { BookOpen, Search, Tag, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

export default function ComicHomePage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getComicHome(page).then(res => {
      setData(res.comics || []);
      setHasMore(res.pagination?.has_more ?? true);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [page]);

  const extractSlug = (link: string) => {
    // Extract slug from link like "/manga/some-comic/"
    const match = link.match(/\/manga\/([^/]+)\/?/);
    return match ? match[1] : link;
  };

  return (
    <div className="max-w-6xl mx-auto px-3 pb-20 md:pb-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">
          <span className="text-purple">Comic</span> Terbaru
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/s/comic/genres')}
            className="neo-tag bg-surface text-text-primary flex items-center gap-1 cursor-pointer"
          >
            <Tag size={10} /> Genre
          </button>
          <button
            onClick={() => navigate('/s/comic/search?q=')}
            className="neo-tag bg-purple text-white flex items-center gap-1 cursor-pointer"
          >
            <Search size={10} /> Cari
          </button>
        </div>
      </div>

      {loading ? <Loader /> : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.map((item: any, i: number) => (
              <div
                key={`${item.link}-${i}`}
                onClick={() => navigate(`/s/comic/detail/${extractSlug(item.link)}`)}
                className="group cursor-pointer neo-card overflow-hidden animate-fadeIn flex gap-3"
              >
                <div className="relative w-28 sm:w-32 flex-shrink-0 overflow-hidden">
                  <img
                    src={item.image}
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
                    <span className="neo-tag bg-purple text-white">
                      {item.chapter}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-text-secondary">
                    <Clock size={10} />
                    <span className="font-mono text-[10px]">{item.time_ago}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {data.length === 0 && (
            <div className="neo-card p-8 text-center">
              <BookOpen size={32} className="mx-auto mb-3 text-text-secondary" />
              <p className="font-mono text-sm text-text-secondary">Tidak ada komik tersedia.</p>
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
            <span className="neo-tag bg-purple text-white">Halaman {page}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={!hasMore}
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
