import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDonghuaSchedule } from '../../lib/api';
import Loader from '../../components/Loader';
import { Calendar, ArrowLeft } from 'lucide-react';

export default function DonghuaSchedulePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getDonghuaSchedule().then(res => {
      setData(res);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const scheduleData = data?.data || data?.schedule || [];
  const scheduleArray = Array.isArray(scheduleData) ? scheduleData : Object.entries(scheduleData).map(([day, items]) => ({ day, items }));

  return (
    <div className="max-w-6xl mx-auto px-3 pb-20 md:pb-4">
      <button onClick={() => navigate('/s/donghua/')} className="flex items-center gap-2 text-text-secondary hover:text-secondary font-mono text-xs mb-4 transition-colors">
        <ArrowLeft size={14} /> Kembali
      </button>

      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Calendar size={22} className="text-secondary" />
        Jadwal <span className="text-secondary">Donghua</span>
      </h1>

      {scheduleArray.length > 0 ? (
        <div className="space-y-4">
          {scheduleArray.map((schedule: any, idx: number) => (
            <div key={idx} className="neo-card p-4">
              <h2 className="font-bold text-sm mb-3 neo-tag bg-secondary text-white inline-block">
                {schedule.day || schedule.title || `Jadwal ${idx + 1}`}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                {(schedule.items || schedule.anime_list || schedule.donghua_list || []).map((item: any, i: number) => (
                  <div
                    key={i}
                    onClick={() => {
                      if (item.slug) navigate(`/s/donghua/detail/${item.slug}`);
                    }}
                    className="flex gap-3 bg-darker border-2 border-black p-2.5 shadow-[2px_2px_0px_#000] cursor-pointer hover:border-secondary transition-colors group"
                  >
                    {item.poster && (
                      <div className="w-12 h-16 flex-shrink-0 border-2 border-black overflow-hidden">
                        <img src={item.poster} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-bold text-xs line-clamp-2 group-hover:text-secondary transition-colors">
                        {item.title || item.name}
                      </p>
                      {item.time && <p className="font-mono text-[9px] text-accent mt-1">{item.time}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="neo-card p-8 text-center">
          <p className="font-mono text-text-secondary">Jadwal belum tersedia atau format data berbeda.</p>
          <pre className="text-[10px] text-left mt-4 text-text-secondary overflow-auto max-h-40 p-2 bg-darker border-2 border-black">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
