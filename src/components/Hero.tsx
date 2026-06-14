import { useEffect, useState } from 'react';
import { AnimeItem } from '../lib/api';
import { useRouter } from '../context/RouterContext';
import { PlayIcon, SparklesIcon, FireIcon, StarIcon, ChevronRightIcon, ChevronLeftIcon } from './Icon';

const heroTitles = [
  {
    eyebrow: 'PREMIUM EDITION',
    title: 'Cinematic Anime,\nElevated.',
    sub: 'Stream in stunning quality with a beautifully crafted liquid glass experience.',
    icon: <SparklesIcon size={14} />,
    gradient: 'from-indigo-600 via-purple-600 to-pink-600',
  },
  {
    eyebrow: 'TRENDING NOW',
    title: 'The hottest\nreleases this week.',
    sub: 'Catch the most-watched anime episodes loved by fans worldwide.',
    icon: <FireIcon size={14} />,
    gradient: 'from-orange-500 via-red-500 to-pink-600',
  },
  {
    eyebrow: 'EDITOR’S PICKS',
    title: 'Stories worth\nthe binge.',
    sub: 'Hand-picked masterpieces curated for an unforgettable journey.',
    icon: <StarIcon size={14} />,
    gradient: 'from-yellow-500 via-amber-500 to-orange-600',
  },
  {
    eyebrow: 'JUST ADDED',
    title: 'Fresh episodes,\ndaily.',
    sub: 'Never miss a beat. Schedule, ongoing, and complete — all in one place.',
    icon: <SparklesIcon size={14} />,
    gradient: 'from-cyan-500 via-blue-500 to-indigo-600',
  },
];

export function Hero({ featured }: { featured: AnimeItem[] }) {
  const [index, setIndex] = useState(0);
  const { navigate } = useRouter();
  const total = heroTitles.length;

  useEffect(() => {
    const t = setInterval(() => setIndex(i => (i + 1) % total), 6000);
    return () => clearInterval(t);
  }, [total]);

  const slide = heroTitles[index];
  const bgAnime = featured[index % Math.max(featured.length, 1)];

  return (
    <div className="relative w-full overflow-hidden rounded-[28px] mb-4" style={{ minHeight: 360 }}>
      {/* Background image */}
      <div className="absolute inset-0 transition-opacity duration-1000" key={index}>
        {bgAnime?.poster && (
          <img src={bgAnime.poster} alt="" className="w-full h-full object-cover scale-110 animate-fade-in" />
        )}
        <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} opacity-50 mix-blend-multiply`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
      </div>

      {/* Floating blobs for liquid effect */}
      <div className="blob-bg w-64 h-64 bg-white/20 -top-10 -right-10" />
      <div className="blob-bg w-56 h-56 bg-purple-400/30 bottom-0 -left-10" style={{ animationDelay: '4s' }} />

      <div className="relative h-full flex flex-col justify-end p-5 text-white" style={{ minHeight: 360 }}>
        <div key={`text-${index}`} className="animate-slide-up">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md mb-3">
            {slide.icon} {slide.eyebrow}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-[1.1] tracking-tight whitespace-pre-line">
            {slide.title}
          </h1>
          <p className="text-sm text-white/80 mt-2 max-w-md leading-relaxed">{slide.sub}</p>

          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => bgAnime?.slug && navigate({ name: 'detail', slug: bgAnime.slug })}
              className="inline-flex items-center gap-2 bg-white text-black font-semibold text-sm px-4 py-2.5 rounded-full"
            >
              <PlayIcon size={14} /> Watch Now
            </button>
            <button
              onClick={() => navigate({ name: 'library', tab: 'ongoing' })}
              className="inline-flex items-center gap-1 text-sm font-semibold px-4 py-2.5 rounded-full bg-white/15 backdrop-blur-md"
            >
              Browse <ChevronRightIcon size={14} />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute top-4 right-4 flex items-center gap-1">
          <button onClick={() => setIndex(i => (i - 1 + total) % total)} className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white">
            <ChevronLeftIcon size={14} />
          </button>
          <button onClick={() => setIndex(i => (i + 1) % total)} className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white">
            <ChevronRightIcon size={14} />
          </button>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-3 right-5 flex items-center gap-1.5">
          {heroTitles.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1 rounded-full transition-all duration-500 ${i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
