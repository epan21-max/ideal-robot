import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAnimeHome, getDonghuaHome, getComicHome, getNovelHome, getDrachinTrending } from '../lib/api';
import Loader from '../components/Loader';
import { ChevronRight, Tv, Film, BookOpen, Feather, Code, Layers, Zap, Globe, ChevronLeft, Play, Star, Clock, TrendingUp, Clapperboard, Eye } from 'lucide-react';

interface AnimeItem {
  title: string;
  poster: string;
  animeId: string;
  episodes?: number;
  releaseDay?: string;
  score?: string;
}

const heroBanners = [
  {
    title: 'One Piece',
    subtitle: 'Petualangan Luffy menuju Raja Bajak Laut',
    slug: '1piece-sub-indo',
    type: 'anime',
    color: 'from-red-900/80',
    poster: 'https://otakudesu.blog/wp-content/uploads/2021/05/One-Piece-Sub-Indo.jpg',
  },
  {
    title: 'Re:Zero Season 4',
    subtitle: 'Kembali dari kematian, sekali lagi',
    slug: 're-zero-kara-s4-sub-indo',
    type: 'anime',
    color: 'from-blue-900/80',
    poster: 'https://otakudesu.blog/wp-content/uploads/2026/04/s4.jpg',
  },
  {
    title: 'Kill Ao',
    subtitle: 'Pertarungan antara manusia dan iblis',
    slug: 'kill-ao-sub-indo',
    type: 'anime',
    color: 'from-green-900/80',
    poster: 'https://otakudesu.blog/wp-content/uploads/2026/04/156600.jpg',
  },
  {
    title: 'Battle Through the Heavens S5',
    subtitle: 'Donghua cultivation terpopuler',
    slug: 'battle-through-the-heavens-season-5',
    type: 'donghua',
    color: 'from-orange-900/80',
    poster: 'https://anichin.cafe/wp-content/uploads/2022/12/BTTH.webp',
  },
  {
    title: 'Standard of Reincarnation',
    subtitle: 'Manhwa action fantasy terbaik',
    slug: 'standard-of-reincarnation',
    type: 'comic',
    color: 'from-purple-900/80',
    poster: 'https://thumbnail.komiku.org/uploads/manga/standard-of-reincarnation/manga_img_horizontal-Standard-Reincarnation-Panjang.png',
  },
  {
    title: 'The Galgame Martial Saint',
    subtitle: 'Martial arts & romance novel terbaik',
    slug: 'the-galgame-martial-saint',
    type: 'novel',
    color: 'from-yellow-900/80',
    poster: 'https://sakuranovel.id/wp-content/uploads/2026/05/The-Galgame-Martial-Saint.jpg',
  },
];

export default function HomePage() {
  const [animeData, setAnimeData] = useState<any>(null);
  const [donghuaData, setDonghuaData] = useState<any[]>([]);
  const [comicData, setComicData] = useState<any[]>([]);
  const [novelData, setNovelData] = useState<any[]>([]);
  const [drachinData, setDrachinData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      getAnimeHome(),
      getDonghuaHome(1),
      getComicHome(1),
      getNovelHome(),
      getDrachinTrending()
    ]).then(([anime, donghua, comic, novel, drachin]) => {
      setAnimeData(anime.data);
      setDonghuaData(donghua.latest_release || []);
      setComicData(comic.comics || []);
      setNovelData(novel.data?.results || []);
      setDrachinData(drachin.collections || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner(p => (p + 1) % heroBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const banner = heroBanners[currentBanner];

  const handleBannerClick = () => {
    if (banner.type === 'anime') navigate(`/s/anime/detail/${banner.slug}`);
    else if (banner.type === 'donghua') navigate(`/s/donghua/detail/${banner.slug}`);
    else if (banner.type === 'comic') navigate(`/s/comic/detail/${banner.slug}`);
    else if (banner.type === 'novel') navigate(`/s/novel/detail/${banner.slug}`);
  };

  const extractComicSlug = (link: string) => {
    const match = link?.match(/\/manga\/([^/]+)\/?/);
    return match ? match[1] : link;
  };

  return (
    <div className="pb-20 md:pb-4">
      {/* Hero Banner */}
      <section className="relative h-[60vh] sm:h-[55vh] overflow-hidden border-b-3 border-black">
        <div className="absolute inset-0 transition-all duration-700">
          <img
            src={banner.poster}
            alt={banner.title}
            className="w-full h-full object-cover"
            key={banner.slug}
            referrerPolicy="no-referrer"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${banner.color} to-darker/95`}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-darker via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 h-full flex flex-col justify-end p-4 sm:p-8 max-w-6xl mx-auto">
          <div className="mb-6 animate-fadeIn" key={currentBanner}>
            <div className="flex gap-2 mb-3">
              <span className="neo-tag bg-primary text-white">
                <TrendingUp size={10} className="inline mr-1" />
                TRENDING
              </span>
              <span className={`neo-tag ${banner.type === 'anime' ? 'bg-primary' : banner.type === 'donghua' ? 'bg-secondary' : banner.type === 'comic' ? 'bg-purple' : 'bg-accent text-black'} text-white`}>
                {banner.type.toUpperCase()}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-2" style={{ textShadow: '3px 3px 0 #000' }}>
              {banner.title}
            </h1>
            <p className="text-text-secondary text-sm sm:text-base max-w-md mb-4">{banner.subtitle}</p>
            <button
              onClick={handleBannerClick}
              className="neo-brutal bg-primary text-white px-5 py-2.5 font-mono font-bold text-sm flex items-center gap-2 w-fit"
            >
              <Play size={16} /> LIHAT SEKARANG
            </button>
          </div>
          {/* Banner indicators */}
          <div className="flex gap-2 mb-2">
            <button onClick={() => setCurrentBanner(p => (p - 1 + heroBanners.length) % heroBanners.length)} className="w-8 h-8 flex items-center justify-center bg-dark/60 border-2 border-black">
              <ChevronLeft size={14} />
            </button>
            {heroBanners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentBanner(i)}
                className={`h-2 border-2 border-black transition-all ${i === currentBanner ? 'w-8 bg-primary' : 'w-2 bg-surface'}`}
              />
            ))}
            <button onClick={() => setCurrentBanner(p => (p + 1) % heroBanners.length)} className="w-8 h-8 flex items-center justify-center bg-dark/60 border-2 border-black">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Quick Nav */}
      <section className="max-w-6xl mx-auto px-3 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { label: 'Anime', desc: 'Subtitle Indonesia', icon: Tv, path: '/s/anime/', bg: 'bg-primary' },
            { label: 'Donghua', desc: 'Chinese Animation', icon: Film, path: '/s/donghua/', bg: 'bg-secondary' },
            { label: 'Comic', desc: 'Manga & Manhwa', icon: BookOpen, path: '/s/comic/', bg: 'bg-purple' },
            { label: 'Novel', desc: 'Light & Web Novel', icon: Feather, path: '/s/novel/', bg: 'bg-accent' },
            { label: 'Drachin', desc: 'Mini Drama', icon: Clapperboard, path: '/s/drachin/', bg: 'bg-danger' },
          ].map(item => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`neo-brutal ${item.bg} p-4 flex flex-col items-start gap-2 text-left ${item.bg === 'bg-accent' ? 'text-black' : 'text-white'}`}
            >
              <item.icon size={24} />
              <div>
                <p className="font-bold text-base">{item.label}</p>
                <p className={`font-mono text-[10px] uppercase ${item.bg === 'bg-accent' ? 'text-black/60' : 'text-white/60'}`}>{item.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {loading ? <Loader /> : (
        <>
          {/* Ongoing Anime */}
          {animeData?.ongoing?.animeList && (
            <section className="max-w-6xl mx-auto px-3 pb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Clock size={20} className="text-primary" />
                  Ongoing <span className="text-primary">Anime</span>
                </h2>
                <button onClick={() => navigate('/s/anime/')} className="neo-tag bg-surface text-text-primary flex items-center gap-1">
                  Lihat semua <ChevronRight size={10} />
                </button>
              </div>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                {animeData.ongoing.animeList.slice(0, 10).map((item: AnimeItem) => (
                  <div
                    key={item.animeId}
                    onClick={() => navigate(`/s/anime/detail/${item.animeId}`)}
                    className="flex-shrink-0 w-32 sm:w-36 cursor-pointer group"
                  >
                    <div className="neo-card overflow-hidden">
                      <div className="aspect-[3/4] overflow-hidden relative">
                        <img src={item.poster} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                          {item.episodes && <span className="neo-tag bg-success text-black text-[9px]">Ep {item.episodes}</span>}
                        </div>
                      </div>
                      <div className="p-2">
                        <p className="font-bold text-[11px] line-clamp-2 group-hover:text-primary transition-colors">{item.title}</p>
                        {item.releaseDay && <p className="font-mono text-[9px] text-accent mt-1">{item.releaseDay}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Completed Anime */}
          {animeData?.completed?.animeList && (
            <section className="max-w-6xl mx-auto px-3 pb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Star size={20} className="text-accent" />
                  Completed <span className="text-accent">Anime</span>
                </h2>
              </div>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                {animeData.completed.animeList.slice(0, 10).map((item: AnimeItem) => (
                  <div
                    key={item.animeId}
                    onClick={() => navigate(`/s/anime/detail/${item.animeId}`)}
                    className="flex-shrink-0 w-32 sm:w-36 cursor-pointer group"
                  >
                    <div className="neo-card overflow-hidden">
                      <div className="aspect-[3/4] overflow-hidden relative">
                        <img src={item.poster} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2 flex items-center gap-1">
                          {item.score && <span className="neo-tag bg-accent text-black text-[9px]"><Star size={8} className="inline" /> {item.score}</span>}
                        </div>
                      </div>
                      <div className="p-2">
                        <p className="font-bold text-[11px] line-clamp-2 group-hover:text-accent transition-colors">{item.title}</p>
                        {item.episodes && <p className="font-mono text-[9px] text-text-secondary mt-1">{item.episodes} Episodes</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Latest Donghua */}
          {donghuaData.length > 0 && (
            <section className="max-w-6xl mx-auto px-3 pb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Film size={20} className="text-secondary" />
                  Latest <span className="text-secondary">Donghua</span>
                </h2>
                <button onClick={() => navigate('/s/donghua/')} className="neo-tag bg-surface text-text-primary flex items-center gap-1">
                  Lihat semua <ChevronRight size={10} />
                </button>
              </div>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                {donghuaData.slice(0, 10).map((item: any, i: number) => (
                  <div
                    key={`${item.slug}-${i}`}
                    onClick={() => {
                      if (item.href?.includes('/episode/')) {
                        navigate(`/s/donghua/watch/${item.slug?.replace(/\/$/, '')}`);
                      } else {
                        navigate(`/s/donghua/detail/${item.slug}`);
                      }
                    }}
                    className="flex-shrink-0 w-32 sm:w-36 cursor-pointer group"
                  >
                    <div className="neo-card overflow-hidden">
                      <div className="aspect-[3/4] overflow-hidden relative">
                        <img src={item.poster} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                          {item.current_episode && <span className="neo-tag bg-secondary text-white text-[9px]">{item.current_episode}</span>}
                        </div>
                      </div>
                      <div className="p-2">
                        <p className="font-bold text-[11px] line-clamp-2 group-hover:text-secondary transition-colors">{item.title}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Latest Comic */}
          {comicData.length > 0 && (
            <section className="max-w-6xl mx-auto px-3 pb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <BookOpen size={20} className="text-purple" />
                  Latest <span className="text-purple">Comic</span>
                </h2>
                <button onClick={() => navigate('/s/comic/')} className="neo-tag bg-surface text-text-primary flex items-center gap-1">
                  Lihat semua <ChevronRight size={10} />
                </button>
              </div>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                {comicData.slice(0, 10).map((item: any, i: number) => (
                  <div
                    key={`${item.link}-${i}`}
                    onClick={() => navigate(`/s/comic/detail/${extractComicSlug(item.link)}`)}
                    className="flex-shrink-0 w-36 sm:w-40 cursor-pointer group"
                  >
                    <div className="neo-card overflow-hidden">
                      <div className="aspect-[16/10] overflow-hidden relative">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                          <span className="neo-tag bg-purple text-white text-[9px]">{item.chapter}</span>
                        </div>
                      </div>
                      <div className="p-2">
                        <p className="font-bold text-[11px] line-clamp-2 group-hover:text-purple transition-colors">{item.title}</p>
                        {item.time_ago && <p className="font-mono text-[9px] text-text-secondary mt-1">{item.time_ago}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Latest Novel */}
          {novelData.length > 0 && (
            <section className="max-w-6xl mx-auto px-3 pb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Feather size={20} className="text-accent" />
                  Latest <span className="text-accent">Novel</span>
                </h2>
                <button onClick={() => navigate('/s/novel/')} className="neo-tag bg-surface text-text-primary flex items-center gap-1">
                  Lihat semua <ChevronRight size={10} />
                </button>
              </div>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                {novelData.slice(0, 10).map((item: any, i: number) => (
                  <div
                    key={`${item.slug}-${i}`}
                    onClick={() => navigate(`/s/novel/detail/${item.slug}`)}
                    className="flex-shrink-0 w-32 sm:w-36 cursor-pointer group"
                  >
                    <div className="neo-card overflow-hidden">
                      <div className="aspect-[3/4] overflow-hidden relative">
                        <img src={item.poster} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" referrerPolicy="no-referrer" />
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                          {item.type && <span className="neo-tag bg-accent text-black text-[9px]">{item.type}</span>}
                        </div>
                      </div>
                      <div className="p-2">
                        <p className="font-bold text-[11px] line-clamp-2 group-hover:text-accent transition-colors">{item.title}</p>
                        {item.latest_chapter && (
                          <p className="font-mono text-[9px] text-text-secondary mt-1 line-clamp-1">
                            {item.latest_chapter.replace(/Bahasa Indonesia/gi, '').trim().substring(0, 30)}...
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Trending Drachin */}
          {drachinData.length > 0 && (
            <section className="max-w-6xl mx-auto px-3 pb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Clapperboard size={20} className="text-danger" />
                  Trending <span className="text-danger">Drachin</span>
                </h2>
                <button onClick={() => navigate('/s/drachin/')} className="neo-tag bg-surface text-text-primary flex items-center gap-1">
                  Lihat semua <ChevronRight size={10} />
                </button>
              </div>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                {drachinData.slice(0, 10).map((item: any, i: number) => (
                  <div
                    key={`${item.collection_id}-${i}`}
                    onClick={() => navigate(`/s/drachin/detail/${item.collection_id}`)}
                    className="flex-shrink-0 w-32 sm:w-36 cursor-pointer group"
                  >
                    <div className="neo-card overflow-hidden">
                      <div className="aspect-[3/4] overflow-hidden relative">
                        <img src={item.cover} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" referrerPolicy="no-referrer" />
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                          <span className="neo-tag bg-danger text-white text-[9px]">{item.total_episodes} Ep</span>
                        </div>
                      </div>
                      <div className="p-2">
                        <p className="font-bold text-[11px] line-clamp-2 group-hover:text-danger transition-colors">{item.title}</p>
                        <span className="flex items-center gap-0.5 text-[9px] text-text-secondary font-mono mt-1">
                          <Eye size={9} /> {item.views >= 1_000_000 ? (item.views / 1_000_000).toFixed(1) + 'M' : item.views >= 1_000 ? (item.views / 1_000).toFixed(1) + 'K' : item.views}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Website Info */}
      <section className="max-w-6xl mx-auto px-3 pb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Code size={20} className="text-primary" />
          Tentang <span className="text-primary">Website</span>
        </h2>
        <div className="neo-card p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Code, label: 'Developer', value: 'EpanD', color: 'text-primary' },
              { icon: Layers, label: 'Tech Stack', value: 'React + Vite + TailwindCSS', color: 'text-secondary' },
              { icon: Zap, label: 'Version', value: 'v2.3.6', color: 'text-accent' },
              { icon: Globe, label: 'Website', value: 'epandstream.my.id', color: 'text-purple' },
            ].map(info => (
              <div key={info.label} className="bg-darker border-2 border-black p-3 shadow-[3px_3px_0px_#000]">
                <info.icon size={18} className={info.color} />
                <p className="font-mono text-[10px] text-text-secondary uppercase mt-2">{info.label}</p>
                <p className="font-bold text-sm mt-0.5">{info.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-primary/10 border-2 border-primary/30">
            <p className="font-mono text-xs text-text-secondary leading-relaxed">
              EpanDStream adalah platform streaming anime, donghua, komik, dan novel subtitle Indonesia.
              Website ini dibuat untuk tujuan edukasi dan non-komersial.
              Semua konten bersumber dari API pihak ketiga.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-3 border-black bg-dark">
        <div className="max-w-6xl mx-auto px-3 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary border-2 border-black flex items-center justify-center font-mono font-bold text-white text-xs shadow-[2px_2px_0px_#000]">E</div>
              <span className="font-bold text-sm">EpanDStream</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/s/about/')} className="font-mono text-[10px] text-primary hover:underline">
                About
              </button>
              <span className="text-text-secondary text-[10px]">|</span>
              <p className="font-mono text-[10px] text-text-secondary text-center">
                2026 EpanDStream. For educational purposes only.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
