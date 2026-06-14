import { useMemo, useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { ChevronLeftIcon, HeartIcon, SparklesIcon, CheckIcon, TvIcon } from '../components/Icon';
import bannerS from '@/assets/image.jfif';
import qrisImage from '@/assets/qris.png'; // Import gambar QRIS dari asset lokal

const SAWERIA_URL = 'https://saweria.co/epandlabs';
// Hapus QRIS_PLACEHOLDER karena tidak diperlukan lagi

export function DonatePage() {
  const { back } = useRouter();
  const [copied, setCopied] = useState(false);

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(SAWERIA_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <div className="min-h-screen px-4 pt-20 pb-28">
      <div className="sticky top-0 z-20 bg-[var(--app-bg)]/80 backdrop-blur-md -mx-4 px-4 pt-[max(env(safe-area-inset-top),12px)] pb-3 mb-4 flex items-center gap-3">
        <button onClick={back} className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center">
          <ChevronLeftIcon size={18} />
        </button>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-[var(--muted)]">Support</div>
          <h1 className="text-xl font-extrabold tracking-tight">Donate</h1>
        </div>
      </div>

      <section className="relative overflow-hidden rounded-[30px] p-5 text-white bg-black animate-page-in">
        <div className="absolute inset-0 opacity-75">
          <img src={bannerS} />
        </div>
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] px-2.5 py-1 rounded-full bg-white/12 border border-white/10 mb-4">
            <HeartIcon size={13} /> SUPPORT THE PROJECT
          </div>
          <h2 className="text-3xl font-black leading-[1.02] tracking-tight">Help keep EpanDStream alive.</h2>
          <p className="mt-3 text-sm text-white/75 max-w-[22rem] leading-relaxed">
            Donasi membantu pengembangan fitur baru, perbaikan UI/UX, optimasi performa, dan pemeliharaan project ini agar terus berkembang.
          </p>
          <div className="grid grid-cols-2 gap-2 mt-5">
            <a href={SAWERIA_URL} target="_blank" rel="noreferrer" className="bg-white text-black rounded-2xl py-3 px-3 font-extrabold text-sm inline-flex items-center justify-center gap-2 shadow-xl">
              <SparklesIcon size={14} /> Open Saweria
            </a>
            <button onClick={copyUrl} className="rounded-2xl py-3 px-3 font-extrabold text-sm inline-flex items-center justify-center gap-2 bg-white/12 border border-white/10">
              {copied ? <CheckIcon size={14} /> : <TvIcon size={14} />} {copied ? 'Copied' : 'Copy URL'}
            </button>
          </div>
        </div>
      </section>

      <section className="mt-5 liquid-glass rounded-3xl p-4 animate-fade-in-up">
        <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-2">Saweria URL</div>
        <div className="text-sm font-extrabold break-all leading-relaxed">{SAWERIA_URL}</div>
      </section>

      <section className="mt-4 liquid-glass rounded-3xl p-4 animate-fade-in-up">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs uppercase tracking-widest text-[var(--muted)]">QRIS</div>
            <h3 className="text-lg font-extrabold tracking-tight mt-0.5">Scan to Donate</h3>
          </div>
          <div className="text-[10px] font-black px-2.5 py-1 rounded-full bg-[var(--accent)]/15 text-[var(--accent)]">QRIS</div>
        </div>

        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-56 h-56 rounded-[28px] bg-white p-4 shadow-2xl flex items-center justify-center">
            <img 
              src={qrisImage} 
              alt="QRIS Code" 
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-xs text-[var(--muted)] text-center leading-relaxed max-w-sm">
            Scan QR code di atas menggunakan aplikasi mobile banking atau e-wallet favorit Anda
          </p>
        </div>
      </section>

      <section className="mt-4 grid grid-cols-2 gap-2 animate-fade-in-up">
        <a href={SAWERIA_URL} target="_blank" rel="noreferrer" className="liquid-glass rounded-2xl p-4 text-left">
          <div className="text-[10px] uppercase tracking-widest text-[var(--muted)]">Direct</div>
          <div className="text-sm font-extrabold mt-1">Visit Saweria</div>
          <div className="text-[11px] text-[var(--muted)] mt-1">Buka halaman donasi resmi</div>
        </a>
        <button onClick={copyUrl} className="liquid-glass rounded-2xl p-4 text-left">
          <div className="text-[10px] uppercase tracking-widest text-[var(--muted)]">Quick</div>
          <div className="text-sm font-extrabold mt-1">Copy Donation Link</div>
          <div className="text-[11px] text-[var(--muted)] mt-1">Bagikan atau simpan tautan</div>
        </button>
      </section>
    </div>
  );
}