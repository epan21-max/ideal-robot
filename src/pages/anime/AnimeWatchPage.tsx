import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAnimeEpisode, getAnimeServer } from '../../lib/api';
import Loader from '../../components/Loader';
import { ArrowLeft, ChevronLeft, ChevronRight, Play, Monitor, Download, List, ChevronDown, ChevronUp, Server } from 'lucide-react';

export default function AnimeWatchPage() {
  const { episodeId } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [streamUrl, setStreamUrl] = useState('');
  const [activeServer, setActiveServer] = useState('');
  const [showEpList, setShowEpList] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!episodeId) return;
    setLoading(true);
    getAnimeEpisode(episodeId).then(res => {
      setData(res.data);
      if (res.data?.defaultStreamingUrl) {
        setStreamUrl(res.data.defaultStreamingUrl);
        setActiveServer('default');
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [episodeId]);

  const handleServerClick = async (serverId: string, serverTitle: string) => {
    try {
      const res = await getAnimeServer(serverId);
      if (res.data?.url) {
        setStreamUrl(res.data.url);
        setActiveServer(serverTitle);
      }
    } catch { /* ignore */ }
  };

  if (loading) return <Loader />;
  if (!data) return <div className="text-center py-20 font-mono text-text-secondary">Episode tidak ditemukan</div>;

  const qualities = data.server?.qualities || [];
  const downloads = data.downloadUrl?.qualities || [];
  const epList = data.info?.episodeList || [];

  return (
    <div className="max-w-4xl mx-auto px-3 pb-20 md:pb-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-secondary hover:text-primary font-mono text-xs mb-3 transition-colors">
        <ArrowLeft size={14} /> Kembali
      </button>

      <h1 className="font-bold text-base sm:text-lg mb-3 line-clamp-2">{data.title}</h1>

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
        {data.hasPrevEpisode && data.prevEpisode && (
          <button
            onClick={() => navigate(`/s/anime/watch/${data.prevEpisode.episodeId}`)}
            className="neo-brutal bg-surface flex-1 py-2.5 font-mono text-xs font-bold flex items-center justify-center gap-1"
          >
            <ChevronLeft size={14} /> Prev
          </button>
        )}
        {data.animeId && (
          <button
            onClick={() => navigate(`/s/anime/detail/${data.animeId}`)}
            className="neo-brutal bg-primary text-white flex-1 py-2.5 font-mono text-xs font-bold flex items-center justify-center gap-1"
          >
            <List size={14} /> Detail
          </button>
        )}
        {data.hasNextEpisode && data.nextEpisode && (
          <button
            onClick={() => navigate(`/s/anime/watch/${data.nextEpisode.episodeId}`)}
            className="neo-brutal bg-surface flex-1 py-2.5 font-mono text-xs font-bold flex items-center justify-center gap-1"
          >
            Next <ChevronRight size={14} />
          </button>
        )}
      </div>

      {/* Server Selection */}
      <div className="neo-card p-4 mb-3">
        <h2 className="font-bold text-sm mb-3 flex items-center gap-2">
          <Server size={14} className="text-primary" /> Server Streaming
        </h2>
        {qualities.map((q: any) => (
          q.serverList?.length > 0 && (
            <div key={q.title} className="mb-3">
              <p className="font-mono text-[10px] text-accent uppercase font-bold mb-2 flex items-center gap-1">
                <Monitor size={10} /> {q.title}
              </p>
              <div className="flex flex-wrap gap-2">
                {q.serverList.map((s: any) => (
                  <button
                    key={s.serverId}
                    onClick={() => handleServerClick(s.serverId, s.title)}
                    className={`px-3 py-1.5 font-mono text-[10px] font-bold uppercase border-2 border-black shadow-[2px_2px_0px_#000] transition-all hover:shadow-[3px_3px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] ${
                      activeServer === s.title ? 'bg-primary text-white' : 'bg-surface text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            </div>
          )
        ))}
      </div>

      {/* Info */}
      {data.info && (
        <div className="neo-card p-4 mb-3">
          <div className="flex flex-wrap gap-2">
            {data.info.duration && <span className="neo-tag bg-surface-light text-text-secondary">{data.info.duration}</span>}
            {data.info.type && <span className="neo-tag bg-secondary text-white">{data.info.type}</span>}
            {data.info.genreList?.map((g: any) => (
              <span key={g.genreId} className="neo-tag bg-surface-light text-text-secondary">{g.title}</span>
            ))}
          </div>
          {data.releaseTime && <p className="font-mono text-[10px] text-text-secondary mt-2">{data.releaseTime}</p>}
        </div>
      )}

      {/* Download */}
      {downloads.length > 0 && (
        <div className="neo-card p-4 mb-3">
          <button onClick={() => setShowDownload(!showDownload)} className="w-full flex items-center justify-between">
            <h2 className="font-bold text-sm flex items-center gap-2">
              <Download size={14} className="text-accent" /> Download
            </h2>
            {showDownload ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {showDownload && (
            <div className="mt-3 space-y-3">
              {downloads.map((d: any) => (
                <div key={d.title}>
                  <p className="font-mono text-[10px] text-accent uppercase font-bold mb-1.5">
                    {d.title} {d.size && `(${d.size})`}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {d.urls?.map((u: any) => (
                      <a
                        key={u.title}
                        href={u.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="neo-tag bg-surface-light text-text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer"
                      >
                        {u.title}
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
      {epList.length > 0 && (
        <div className="neo-card p-4">
          <button onClick={() => setShowEpList(!showEpList)} className="w-full flex items-center justify-between">
            <h2 className="font-bold text-sm flex items-center gap-2">
              <Play size={14} className="text-primary" /> Episode Lainnya ({epList.length})
            </h2>
            {showEpList ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {showEpList && (
            <div className="mt-3 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1.5">
              {epList.map((ep: any) => (
                <button
                  key={ep.episodeId}
                  onClick={() => navigate(`/s/anime/watch/${ep.episodeId}`)}
                  className={`py-2 font-mono text-[10px] font-bold border-2 border-black shadow-[2px_2px_0px_#000] transition-all hover:bg-primary hover:text-white ${
                    ep.episodeId === episodeId ? 'bg-primary text-white' : 'bg-surface text-text-secondary'
                  }`}
                >
                  {ep.eps}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
