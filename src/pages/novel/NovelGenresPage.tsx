import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNovelGenres } from '../../lib/api';
import Loader from '../../components/Loader';
import { ArrowLeft, Tag, AlertCircle } from 'lucide-react';

export default function NovelGenresPage() {
  const [genres, setGenres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getNovelGenres().then(res => {
      // Remove duplicates based on slug
      const seen = new Set();
      const uniqueGenres = (res.data || []).filter((g: any) => {
        if (seen.has(g.slug)) return false;
        seen.add(g.slug);
        return true;
      });
      setGenres(uniqueGenres);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-3 pb-20 md:pb-4">
      <button onClick={() => navigate('/s/novel/')} className="flex items-center gap-2 text-text-secondary hover:text-accent font-mono text-xs mb-4 transition-colors">
        <ArrowLeft size={14} /> Kembali
      </button>

      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Tag size={22} className="text-accent" />
        Genre <span className="text-accent">Novel</span>
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
        {genres.map((genre: any) => (
          <div
            key={genre.slug}
            className="neo-card p-4 text-center cursor-default hover:border-accent transition-colors group"
          >
            <Tag size={20} className="mx-auto mb-2 text-accent" />
            <p className="font-bold text-sm group-hover:text-accent transition-colors">{genre.name}</p>
            {genre.count && (
              <p className="font-mono text-[10px] text-text-secondary mt-1">{genre.count} novel</p>
            )}
            <span className="neo-tag bg-surface-light text-text-secondary mt-2 inline-flex items-center gap-1">
              <AlertCircle size={8} /> Soon
            </span>
          </div>
        ))}
      </div>

      {/* Coming Soon Notice */}
      <div className="neo-card p-4 border-l-4 border-l-accent">
        <p className="font-mono text-xs text-text-secondary">
          Filter berdasarkan genre sedang dalam pengembangan. Saat ini Anda dapat menggunakan fitur pencarian untuk menemukan novel.
        </p>
      </div>
    </div>
  );
}
