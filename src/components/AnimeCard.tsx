import { Heart, Play, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { isFavorite, toggleFavorite, type FavoriteItem } from '../lib/favorites';
import { useState } from 'react';

interface Props {
  title: string;
  poster: string;
  slug: string;
  type: 'anime' | 'donghua';
  episodes?: number | string;
  score?: string;
  releaseDay?: string;
  status?: string;
}

export default function AnimeCard({ title, poster, slug, type, episodes, score, releaseDay, status }: Props) {
  const navigate = useNavigate();
  const [fav, setFav] = useState(isFavorite(`${type}-${slug}`));

  const handleClick = () => {
    if (type === 'anime') {
      navigate(`/s/anime/detail/${slug}`);
    } else {
      navigate(`/s/donghua/detail/${slug}`);
    }
  };

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    const item: FavoriteItem = {
      id: `${type}-${slug}`,
      title,
      poster,
      type,
      slug,
      addedAt: Date.now(),
    };
    const result = toggleFavorite(item);
    setFav(result);
  };

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer relative neo-card overflow-hidden animate-fadeIn"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={poster}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" fill="%231E2D4A"><rect width="300" height="400"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23A0AEC0" font-size="14">No Image</text></svg>'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-3 left-0 right-0 flex justify-center">
            <div className="neo-tag bg-primary text-white flex items-center gap-1">
              <Play size={10} /> Watch
            </div>
          </div>
        </div>
        <button
          onClick={handleFav}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-dark/70 border-2 border-black z-10"
        >
          <Heart size={14} className={fav ? 'fill-danger text-danger' : 'text-white'} />
        </button>
        {score && (
          <div className="absolute top-2 left-2 neo-tag bg-accent text-black flex items-center gap-1">
            <Star size={10} /> {score}
          </div>
        )}
        {status && (
          <div className={`absolute bottom-2 left-2 neo-tag ${status === 'Ongoing' ? 'bg-success text-black' : 'bg-purple text-white'}`}>
            {status}
          </div>
        )}
      </div>
      <div className="p-2.5">
        <h3 className="font-bold text-xs leading-tight line-clamp-2 text-text-primary group-hover:text-primary transition-colors">
          {title}
        </h3>
        <div className="flex items-center gap-2 mt-1.5">
          {episodes && (
            <span className="font-mono text-[10px] text-text-secondary">
              {episodes} Eps
            </span>
          )}
          {releaseDay && (
            <span className="font-mono text-[10px] text-accent">
              {releaseDay}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
