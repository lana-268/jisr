import { BellRing, Globe2, LockKeyhole, RotateCcw, Save, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import type { Provider } from '../../../types';
import { Button } from '../../../shared/components/Button';
import { Select } from '../../../shared/components/FormControls';
import { Toggle } from '../../../shared/components/Toggle';

export interface ProviderPreferences {
  newOrderNotifications: boolean;
  messageNotifications: boolean;
  weeklySummary: boolean;
  profileDiscoverable: boolean;
  language: 'English' | 'Türkçe' | 'العربية';
}

export interface ProviderSettingsProps { provider: Provider; onSaved: (message: string) => void }
const defaults: ProviderPreferences = { newOrderNotifications: true, messageNotifications: true, weeklySummary: false, profileDiscoverable: true, language: 'English' };

export function ProviderSettings({ provider, onSaved }: ProviderSettingsProps) {
  const storageKey = `jisr-preferences-${provider.providerId}`;
  const [preferences, setPreferences] = useState<ProviderPreferences>(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return defaults;
    try { return { ...defaults, ...(JSON.parse(saved) as Partial<ProviderPreferences>) }; } catch { return defaults; }
  });
  const [saving, setSaving] = useState(false);
  const update = <Key extends keyof ProviderPreferences>(key: Key, value: ProviderPreferences[Key]) => setPreferences((current) => ({ ...current, [key]: value }));
  const save = () => { setSaving(true); window.setTimeout(() => { window.localStorage.setItem(storageKey, JSON.stringify(preferences)); setSaving(false); onSaved('Settings saved for this device.'); }, 350); };
  const reset = () => { setPreferences(defaults); window.localStorage.removeItem(storageKey); onSaved('Settings restored to defaults.'); };
  return <div className="space-y-5">
    <section className="rounded-xl border border-border"><header className="flex items-center gap-3 border-b border-border px-4 py-3.5"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary"><BellRing className="h-[18px] w-[18px]"/></span><div><h3 className="text-sm font-semibold text-heading">Notifications</h3><p className="text-xs text-muted">Choose which business updates you receive.</p></div></header><div className="divide-y divide-border px-4"><div className="py-3.5"><Toggle compact checked={preferences.newOrderNotifications} onChange={(value) => update('newOrderNotifications', value)} label="New order alerts" description="Notify me as soon as a customer places an order."/></div><div className="py-3.5"><Toggle compact checked={preferences.messageNotifications} onChange={(value) => update('messageNotifications', value)} label="New message alerts" description="Notify me when a customer sends a message."/></div><div className="py-3.5"><Toggle compact checked={preferences.weeklySummary} onChange={(value) => update('weeklySummary', value)} label="Weekly business summary" description="Receive a weekly overview of orders and earnings."/></div></div></section>
    <section className="rounded-xl border border-border"><header className="flex items-center gap-3 border-b border-border px-4 py-3.5"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sage-soft text-success"><ShieldCheck className="h-[18px] w-[18px]"/></span><div><h3 className="text-sm font-semibold text-heading">Privacy & visibility</h3><p className="text-xs text-muted">Control how your business appears around Jisr.</p></div></header><div className="p-4"><Toggle compact checked={preferences.profileDiscoverable} onChange={(value) => update('profileDiscoverable', value)} label="Show my provider profile" description={preferences.profileDiscoverable ? 'Nearby customers can discover your approved profile.' : 'Your profile is hidden, even while individual listings are available.'}/></div></section>
    <section className="grid gap-4 rounded-xl border border-border p-4 sm:grid-cols-[1fr_220px] sm:items-end"><div className="flex items-start gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-soft text-blue"><Globe2 className="h-[18px] w-[18px]"/></span><div><h3 className="text-sm font-semibold text-heading">Language</h3><p className="text-xs text-muted">Choose your preferred dashboard language. Translation is preview-only.</p></div></div><Select label="Dashboard language" value={preferences.language} onChange={(event) => update('language', event.target.value as ProviderPreferences['language'])}><option>English</option><option>Türkçe</option><option>العربية</option></Select></section>
    <section className="flex items-center gap-3 rounded-xl border border-border bg-page p-4"><LockKeyhole className="h-5 w-5 shrink-0 text-muted"/><div className="min-w-0"><h3 className="text-sm font-semibold text-heading">Account security</h3><p className="text-xs text-muted">Password and sign-in settings will be available when authentication is connected.</p></div><span className="ml-auto rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-muted">Backend required</span></section>
    <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-between"><Button variant="ghost" icon={<RotateCcw className="h-4 w-4"/>} onClick={reset}>Reset defaults</Button><Button loading={saving} icon={<Save className="h-4 w-4"/>} onClick={save}>Save settings</Button></div>
  </div>;
}
