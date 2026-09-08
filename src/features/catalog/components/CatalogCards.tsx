import { BadgeCheck, Heart, ImageIcon, MapPin } from 'lucide-react';
import { useState } from 'react';
import type { CatalogItem } from '../../../types';
import { Button } from '../../../shared/components/Button';
import { formatCurrency } from '../../provider/utils/dashboard';

export interface VerifiedBadgeProps { label?: string }

export function VerifiedBadge({ label = 'Verified' }: VerifiedBadgeProps) {
  return <span className="inline-flex items-center gap-1 text-xs font-semibold text-success"><BadgeCheck className="h-4 w-4"/>{label}</span>;
}

export interface ResponsiveImageProps {
  src?: string | null;
  alt: string;
  className?: string;
}

export function ResponsiveImage({ src, alt, className = '' }: ResponsiveImageProps) {
  const [failed, setFailed] = useState(false);
  if (src && !failed) return <img src={src} alt={alt} onError={() => setFailed(true)} className={`h-full w-full object-cover ${className}`}/>;
  return <div role={alt ? 'img' : undefined} aria-label={alt ? `${alt} image unavailable` : undefined} aria-hidden={alt ? undefined : true} className={`flex h-full w-full items-center justify-center bg-primary-soft text-primary ${className}`}><ImageIcon className="h-9 w-9"/></div>;
}

export interface FavoriteButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

export function FavoriteButton({ active, onClick, label }: FavoriteButtonProps) {
  return <button type="button" aria-label={`${active ? 'Remove' : 'Add'} ${label} ${active ? 'from' : 'to'} favorites`} aria-pressed={active} onClick={onClick} className={`absolute end-3 top-3 flex h-11 w-11 items-center justify-center rounded-full border shadow-card transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${active ? 'border-primary-hover bg-primary-hover text-white' : 'border-border bg-surface/95 text-body hover:text-primary-hover'}`}><Heart className={`h-5 w-5 ${active ? 'fill-current' : ''}`}/></button>;
}

export interface CatalogCardProps {
  entry: CatalogItem;
  favorite: boolean;
  onFavorite: () => void;
  onRequest: () => void;
  compact?: boolean;
}

export function CatalogCard({ entry, favorite, onFavorite, onRequest, compact = false }: CatalogCardProps) {
  const { item, provider } = entry;
  return <article className={`group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-card transition-colors hover:border-border-strong ${compact ? 'min-w-[272px]' : ''}`}>
    <div className="relative aspect-[16/10] overflow-hidden"><ResponsiveImage src={item.imageUrl} alt={item.title} className="transition-transform duration-300 group-hover:scale-[1.025]"/><FavoriteButton active={favorite} onClick={onFavorite} label={item.title}/><span className={`absolute bottom-3 start-3 rounded-full px-2.5 py-1 text-xs font-semibold ${entry.kind === 'product' ? 'bg-primary-soft text-primary-hover' : 'bg-blue-soft text-blue'}`}>{entry.kind === 'product' ? 'Home product' : 'Local service'}</span></div>
    <div className="flex flex-1 flex-col p-4"><div className="flex items-start justify-between gap-3"><h3 className="min-w-0 text-lg font-semibold leading-6 text-heading">{item.title}</h3><p className="shrink-0 text-sm font-bold text-heading">{entry.kind === 'service' ? 'From ' : ''}{formatCurrency(item.price)}</p></div><p className={`mt-2 text-sm leading-6 text-muted ${compact ? 'line-clamp-1' : 'line-clamp-2'}`}>{item.description}</p><div className="mt-4 border-t border-border pt-3"><p className="truncate text-sm font-semibold text-heading">{provider.businessName}</p><div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1"><VerifiedBadge/><span className="inline-flex items-center gap-1 text-xs text-muted"><MapPin className="h-3.5 w-3.5"/>{provider.district}</span></div></div><Button onClick={onRequest} className="mt-4 w-full" variant="outline">Request & Contact</Button></div>
  </article>;
}

export function SkeletonCard() {
  return <div className="animate-pulse overflow-hidden rounded-xl border border-border bg-surface"><div className="aspect-[16/10] bg-border"/><div className="space-y-3 p-4"><div className="h-5 w-2/3 rounded bg-border"/><div className="h-4 rounded bg-border"/><div className="h-11 rounded-lg bg-border"/></div></div>;
}
