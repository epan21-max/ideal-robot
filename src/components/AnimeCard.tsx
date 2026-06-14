import { AnimeItem } from '../lib/api';
import { useRouter } from '../context/RouterContext';
import { useApp } from '../context/AppContext';
import { HeartIcon, HeartFillIcon, PlayIcon, StarIcon } from './Icon';

export function AnimeCard({ anime, variant = 'grid' }: { anime: AnimeItem; variant?: 'grid' | 'wide' | 'rail' }) {
  const { navigate } = useRouter();
  const { isFavorite, toggleFavorite } = useApp();
  const fav = isFavorite(anime.slug || '');
  const img = anime.poster || anime.thumbnail;

  if (variant === 'rail') {
    return (
      <button
        onClick={() => anime.slug && navigate({ name: 'detail', slug: anime.slug })}
        className="group shrink-0 w-36 text-left"
      >
        <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-[var(--surface)]">
          {img && (
            <img src={img} alt={anime.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          {anime.episode && (
            <span className="absolute top-2 left-2 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-black/60 text-white backdrop-blur">
              {String(anime.episode).replace(/episode/i, 'EP')}
            </span>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); toggleFavorite(anime); }}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white"
          >
            {fav ? <HeartFillIcon size={13} className="text-red-500" /> : <HeartIcon size={13} />}
          </button>
        </div>
        <div className="mt-2 px-0.5">
          <div className="text-xs font-semibold line-clamp-2 leading-tight">{anime.title}</div>
          {anime.type && <div className="text-[10px] text-[var(--muted)] mt-0.5">{anime.type}</div>}
        </div>
      </button>
    );
  }

  if (variant === 'wide') {
    return (
      <button
        onClick={() => anime.slug && navigate({ name: 'detail', slug: anime.slug })}
        className="w-full liquid-glass rounded-2xl p-2 flex gap-3 text-left"
      >
        <div className="w-20 h-28 shrink-0 rounded-xl overflow-hidden bg-[var(--surface)]">
          {img && <img src={img} alt={anime.title} loading="lazy" className="w-full h-full object-cover" />}
        </div>
        <div className="flex-1 min-w-0 py-1">
          <div className="text-sm font-semibold line-clamp-2">{anime.title}</div>
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            {anime.rating && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-[var(--surface)]">
                <StarIcon size={10} className="text-yellow-500" /> {anime.rating}
              </span>
            )}
            {anime.type && <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-[var(--surface)]">{anime.type}</span>}
            {anime.status && <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-[var(--surface)]">{anime.status}</span>}
          </div>
          {anime.newest_release_date && (
            <div className="text-[10px] text-[var(--muted)] mt-1.5">{anime.newest_release_date}</div>
          )}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); toggleFavorite(anime); }}
          className="self-start w-8 h-8 rounded-full bg-[var(--surface)] flex items-center justify-center"
        >
          {fav ? <HeartFillIcon size={14} className="text-red-500" /> : <HeartIcon size={14} />}
        </button>
      </button>
    );
  }

  return (
    <button
      onClick={() => anime.slug && navigate({ name: 'detail', slug: anime.slug })}
      className="group text-left"
    >
      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-[var(--surface)]">
        {img && (
          <img src={img} alt={anime.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0" />
        <button
          onClick={(e) => { e.stopPropagation(); toggleFavorite(anime); }}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white"
        >
          {fav ? <HeartFillIcon size={14} className="text-red-500" /> : <HeartIcon size={14} />}
        </button>
        {anime.episode && (
          <span className="absolute top-2 left-2 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-black/60 text-white backdrop-blur">
            {String(anime.episode).replace(/episode/i, 'EP')}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-2">
          <div className="flex items-center gap-1.5">
            {anime.rating && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-black/50 text-white backdrop-blur">
                <StarIcon size={9} className="text-yellow-400" /> {anime.rating}
              </span>
            )}
            <div className="ml-auto w-7 h-7 rounded-full bg-white/90 text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <PlayIcon size={12} />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 px-0.5">
        <div className="text-xs font-semibold line-clamp-2 leading-tight">{anime.title}</div>
        {anime.type && <div className="text-[10px] text-[var(--muted)] mt-0.5">{anime.type}</div>}
      </div>
    </button>
  );
}
