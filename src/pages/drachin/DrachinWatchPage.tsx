import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDrachinEpisode, getDrachinDetail } from '../../lib/api';
import Loader from '../../components/Loader';
import { ArrowLeft, ChevronLeft, ChevronRight, List, ChevronDown, ChevronUp, Clapperboard } from 'lucide-react';

export default function DrachinWatchPage() {
  const { collectionId, episode } = useParams();
  const [videoUrl, setVideoUrl] = useState('');
  const [title, setTitle] = useState('');
  const [totalEps, setTotalEps] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showEpList, setShowEpList] = useState(false);
  const navigate = useNavigate();

  const epNum = parseInt(episode || '1');

  useEffect(() => {
    if (!collectionId || !episode) return;
    setLoading(true);
    Promise.all([
      getDrachinEpisode(collectionId, epNum),
      getDrachinDetail(collectionId),
    ]).then(([epData, detail]) => {
      setTitle(epData.title || detail.title || 'Drama');
      setTotalEps(detail.total_episodes || 0);
      // Pick best video URL
      const best = epData.best_url
        || epData.alt?.indo_hd_cdn_urls?.[0]
        || epData.alt?.indo_cdn_urls?.[0]
        || epData.main?.indo_cdn_urls?.[0]
        || '';
      setVideoUrl(best);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [collectionId, episode, epNum]);

  if (loading) return <Loader />;

  const episodes = Array.from({ length: totalEps }, (_, i) => i + 1);

  return (
    <div className="max-w-4xl mx-auto px-3 pb-20 md:pb-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-secondary hover:text-danger font-mono text-xs mb-3 transition-colors">
        <ArrowLeft size={14} /> Kembali
      </button>

      <h1 className="font-bold text-base sm:text-lg mb-1 line-clamp-2">{title}</h1>
      <p className="font-mono text-xs text-danger mb-3">Episode {epNum}</p>

      {/* Video Player */}
      <div className="neo-card overflow-hidden mb-3">
        <div className="aspect-[9/16] sm:aspect-video bg-black relative max-h-[70vh]">
          {videoUrl ? (
            <video
              src={videoUrl}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain bg-black"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="font-mono text-sm text-text-secondary">Video tidak tersedia</p>
            </div>
          )}
        </div>
      </div>

      {/* Ep Navigation */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => navigate(`/s/drachin/watch/${collectionId}/${epNum - 1}`)}
          disabled={epNum <= 1}
          className="neo-brutal bg-surface flex-1 py-2.5 font-mono text-xs font-bold flex items-center justify-center gap-1 disabled:opacity-40"
        >
          <ChevronLeft size={14} /> Prev
        </button>
        <button
          onClick={() => navigate(`/s/drachin/detail/${collectionId}`)}
          className="neo-brutal bg-danger text-white flex-1 py-2.5 font-mono text-xs font-bold flex items-center justify-center gap-1"
        >
          <List size={14} /> Detail
        </button>
        <button
          onClick={() => navigate(`/s/drachin/watch/${collectionId}/${epNum + 1}`)}
          disabled={epNum >= totalEps}
          className="neo-brutal bg-surface flex-1 py-2.5 font-mono text-xs font-bold flex items-center justify-center gap-1 disabled:opacity-40"
        >
          Next <ChevronRight size={14} />
        </button>
      </div>

      {/* Episode List */}
      {totalEps > 0 && (
        <div className="neo-card p-4">
          <button onClick={() => setShowEpList(!showEpList)} className="w-full flex items-center justify-between">
            <h2 className="font-bold text-sm flex items-center gap-2">
              <Clapperboard size={14} className="text-danger" /> Episode ({totalEps})
            </h2>
            {showEpList ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {showEpList && (
            <div className="mt-3 grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1.5">
              {episodes.map(ep => (
                <button
                  key={ep}
                  onClick={() => navigate(`/s/drachin/watch/${collectionId}/${ep}`)}
                  className={`py-2 font-mono text-[10px] font-bold border-2 border-black shadow-[2px_2px_0px_#000] transition-all hover:bg-danger hover:text-white ${
                    ep === epNum ? 'bg-danger text-white' : 'bg-surface text-text-secondary'
                  }`}
                >
                  {ep}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
