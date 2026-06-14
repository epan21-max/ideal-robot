import { useEffect, useState } from 'react';
import { api, normalizeAnime, AnimeItem } from '../lib/api';
import { AnimeCard } from '../components/AnimeCard';
import { RailSkeleton } from '../components/Skeleton';
import { CalendarIcon } from '../components/Icon';

type Day = { day: string; anime: AnimeItem[] };

export function SchedulePage() {
  const [days, setDays] = useState<Day[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState<string>('');

  useEffect(() => {
    let m = true;
    (async () => {
      try {
        const data = await api.schedule();
        const arr = Array.isArray(data) ? data : (data?.days || data?.schedule || data?.data || []);
        const mapped: Day[] = arr.map((d: any) => ({
          day: d.day || d.hari || d.name || 'Unknown',
          anime: (d.anime_list || d.anime || d.list || []).map(normalizeAnime),
        }));
        if (m) {
          setDays(mapped);
          const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
          const match = mapped.find(d => d.day.toLowerCase() === today.toLowerCase());
          setActiveDay(match?.day || mapped[0]?.day || '');
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (m) setLoading(false);
      }
    })();
    return () => { m = false; };
  }, []);

  const current = days.find(d => d.day === activeDay);

  return (
    <div className="px-4 pt-20">
      <div className="mb-4 animate-fade-in-up">
        <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-[var(--muted)] mb-1">
          <CalendarIcon size={12} /> Weekly Schedule
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Schedule</h1>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {[1,2,3,4,5,6,7].map(i => <div key={i} className="h-10 w-20 rounded-full skeleton shrink-0" />)}
          </div>
          <RailSkeleton />
        </div>
      ) : (
        <>
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1 mb-5">
            {days.map(d => (
              <button
                key={d.day}
                onClick={() => setActiveDay(d.day)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition ${activeDay === d.day ? 'bg-[var(--app-fg)] text-[var(--app-bg)]' : 'liquid-glass'}`}
              >
                {d.day}
              </button>
            ))}
          </div>
          {current && (
            <div className="animate-fade-in">
              <div className="text-xs text-[var(--muted)] mb-3">{current.anime.length} airing on {current.day}</div>
              <div className="grid grid-cols-3 gap-3 stagger">
                {current.anime.map((a, i) => <AnimeCard key={(a.slug || '') + i} anime={a} />)}
              </div>
            </div>
          )}
        </>
      )}

      <div className="h-32" />
    </div>
  );
}
