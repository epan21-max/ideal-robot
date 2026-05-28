import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFavorites, removeFavorite, type FavoriteItem } from '../lib/favorites';
import { Heart, Trash2, Tv, Film, BookOpen, Feather, Clapperboard, ArrowLeft } from 'lucide-react';

const typeConfig: Record<string, { icon: any; label: string; color: string; route: (slug: string) => string }> = {
  anime:   { icon: Tv,           label: 'Anime',   color: 'bg-primary',   route: (s) => `/s/anime/detail/${s}` },
  donghua: { icon: Film,         label: 'Donghua',  color: 'bg-secondary', route: (s) => `/s/donghua/detail/${s}` },
  comic:   { icon: BookOpen,     label: 'Comic',    color: 'bg-purple',    route: (s) => `/s/comic/detail/${s}` },
  novel:   { icon: Feather,      label: 'Novel',    color: 'bg-accent',    route: (s) => `/s/novel/detail/${s}` },
  drachin: { icon: Clapperboard, label: 'Drachin',  color: 'bg-danger',    route: (s) => `/s/drachin/detail/${s}` },
};

type FilterType = 'all' | 'anime' | 'donghua' | 'comic' | 'novel' | 'drachin';

const filterTabs: { key: FilterType; label: string; icon: any }[] = [
  { key: 'all',     label: 'Semua',   icon: Heart },
  { key: 'anime',   label: 'Anime',   icon: Tv },
  { key: 'donghua', label: 'Donghua', icon: Film },
  { key: 'comic',   label: 'Comic',   icon: BookOpen },
  { key: 'novel',   label: 'Novel',   icon: Feather },
  { key: 'drachin', label: 'Drachin', icon: Clapperboard },
];

export default function FavoritePage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const navigate = useNavigate();

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const handleRemove = (id: string) => {
    removeFavorite(id);
    setFavorites(getFavorites());
  };

  const filtered = filter === 'all' ? favorites : favorites.filter(f => f.type === filter);

  return (
    <div className="max-w-6xl mx-auto px-3 pb-20 md:pb-4">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-text-secondary hover:text-primary font-mono text-xs mb-4 transition-colors">
        <ArrowLeft size={14} /> Home
      </button>

      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Heart size={22} className="text-danger" />
        <span className="text-danger">Favorit</span> Saya
        {favorites.length > 0 && (
          <span className="neo-tag bg-surface text-text-secondary ml-1">{favorites.length}</span>
        )}
      </h1>

      {/* Filter */}
      <div className="flex gap-1.5 mb-5 overflow-x-auto scrollbar-hide pb-1">
        {filterTabs.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex-shrink-0 px-3 py-2 font-mono text-[10px] font-bold uppercase flex items-center gap-1 border-2 border-black transition-all ${
              filter === f.key
                ? 'bg-danger text-white shadow-[3px_3px_0px_#000]'
                : 'bg-surface text-text-secondary shadow-[2px_2px_0px_#000] hover:bg-surface-light'
            }`}
          >
            <f.icon size={11} /> {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="neo-card p-12 text-center">
          <Heart size={48} className="mx-auto mb-4 text-text-secondary" />
          <h3 className="font-bold text-lg mb-2">Belum ada favorit</h3>
          <p className="font-mono text-xs text-text-secondary max-w-sm mx-auto">
            Tambahkan anime, donghua, komik, novel, atau drachin ke daftar favorit kamu dengan menekan tombol hati di halaman detail.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {filtered.map(item => {
            const cfg = typeConfig[item.type] || typeConfig.anime;
            const TypeIcon = cfg.icon;
            return (
              <div key={item.id} className="group neo-card overflow-hidden animate-fadeIn relative">
                <div
                  onClick={() => navigate(cfg.route(item.slug))}
                  className="cursor-pointer"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={item.poster}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" fill="%231E2D4A"><rect width="300" height="400"/></svg>'; }}
                    />
                    <div className={`absolute top-2 left-2 neo-tag ${cfg.color} text-white uppercase text-[8px]`}>
                      <TypeIcon size={8} className="inline mr-0.5" />{cfg.label}
                    </div>
                  </div>
                  <div className="p-2.5">
                    <h3 className="font-bold text-xs leading-tight line-clamp-2 group-hover:text-danger transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-danger border-2 border-black shadow-[2px_2px_0px_#000] text-white hover:shadow-[3px_3px_0px_#000] transition-all"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
