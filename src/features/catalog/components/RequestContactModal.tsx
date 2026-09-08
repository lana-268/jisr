import { CalendarDays, Clock3, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { CatalogItem } from '../../../types';
import { Button } from '../../../shared/components/Button';
import { Input, Textarea } from '../../../shared/components/FormControls';
import { Modal } from '../../../shared/components/Modal';
import { formatCurrency } from '../../provider/utils/dashboard';
import { VerifiedBadge } from './CatalogCards';

export interface RequestContactModalProps { entry: CatalogItem | null; onClose: () => void; onSuccess: (message: string) => void }
export function RequestContactModal({ entry, onClose, onSuccess }: RequestContactModalProps) {
  const [note, setNote] = useState(''); const [date, setDate] = useState(''); const [time, setTime] = useState(''); const [submitted, setSubmitted] = useState(false); const [saving, setSaving] = useState(false);
  useEffect(() => { setNote(''); setDate(''); setTime(''); setSubmitted(false); }, [entry]);
  if (!entry) return null;
  const submit = (event: React.FormEvent) => { event.preventDefault(); setSubmitted(true); if (!note.trim() || !date || !time) return; setSaving(true); window.setTimeout(() => { setSaving(false); onClose(); onSuccess('Demo request created. Backend connection will be added later.'); }, 450); };
  return <Modal open onClose={onClose} title="Request & Contact" description="Share a few details with this local provider" size="lg"><div className="mb-5 flex items-start justify-between gap-4 rounded-xl bg-page p-4"><div><h3 className="font-semibold text-heading">{entry.item.title}</h3><p className="mt-1 text-sm text-muted">{entry.provider.businessName}</p><div className="mt-2 flex items-center gap-2"><VerifiedBadge/><span className="inline-flex items-center gap-1 text-xs text-muted"><MapPin className="h-3.5 w-3.5"/>{entry.provider.district}</span></div></div><p className="shrink-0 font-bold text-heading">{entry.kind === 'service' ? 'From ' : ''}{formatCurrency(entry.item.price)}</p></div><form noValidate onSubmit={submit} className="space-y-5"><Textarea label="Request note" required value={note} onChange={(event) => setNote(event.target.value)} error={submitted && !note.trim() ? 'Tell the provider what you need.' : undefined} placeholder="Include quantity, timing, or other helpful details…"/><div className="grid gap-5 sm:grid-cols-2"><Input label="Preferred date" required type="date" min={new Date().toISOString().slice(0,10)} value={date} onChange={(event) => setDate(event.target.value)} error={submitted && !date ? 'Choose a preferred date.' : undefined}/><Input label="Preferred time" required type="time" value={time} onChange={(event) => setTime(event.target.value)} error={submitted && !time ? 'Choose a preferred time.' : undefined}/></div><div className="rounded-xl border border-border bg-sage-soft/50 p-3 text-xs leading-5 text-success"><CalendarDays className="me-1 inline h-4 w-4"/><Clock3 className="me-1 inline h-4 w-4"/>This creates a local demo request only. No real order or chat is stored.</div><div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><Button type="button" variant="outline" onClick={onClose}>Cancel</Button><Button type="submit" loading={saving}>Send Request</Button></div></form></Modal>;
}
