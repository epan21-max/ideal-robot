const BASE = 'https://www.sankavollerei.com/anime';

async function fetchJSON(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ===== ANIME =====
export async function getAnimeHome() {
  return fetchJSON(`${BASE}/home`);
}

export async function getAnimeSchedule() {
  return fetchJSON(`${BASE}/schedule`);
}

export async function getAnimeDetail(slug: string) {
  return fetchJSON(`${BASE}/anime/${slug}`);
}

export async function searchAnime(query: string) {
  return fetchJSON(`${BASE}/search/${encodeURIComponent(query)}`);
}

export async function getAnimeUnlimited(page = 1) {
  return fetchJSON(`${BASE}/unlimited?page=${page}`);
}

export async function getAnimeEpisode(episodeId: string) {
  return fetchJSON(`${BASE}/episode/${episodeId}`);
}

export async function getAnimeServer(serverId: string) {
  return fetchJSON(`${BASE}/server/${serverId}`);
}

// ===== DONGHUA =====
export async function getDonghuaHome(page = 1) {
  return fetchJSON(`${BASE}/donghua/home/${page}`);
}

export async function getDonghuaSchedule() {
  return fetchJSON(`${BASE}/donghua/schedule`);
}

export async function searchDonghua(query: string) {
  return fetchJSON(`${BASE}/donghua/search/${encodeURIComponent(query)}`);
}

export async function getDonghuaGenres() {
  return fetchJSON(`${BASE}/donghua/genres`);
}

export async function getDonghuaEpisode(slug: string) {
  return fetchJSON(`${BASE}/donghua/episode/${slug}`);
}

export async function getDonghuaDetail(slug: string) {
  return fetchJSON(`${BASE}/donghua/detail/${slug}`);
}

// ===== COMIC =====
const COMIC_BASE = 'https://www.sankavollerei.com/comic';

export async function getComicHome(page = 1) {
  return fetchJSON(`${COMIC_BASE}/terbaru${page > 1 ? `?page=${page}` : ''}`);
}

export async function getComicDetail(slug: string) {
  return fetchJSON(`${COMIC_BASE}/comic/${slug}`);
}

export async function getComicGenres() {
  return fetchJSON(`${COMIC_BASE}/genres`);
}

export async function searchComic(query: string) {
  return fetchJSON(`${COMIC_BASE}/search?q=${encodeURIComponent(query)}`);
}

export async function getComicChapter(chapterSlug: string) {
  return fetchJSON(`${COMIC_BASE}/chapter/${chapterSlug}`);
}

export async function getComicByGenre(genre: string, page = 1) {
  return fetchJSON(`${COMIC_BASE}/genre/${genre}${page > 1 ? `?page=${page}` : ''}`);
}

// ===== NOVEL =====
const NOVEL_BASE = 'https://www.sankavollerei.com/novel/sakuranovel';

export async function getNovelHome(page = 1) {
  return fetchJSON(`${NOVEL_BASE}/home?page=${page}`);
}

export async function getNovelGenres() {
  return fetchJSON(`${NOVEL_BASE}/genres`);
}

export async function searchNovel(query: string) {
  return fetchJSON(`${NOVEL_BASE}/search?q=${encodeURIComponent(query)}`);
}

export async function getNovelDetail(slug: string) {
  return fetchJSON(`${NOVEL_BASE}/detail/${slug}`);
}

export async function getNovelRead(chapterSlug: string) {
  return fetchJSON(`${NOVEL_BASE}/read/${chapterSlug}`);
}

// ===== DRACHIN =====
const DRACHIN_BASE = 'https://api.sansekai.my.id/api/pinedrama';

export async function getDrachinHome() {
  return fetchJSON(`${DRACHIN_BASE}/foryou`);
}

export async function getDrachinTrending() {
  return fetchJSON(`${DRACHIN_BASE}/trending`);
}

export async function searchDrachin(query: string) {
  return fetchJSON(`${DRACHIN_BASE}/search?query=${encodeURIComponent(query)}`);
}

export async function getDrachinDetail(collectionId: string) {
  return fetchJSON(`${DRACHIN_BASE}/detail?collection_id=${collectionId}`);
}

export async function getDrachinEpisode(collectionId: string, episodeNumber: number) {
  return fetchJSON(`${DRACHIN_BASE}/episode?collection_id=${collectionId}&episodeNumber=${episodeNumber}`);
}
