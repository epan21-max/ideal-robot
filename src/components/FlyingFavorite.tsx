import { useApp } from '../context/AppContext';
import { useRouter } from '../context/RouterContext';
import { HeartFillIcon } from './Icon';

export function FlyingFavorite() {
  const { favorites } = useApp();
  const { navigate, route } = useRouter();

  if (route.name === 'favorites') return null;

  return (
    <div className="fixed bottom-20 right-4 z-50 animate-scale-in pointer-events-auto">
      <button
        onClick={() => navigate({ name: 'favorites' })}
        aria-label="View Favorites"
        className="liquid-glass-strong group flex items-center gap-2.5 px-4 py-3 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
        style={{
          background: 'var(--island-bg)',
          color: 'var(--island-fg)',
          border: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        <div className="relative flex items-center justify-center">
          <HeartFillIcon size={18} className="text-red-500 transition-transform group-hover:scale-110" />
          {favorites.length > 0 && (
            <span className="absolute -top-1 -right-2 flex items-center justify-center min-w-[16px] h-[16px] text-[10px] font-extrabold text-white bg-red-500 rounded-full px-1 shadow-md">
              {favorites.length}
            </span>
          )}
        </div>
      </button>
    </div>
  );
}
