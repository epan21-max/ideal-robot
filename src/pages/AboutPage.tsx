import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Code, Layers, Zap, Globe, Mail,
  MessageCircle, Heart, ExternalLink, Coffee,
  Tv, Film, BookOpen, Feather, Shield, Clapperboard, Phone
} from 'lucide-react';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-3 pb-20 md:pb-4">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-text-secondary hover:text-primary font-mono text-xs mb-4 transition-colors">
        <ArrowLeft size={14} /> Home
      </button>

      {/* Header */}
      <div className="neo-card p-6 sm:p-8 text-center mb-6">
        <div className="w-16 h-16 bg-primary border-3 border-black shadow-[4px_4px_0px_#000] flex items-center justify-center mx-auto mb-4">
          <img src="https://pchs5.krakencloud.net/uploads/27-05-2026/upMEFpcd6i/image.png" alt="EpanDStream" />
        </div>
        <h1 className="text-3xl font-bold mb-1">
          Epan<span className="text-primary">D</span>Stream
        </h1>
        <p className="font-mono text-xs text-text-secondary">Streaming Anime, Donghua, Comic, Novel & Drachin</p>
        <div className="flex justify-center gap-2 mt-3">
          <span className="neo-tag bg-primary text-white">v2.3.6</span>
        </div>
      </div>

      {/* About */}
      <div className="neo-card p-5 mb-4">
        <h2 className="font-bold text-base mb-3 flex items-center gap-2">
          <Code size={16} className="text-primary" /> Tentang Website
        </h2>
        <p className="font-mono text-xs text-text-secondary leading-relaxed mb-4">
          EpanDStream adalah platform streaming dan baca konten Jepang & Asia secara gratis dengan subtitle Indonesia.
          Website ini dibangun untuk tujuan edukasi dan non-komersial.
          Semua konten bersumber dari API pihak ketiga dan hak cipta sepenuhnya milik pemilik asli.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {[
            { icon: Tv, label: 'Anime', desc: 'Sub Indo', color: 'text-primary' },
            { icon: Film, label: 'Donghua', desc: 'Chinese Anime', color: 'text-secondary' },
            { icon: BookOpen, label: 'Comic', desc: 'Manga/Manhwa', color: 'text-purple' },
            { icon: Feather, label: 'Novel', desc: 'Light Novel', color: 'text-accent' },
            { icon: Clapperboard, label: 'Drachin', desc: 'Mini Drama', color: 'text-danger' },
          ].map(item => (
            <div key={item.label} className="bg-darker border-2 border-black p-3 shadow-[2px_2px_0px_#000] text-center">
              <item.icon size={20} className={`${item.color} mx-auto mb-1`} />
              <p className="font-bold text-xs">{item.label}</p>
              <p className="font-mono text-[9px] text-text-secondary">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack & Info */}
      <div className="neo-card p-5 mb-4">
        <h2 className="font-bold text-base mb-3 flex items-center gap-2">
          <Layers size={16} className="text-secondary" /> Tech Stack & Info
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: Code, label: 'Developer', value: 'EpanD', color: 'text-primary' },
            { icon: Layers, label: 'Frontend', value: 'React + TypeScript', color: 'text-secondary' },
            { icon: Zap, label: 'Build Tool', value: 'Vite', color: 'text-accent' },
            { icon: Globe, label: 'Styling', value: 'Tailwind CSS v4', color: 'text-purple' },
            { icon: Shield, label: 'Design', value: 'Neo Brutalism', color: 'text-danger' },
            { icon: Zap, label: 'Version', value: 'v2.3.6', color: 'text-success' },
          ].map(info => (
            <div key={`${info.label}-${info.value}`} className="flex items-center gap-3 bg-darker border-2 border-black p-3 shadow-[2px_2px_0px_#000]">
              <info.icon size={16} className={info.color} />
              <div>
                <p className="font-mono text-[9px] text-text-secondary uppercase">{info.label}</p>
                <p className="font-bold text-xs">{info.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="neo-card p-5 mb-4">
        <h2 className="font-bold text-base mb-3 flex items-center gap-2">
          <MessageCircle size={16} className="text-success" /> Kontak
        </h2>
        <p className="font-mono text-xs text-text-secondary leading-relaxed mb-4">
          Punya pertanyaan, saran, atau menemukan bug? Jangan ragu untuk menghubungi kami melalui kontak di bawah ini.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: Mail, label: 'Email', value: 'deandri.epan21@smp.belajar.id', href: 'mailto:deandri.epan21@smp.belajar.id', color: 'bg-primary' },
            { icon: Phone, label: 'Channel WhatsApp', value: 'EpannXD Channel', href: 'https://whatsapp.com/channel/0029VbBwmFJKQuJK7xC9ga25', color: 'bg-success' },
            { icon: MessageCircle, label: 'Channel WhatsApp', value: './LiaaXD Channel', href: 'https://whatsapp.com/channel/0029Vb8EBxbChq6DHotp8I00', color: 'bg-success' },
            { icon: Globe, label: 'Website', value: 'www.epandstream.biz.id', href: 'https://www.epandstream.biz.id', color: 'bg-purple' },
          ].map(item => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 ${item.color} border-2 border-black p-3 shadow-[3px_3px_0px_#000] hover:shadow-[4px_4px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all group`}
            >
              <div className="w-9 h-9 bg-dark/30 border-2 border-black flex items-center justify-center flex-shrink-0">
                <item.icon size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[9px] text-white/60 uppercase">{item.label}</p>
                <p className="font-bold text-xs">{item.value}</p>
              </div>
              <ExternalLink size={12} className="text-white/40 group-hover:text-white transition-colors flex-shrink-0" />
            </a>
          ))}
        </div>
      </div>

      {/* Donate */}
      <div className="neo-card p-5 mb-4 border-l-4 border-l-danger">
        <h2 className="font-bold text-base mb-2 flex items-center gap-2">
          <Heart size={16} className="text-danger" /> Dukung Kami
        </h2>
        <p className="font-mono text-xs text-text-secondary leading-relaxed mb-4">
          Jika kamu menikmati EpanDStream dan ingin mendukung pengembangan website ini,
          kamu bisa berdonasi melalui platform di bawah ini.
          Setiap dukungan sangat berarti bagi kami!
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Saweria */}
          <a
            href="https://saweria.co/epandlabs"
            target="_blank"
            rel="noopener noreferrer"
            className="neo-brutal bg-[#F59E0B] text-black p-4 flex items-center gap-4 group"
          >
            <div className="w-12 h-12 bg-white/20 border-2 border-black flex items-center justify-center flex-shrink-0">
              <Coffee size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-lg">Saweria</p>
              <p className="font-mono text-[10px] text-black/60 uppercase">saweria.co/epandlabs</p>
            </div>
            <ExternalLink size={16} className="text-black/40 group-hover:text-black transition-colors flex-shrink-0" />
          </a>

          {/* Trakteer */}
          <a
            href="https://trakteer.id/epandlabs"
            target="_blank"
            rel="noopener noreferrer"
            className="neo-brutal bg-[#BE1E2D] text-white p-4 flex items-center gap-4 group"
          >
            <div className="w-12 h-12 bg-white/20 border-2 border-black flex items-center justify-center flex-shrink-0">
              <Heart size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-lg">Trakteer</p>
              <p className="font-mono text-[10px] text-white/60 uppercase">trakteer.id/epandlabs</p>
            </div>
            <ExternalLink size={16} className="text-white/40 group-hover:text-white transition-colors flex-shrink-0" />
          </a>
        </div>

        <div className="mt-4 p-3 bg-danger/10 border-2 border-danger/30">
          <p className="font-mono text-[10px] text-text-secondary leading-relaxed flex items-start gap-2">
            <Heart size={12} className="text-danger flex-shrink-0 mt-0.5" />
            Donasi bersifat sukarela dan tidak mempengaruhi akses ke konten. Semua fitur tetap gratis untuk semua pengguna.
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="neo-card p-5">
        <h2 className="font-bold text-base mb-3 flex items-center gap-2">
          <Shield size={16} className="text-text-secondary" /> Disclaimer
        </h2>
        <div className="space-y-2">
          {[
            'Website ini tidak menyimpan file atau konten apapun di server sendiri.',
            'Semua konten bersumber dari API pihak ketiga yang tersedia secara publik.',
            'Hak cipta seluruh konten anime, donghua, komik, novel, dan drama sepenuhnya milik pemilik dan penerbit asli.',
            'Website ini dibuat untuk tujuan edukasi dan pembelajaran dalam pengembangan web.',
            'Jika Anda adalah pemilik konten dan keberatan, silakan hubungi kami untuk penghapusan.',
          ].map((text, i) => (
            <div key={i} className="flex items-start gap-2 bg-darker border-2 border-black p-2.5 shadow-[2px_2px_0px_#000]">
              <span className="font-mono text-[10px] text-primary font-bold mt-0.5">{String(i + 1).padStart(2, '0')}</span>
              <p className="font-mono text-[10px] text-text-secondary leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
