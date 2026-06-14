import { useEffect, useState } from 'react';
import { donghuaApi } from '../lib/donghua';
import { useRouter } from '../context/RouterContext';
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon, ChevronDownIcon, TvIcon, DownloadIcon, ShareIcon, CheckIcon } from '../components/Icon';

export function DonghuaEpisodePage({ slug }: { slug: string }) {
  const { back, navigate } = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [streamUrl, setStreamUrl] = useState('');
  const [activeServer, setActiveServer] = useState('');
  const [openServers, setOpenServers] = useState(true);
  const [openDownloads, setOpenDownloads] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    let m = true;
    (async () => {
      setLoading(true);
      try {
        const d = await donghuaApi.episode(slug);
        if (!m) return;
        setData(d);
        const url = d?.streaming?.main_url?.url || d?.streaming?.servers?.[0]?.url || '';
        setStreamUrl(url);
        setActiveServer(d?.streaming?.main_url?.name || 'default');
      } catch (e) { console.error(e); }
      finally { if (m) setLoading(false); }
    })();
    window.scrollTo({ top: 0, behavior: 'instant' as any });
    return () => { m = false; };
  }, [slug]);

  if (loading) {
    return (
      <div className="px-4 pt-20">
        <div className="aspect-video rounded-2xl skeleton mb-4" />
        <div className="h-6 skeleton rounded w-2/3 mb-2" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="px-4 pt-20 text-center text-[var(--muted)]">
        <p>Failed to load episode.</p>
        <button onClick={back} className="mt-4 text-[var(--accent)]">Go back</button>
      </div>
    );
  }

  const title = data.episode || 'Episode';
  const details = data.donghua_details || {};
  const animeSlug = details.slug || '';
  const servers: any[] = data.streaming?.servers || [];
  const downloads = data.download_url || {};
  const nav = data.navigation || {};
  const prevSlug = nav.previous_episode?.slug;
  const nextSlug = nav.next_episode?.slug;

  const downloadKeys = Object.keys(downloads).filter(k => k.startsWith('download_url'));

  return (
    <div className="pb-32">
      {/* Top bar */}
      <div className="sticky z-30 px-4 pb-2 liquid-glass-strong" style={{ top: 0, paddingTop: 'max(env(safe-area-inset-top), 12px)' }}>
        <div className="flex items-center gap-3">
          <button onClick={back} className="w-10 h-10 rounded-full bg-[var(--surface)] flex items-center justify-center shrink-0"><ChevronLeftIcon size={18} /></button>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-widest text-[var(--muted)]">Now Playing</div>
            <div className="text-sm font-bold truncate">{title}</div>
          </div>
        </div>
      </div>

      {/* Player */}
      <div className="px-3 mt-3 animate-fade-in">
        <div className="aspect-video rounded-2xl overflow-hidden bg-black relative shadow-2xl">
          {streamUrl ? (
            <iframe key={streamUrl} src={streamUrl} className="w-full h-full" allowFullScreen allow="autoplay; encrypted-media; picture-in-picture; fullscreen" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/60 gap-2">
              <PlayIcon size={28} />
              <div className="text-xs">Stream not available</div>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 mt-4 animate-fade-in-up">
        <h1 className="text-xl font-extrabold tracking-tight leading-snug">{title}</h1>
        <div className="mt-2 flex items-center justify-between gap-2">
          {animeSlug ? (
            <button onClick={() => navigate({ name: 'donghua-detail', slug: animeSlug })} className="text-sm text-[var(--accent)] font-semibold">View all episodes →</button>
          ) : <span />}
          <button
            onClick={async () => {
              const shareUrl = window.location.href;
              const payload = { title, text: `Watch ${title} on EpanDStream`, url: shareUrl };
              try {
                if (navigator.share) await navigator.share(payload);
                else await navigator.clipboard.writeText(`${payload.text}\n${payload.url}`);
                setShared(true);
                setTimeout(() => setShared(false), 1600);
              } catch {}
            }}
            className="liquid-glass rounded-full px-3 py-2 text-xs font-bold inline-flex items-center gap-1.5 shrink-0"
          >
            {shared ? <CheckIcon size={13} /> : <ShareIcon size={13} />}
            {shared ? 'Shared' : 'Share'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <button disabled={!prevSlug} onClick={() => prevSlug && navigate({ name: 'donghua-episode', slug: prevSlug })} className="liquid-glass rounded-2xl py-3 px-3 inline-flex items-center justify-center gap-1.5 text-sm font-semibold disabled:opacity-40">
            <ChevronLeftIcon size={14} /> Previous
          </button>
          <button disabled={!nextSlug} onClick={() => nextSlug && navigate({ name: 'donghua-episode', slug: nextSlug })} className="liquid-glass rounded-2xl py-3 px-3 inline-flex items-center justify-center gap-1.5 text-sm font-semibold disabled:opacity-40">
            Next <ChevronRightIcon size={14} />
          </button>
        </div>

        {/* 2-column Dropdown Menu Layout for Quality & Server and Downloads */}
        <div className="grid grid-cols-2 gap-2 mt-6 items-start">
          {/* Column 1: Quality & Server Dropdown */}
          <div className="col-span-1">
            <div className="liquid-glass rounded-2xl overflow-hidden shadow-xl border border-black/5 dark:border-white/5 transition-all duration-300">
              <button
                onClick={() => setOpenServers(prev => !prev)}
                className="w-full p-2.5 flex items-center justify-between text-left font-bold hover:bg-white/5 active:bg-white/10 transition group"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="w-7 h-7 rounded-xl bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <TvIcon size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-black tracking-tight truncate">Servers</div>
                    <div className="text-[9px] text-[var(--muted)]">{servers.length || 0} Options</div>
                  </div>
                </div>
                <ChevronDownIcon size={14} className={`text-[var(--muted)] transition-transform duration-300 shrink-0 ml-1 ${openServers ? 'rotate-180' : ''}`} />
              </button>

              {openServers && servers.length > 0 && (
                <div className="p-2.5 pt-1 border-t border-black/5 dark:border-white/5 space-y-2 animate-slide-up bg-black/5 dark:bg-white/5">
                  <div className="text-[10px] font-black text-[var(--accent)] uppercase tracking-wider mb-1">
                    Streaming
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {servers.map((s: any, si: number) => {
                      const isActive = activeServer === s.name;
                      return (
                        <button
                          key={si}
                          onClick={() => { setStreamUrl(s.url); setActiveServer(s.name); }}
                          className={`text-[10px] font-bold px-2 py-1 rounded-xl transition-all ${isActive ? 'bg-[var(--accent)] text-white shadow-md scale-105' : 'bg-[var(--app-bg)] text-[var(--app-fg)] hover:scale-105 border border-black/10 dark:border-white/10'}`}
                        >
                          {s.name.trim()}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Downloads Dropdown */}
          <div className="col-span-1">
            <div className="liquid-glass rounded-2xl overflow-hidden shadow-xl border border-black/5 dark:border-white/5 transition-all duration-300">
              <button
                onClick={() => setOpenDownloads(prev => !prev)}
                className="w-full p-2.5 flex items-center justify-between text-left font-bold hover:bg-white/5 active:bg-white/10 transition group"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <DownloadIcon size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-black tracking-tight truncate">Downloads</div>
                    <div className="text-[9px] text-[var(--muted)]">{downloadKeys.length || 0} Formats</div>
                  </div>
                </div>
                <ChevronDownIcon size={14} className={`text-[var(--muted)] transition-transform duration-300 shrink-0 ml-1 ${openDownloads ? 'rotate-180' : ''}`} />
              </button>

              {openDownloads && downloadKeys.length > 0 && (
                <div className="p-2.5 pt-1 border-t border-black/5 dark:border-white/5 space-y-2.5 animate-slide-up bg-black/5 dark:bg-white/5">
                  {downloadKeys.map((key, i) => {
                    const urls = downloads[key] || {};
                    const quality = key.replace('download_url_', '').toUpperCase();
                    return (
                      <div key={i} className="space-y-1">
                        <div className="text-[10px] font-black text-emerald-500 uppercase tracking-wider">
                          {quality}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(urls).map(([provider, url]) => (
                            <a
                              key={provider}
                              href={url as string}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] font-bold px-2 py-1 rounded-xl bg-[var(--app-bg)] text-[var(--app-fg)] hover:scale-105 transition border border-black/10 dark:border-white/10 shadow-sm"
                            >
                              {provider}
                            </a>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
