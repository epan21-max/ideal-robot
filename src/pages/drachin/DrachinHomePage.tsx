import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDrachinHome, getDrachinTrending } from '../../lib/api';
import Loader from '../../components/Loader';
import { Search, TrendingUp, Flame, Eye, Play, Clapperboard } from 'lucide-react';

export default function DrachinHomePage() {
  const [forYou, setForYou] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'foryou' | 'trending'>('foryou');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    Promise.all([getDrachinHome(), getDrachinTrending()])
      .then(([fy, tr]) => {
        setForYou(fy.collections || []);
        setTrending(tr.collections || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatViews = (n: number) => {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return n?.toString() || '0';
  };

  const list = tab === 'foryou' ? forYou : trending;

  return (
    <div className="max-w-6xl mx-auto px-3 pb-20 md:pb-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">
          <span className="text-danger">Dra</span>chin
        </h1>
        <button
          onClick={() => navigate('/s/drachin/search?q=')}
          className="neo-tag bg-danger text-white flex items-center gap-1 cursor-pointer"
        >
          <Search size={10} /> Cari
        </button>
      </div>

      {/* Tabs */}
      <div className="flex mb-4 border-2 border-black">
        <button
          onClick={() => setTab('foryou')}
          className={`flex-1 py-2.5 font-mono text-xs font-bold uppercase flex items-center justify-center gap-1.5 border-r-2 border-black transition-colors ${
            tab === 'foryou' ? 'bg-danger text-white' : 'bg-surface text-text-secondary hover:bg-surface-light'
          }`}
        >
          <Clapperboard size={14} /> For You
        </button>
        <button
          onClick={() => setTab('trending')}
          className={`flex-1 py-2.5 font-mono text-xs font-bold uppercase flex items-center justify-center gap-1.5 transition-colors ${
            tab === 'trending' ? 'bg-accent text-black' : 'bg-surface text-text-secondary hover:bg-surface-light'
          }`}
        >
          <TrendingUp size={14} /> Trending
        </button>
      </div>

      {loading ? <Loader /> : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {list.map((item: any, i: number) => (
            <div
              key={`${item.collection_id}-${i}`}
              onClick={() => navigate(`/s/drachin/detail/${item.collection_id}`)}
              className="group cursor-pointer neo-card overflow-hidden animate-fadeIn"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={item.cover}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" fill="%231E2D4A"><rect width="300" height="400"/></svg>'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                    <div className="neo-tag bg-danger text-white flex items-center gap-1">
                      <Play size={10} /> Tonton
                    </div>
                  </div>
                </div>
                {item.label_hot && (
                  <div className="absolute top-2 left-2 neo-tag bg-danger text-white flex items-center gap-0.5 text-[8px]">
                    <Flame size={8} /> HOT
                  </div>
                )}
                {item.label_new && (
                  <div className="absolute top-2 left-2 neo-tag bg-success text-black text-[8px]">NEW</div>
                )}
                <div className="absolute bottom-2 left-2 neo-tag bg-black/70 text-white text-[8px]">
                  {item.total_episodes} Ep
                </div>
              </div>
              <div className="p-2.5">
                <h3 className="font-bold text-xs leading-tight line-clamp-2 group-hover:text-danger transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="flex items-center gap-0.5 text-[9px] text-text-secondary font-mono">
                    <Eye size={9} /> {formatViews(item.views)}
                  </span>
                </div>
                {item.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {item.tags.slice(0, 2).map((tag: string, ti: number) => (
                      <span key={ti} className="text-[8px] font-mono text-text-secondary bg-darker px-1.5 py-0.5 border border-black/30">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
