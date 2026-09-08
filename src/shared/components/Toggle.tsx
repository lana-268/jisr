export interface ToggleProps { checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean; label: string; description?: string; compact?: boolean }

export function Toggle({ checked, onChange, disabled = false, label, description, compact = false }: ToggleProps) {
  return <div className={`flex items-center justify-between gap-4 ${compact ? '' : 'rounded-xl border border-border bg-surface p-4'}`}>
    <div><p className="text-sm font-semibold text-heading">{label}</p>{description && <p className="mt-0.5 text-xs leading-5 text-muted">{description}</p>}</div>
    <button type="button" role="switch" aria-checked={checked} aria-label={label} disabled={disabled} onClick={() => onChange(!checked)} className={`relative h-7 w-12 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${checked ? 'bg-success' : 'bg-border-strong'}`}>
      <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${checked ? 'left-6' : 'left-1'}`} />
    </button>
  </div>;
}
