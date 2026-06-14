import { useEffect, useState } from 'react';
import { donghuaApi } from '../lib/donghua';
import { TagIcon } from '../components/Icon';
import { useRouter } from '../context/RouterContext';

const palette = ['from-red-500 to-orange-600','from-orange-500 to-amber-600','from-emerald-500 to-teal-600','from-blue-500 to-cyan-600','from-purple-500 to-indigo-600','from-pink-500 to-rose-600','from-cyan-500 to-blue-600','from-lime-500 to-green-600','from-violet-500 to-purple-600','from-amber-500 to-yellow-600'];

export function DonghuaGenrePage() {
  const { navigate } = useRouter();
  const [genres, setGenres] = useState<{ name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let m = true;
    (async () => {
      try {
        const data = await donghuaApi.genres();
        const list = Array.isArray(data) ? data : (data?.genreList || data?.data || []);
        const mapped = list.map((g: any) => ({ name: g.title || g.name || (typeof g === 'string' ? g : 'Unknown'), slug: g.slug || g.genreId || '' }));
        if (m) setGenres(mapped);
      } catch (e) { console.error(e); }
      finally { if (m) setLoading(false); }
    })();
    return () => { m = false; };
  }, []);

  return (
    <div className="px-4 pt-20">
      <div className="mb-5 animate-fade-in-up">
        <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-[var(--muted)] mb-1"><TagIcon size={12} /> Browse</div>
        <h1 className="text-3xl font-extrabold tracking-tight">Donghua Genres</h1>
      </div>
      {loading ? (
        <div className="grid grid-cols-2 gap-3">{Array.from({ length: 10 }).map((_, i) => <div key={i} className="h-24 rounded-2xl skeleton" />)}</div>
      ) : (
        <div className="grid grid-cols-2 gap-3 stagger">
          {genres.map((g, i) => (
            <button
              key={g.name + i}
              onClick={() => g.slug && navigate({ name: 'donghua-genre-detail', slug: g.slug, genreName: g.name })}
              className={`relative w-full text-left h-24 rounded-2xl overflow-hidden bg-gradient-to-br ${palette[i % palette.length]} p-3 flex items-end shadow-lg group hover:scale-[1.02] active:scale-[0.98] transition-transform`}
            >
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              <div className="absolute -top-4 -right-4 opacity-30 text-white group-hover:opacity-40 group-hover:rotate-12 transition-all"><TagIcon size={64} /></div>
              <div className="relative text-white font-bold text-base tracking-tight">{g.name}</div>
            </button>
          ))}
        </div>
      )}
      <div className="h-32" />
    </div>
  );
}
