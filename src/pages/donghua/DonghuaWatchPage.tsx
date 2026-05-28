import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDonghuaEpisode } from '../../lib/api';
import Loader from '../../components/Loader';
import { ArrowLeft, ChevronLeft, ChevronRight, Play, List, Download, ChevronDown, ChevronUp, Server } from 'lucide-react';

export default function DonghuaWatchPage() {
  const { slug } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [streamUrl, setStreamUrl] = useState('');
  const [activeServer, setActiveServer] = useState('');
  const [showEpList, setShowEpList] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getDonghuaEpisode(slug).then(res => {
      setData(res);
      if (res.streaming?.main_url?.url) {
        setStreamUrl(res.streaming.main_url.url);
        setActiveServer(res.streaming.main_url.name);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loader />;
  if (!data) return <div className="text-center py-20 font-mono text-text-secondary">Episode tidak ditemukan</div>;

  const servers = data.streaming?.servers || [];
  const episodes = data.episodes_list || [];
  const downloadUrl = data.download_url || {};

  return (
    <div className="max-w-4xl mx-auto px-3 pb-20 md:pb-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-secondary hover:text-secondary font-mono text-xs mb-3 transition-colors">
        <ArrowLeft size={14} /> Kembali
      </button>

      <h1 className="font-bold text-base sm:text-lg mb-3 line-clamp-2">{data.episode}</h1>

      {/* Video Player */}
      <div className="neo-card overflow-hidden mb-3">
        <div className="aspect-video bg-black relative">
          {streamUrl ? (
            <iframe
              src={streamUrl}
              className="w-full h-full"
              allowFullScreen
              allow="autoplay; encrypted-media"
              referrerPolicy="no-referrer"
              sandbox="allow-scripts allow-same-origin allow-presentation"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="font-mono text-sm text-text-secondary">Pilih server untuk memutar</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-2 mb-3">
        {data.navigation?.previous_episode && (
          <button
            onClick={() => navigate(`/s/donghua/watch/${data.navigation.previous_episode.slug}`)}
            className="neo-brutal bg-surface flex-1 py-2.5 font-mono text-xs font-bold flex items-center justify-center gap-1"
          >
            <ChevronLeft size={14} /> Prev
          </button>
        )}
        {data.navigation?.all_episodes && (
          <button
            onClick={() => navigate(`/s/donghua/detail/${data.navigation.all_episodes.slug}`)}
            className="neo-brutal bg-secondary text-white flex-1 py-2.5 font-mono text-xs font-bold flex items-center justify-center gap-1"
          >
            <List size={14} /> Detail
          </button>
        )}
        {data.navigation?.next_episode && (
          <button
            onClick={() => navigate(`/s/donghua/watch/${data.navigation.next_episode.slug}`)}
            className="neo-brutal bg-surface flex-1 py-2.5 font-mono text-xs font-bold flex items-center justify-center gap-1"
          >
            Next <ChevronRight size={14} />
          </button>
        )}
      </div>

      {/* Server Selection */}
      {servers.length > 0 && (
        <div className="neo-card p-4 mb-3">
          <h2 className="font-bold text-sm mb-3 flex items-center gap-2">
            <Server size={14} className="text-secondary" /> Server Streaming
          </h2>
          <div className="flex flex-wrap gap-2">
            {servers.map((s: any) => (
              <button
                key={s.name}
                onClick={() => { setStreamUrl(s.url); setActiveServer(s.name); }}
                className={`px-3 py-1.5 font-mono text-[10px] font-bold uppercase border-2 border-black shadow-[2px_2px_0px_#000] transition-all hover:shadow-[3px_3px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] ${
                  activeServer === s.name ? 'bg-secondary text-white' : 'bg-surface text-text-secondary hover:text-text-primary'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Download */}
      {Object.keys(downloadUrl).length > 0 && (
        <div className="neo-card p-4 mb-3">
          <button onClick={() => setShowDownload(!showDownload)} className="w-full flex items-center justify-between">
            <h2 className="font-bold text-sm flex items-center gap-2">
              <Download size={14} className="text-accent" /> Download
            </h2>
            {showDownload ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {showDownload && (
            <div className="mt-3 space-y-3">
              {Object.entries(downloadUrl).map(([quality, links]: [string, any]) => (
                <div key={quality}>
                  <p className="font-mono text-[10px] text-accent uppercase font-bold mb-1.5">
                    {quality.replace('download_url_', '').toUpperCase()}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(links).map(([name, url]: [string, any]) => (
                      <a
                        key={name}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="neo-tag bg-surface-light text-text-primary hover:bg-secondary hover:text-white transition-colors cursor-pointer"
                      >
                        {name}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Episode List */}
      {episodes.length > 0 && (
        <div className="neo-card p-4">
          <button onClick={() => setShowEpList(!showEpList)} className="w-full flex items-center justify-between">
            <h2 className="font-bold text-sm flex items-center gap-2">
              <Play size={14} className="text-secondary" /> Episode Lainnya ({episodes.length})
            </h2>
            {showEpList ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {showEpList && (
            <div className="mt-3 space-y-1.5 max-h-80 overflow-y-auto scrollbar-hide">
              {episodes.map((ep: any) => (
                <button
                  key={ep.slug}
                  onClick={() => navigate(`/s/donghua/watch/${ep.slug}`)}
                  className={`w-full flex items-center gap-2 p-2.5 font-mono text-[10px] font-bold border-2 border-black transition-all hover:bg-secondary hover:text-white text-left ${
                    ep.slug === slug ? 'bg-secondary text-white' : 'bg-surface text-text-secondary'
                  }`}
                >
                  <Play size={10} />
                  <span className="line-clamp-1">{ep.episode}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
