import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNovelDetail } from '../../lib/api';
import Loader from '../../components/Loader';
import { ArrowLeft, Feather, User, Calendar, Tag, ChevronDown, ChevronUp, BookOpen, Star, Globe, Heart } from 'lucide-react';
import { stripHtml } from '../../lib/stripHtml';
import { isFavorite, toggleFavorite, type FavoriteItem } from '../../lib/favorites';

export default function NovelDetailPage() {
  const { slug } = useParams();
  const [data, setData] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllChapters, setShowAllChapters] = useState(false);
  const [synopsisExpanded, setSynopsisExpanded] = useState(false);
  const [fav, setFav] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getNovelDetail(slug).then(res => {
      setData(res.data);
      setChapters(res.data?.chapters || []);
      setFav(isFavorite(`novel-${slug}`));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [slug]);

  const handleFav = () => {
    const item: FavoriteItem = {
      id: `novel-${slug}`,
      title: data.title,
      poster: data.poster,
      type: 'novel',
      slug: slug!,
      addedAt: Date.now(),
    };
    setFav(toggleFavorite(item));
  };

  if (loading) return <Loader />;
  if (!data) return <div className="text-center py-20 font-mono text-text-secondary">Novel tidak ditemukan</div>;

  const visibleChapters = showAllChapters ? chapters : chapters.slice(0, 20);

  return (
    <div className="max-w-4xl mx-auto px-3 pb-20 md:pb-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-secondary hover:text-accent font-mono text-xs mb-4 transition-colors">
        <ArrowLeft size={14} /> Kembali
      </button>

      {/* Hero */}
      <div className="neo-card overflow-hidden mb-4">
        <div className="relative h-40 sm:h-52 overflow-hidden">
          <img src={data.poster} alt={data.title} className="w-full h-full object-cover blur-sm scale-110" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-surface/40"></div>
        </div>
        <div className="p-4 -mt-20 relative z-10">
          <div className="flex gap-4">
            <div className="w-24 sm:w-32 flex-shrink-0">
              <div className="aspect-[3/4] border-3 border-black shadow-[4px_4px_0px_#000] overflow-hidden bg-surface">
                <img src={data.poster} alt={data.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>
            <div className="flex-1 min-w-0 pt-8 sm:pt-12">
              <h1 className="font-bold text-lg sm:text-xl leading-tight mb-1">{data.title}</h1>
              {data.alt_title && <p className="font-mono text-xs text-text-secondary mb-2">{data.alt_title}</p>}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {data.type && (
                  <span className="neo-tag bg-accent text-black">{data.type}</span>
                )}
                {data.status && (
                  <span className={`neo-tag ${data.status === 'Ongoing' ? 'bg-success text-black' : 'bg-purple text-white'}`}>
                    {data.status}
                  </span>
                )}
                {data.rating && (
                  <span className="neo-tag bg-surface-light text-text-secondary flex items-center gap-1">
                    <Star size={8} /> {data.rating}
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

      {/* Info */}
      <div className="neo-card p-4 mb-4">
        <h2 className="font-bold text-sm mb-3 flex items-center gap-2">
          <Tag size={14} className="text-accent" /> Informasi
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: User, label: 'Author', value: data.info?.author },
            { icon: Globe, label: 'Negara', value: data.info?.country },
            { icon: Calendar, label: 'Terbit', value: data.info?.published },
            { icon: BookOpen, label: 'Volume', value: data.info?.volume },
            { icon: Feather, label: 'Chapter', value: data.info?.total_chapter },
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
        {data.info?.tags && (
          <div className="mt-3 p-2 bg-darker border-2 border-black">
            <p className="font-mono text-[9px] text-text-secondary uppercase mb-1">Tags</p>
            <p className="font-mono text-[10px] text-accent">{data.info.tags}</p>
          </div>
        )}
      </div>

      {/* Synopsis */}
      {data.synopsis && (
        <div className="neo-card p-4 mb-4">
          <h2 className="font-bold text-sm mb-2 flex items-center gap-2">
            <Tag size={14} className="text-purple" /> Sinopsis
          </h2>
          <div className={`font-mono text-xs text-text-secondary leading-relaxed whitespace-pre-line ${!synopsisExpanded ? 'line-clamp-4' : ''}`}>
            {stripHtml(data.synopsis)}
          </div>
          <button onClick={() => setSynopsisExpanded(!synopsisExpanded)} className="text-accent font-mono text-[10px] font-bold uppercase flex items-center gap-1 mt-2">
            {synopsisExpanded ? <><ChevronUp size={10} /> Tutup</> : <><ChevronDown size={10} /> Baca selengkapnya</>}
          </button>
        </div>
      )}

      {/* Chapters */}
      {chapters.length > 0 ? (
        <div className="neo-card p-4">
          <h2 className="font-bold text-sm mb-3 flex items-center gap-2">
            <Feather size={14} className="text-accent" /> Chapters ({chapters.length})
          </h2>
          <div className="space-y-2">
            {visibleChapters.map((ch: any) => (
              <button
                key={ch.slug}
                onClick={() => navigate(`/s/novel/baca/${ch.slug}`)}
                className="w-full flex items-center justify-between bg-darker border-2 border-black p-3 shadow-[2px_2px_0px_#000] hover:shadow-[3px_3px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:border-accent transition-all text-left group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 bg-accent/20 border-2 border-black flex items-center justify-center flex-shrink-0">
                    <Feather size={12} className="text-accent" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-xs line-clamp-1 group-hover:text-accent transition-colors">
                      {ch.title?.replace(/Bahasa Indonesia/gi, '').trim()}
                    </p>
                    {ch.date && <p className="font-mono text-[9px] text-text-secondary">{ch.date}</p>}
                  </div>
                </div>
                <span className="neo-tag bg-accent text-black">
                  Baca
                </span>
              </button>
            ))}
          </div>
          {chapters.length > 20 && (
            <button
              onClick={() => setShowAllChapters(!showAllChapters)}
              className="w-full mt-3 py-2 bg-surface border-2 border-black font-mono text-xs font-bold text-accent flex items-center justify-center gap-1"
            >
              {showAllChapters ? <><ChevronUp size={12} /> Sembunyikan</> : <><ChevronDown size={12} /> Tampilkan semua ({chapters.length})</>}
            </button>
          )}
        </div>
      ) : (
        <div className="neo-card p-8 text-center">
          <Feather size={32} className="mx-auto mb-3 text-text-secondary" />
          <p className="font-mono text-sm text-text-secondary">Belum ada chapter tersedia.</p>
        </div>
      )}
    </div>
  );
}
