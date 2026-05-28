import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAnimeHome } from '../../lib/api';
import AnimeCard from '../../components/AnimeCard';
import Loader from '../../components/Loader';
import { Clock, CheckCircle, Calendar, Search } from 'lucide-react';

export default function AnimeHomePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'ongoing' | 'completed'>('ongoing');
  const navigate = useNavigate();

  useEffect(() => {
    getAnimeHome().then(res => {
      setData(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const list = tab === 'ongoing' ? data?.ongoing?.animeList : data?.completed?.animeList;

  return (
    <div className="max-w-6xl mx-auto px-3 pb-20 md:pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">
          <span className="text-primary">Anime</span> Sub Indo
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/s/anime/schedule')}
            className="neo-tag bg-surface text-text-primary flex items-center gap-1 cursor-pointer"
          >
            <Calendar size={10} /> Jadwal
          </button>
          <button
            onClick={() => navigate('/s/anime/search?q=')}
            className="neo-tag bg-primary text-white flex items-center gap-1 cursor-pointer"
          >
            <Search size={10} /> Cari
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex mb-4 border-2 border-black">
        <button
          onClick={() => setTab('ongoing')}
          className={`flex-1 py-2.5 font-mono text-xs font-bold uppercase flex items-center justify-center gap-1.5 border-r-2 border-black transition-colors ${
            tab === 'ongoing' ? 'bg-primary text-white' : 'bg-surface text-text-secondary hover:bg-surface-light'
          }`}
        >
          <Clock size={14} /> Ongoing
        </button>
        <button
          onClick={() => setTab('completed')}
          className={`flex-1 py-2.5 font-mono text-xs font-bold uppercase flex items-center justify-center gap-1.5 transition-colors ${
            tab === 'completed' ? 'bg-accent text-black' : 'bg-surface text-text-secondary hover:bg-surface-light'
          }`}
        >
          <CheckCircle size={14} /> Completed
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {list?.map((item: any) => (
          <AnimeCard
            key={item.animeId}
            title={item.title}
            poster={item.poster}
            slug={item.animeId}
            type="anime"
            episodes={item.episodes}
            score={item.score}
            releaseDay={item.releaseDay}
            status={tab === 'ongoing' ? 'Ongoing' : 'Completed'}
          />
        ))}
      </div>

      {(!list || list.length === 0) && (
        <div className="neo-card p-8 text-center">
          <p className="font-mono text-text-secondary">Tidak ada data tersedia.</p>
        </div>
      )}
    </div>
  );
}
