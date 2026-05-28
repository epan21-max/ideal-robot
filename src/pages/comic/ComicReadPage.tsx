import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getComicChapter } from '../../lib/api';
import Loader from '../../components/Loader';
import { ArrowLeft, ChevronLeft, ChevronRight, List, ChevronUp, Maximize2, Minimize2 } from 'lucide-react';

export default function ComicReadPage() {
  const { chapterSlug } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showNav, setShowNav] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!chapterSlug) return;
    setLoading(true);
    getComicChapter(chapterSlug).then(res => {
      setData(res);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [chapterSlug]);

  // Track scroll to auto-hide/show top nav
  useEffect(() => {
    let lastScrollY = 0;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY < 100) {
        setShowNav(true);
      } else if (scrollY > lastScrollY + 10) {
        setShowNav(false);
      } else if (scrollY < lastScrollY - 10) {
        setShowNav(true);
      }
      lastScrollY = scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Listen for fullscreen change events
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        const el = containerRef.current || document.documentElement;
        await el.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Fallback: if fullscreen API is not available, do nothing
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <Loader />;
  if (!data) return <div className="text-center py-20 font-mono text-text-secondary">Chapter tidak ditemukan</div>;

  const images = data.images || [];
  const nav = data.navigation || {};

  return (
    <div ref={containerRef} className="min-h-screen bg-darker">
      {/* Top Navigation - auto hide/show on scroll */}
      <div
        className={`fixed ${isFullscreen ? 'top-0' : 'top-14 md:top-[6.5rem]'} left-0 right-0 z-40 bg-dark/95 backdrop-blur-sm border-b-2 border-black transition-transform duration-300 ${showNav ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="max-w-4xl mx-auto px-3 py-2 flex items-center justify-between gap-2">
          <button onClick={() => navigate(-1)} className="neo-tag bg-surface text-text-primary flex items-center gap-1">
            <ArrowLeft size={10} /> Back
          </button>
          <div className="flex-1 min-w-0 text-center">
            <p className="font-bold text-xs line-clamp-1">{data.manga_title}</p>
            <p className="font-mono text-[10px] text-purple">{data.chapter_title}</p>
          </div>
          <button
            onClick={toggleFullscreen}
            className={`neo-tag flex items-center gap-1 ${isFullscreen ? 'bg-purple text-white' : 'bg-surface text-text-primary'}`}
          >
            {isFullscreen ? <Minimize2 size={10} /> : <Maximize2 size={10} />}
            <span className="hidden sm:inline">{isFullscreen ? 'Exit' : 'Full'}</span>
          </button>
        </div>
      </div>

      {/* Top Chapter Navigation */}
      <div className="max-w-4xl mx-auto px-3 pt-4">
        <div className="flex gap-2 mb-4">
          {nav.previousChapter && (
            <button
              onClick={() => navigate(`/s/comic/read/${nav.previousChapter}`)}
              className="neo-brutal bg-surface flex-1 py-2.5 font-mono text-xs font-bold flex items-center justify-center gap-1"
            >
              <ChevronLeft size={14} /> Prev
            </button>
          )}
          {nav.chapterList && (
            <button
              onClick={() => navigate(`/s/comic/detail/${nav.chapterList}`)}
              className="neo-brutal bg-purple text-white flex-1 py-2.5 font-mono text-xs font-bold flex items-center justify-center gap-1"
            >
              <List size={14} /> Chapters
            </button>
          )}
          {nav.nextChapter && (
            <button
              onClick={() => navigate(`/s/comic/read/${nav.nextChapter}`)}
              className="neo-brutal bg-surface flex-1 py-2.5 font-mono text-xs font-bold flex items-center justify-center gap-1"
            >
              Next <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Comic Images */}
      <div className="max-w-3xl mx-auto bg-black">
        {images.map((img: string, index: number) => (
          <img
            key={index}
            src={img}
            alt={`Page ${index + 1}`}
            className="w-full h-auto block"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const el = e.target as HTMLImageElement;
              if (!el.dataset.retried) {
                el.dataset.retried = '1';
                el.src = img;
              } else {
                el.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" fill="%231E2D4A"><rect width="800" height="400"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23A0AEC0" font-size="16">Image Failed to Load</text></svg>';
              }
            }}
          />
        ))}
      </div>

      {/* Bottom Navigation - with safe spacing for mobile bottom bar */}
      <div className="max-w-4xl mx-auto px-3 pt-4 pb-24 md:pb-6">
        {/* Prev / Next Chapter */}
        <div className="flex gap-2 mb-3">
          {nav.previousChapter && (
            <button
              onClick={() => { navigate(`/s/comic/read/${nav.previousChapter}`); scrollToTop(); }}
              className="neo-brutal bg-surface flex-1 py-3 font-mono text-xs font-bold flex items-center justify-center gap-1"
            >
              <ChevronLeft size={14} /> Prev Chapter
            </button>
          )}
          {nav.nextChapter && (
            <button
              onClick={() => { navigate(`/s/comic/read/${nav.nextChapter}`); scrollToTop(); }}
              className="neo-brutal bg-purple text-white flex-1 py-3 font-mono text-xs font-bold flex items-center justify-center gap-1"
            >
              Next Chapter <ChevronRight size={14} />
            </button>
          )}
        </div>

        {/* Back to chapter list */}
        {nav.chapterList && (
          <button
            onClick={() => navigate(`/s/comic/detail/${nav.chapterList}`)}
            className="neo-brutal bg-surface w-full py-3 font-mono text-xs font-bold flex items-center justify-center gap-1"
          >
            <List size={14} /> Back to Chapter List
          </button>
        )}
      </div>

      {/* Scroll to Top Button - above mobile bottom nav */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-24 md:bottom-8 right-4 z-40 w-10 h-10 neo-brutal bg-purple text-white flex items-center justify-center"
      >
        <ChevronUp size={18} />
      </button>
    </div>
  );
}
