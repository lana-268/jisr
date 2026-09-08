import { Beaker } from 'lucide-react';
import type { Provider } from '../../../types';

export interface ProviderTypePreviewProps { providers: Provider[]; selectedId: string; disabled?: boolean; onChange: (providerId: string) => void }
// Remove this preview control when authentication and the real provider repository are connected.
export function ProviderTypePreview({ providers, selectedId, disabled, onChange }: ProviderTypePreviewProps) {
  return <div className="flex flex-col gap-2 rounded-xl border border-dashed border-border-strong bg-surface px-4 py-3 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-soft text-blue"><Beaker className="h-4 w-4"/></span><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-blue">Demo provider</p><p className="text-xs text-muted">Preview both provider experiences</p></div></div><label className="sr-only" htmlFor="demo-provider">Demo provider</label><select id="demo-provider" disabled={disabled} value={selectedId} onChange={(event) => onChange(event.target.value)} className="h-11 min-w-64 rounded-lg border border-border-strong bg-surface px-3 text-sm font-medium text-heading outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft disabled:opacity-50">{providers.map((provider) => <option key={provider.providerId} value={provider.providerId}>{provider.businessName} — {provider.providerType}</option>)}</select></div>;
}
