import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { catalogProviders, catalogProducts } from '../features/catalog/data/mockCatalogData';
import { LandingPage } from './landing/LandingPage';
import { UserCatalog } from './user/UserCatalog';
import { ResponsiveImage } from '../features/catalog/components/CatalogCards';
import { RequestContactModal } from '../features/catalog/components/RequestContactModal';

function LocationView() { const location = useLocation(); return <output aria-label="location">{location.pathname}{location.search}</output>; }
describe('customer experience', () => {
  it('renders the landing page main sections', () => { render(<MemoryRouter><LandingPage/></MemoryRouter>); expect(screen.getByRole('heading', { name: 'Good Help, Close to Home' })).toBeInTheDocument(); expect(screen.getByRole('heading', { name: 'Whatever your day needs' })).toBeInTheDocument(); expect(screen.getByRole('heading', { name: 'How Jisr works' })).toBeInTheDocument(); expect(screen.getByRole('heading', { name: 'Turn your skills into a local business' })).toBeInTheDocument(); });
  it('navigates search and district to the customer URL', async () => { render(<MemoryRouter initialEntries={['/']}><Routes><Route path="/" element={<LandingPage/>}/><Route path="/user" element={<LocationView/>}/></Routes></MemoryRouter>); await userEvent.selectOptions(screen.getByLabelText('District'), 'Kadıköy'); await userEvent.type(screen.getByLabelText('What do you need?'), 'cleaning'); await userEvent.click(screen.getByRole('button', { name: 'Search' })); expect(screen.getByLabelText('location')).toHaveTextContent('/user?district=Kad%C4%B1k%C3%B6y&search=cleaning'); });
  it('opens and closes mobile navigation', async () => { render(<MemoryRouter><LandingPage/></MemoryRouter>); await userEvent.click(screen.getByRole('button', { name: 'Open navigation' })); expect(screen.getByRole('button', { name: 'Close navigation' })).toBeInTheDocument(); await userEvent.click(screen.getByRole('button', { name: 'Close navigation' })); expect(screen.queryByRole('button', { name: 'Close navigation' })).not.toBeInTheDocument(); });
  it('shows a page empty state for unmatched search', async () => { render(<MemoryRouter initialEntries={['/user?search=zzzz-no-match']}><UserCatalog/></MemoryRouter>); expect(await screen.findByText('No providers available here yet', {}, { timeout: 2000 })).toBeInTheDocument(); });
  it('filters with product track and category controls', async () => { render(<MemoryRouter initialEntries={['/user']}><UserCatalog/></MemoryRouter>); await screen.findByRole('heading', { name: 'Home-Cooked Meals' }, { timeout: 2000 }); await userEvent.click(screen.getByRole('button', { name: 'Home Products' })); expect(screen.queryByRole('heading', { name: 'Delivery' })).not.toBeInTheDocument(); await userEvent.click(screen.getByRole('button', { name: 'Desserts' })); expect(screen.getByRole('heading', { name: 'Desserts' })).toBeInTheDocument(); });
  it('validates required request details', async () => { const entry = { kind: 'product' as const, item: catalogProducts[0], provider: catalogProviders[0] }; render(<RequestContactModal entry={entry} onClose={() => undefined} onSuccess={() => undefined}/>); await userEvent.click(screen.getByRole('button', { name: 'Send Request' })); expect(screen.getByText('Tell the provider what you need.')).toBeInTheDocument(); expect(screen.getByText('Choose a preferred date.')).toBeInTheDocument(); });
  it('renders a placeholder for missing images', () => { render(<ResponsiveImage alt="Spinach Börek"/>); expect(screen.getByRole('img', { name: 'Spinach Börek image unavailable' })).toBeInTheDocument(); });
});
