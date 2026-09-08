import { ArrowLeft, Construction } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { buttonStyles } from '../shared/components/Button';
import { PublicBrand } from '../shared/layout/PublicLayout';

export function PlaceholderPage() { const { pathname } = useLocation(); const title = pathname.slice(1).replaceAll('-', ' ') || 'Page'; return <main className="flex min-h-screen items-center justify-center bg-page p-4"><section className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 text-center shadow-card"><div className="flex justify-center"><PublicBrand/></div><span className="mx-auto mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary"><Construction className="h-6 w-6"/></span><h1 className="mt-5 text-2xl font-bold capitalize text-heading">{title} is coming soon</h1><p className="mt-2 text-sm leading-6 text-muted">This route is ready for the next phase of the Jisr frontend.</p><Link to="/" className={buttonStyles('primary', 'mt-6 w-full')}><ArrowLeft className="h-4 w-4"/>Back home</Link></section></main>; }
