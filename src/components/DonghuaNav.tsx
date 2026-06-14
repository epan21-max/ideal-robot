import { useRouter, Route } from '../context/RouterContext';
import { HomeIcon, SearchIcon, TagIcon, CalendarIcon, GridIcon } from './Icon';

const items: { key: Route['name']; label: string; icon: any; route: Route }[] = [
  { key: 'donghua', label: 'Home', icon: HomeIcon, route: { name: 'donghua' } },
  { key: 'donghua-search', label: 'Search', icon: SearchIcon, route: { name: 'donghua-search' } },
  { key: 'donghua-library', label: 'Library', icon: GridIcon, route: { name: 'donghua-library', tab: 'ongoing' } },
  { key: 'donghua-schedule', label: 'Schedule', icon: CalendarIcon, route: { name: 'donghua-schedule' } },
  { key: 'donghua-genre', label: 'Genres', icon: TagIcon, route: { name: 'donghua-genre' } },
];

export function DonghuaNav() {
  const { route, navigate } = useRouter();
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 safe-bottom px-3 pb-3 pointer-events-none">
      <div
        className="liquid-glass-strong mx-auto max-w-md rounded-[28px] px-2 py-2 pointer-events-auto"
        style={{ backdropFilter: 'blur(28px) saturate(180%)', WebkitBackdropFilter: 'blur(28px) saturate(180%)' }}
      >
        <div className="flex items-center justify-between">
          {items.map(it => {
            const active = route.name === it.key;
            const Icon = it.icon;
            return (
              <button key={it.key} onClick={() => navigate(it.route)} className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-2xl relative">
                <div className={`flex items-center justify-center w-10 h-7 rounded-full transition-all duration-300 ${active ? 'bg-[var(--accent)] text-white scale-110' : 'opacity-60'}`}>
                  <Icon size={18} />
                </div>
                <span className={`text-[10px] font-medium transition ${active ? 'opacity-100' : 'opacity-60'}`}>{it.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
