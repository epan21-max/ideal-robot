export interface FavoriteItem {
  id: string;
  title: string;
  poster: string;
  type: 'anime' | 'donghua' | 'comic' | 'novel' | 'drachin';
  slug: string;
  addedAt: number;
}

const STORAGE_KEY = 'epandstream_favorites';

export function getFavorites(): FavoriteItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addFavorite(item: FavoriteItem) {
  const favs = getFavorites();
  if (!favs.find(f => f.id === item.id)) {
    favs.push({ ...item, addedAt: Date.now() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
  }
}

export function removeFavorite(id: string) {
  const favs = getFavorites().filter(f => f.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
}

export function isFavorite(id: string): boolean {
  return getFavorites().some(f => f.id === id);
}

export function toggleFavorite(item: FavoriteItem): boolean {
  if (isFavorite(item.id)) {
    removeFavorite(item.id);
    return false;
  } else {
    addFavorite(item);
    return true;
  }
}
