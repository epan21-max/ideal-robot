const BASE = 'https://www.sankavollerei.web.id/anime';

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  const json = await res.json();
  return (json?.data ?? json) as T;
}

export const api = {
  home: () => request<any>('/home'),
  schedule: () => request<any>('/schedule'),
  detail: (slug: string) => request<any>(`/anime/${slug}`),
  ongoing: (page = 1) => request<any>(`/ongoing-anime?page=${page}`),
  complete: (page = 1) => request<any>(`/complete-anime?page=${page}`),
  genre: () => request<any>('/genre'),
  genreDetail: (slug: string, page = 1) => request<any>(`/genre/${slug}?page=${page}`),
  search: (q: string) => request<any>(`/search/${encodeURIComponent(q)}`),
  episode: (slug: string) => request<any>(`/episode/${slug}`),
  unlimited: () => request<any>('/unlimited'),
};

export type AnimeItem = {
  title?: string;
  thumbnail?: string;
  poster?: string;
  slug?: string;
  rating?: string | number;
  episode?: string | number;
  type?: string;
  status?: string;
  release_day?: string;
  newest_release_date?: string;
  genres?: any[];
  href?: string;
};

export function normalizeAnime(raw: any): AnimeItem {
  if (!raw || typeof raw !== 'object') return {};
  const slug =
    raw.animeId ||
    raw.slug ||
    raw.anime_slug ||
    raw.endpoint ||
    (typeof raw.href === 'string' ? extractSlug(raw.href) : '') ||
    (typeof raw.url === 'string' ? extractSlug(raw.url) : '') ||
    '';
  return {
    title: raw.title || raw.judul || raw.name || 'Untitled',
    thumbnail: raw.thumbnail || raw.poster || raw.image || raw.thumb || raw.cover || '',
    poster: raw.poster || raw.thumbnail || raw.image || raw.cover || '',
    slug,
    rating: raw.score || raw.rating || raw.skor || '',
    episode: raw.episodes ?? raw.episode ?? raw.current_episode ?? raw.episode_count ?? '',
    type: raw.type || raw.tipe || '',
    status: raw.status || '',
    release_day: raw.releaseDay || raw.release_day || raw.day || '',
    newest_release_date: raw.latestReleaseDate || raw.newest_release_date || raw.release_date || raw.updated_on || '',
    genres: raw.genres || raw.genre || [],
    href: raw.href || '',
  };
}

function extractSlug(url: string) {
  try {
    const cleaned = url.replace(/\/$/, '');
    const parts = cleaned.split('/').filter(Boolean);
    return parts[parts.length - 1] || '';
  } catch {
    return '';
  }
}
