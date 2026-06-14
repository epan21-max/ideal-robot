const BASE = 'https://www.sankavollerei.web.id/anime';

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  const json = await res.json();
  return json as T;
}

export const donghuaApi = {
  ongoing: (page = 1) => request<any>(`/donghua/ongoing/${page}`),
  completed: (page = 1) => request<any>(`/donghua/completed/${page}`),
  schedule: () => request<any>('/donghua/schedule'),
  detail: (slug: string) => request<any>(`/donghua/detail/${slug}`),
  episode: (slug: string) => request<any>(`/donghua/episode/${slug}`),
  search: (q: string) => request<any>(`/donghua/search/${encodeURIComponent(q)}`),
  genres: () => request<any>('/donghua/genres'),
  genreDetail: (slug: string, page = 1) => request<any>(`/donghua/genres/${slug}/${page}`),
};

export type DonghuaItem = {
  title?: string;
  poster?: string;
  slug?: string;
  status?: string;
  rating?: string;
  type?: string;
  studio?: string;
  released?: string;
  episodes_count?: string;
  genres?: any[];
  synopsis?: string;
  href?: string;
  season?: string;
  country?: string;
};

export function normalizeDonghua(raw: any): DonghuaItem {
  if (!raw || typeof raw !== 'object') return {};
  const slug =
    raw.slug?.replace(/\/$/, '') ||
    raw.animeId ||
    (typeof raw.href === 'string' ? extractSlug(raw.href) : '') ||
    '';
  return {
    title: raw.title || 'Untitled',
    poster: raw.poster || raw.thumbnail || '',
    slug,
    status: raw.status || '',
    rating: raw.rating || raw.score || '',
    type: raw.type || 'Donghua',
    studio: raw.studio || '',
    released: raw.released || raw.released_on || '',
    episodes_count: raw.episodes_count || '',
    genres: raw.genres || raw.genreList || [],
    synopsis: raw.synopsis || '',
    href: raw.href || '',
    season: raw.season || '',
    country: raw.country || 'China',
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
