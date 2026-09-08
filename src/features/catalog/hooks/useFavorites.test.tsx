import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useFavorites } from './useFavorites';

describe('customer favorites', () => {
  beforeEach(() => localStorage.clear());
  it('toggles and persists namespaced IDs', () => { const { result } = renderHook(() => useFavorites()); act(() => result.current.toggleFavorite('product:cp-1')); expect(result.current.isFavorite('product:cp-1')).toBe(true); expect(localStorage.getItem('jisr-customer-favorites')).toContain('product:cp-1'); });
  it('handles invalid stored JSON safely', () => { localStorage.setItem('jisr-customer-favorites', '{invalid'); const { result } = renderHook(() => useFavorites()); expect(result.current.favoriteIds.size).toBe(0); });
});
