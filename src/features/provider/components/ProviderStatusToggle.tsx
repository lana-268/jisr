import { LoaderCircle } from 'lucide-react';
import type { Provider } from '../../../types';
import { Toggle } from '../../../shared/components/Toggle';

export interface ProviderStatusToggleProps { provider: Provider; updating: boolean; onChange: (checked: boolean) => void }
export function ProviderStatusToggle({ provider, updating, onChange }: ProviderStatusToggleProps) {
  const cannotEnable = provider.status !== 'APPROVED' && !provider.isOnline;
  const description = cannotEnable ? 'Your account must be approved before you can receive orders.' : provider.isOnline ? 'Customers can currently discover your available listings.' : 'Your listings are temporarily hidden from customers.';
  return <div id="availability" tabIndex={-1} className="scroll-mt-28 outline-none"><Toggle checked={provider.isOnline} onChange={onChange} disabled={updating || cannotEnable} label={updating ? 'Updating availability…' : 'Available to receive orders now'} description={description} />{updating && <span className="sr-only"><LoaderCircle className="animate-spin"/>Updating</span>}</div>;
}
