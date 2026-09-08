import { useState } from 'react';
export interface UseFavoritesResult { favoriteIds: Set<string>; toggleFavorite: (id: string) => void; isFavorite: (id: string) => boolean }
const key = 'jisr-customer-favorites';
export function useFavorites(): UseFavoritesResult {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => { try { const parsed: unknown = JSON.parse(localStorage.getItem(key) ?? '[]'); return new Set(Array.isArray(parsed) && parsed.every((item) => typeof item === 'string') ? parsed : []); } catch { return new Set(); } });
  const toggleFavorite = (id: string) => setFavoriteIds((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); localStorage.setItem(key, JSON.stringify([...next])); return next; });
  return { favoriteIds, toggleFavorite, isFavorite: (id) => favoriteIds.has(id) };
}
