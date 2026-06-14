import { useEffect, useState } from 'react';
import { api, normalizeAnime, AnimeItem } from '../lib/api';
import { Hero } from '../components/Hero';
import { Section } from '../components/Section';
import { AnimeCard } from '../components/AnimeCard';
import { GridSkeleton, HeroSkeleton, RailSkeleton } from '../components/Skeleton';
import { FireIcon, SparklesIcon, CheckIcon, CalendarIcon } from '../components/Icon';
import { useRouter } from '../context/RouterContext';

export function HomePage() {
  const { navigate } = useRouter();
  const [loading, setLoading] = useState(true);
  const [ongoing, setOngoing] = useState<AnimeItem[]>([]);
  const [complete, setComplete] = useState<AnimeItem[]>([]);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const home = await api.home();
        if (!mounted) return;
        const ong = (home?.ongoing?.animeList || home?.ongoing_anime || home?.ongoing || home?.recent || []).map(normalizeAnime);
        const com = (home?.completed?.animeList || home?.complete?.animeList || home?.complete_anime || home?.complete || home?.popular || []).map(normalizeAnime);
        setOngoing(ong);
        setComplete(com);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const featured = ongoing.slice(0, 5).length > 0 ? ongoing.slice(0, 5) : complete.slice(0, 5);

  return (
    <div className="px-4 pt-20">
      {loading ? <HeroSkeleton /> : <Hero featured={featured} />}

      <Section
        title="Ongoing Anime"
        subtitle="Latest Episodes"
        icon={<FireIcon size={12} />}
        action="See all"
        onAction={() => navigate({ name: 'library', tab: 'ongoing' })}
      >
        {loading ? <RailSkeleton /> : (
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1 stagger">
            {ongoing.slice(0, 12).map((a, i) => <AnimeCard key={a.slug || i} anime={a} variant="rail" />)}
          </div>
        )}
      </Section>

      <Section
        title="Trending"
        subtitle="Editor's Pick"
        icon={<SparklesIcon size={12} />}
      >
        {loading ? <GridSkeleton count={6} /> : (
          <div className="grid grid-cols-3 gap-3 stagger">
            {complete.slice(0, 6).map((a, i) => (
              <AnimeCard key={a.slug || i} anime={a} />
            ))}
          </div>
        )}
      </Section>

      <Section
        title="Completed"
        subtitle="Watch the full series"
        icon={<CheckIcon size={12} />}
        action="See all"
        onAction={() => navigate({ name: 'library', tab: 'complete' })}
      >
        {loading ? <RailSkeleton /> : (
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1 stagger">
            {complete.slice(0, 12).map((a, i) => <AnimeCard key={a.slug || i} anime={a} variant="rail" />)}
          </div>
        )}
      </Section>

      <Section
        title="Browse by Schedule"
        subtitle="What's airing"
        icon={<CalendarIcon size={12} />}
        action="View"
        onAction={() => navigate({ name: 'schedule' })}
      >
        <div className="grid grid-cols-7 gap-1.5">
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d) => (
            <button
              key={d}
              onClick={() => navigate({ name: 'schedule' })}
              className="liquid-glass rounded-xl py-3 text-xs font-semibold text-center"
            >
              {d}
            </button>
          ))}
        </div>
      </Section>

      <div className="h-32" />
    </div>
  );
}
