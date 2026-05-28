import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, CheckCircle, Zap, Bug, Star, Sparkles } from 'lucide-react';

interface UpdateEntry {
  version: string;
  date: string;
  type: 'major' | 'minor' | 'patch';
  changes: { icon: any; text: string; tag?: string }[];
}

const updates: UpdateEntry[] = [
  {
    version: '2.3.6',
    date: '29 Mei 2026',
    type: 'minor',
    changes: [
      { icon: Sparkles, text: 'Tambah halaman Drachin (Mini Drama) dengan streaming video', tag: 'NEW' },
      { icon: Sparkles, text: 'Tambah fitur Favorite untuk Comic, Novel, dan Drachin', tag: 'NEW' },
      { icon: Sparkles, text: 'Tambah halaman About dengan info kontak & donasi', tag: 'NEW' },
      { icon: Sparkles, text: 'Tambah halaman Updates / Informasi', tag: 'NEW' },
      { icon: Zap, text: 'Anti-DevTools protection untuk keamanan website' },
      { icon: Bug, text: 'Fix render HTML tag mentah di konten novel & synopsis' },
      { icon: CheckCircle, text: 'Fix fullscreen button di Comic Reader' },
      { icon: CheckCircle, text: 'Fix bottom navigation tertimpa di Comic Reader' },
    ],
  },
  {
    version: '2.2.0',
    date: '28 Mei 2026',
    type: 'minor',
    changes: [
      { icon: Sparkles, text: 'Tambah halaman Comic dengan fitur Read Chapter', tag: 'NEW' },
      { icon: Sparkles, text: 'Tambah halaman Novel dengan fitur Read Chapter', tag: 'NEW' },
      { icon: Sparkles, text: 'Tambah fitur Genre untuk Comic dan Novel', tag: 'NEW' },
      { icon: Zap, text: 'Update hero banner dengan konten dari semua kategori' },
      { icon: CheckCircle, text: 'Improve mobile bottom navigation' },
    ],
  },
  {
    version: '2.0.0',
    date: '27 Mei 2026',
    type: 'major',
    changes: [
      { icon: Star, text: 'Rilis pertama EpanDStream', tag: 'LAUNCH' },
      { icon: Sparkles, text: 'Halaman Anime: Home, Schedule, Detail, Watch, Search', tag: 'NEW' },
      { icon: Sparkles, text: 'Halaman Donghua: Home, Schedule, Detail, Watch, Search', tag: 'NEW' },
      { icon: Sparkles, text: 'Halaman Favorite dengan localStorage', tag: 'NEW' },
      { icon: Zap, text: 'Neo Brutalism design dengan typography theme' },
      { icon: CheckCircle, text: 'Mobile-first responsive design' },
    ],
  },
];

export default function UpdatesPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-3 pb-20 md:pb-4">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-text-secondary hover:text-primary font-mono text-xs mb-4 transition-colors">
        <ArrowLeft size={14} /> Home
      </button>

      <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
        <Bell size={22} className="text-primary" />
        Update & <span className="text-primary">Informasi</span>
      </h1>
      <p className="font-mono text-xs text-text-secondary mb-6">
        Changelog dan informasi terbaru dari EpanDStream
      </p>

      {/* Current Version Banner */}
      <div className="neo-card p-5 mb-6 border-l-4 border-l-primary">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-base">Versi Saat Ini</p>
              <p className="font-mono text-xs text-text-secondary">EpanDStream</p>
            </div>
          </div>
          <span className="neo-tag bg-primary text-white text-sm">v2.3.6</span>
        </div>
        <p className="font-mono text-[10px] text-text-secondary">
          Terakhir diperbarui: 29 Mei 2026
        </p>
      </div>

      {/* Update Timeline */}
      <div className="space-y-6">
        {updates.map((update, idx) => (
          <div key={update.version} className="neo-card overflow-hidden">
            {/* Version Header */}
            <div className={`p-4 border-b-2 border-black ${
              idx === 0 ? 'bg-primary/10' : 'bg-surface'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`neo-tag ${
                    update.type === 'major' ? 'bg-danger text-white' :
                    update.type === 'minor' ? 'bg-primary text-white' :
                    'bg-surface-light text-text-secondary'
                  }`}>
                    v{update.version}
                  </span>
                  {idx === 0 && (
                    <span className="neo-tag bg-success text-black">LATEST</span>
                  )}
                </div>
                <span className="font-mono text-[10px] text-text-secondary">{update.date}</span>
              </div>
            </div>
            {/* Changes */}
            <div className="p-4 space-y-2">
              {update.changes.map((change, ci) => (
                <div key={ci} className="flex items-start gap-2.5 bg-darker border-2 border-black p-2.5 shadow-[2px_2px_0px_#000]">
                  <change.icon size={14} className="text-primary flex-shrink-0 mt-0.5" />
                  <p className="font-mono text-[11px] text-text-secondary leading-relaxed flex-1">
                    {change.text}
                  </p>
                  {change.tag && (
                    <span className={`neo-tag flex-shrink-0 text-[8px] ${
                      change.tag === 'NEW' ? 'bg-success text-black' :
                      change.tag === 'LAUNCH' ? 'bg-primary text-white' :
                      'bg-surface-light text-text-secondary'
                    }`}>
                      {change.tag}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
