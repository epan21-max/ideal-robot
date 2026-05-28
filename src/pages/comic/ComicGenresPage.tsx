import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getComicGenres } from '../../lib/api';
import Loader from '../../components/Loader';
import { ArrowLeft, Tag } from 'lucide-react';

export default function ComicGenresPage() {
  const [genres, setGenres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getComicGenres().then(res => {
      // Convert object to array
      const genreList = Object.entries(res)
        .filter(([key]) => key !== 'creator')
        .map(([, val]: [string, any]) => val);
      setGenres(genreList);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-3 pb-20 md:pb-4">
      <button onClick={() => navigate('/s/comic/')} className="flex items-center gap-2 text-text-secondary hover:text-purple font-mono text-xs mb-4 transition-colors">
        <ArrowLeft size={14} /> Kembali
      </button>

      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Tag size={22} className="text-purple" />
        Genre <span className="text-purple">Komik</span>
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {genres.map((genre: any) => (
          <button
            key={genre.value}
            onClick={() => navigate(`/s/comic/genre/${genre.value}`)}
            className="neo-card p-4 text-center cursor-pointer hover:border-purple transition-colors group text-left"
          >
            <Tag size={20} className="mx-auto mb-2 text-purple" />
            <p className="font-bold text-sm group-hover:text-purple transition-colors text-center">{genre.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
