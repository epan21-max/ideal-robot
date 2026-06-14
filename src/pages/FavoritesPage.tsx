import { useApp } from '../context/AppContext';
import { AnimeCard } from '../components/AnimeCard';
import { HeartIcon, TrashIcon } from '../components/Icon';
import { useRouter } from '../context/RouterContext';

export function FavoritesPage() {
  const { favorites, clearFavorites } = useApp();
  const { navigate } = useRouter();

  return (
    <div className="px-4 pt-20">
      <div className="flex items-center justify-between mb-4 animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Favorites</h1>
          <div className="text-xs text-[var(--muted)] mt-1">{favorites.length} saved anime</div>
        </div>
        {favorites.length > 0 && (
          <button onClick={clearFavorites} className="liquid-glass rounded-full w-10 h-10 flex items-center justify-center text-red-500">
            <TrashIcon size={16} />
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="animate-fade-in-up text-center py-16 px-4">
          <div className="mx-auto w-20 h-20 rounded-full liquid-glass-strong flex items-center justify-center mb-4">
            <HeartIcon size={28} className="text-red-500" />
          </div>
          <h3 className="text-lg font-bold mb-1">No favorites yet</h3>
          <p className="text-sm text-[var(--muted)] mb-5 max-w-xs mx-auto">
            Tap the heart icon on any anime to save it here for quick access.
          </p>
          <button
            onClick={() => navigate({ name: 'home' })}
            className="inline-flex items-center gap-2 bg-[var(--app-fg)] text-[var(--app-bg)] font-semibold text-sm px-5 py-2.5 rounded-full"
          >
            Explore Home
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3 stagger">
          {favorites.map((a, i) => <AnimeCard key={(a.slug || '') + i} anime={a} />)}
        </div>
      )}

      <div className="h-32" />
    </div>
  );
}
