import { forwardRef } from 'react';
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface FieldShellProps { id: string; label: string; required?: boolean; error?: string; children: React.ReactNode }
function FieldShell({ id, label, required, error, children }: FieldShellProps) {
  return <div className="space-y-2"><label htmlFor={id} className="block text-sm font-semibold text-heading">{label} <span className="font-normal text-muted">{required ? '(required)' : '(optional)'}</span></label>{children}{error && <p id={`${id}-error`} className="text-sm text-danger">{error}</p>}</div>;
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> { label: string; error?: string }
export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, required, id, className = '', ...props }, ref) => {
  const fieldId = id ?? props.name ?? label.toLowerCase().replaceAll(' ', '-');
  return <FieldShell id={fieldId} label={label} required={required} error={error}><input ref={ref} id={fieldId} required={required} aria-invalid={Boolean(error)} aria-describedby={error ? `${fieldId}-error` : undefined} className={`h-12 w-full rounded-lg border bg-surface px-3.5 text-body outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-soft disabled:bg-page ${error ? 'border-danger' : 'border-border-strong'} ${className}`} {...props} /></FieldShell>;
});
Input.displayName = 'Input';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> { label: string; error?: string }
export function Select({ label, error, required, id, children, className = '', ...props }: SelectProps) {
  const fieldId = id ?? props.name ?? label.toLowerCase().replaceAll(' ', '-');
  return <FieldShell id={fieldId} label={label} required={required} error={error}><select id={fieldId} required={required} aria-invalid={Boolean(error)} aria-describedby={error ? `${fieldId}-error` : undefined} className={`h-12 w-full rounded-lg border bg-surface px-3.5 text-body outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-soft ${error ? 'border-danger' : 'border-border-strong'} ${className}`} {...props}>{children}</select></FieldShell>;
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> { label: string; error?: string }
export function Textarea({ label, error, required, id, className = '', ...props }: TextareaProps) {
  const fieldId = id ?? props.name ?? label.toLowerCase().replaceAll(' ', '-');
  return <FieldShell id={fieldId} label={label} required={required} error={error}><textarea id={fieldId} required={required} aria-invalid={Boolean(error)} aria-describedby={error ? `${fieldId}-error` : undefined} className={`min-h-28 w-full resize-y rounded-lg border bg-surface px-3.5 py-3 text-body outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-soft ${error ? 'border-danger' : 'border-border-strong'} ${className}`} {...props} /></FieldShell>;
}
