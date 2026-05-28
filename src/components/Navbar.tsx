import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, X, Menu, Home, Tv, Film, BookOpen, Feather, Heart, Info, Clapperboard } from 'lucide-react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'anime' | 'donghua'>('anime');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (searchType === 'anime') {
      navigate(`/s/anime/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate(`/s/donghua/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
    setSearchOpen(false);
    setSearchQuery('');
  };

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Anime', path: '/s/anime/', icon: Tv },
    { label: 'Donghua', path: '/s/donghua/', icon: Film },
    { label: 'Comic', path: '/s/comic/', icon: BookOpen },
    { label: 'Novel', path: '/s/novel/', icon: Feather },
    { label: 'Drachin', path: '/s/drachin/', icon: Clapperboard },
    { label: 'Favorite', path: '/s/favorite/', icon: Heart },
    { label: 'About', path: '/s/about/', icon: Info },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark border-b-3 border-black">
        <div className="max-w-6xl mx-auto px-3 h-14 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary border-2 border-black flex items-center justify-center font-mono font-bold text-white text-sm shadow-[2px_2px_0px_#000]">
              E
            </div>
            <span className="font-bold text-lg tracking-tight hidden sm:block">
              Epan<span className="text-primary">D</span>Stream
            </span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-9 h-9 flex items-center justify-center bg-surface border-2 border-black shadow-[2px_2px_0px_#000] hover:shadow-[3px_3px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
            >
              <Search size={16} />
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-9 h-9 flex items-center justify-center bg-surface border-2 border-black shadow-[2px_2px_0px_#000] hover:shadow-[3px_3px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all md:hidden"
            >
              {menuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="border-t-2 border-black bg-surface p-3 animate-fadeIn">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
              <div className="flex border-2 border-black bg-dark overflow-hidden flex-1">
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value as 'anime' | 'donghua')}
                  className="bg-surface-light text-xs font-mono px-2 border-r-2 border-black text-text-primary outline-none"
                >
                  <option value="anime">Anime</option>
                  <option value="donghua">Donghua</option>
                </select>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari anime atau donghua..."
                  className="flex-1 px-3 py-2 bg-transparent text-sm outline-none text-text-primary placeholder:text-text-secondary"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="px-4 bg-primary border-2 border-black shadow-[3px_3px_0px_#000] font-mono font-bold text-sm text-white hover:shadow-[4px_4px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
              >
                <Search size={16} />
              </button>
            </form>
          </div>
        )}

        {/* Desktop Nav */}
        <div className="hidden md:block border-t-2 border-black bg-darker">
          <div className="max-w-6xl mx-auto px-3 flex">
            {navItems.map(item => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-1.5 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider border-r-2 border-black transition-colors ${
                  isActive(item.path) ? 'bg-primary text-white' : 'hover:bg-surface-light text-text-secondary hover:text-text-primary'
                }`}
              >
                <item.icon size={14} />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setMenuOpen(false)}>
          <div
            className="absolute top-14 right-0 w-56 bg-dark border-l-3 border-b-3 border-black shadow-[-4px_4px_0px_#000] animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            {navItems.map(item => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 font-mono text-sm font-bold uppercase tracking-wider border-b-2 border-black transition-colors ${
                  isActive(item.path) ? 'bg-primary text-white' : 'hover:bg-surface text-text-secondary hover:text-text-primary'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Nav Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-dark border-t-3 border-black">
        <div className="flex justify-around">
          {[navItems[0], navItems[1], navItems[2], navItems[3], navItems[5]].map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center py-2 px-2 flex-1 transition-colors ${
                isActive(item.path) ? 'text-primary' : 'text-text-secondary'
              }`}
            >
              <item.icon size={16} />
              <span className="text-[8px] font-mono font-bold uppercase mt-0.5">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
