import { useEffect, useState } from 'react';
import { donghuaApi, normalizeDonghua, DonghuaItem } from '../lib/donghua';
import { Section } from '../components/Section';
import { RailSkeleton, GridSkeleton } from '../components/Skeleton';
import { useRouter } from '../context/RouterContext';
import { FireIcon, SparklesIcon, PlayIcon, ChevronRightIcon, ChevronLeftIcon, CalendarIcon } from '../components/Icon';

export function DonghuaHomePage() {
  const { navigate } = useRouter();
  const [loading, setLoading] = useState(true);
  const [ongoing, setOngoing] = useState<DonghuaItem[]>([]);
  const [completed, setCompleted] = useState<DonghuaItem[]>([]);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [onRes, comRes] = await Promise.allSettled([
          donghuaApi.ongoing(1),
          donghuaApi.completed(1),
        ]);
        if (!mounted) return;
        if (onRes.status === 'fulfilled') {
          const list = (onRes.value?.ongoing_donghua || []).map(normalizeDonghua);
          setOngoing(list);
        }
        if (comRes.status === 'fulfilled') {
          const list = (comRes.value?.completed_donghua || []).map(normalizeDonghua);
          setCompleted(list);
        }
      } catch (e) { console.error(e); }
      finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, []);

  const featured = ongoing.slice(0, 5);
  const heroData = [
    { eyebrow: 'CHINESE ANIMATION', title: 'Donghua\nCollection', sub: 'Explore the world of Chinese animation with premium quality streaming.', gradient: 'from-red-600 via-orange-500 to-amber-500', icon: <SparklesIcon size={14} /> },
    { eyebrow: 'TRENDING DONGHUA', title: 'Martial Arts\nSaga', sub: 'Follow epic cultivation journeys and fantasy adventures.', gradient: 'from-purple-600 via-pink-500 to-red-500', icon: <FireIcon size={14} /> },
    { eyebrow: 'TOP PICKS', title: 'Xianxia\nWorld', sub: 'Discover the best Chinese animation with stunning visuals.', gradient: 'from-cyan-500 via-blue-500 to-indigo-600', icon: <SparklesIcon size={14} /> },
  ];
  const slide = heroData[heroIndex % heroData.length];
  const heroAnime = featured[heroIndex % Math.max(featured.length, 1)];

  useEffect(() => {
    const t = setInterval(() => setHeroIndex(i => (i + 1) % heroData.length), 6000);
    return () => clearInterval(t);
  }, [heroData.length]);

  return (
    <div className="px-4 pt-20">
      {/* Hero */}
      <div className="relative w-full overflow-hidden rounded-[28px] mb-4" style={{ minHeight: 360 }}>
        <div className="absolute inset-0 transition-opacity duration-1000" key={heroIndex}>
          {heroAnime?.poster && (
            <img src={heroAnime.poster} alt="" className="w-full h-full object-cover scale-110 animate-fade-in" />
          )}
          <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} opacity-50 mix-blend-multiply`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
        </div>
        <div className="blob-bg w-64 h-64 bg-white/20 -top-10 -right-10" />
        <div className="blob-bg w-56 h-56 bg-red-400/30 bottom-0 -left-10" style={{ animationDelay: '4s' }} />

        <div className="relative h-full flex flex-col justify-end p-5 text-white" style={{ minHeight: 360 }}>
          <div key={`text-${heroIndex}`} className="animate-slide-up">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md mb-3">
              {slide.icon} {slide.eyebrow}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold leading-[1.1] tracking-tight whitespace-pre-line">{slide.title}</h1>
            <p className="text-sm text-white/80 mt-2 max-w-md leading-relaxed">{slide.sub}</p>
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => heroAnime?.slug && navigate({ name: 'donghua-detail', slug: heroAnime.slug })}
                className="inline-flex items-center gap-2 bg-white text-black font-semibold text-sm px-4 py-2.5 rounded-full"
              >
                <PlayIcon size={14} /> Watch Now
              </button>
              <button
                onClick={() => navigate({ name: 'donghua-library', tab: 'ongoing' })}
                className="inline-flex items-center gap-1 text-sm font-semibold px-4 py-2.5 rounded-full bg-white/15 backdrop-blur-md"
              >
                Browse <ChevronRightIcon size={14} />
              </button>
            </div>
          </div>
          <div className="absolute top-4 right-4 flex items-center gap-1">
            <button onClick={() => setHeroIndex(i => (i - 1 + heroData.length) % heroData.length)} className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white">
              <ChevronLeftIcon size={14} />
            </button>
            <button onClick={() => setHeroIndex(i => (i + 1) % heroData.length)} className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white">
              <ChevronRightIcon size={14} />
            </button>
          </div>
          <div className="absolute bottom-3 right-5 flex items-center gap-1.5">
            {heroData.map((_, i) => (
              <button key={i} onClick={() => setHeroIndex(i)} className={`h-1 rounded-full transition-all duration-500 ${i === heroIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`} />
            ))}
          </div>
        </div>
      </div>

      <Section title="Ongoing Donghua" subtitle="Latest Releases" icon={<FireIcon size={12} />} action="See all" onAction={() => navigate({ name: 'donghua-library', tab: 'ongoing' })}>
        {loading ? <RailSkeleton /> : (
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1 stagger">
            {ongoing.slice(0, 15).map((a, i) => (
              <button key={i} onClick={() => a.slug && navigate({ name: 'donghua-detail', slug: a.slug })} className="group shrink-0 w-36 text-left">
                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-[var(--surface)]">
                  {a.poster && <img src={a.poster} alt={a.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  {a.status && <span className="absolute top-2 left-2 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-black/60 text-white backdrop-blur">{a.status}</span>}
                </div>
                <div className="mt-2 px-0.5">
                  <div className="text-xs font-semibold line-clamp-2 leading-tight">{a.title}</div>
                  <div className="text-[10px] text-[var(--muted)] mt-0.5">{a.type}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </Section>

      <Section title="Completed Donghua" subtitle="Full Series" icon={<SparklesIcon size={12} />} action="See all" onAction={() => navigate({ name: 'donghua-library', tab: 'completed' })}>
        {loading ? <GridSkeleton count={6} /> : (
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1 stagger">
            {completed.slice(0, 15).map((a, i) => (
              <button key={i} onClick={() => a.slug && navigate({ name: 'donghua-detail', slug: a.slug })} className="group shrink-0 w-36 text-left">
                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-[var(--surface)]">
                  {a.poster && <img src={a.poster} alt={a.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </div>
                <div className="mt-2 px-0.5">
                  <div className="text-xs font-semibold line-clamp-2 leading-tight">{a.title}</div>
                  <div className="text-[10px] text-[var(--muted)] mt-0.5">{a.episodes_count}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </Section>

      <Section title="Schedule" subtitle="What's Airing" icon={<CalendarIcon size={12} />} action="View" onAction={() => navigate({ name: 'donghua-schedule' })}>
        <button onClick={() => navigate({ name: 'donghua-schedule' })} className="w-full liquid-glass rounded-2xl p-4 flex items-center gap-3">
          <CalendarIcon size={20} className="text-[var(--accent)]" />
          <div className="text-left">
            <div className="text-sm font-semibold">Weekly Schedule</div>
            <div className="text-xs text-[var(--muted)]">See what's airing today</div>
          </div>
        </button>
      </Section>

      <div className="h-32" />
    </div>
  );
}
