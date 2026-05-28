import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDonghuaDetail } from '../../lib/api';
import { isFavorite, toggleFavorite, type FavoriteItem } from '../../lib/favorites';
import Loader from '../../components/Loader';
import { ArrowLeft, Heart, Star, Play, Clock, Film, Calendar, Tag, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import { stripHtml } from '../../lib/stripHtml';

export default function DonghuaDetailPage() {
  const { slug } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fav, setFav] = useState(false);
  const [showAllEps, setShowAllEps] = useState(false);
  const [synopsisExpanded, setSynopsisExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getDonghuaDetail(slug).then(res => {
      setData(res);
      setFav(isFavorite(`donghua-${slug}`));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loader />;
  if (!data) return <div className="text-center py-20 font-mono text-text-secondary">Data tidak ditemukan</div>;

  const handleFav = () => {
    const item: FavoriteItem = {
      id: `donghua-${slug}`,
      title: data.title,
      poster: data.poster,
      type: 'donghua',
      slug: slug!,
      addedAt: Date.now(),
    };
    const result = toggleFavorite(item);
    setFav(result);
  };

  const episodes = data.episodes_list || [];
  const visibleEps = showAllEps ? episodes : episodes.slice(0, 20);

  return (
    <div className="max-w-4xl mx-auto px-3 pb-20 md:pb-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-secondary hover:text-secondary font-mono text-xs mb-4 transition-colors">
        <ArrowLeft size={14} /> Kembali
      </button>

      {/* Hero */}
      <div className="neo-card overflow-hidden mb-4">
        <div className="relative h-48 sm:h-64">
          <img src={data.poster} alt={data.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent"></div>
        </div>
        <div className="p-4 -mt-16 relative z-10">
          <div className="flex gap-4">
            <div className="w-24 sm:w-28 flex-shrink-0">
              <div className="aspect-[3/4] border-3 border-black shadow-[4px_4px_0px_#000] overflow-hidden">
                <img src={data.poster} alt={data.title} className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex-1 min-w-0 pt-12">
              <h1 className="font-bold text-lg sm:text-xl leading-tight mb-1">{data.title}</h1>
              {data.alter_title && <p className="font-mono text-xs text-text-secondary mb-2">{data.alter_title}</p>}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {data.rating && (
                  <span className="neo-tag bg-accent text-black flex items-center gap-1">
                    <Star size={10} /> {data.rating}
                  </span>
                )}
                {data.status && (
                  <span className={`neo-tag ${data.status === 'Ongoing' ? 'bg-success text-black' : 'bg-purple text-white'}`}>
                    {data.status}
                  </span>
                )}
                <span className="neo-tag bg-secondary text-white">Donghua</span>
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

      {/* Info */}
      <div className="neo-card p-4 mb-4">
        <h2 className="font-bold text-sm mb-3 flex items-center gap-2">
          <Tag size={14} className="text-secondary" /> Informasi
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: Film, label: 'Studio', value: data.studio },
            { icon: Clock, label: 'Durasi', value: data.duration },
            { icon: Calendar, label: 'Rilis', value: data.released },
            { icon: Globe, label: 'Negara', value: data.country },
            { icon: Tag, label: 'Season', value: data.season },
            { icon: Play, label: 'Episode', value: data.episodes_count },
          ].filter(i => i.value).map(info => (
            <div key={info.label} className="bg-darker border-2 border-black p-2.5 shadow-[2px_2px_0px_#000]">
              <p className="font-mono text-[9px] text-text-secondary uppercase flex items-center gap-1">
                <info.icon size={10} /> {info.label}
              </p>
              <p className="font-bold text-xs mt-0.5 line-clamp-1">{info.value}</p>
            </div>
          ))}
        </div>
        {data.genres?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {data.genres.map((g: any) => (
              <span key={g.slug || g.name} className="neo-tag bg-surface-light text-text-secondary">{g.name}</span>
            ))}
          </div>
        )}
      </div>

      {/* Synopsis */}
      {data.synopsis && (
        <div className="neo-card p-4 mb-4">
          <h2 className="font-bold text-sm mb-2 flex items-center gap-2">
            <Tag size={14} className="text-accent" /> Sinopsis
          </h2>
          <div className={`font-mono text-xs text-text-secondary leading-relaxed ${!synopsisExpanded ? 'line-clamp-3' : ''}`}>
            <p>{stripHtml(data.synopsis)}</p>
          </div>
          <button onClick={() => setSynopsisExpanded(!synopsisExpanded)} className="text-secondary font-mono text-[10px] font-bold uppercase flex items-center gap-1 mt-1">
            {synopsisExpanded ? <><ChevronUp size={10} /> Tutup</> : <><ChevronDown size={10} /> Baca selengkapnya</>}
          </button>
        </div>
      )}

      {/* Episodes */}
      {episodes.length > 0 && (
        <div className="neo-card p-4">
          <h2 className="font-bold text-sm mb-3 flex items-center gap-2">
            <Play size={14} className="text-secondary" /> Episode ({episodes.length})
          </h2>
          <div className="space-y-2">
            {visibleEps.map((ep: any) => (
              <button
                key={ep.slug}
                onClick={() => navigate(`/s/donghua/watch/${ep.slug}`)}
                className="w-full flex items-center gap-2 bg-darker border-2 border-black p-3 shadow-[2px_2px_0px_#000] hover:shadow-[3px_3px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:border-secondary transition-all text-left group"
              >
                <div className="w-8 h-8 bg-secondary/20 border-2 border-black flex items-center justify-center flex-shrink-0">
                  <Play size={12} className="text-secondary" />
                </div>
                <p className="font-bold text-xs line-clamp-1 group-hover:text-secondary transition-colors flex-1 min-w-0">
                  {ep.episode}
                </p>
              </button>
            ))}
          </div>
          {episodes.length > 20 && (
            <button
              onClick={() => setShowAllEps(!showAllEps)}
              className="w-full mt-3 py-2 bg-surface border-2 border-black font-mono text-xs font-bold text-secondary flex items-center justify-center gap-1"
            >
              {showAllEps ? <><ChevronUp size={12} /> Sembunyikan</> : <><ChevronDown size={12} /> Tampilkan semua ({episodes.length})</>}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
