import { Link } from 'react-router-dom';

export interface JisrBrandProps {
  to?: string;
  className?: string;
}

function BrandContent() {
  return <>
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sage-soft text-success ring-1 ring-success/10">
      <svg viewBox="0 0 32 32" className="h-6 w-6 fill-current" aria-hidden="true">
        <path d="M15.3 27.2c-1.4-7.7 1.2-14.4 8-20.2 1.4 7.4-1.1 14.2-8 20.2ZM13.5 24.1C7.1 21.7 4 16.6 4.2 8.7c6.8 2.8 9.9 7.9 9.3 15.4Z"/>
      </svg>
    </span>
    <span className="text-xl font-bold tracking-[-0.035em] text-heading">Jisr</span>
  </>;
}

export function JisrBrand({ to, className = '' }: JisrBrandProps) {
  const styles = `inline-flex min-h-11 items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${className}`;
  if (to) return <Link to={to} className={styles} aria-label="Jisr home"><BrandContent/></Link>;
  return <div className={styles}><BrandContent/></div>;
}
