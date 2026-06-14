import { useEffect, useState } from 'react';
import { donghuaApi, normalizeDonghua, DonghuaItem } from '../lib/donghua';
import { useRouter } from '../context/RouterContext';
import { CalendarIcon } from '../components/Icon';

export function DonghuaSchedulePage() {
  const { navigate } = useRouter();
  const [days, setDays] = useState<{ day: string; list: DonghuaItem[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState('');

  useEffect(() => {
    let m = true;
    (async () => {
      try {
        const data = await donghuaApi.schedule();
        const arr = Array.isArray(data?.schedule) ? data.schedule : (Array.isArray(data) ? data : (data?.data || data?.days || []));
        const mapped = arr.map((d: any) => ({
          day: d.day || d.hari || d.name || 'Unknown',
          list: (d.donghua_list || d.anime_list || d.list || []).map(normalizeDonghua),
        }));
        if (m) {
          setDays(mapped);
          const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
          const match = mapped.find((d: any) => d.day.toLowerCase() === today.toLowerCase());
          setActiveDay(match?.day || mapped[0]?.day || '');
        }
      } catch (e) { console.error(e); }
      finally { if (m) setLoading(false); }
    })();
    return () => { m = false; };
  }, []);

  const current = days.find(d => d.day === activeDay);

  return (
    <div className="px-4 pt-20">
      <div className="mb-4 animate-fade-in-up">
        <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-[var(--muted)] mb-1"><CalendarIcon size={12} /> Weekly Schedule</div>
        <h1 className="text-3xl font-extrabold tracking-tight">Donghua Schedule</h1>
      </div>
      {loading ? (
        <div className="space-y-4"><div className="flex gap-2 overflow-x-auto no-scrollbar">{[1,2,3,4,5,6,7].map(i => <div key={i} className="h-10 w-20 rounded-full skeleton shrink-0" />)}</div></div>
      ) : (
        <>
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1 mb-5">
            {days.map(d => (
              <button key={d.day} onClick={() => setActiveDay(d.day)} className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition ${activeDay === d.day ? 'bg-[var(--app-fg)] text-[var(--app-bg)]' : 'liquid-glass'}`}>{d.day}</button>
            ))}
          </div>
          {current && (
            <div className="animate-fade-in">
              <div className="text-xs text-[var(--muted)] mb-3">{current.list.length} airing on {current.day}</div>
              <div className="grid grid-cols-3 gap-3 stagger">
                {current.list.map((a, i) => (
                  <button key={(a.slug || '') + i} onClick={() => a.slug && navigate({ name: 'donghua-detail', slug: a.slug })} className="group text-left">
                    <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-[var(--surface)]">
                      {a.poster && <img src={a.poster} alt={a.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0" />
                    </div>
                    <div className="mt-2 px-0.5"><div className="text-xs font-semibold line-clamp-2 leading-tight">{a.title}</div></div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
      <div className="h-32" />
    </div>
  );
}
