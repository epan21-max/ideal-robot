import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAnimeSchedule } from '../../lib/api';
import Loader from '../../components/Loader';
import { Calendar, ArrowLeft } from 'lucide-react';

export default function AnimeSchedulePage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getAnimeSchedule().then(res => {
      setData(res.data || []);
      if (res.data?.length) {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const today = days[new Date().getDay()];
        const found = res.data.find((d: any) => d.day === today);
        setActiveDay(found ? today : res.data[0].day);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const activeSchedule = data.find(d => d.day === activeDay);

  return (
    <div className="max-w-6xl mx-auto px-3 pb-20 md:pb-4">
      <button onClick={() => navigate('/s/anime/')} className="flex items-center gap-2 text-text-secondary hover:text-primary font-mono text-xs mb-4 transition-colors">
        <ArrowLeft size={14} /> Kembali
      </button>

      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Calendar size={22} className="text-primary" />
        Jadwal <span className="text-primary">Anime</span>
      </h1>

      {/* Day tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-5 pb-1">
        {data.map(d => (
          <button
            key={d.day}
            onClick={() => setActiveDay(d.day)}
            className={`flex-shrink-0 px-4 py-2 font-mono text-xs font-bold uppercase border-2 border-black transition-all ${
              activeDay === d.day
                ? 'bg-primary text-white shadow-[3px_3px_0px_#000]'
                : 'bg-surface text-text-secondary shadow-[2px_2px_0px_#000] hover:bg-surface-light'
            }`}
          >
            {d.day}
          </button>
        ))}
      </div>

      {/* Anime list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {activeSchedule?.anime_list?.map((item: any) => (
          <div
            key={item.slug}
            onClick={() => navigate(`/s/anime/detail/${item.slug}`)}
            className="neo-card flex gap-3 p-3 cursor-pointer hover:border-primary transition-colors group"
          >
            <div className="w-16 h-20 flex-shrink-0 border-2 border-black overflow-hidden">
              <img src={item.poster} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm line-clamp-2 group-hover:text-primary transition-colors">{item.title}</h3>
              <p className="font-mono text-[10px] text-accent mt-1 uppercase">{activeDay}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
