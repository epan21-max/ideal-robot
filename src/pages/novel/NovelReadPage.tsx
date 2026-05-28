import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNovelRead } from '../../lib/api';
import { stripHtml } from '../../lib/stripHtml';
import Loader from '../../components/Loader';
import { ArrowLeft, ChevronLeft, ChevronRight, List, ChevronUp, Settings, Minus, Plus } from 'lucide-react';

export default function NovelReadPage() {
  const { chapterSlug } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!chapterSlug) return;
    setLoading(true);
    getNovelRead(chapterSlug).then(res => {
      setData(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [chapterSlug]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <Loader />;
  if (!data) return <div className="text-center py-20 font-mono text-text-secondary">Chapter tidak ditemukan</div>;

  const navigation = data.navigation || {};

  return (
    <div className="min-h-screen bg-darker">
      {/* Top Bar */}
      <div className="sticky top-14 md:top-[6.5rem] z-40 bg-dark border-b-2 border-black">
        <div className="max-w-3xl mx-auto px-3 py-2 flex items-center justify-between gap-2">
          <button onClick={() => navigate(-1)} className="neo-tag bg-surface text-text-primary flex items-center gap-1">
            <ArrowLeft size={10} /> Back
          </button>
          <div className="flex-1 min-w-0 text-center">
            <p className="font-bold text-xs line-clamp-1">{data.title}</p>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="neo-tag bg-surface text-text-primary flex items-center gap-1"
          >
            <Settings size={10} />
          </button>
        </div>
        
        {/* Settings Panel */}
        {showSettings && (
          <div className="border-t-2 border-black bg-surface p-3">
            <div className="max-w-3xl mx-auto flex items-center justify-between">
              <span className="font-mono text-xs text-text-secondary">Ukuran Font</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFontSize(s => Math.max(12, s - 2))}
                  className="w-8 h-8 flex items-center justify-center bg-darker border-2 border-black"
                >
                  <Minus size={12} />
                </button>
                <span className="font-mono text-sm w-8 text-center">{fontSize}</span>
                <button
                  onClick={() => setFontSize(s => Math.min(24, s + 2))}
                  className="w-8 h-8 flex items-center justify-center bg-darker border-2 border-black"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="max-w-3xl mx-auto px-3 pt-4">
        <div className="flex gap-2 mb-4">
          {navigation.prev_slug && (
            <button
              onClick={() => navigate(`/s/novel/baca/${navigation.prev_slug}`)}
              className="neo-brutal bg-surface flex-1 py-2.5 font-mono text-xs font-bold flex items-center justify-center gap-1"
            >
              <ChevronLeft size={14} /> Prev
            </button>
          )}
          {navigation.parent_slug && (
            <button
              onClick={() => navigate(`/s/novel/detail/${navigation.parent_slug}`)}
              className="neo-brutal bg-accent text-black flex-1 py-2.5 font-mono text-xs font-bold flex items-center justify-center gap-1"
            >
              <List size={14} /> Chapters
            </button>
          )}
          {navigation.next_slug && (
            <button
              onClick={() => navigate(`/s/novel/baca/${navigation.next_slug}`)}
              className="neo-brutal bg-surface flex-1 py-2.5 font-mono text-xs font-bold flex items-center justify-center gap-1"
            >
              Next <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 pb-8">
        <div className="neo-card p-4 sm:p-6">
          <h1 className="font-bold text-lg mb-4">{data.title}</h1>
          
          <div 
            className="max-w-none text-text-primary leading-relaxed whitespace-pre-line"
            style={{ fontSize: `${fontSize}px` }}
          >
            {stripHtml(data.content)}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="max-w-3xl mx-auto px-3 pb-20 md:pb-8">
        <div className="flex gap-2">
          {navigation.prev_slug && (
            <button
              onClick={() => { navigate(`/s/novel/baca/${navigation.prev_slug}`); scrollToTop(); }}
              className="neo-brutal bg-surface flex-1 py-2.5 font-mono text-xs font-bold flex items-center justify-center gap-1"
            >
              <ChevronLeft size={14} /> Prev Chapter
            </button>
          )}
          {navigation.next_slug && (
            <button
              onClick={() => { navigate(`/s/novel/baca/${navigation.next_slug}`); scrollToTop(); }}
              className="neo-brutal bg-accent text-black flex-1 py-2.5 font-mono text-xs font-bold flex items-center justify-center gap-1"
            >
              Next Chapter <ChevronRight size={14} />
            </button>
          )}
        </div>
        {navigation.parent_slug && (
          <button
            onClick={() => navigate(`/s/novel/detail/${navigation.parent_slug}`)}
            className="neo-brutal bg-surface w-full mt-2 py-2.5 font-mono text-xs font-bold flex items-center justify-center gap-1"
          >
            <List size={14} /> Kembali ke Daftar Chapter
          </button>
        )}
      </div>

      {/* Scroll to Top */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-20 md:bottom-6 right-4 z-40 w-10 h-10 neo-brutal bg-accent text-black flex items-center justify-center"
      >
        <ChevronUp size={18} />
      </button>
    </div>
  );
}
