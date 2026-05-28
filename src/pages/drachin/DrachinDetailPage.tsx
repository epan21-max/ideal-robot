import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDrachinDetail } from '../../lib/api';
import { stripHtml } from '../../lib/stripHtml';
import Loader from '../../components/Loader';
import { ArrowLeft, Play, Eye, Tag, ChevronDown, ChevronUp, Clapperboard, Users, Heart } from 'lucide-react';
import { isFavorite, toggleFavorite, type FavoriteItem } from '../../lib/favorites';

export default function DrachinDetailPage() {
  const { collectionId } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [synopsisExpanded, setSynopsisExpanded] = useState(false);
  const [fav, setFav] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!collectionId) return;
    setLoading(true);
    getDrachinDetail(collectionId).then(res => {
      setData(res);
      setFav(isFavorite(`drachin-${collectionId}`));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [collectionId]);

  const handleFav = () => {
    const item: FavoriteItem = {
      id: `drachin-${collectionId}`,
      title: data.title,
      poster: data.cover_urls?.[0] || '',
      type: 'drachin',
      slug: collectionId!,
      addedAt: Date.now(),
    };
    setFav(toggleFavorite(item));
  };

  if (loading) return <Loader />;
  if (!data) return <div className="text-center py-20 font-mono text-text-secondary">Drama tidak ditemukan</div>;

  const formatViews = (n: number) => {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return n?.toString() || '0';
  };

  const totalEps = data.total_episodes || 0;
  const episodes = Array.from({ length: totalEps }, (_, i) => i + 1);

  return (
    <div className="max-w-4xl mx-auto px-3 pb-20 md:pb-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-secondary hover:text-danger font-mono text-xs mb-4 transition-colors">
        <ArrowLeft size={14} /> Kembali
      </button>

      {/* Hero */}
      <div className="neo-card overflow-hidden mb-4">
        <div className="relative h-48 sm:h-64 overflow-hidden">
          <img src={data.cover_urls?.[0] || ''} alt={data.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent"></div>
        </div>
        <div className="p-4 -mt-16 relative z-10">
          <div className="flex gap-4">
            <div className="w-24 sm:w-28 flex-shrink-0">
              <div className="aspect-[3/4] border-3 border-black shadow-[4px_4px_0px_#000] overflow-hidden bg-surface">
                <img src={data.cover_urls?.[0] || ''} alt={data.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>
            <div className="flex-1 min-w-0 pt-10 sm:pt-12">
              <h1 className="font-bold text-lg sm:text-xl leading-tight mb-1">{data.title}</h1>
              {data.channel && <p className="font-mono text-xs text-text-secondary mb-2">{data.channel}</p>}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {data.type && <span className="neo-tag bg-danger text-white">{data.type}</span>}
                <span className="neo-tag bg-surface-light text-text-secondary">{data.episode_label || `${totalEps} Episode`}</span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <span className="flex items-center gap-1 text-[10px] text-text-secondary font-mono">
                  <Eye size={10} /> {formatViews(data.views)}
                </span>
                {data.channel_followers && (
                  <span className="flex items-center gap-1 text-[10px] text-text-secondary font-mono">
                    <Users size={10} /> {formatViews(data.channel_followers)}
                  </span>
                )}
              </div>
              <button
                onClick={handleFav}
                className={`neo-brutal text-xs font-mono font-bold px-3 py-1.5 flex items-center gap-1.5 ${
                  fav ? 'bg-danger text-white' : 'bg-surface text-text-primary'
                }`}
              >
                <Heart size={12} className={fav ? 'fill-white' : ''} />
                {fav ? 'Hapus Favorit' : 'Tambah Favorit'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Synopsis */}
      {data.description && (
        <div className="neo-card p-4 mb-4">
          <h2 className="font-bold text-sm mb-2 flex items-center gap-2">
            <Tag size={14} className="text-danger" /> Sinopsis
          </h2>
          <div className={`font-mono text-xs text-text-secondary leading-relaxed whitespace-pre-line ${!synopsisExpanded ? 'line-clamp-4' : ''}`}>
            {stripHtml(data.description)}
          </div>
          <button onClick={() => setSynopsisExpanded(!synopsisExpanded)} className="text-danger font-mono text-[10px] font-bold uppercase flex items-center gap-1 mt-2">
            {synopsisExpanded ? <><ChevronUp size={10} /> Tutup</> : <><ChevronDown size={10} /> Selengkapnya</>}
          </button>
        </div>
      )}

      {/* Episode Grid */}
      <div className="neo-card p-4">
        <h2 className="font-bold text-sm mb-3 flex items-center gap-2">
          <Clapperboard size={14} className="text-danger" /> Episode ({totalEps})
        </h2>
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {episodes.map(ep => (
            <button
              key={ep}
              onClick={() => navigate(`/s/drachin/watch/${collectionId}/${ep}`)}
              className="py-2.5 font-mono text-[11px] font-bold border-2 border-black shadow-[2px_2px_0px_#000] transition-all hover:bg-danger hover:text-white hover:shadow-[3px_3px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] bg-surface text-text-secondary text-center"
            >
              {ep}
            </button>
          ))}
        </div>

        {/* Quick play first episode */}
        <button
          onClick={() => navigate(`/s/drachin/watch/${collectionId}/1`)}
          className="neo-brutal bg-danger text-white w-full mt-4 py-3 font-mono text-sm font-bold flex items-center justify-center gap-2"
        >
          <Play size={16} /> Tonton Episode 1
        </button>
      </div>
    </div>
  );
}
