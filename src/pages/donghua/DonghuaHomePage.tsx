import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDonghuaHome } from '../../lib/api';
import Loader from '../../components/Loader';
import { Calendar, Search, Play, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DonghuaHomePage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getDonghuaHome(page).then(res => {
      setData(res.latest_release || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [page]);

  return (
    <div className="max-w-6xl mx-auto px-3 pb-20 md:pb-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">
          <span className="text-secondary">Donghua</span> Sub Indo
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/s/donghua/schedule')}
            className="neo-tag bg-surface text-text-primary flex items-center gap-1 cursor-pointer"
          >
            <Calendar size={10} /> Jadwal
          </button>
          <button
            onClick={() => navigate('/s/donghua/search?q=')}
            className="neo-tag bg-secondary text-white flex items-center gap-1 cursor-pointer"
          >
            <Search size={10} /> Cari
          </button>
        </div>
      </div>

      {loading ? <Loader /> : (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {data.map((item: any, i: number) => (
              <div
                key={`${item.slug}-${i}`}
                onClick={() => {
                  if (item.href?.includes('/episode/')) {
                    const epSlug = item.slug?.replace(/\/$/, '');
                    navigate(`/s/donghua/watch/${epSlug}`);
                  } else {
                    navigate(`/s/donghua/detail/${item.slug}`);
                  }
                }}
                className="group cursor-pointer neo-card overflow-hidden animate-fadeIn"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={item.poster}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" fill="%231E2D4A"><rect width="300" height="400"/></svg>'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                      <div className="neo-tag bg-secondary text-white flex items-center gap-1">
                        <Play size={10} /> Watch
                      </div>
                    </div>
                  </div>
                  {item.current_episode && (
                    <div className="absolute bottom-2 left-2 neo-tag bg-success text-black">{item.current_episode}</div>
                  )}
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
                  {item.type && (
                    <span className="font-mono text-[10px] text-text-secondary mt-1 block">{item.type}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="neo-brutal bg-surface px-4 py-2 font-mono text-xs font-bold disabled:opacity-40 flex items-center gap-1"
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <span className="neo-tag bg-secondary text-white">Halaman {page}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={data.length === 0}
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
