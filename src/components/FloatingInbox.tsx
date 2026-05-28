import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, X, ChevronRight, Sparkles, Zap, Info } from 'lucide-react';

interface InboxItem {
  id: string;
  title: string;
  message: string;
  type: 'update' | 'info' | 'feature';
  date: string;
  link?: string;
}

const inboxItems: InboxItem[] = [
  {
    id: 'v236',
    title: 'Update v2.3.6',
    message: 'Drachin (Mini Drama), Halaman About, Floating Inbox, dan Anti-DevTools protection!',
    type: 'update',
    date: '29 Mei 2026',
    link: '/s/updates/',
  },
  {
    id: 'drachin-new',
    title: 'Drachin Tersedia!',
    message: 'Nonton mini drama pendek dari TikTok langsung di EpanDStream. Cek sekarang!',
    type: 'feature',
    date: '29 Mei 2026',
    link: '/s/drachin/',
  },
  {
    id: 'fav-all',
    title: 'Favorite Semua Konten',
    message: 'Sekarang kamu bisa favorite Anime, Donghua, Comic, Novel, dan Drachin!',
    type: 'feature',
    date: '29 Mei 2026',
    link: '/s/favorite/',
  },
  {
    id: 'about-donate',
    title: 'Dukung EpanDStream',
    message: 'Suka dengan website ini? Dukung kami lewat Saweria atau Trakteer.',
    type: 'info',
    date: '29 Mei 2026',
    link: '/s/about/',
  },
];

const READ_KEY = 'epandstream_inbox_read';

function getReadIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(READ_KEY) || '[]');
  } catch { return []; }
}

function markRead(id: string) {
  const read = getReadIds();
  if (!read.includes(id)) {
    read.push(id);
    localStorage.setItem(READ_KEY, JSON.stringify(read));
  }
}

export default function FloatingInbox() {
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [pulse, setPulse] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setReadIds(getReadIds());
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const unreadCount = inboxItems.filter(i => !readIds.includes(i.id)).length;

  const handleItemClick = (item: InboxItem) => {
    markRead(item.id);
    setReadIds(getReadIds());
    if (item.link) {
      navigate(item.link);
    }
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen(!open);
    setPulse(false);
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case 'update': return <Zap size={14} className="text-primary" />;
      case 'feature': return <Sparkles size={14} className="text-success" />;
      case 'info': return <Info size={14} className="text-accent" />;
      default: return <Bell size={14} />;
    }
  };

  // Hide on reader/watch pages to not obstruct
  const hideOnPaths = ['/s/comic/read/', '/s/novel/baca/', '/s/drachin/watch/'];
  if (hideOnPaths.some(p => location.pathname.includes(p))) return null;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={handleToggle}
        className={`fixed z-50 w-12 h-12 neo-brutal flex items-center justify-center transition-all ${
          open ? 'bg-dark text-text-primary bottom-24 md:bottom-8 right-4' : 'bg-primary text-white bottom-24 md:bottom-8 right-4'
        } ${pulse && unreadCount > 0 ? 'animate-bounce' : ''}`}
        style={{ animationDuration: '2s' }}
      >
        {open ? <X size={20} /> : <Bell size={20} />}
        {unreadCount > 0 && !open && (
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-danger text-white text-[9px] font-mono font-bold border-2 border-black flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Inbox Panel */}
      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setOpen(false)} />
          <div className="fixed z-50 bottom-38 md:bottom-22 right-4 w-[calc(100vw-32px)] max-w-sm animate-fadeIn">
            <div className="neo-card overflow-hidden">
              {/* Header */}
              <div className="p-3 border-b-2 border-black bg-surface flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell size={14} className="text-primary" />
                  <span className="font-bold text-sm">Informasi</span>
                  {unreadCount > 0 && (
                    <span className="neo-tag bg-danger text-white text-[8px]">{unreadCount} baru</span>
                  )}
                </div>
                <button
                  onClick={() => {
                    navigate('/s/updates/');
                    setOpen(false);
                  }}
                  className="font-mono text-[10px] text-primary flex items-center gap-0.5 hover:underline"
                >
                  Lihat semua <ChevronRight size={10} />
                </button>
              </div>

              {/* Items */}
              <div className="max-h-72 overflow-y-auto scrollbar-hide">
                {inboxItems.map(item => {
                  const isRead = readIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className={`w-full flex items-start gap-2.5 p-3 border-b border-black/20 text-left transition-colors hover:bg-surface-light ${
                        isRead ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="w-8 h-8 flex items-center justify-center bg-darker border-2 border-black flex-shrink-0 mt-0.5">
                        {typeIcon(item.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <p className="font-bold text-xs line-clamp-1">{item.title}</p>
                          {!isRead && (
                            <span className="w-2 h-2 bg-danger border border-black flex-shrink-0"></span>
                          )}
                        </div>
                        <p className="font-mono text-[10px] text-text-secondary line-clamp-2 leading-relaxed">
                          {item.message}
                        </p>
                        <p className="font-mono text-[9px] text-text-secondary/60 mt-1">{item.date}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
