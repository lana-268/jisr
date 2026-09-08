import { LoaderCircle } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  loading?: boolean;
  icon?: ReactNode;
}

const variants = {
  primary: 'bg-primary text-white hover:bg-primary-hover border-primary',
  secondary: 'bg-sage-soft text-success hover:bg-border border-sage-soft',
  outline: 'bg-surface text-body hover:bg-page border-border-strong',
  ghost: 'bg-transparent text-body hover:bg-page border-transparent',
  danger: 'bg-danger text-white hover:bg-red-700 border-danger',
};

export function Button({ variant = 'primary', loading = false, icon, className = '', disabled, children, ...props }: ButtonProps) {
  return (
    <button className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-5 text-[15px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-55 ${variants[variant]} ${className}`} disabled={disabled || loading} {...props}>
      {loading ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : icon}
      {children}
    </button>
  );
}
