import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { ProviderDashboard } from './ProviderDashboard';

const renderDashboard = () => render(<MemoryRouter><ProviderDashboard/></MemoryRouter>);
function LocationView() { return <output aria-label="provider-location">{useLocation().pathname}</output>; }
describe('provider dashboard', () => {
  it('renders product management and switches to service management', async () => {
    renderDashboard();
    expect(await screen.findByRole('heading', { name: 'Products' }, { timeout: 2000 })).toBeInTheDocument();
    await userEvent.selectOptions(screen.getByLabelText('Demo provider'), 'provider-service');
    expect(await screen.findByRole('heading', { name: 'Services' }, { timeout: 2000 })).toBeInTheDocument();
    expect(screen.getByText('Mehmet Home Services')).toBeInTheDocument();
  });

  it('toggles listing availability', async () => {
    renderDashboard();
    await screen.findByRole('heading', { name: 'Products' }, { timeout: 2000 });
    const table = screen.getByTestId('desktop-listing-table');
    const row = within(table).getByText('Date Cookies').closest('tr');
    expect(row).not.toBeNull();
    await userEvent.click(within(row!).getByRole('button', { name: 'Enable' }));
    expect(await within(row!).findByText('Available')).toBeInTheDocument();
  });

  it('requires delete confirmation', async () => {
    renderDashboard();
    await screen.findByRole('heading', { name: 'Products' }, { timeout: 2000 });
    await userEvent.click(screen.getAllByRole('button', { name: 'Delete Chicken Kabsa' })[0]);
    expect(screen.getByRole('heading', { name: 'Delete product?' })).toBeInTheDocument();
    expect(screen.getByText(/“Chicken Kabsa”/)).toBeInTheDocument();
  });

  it('includes mobile cards while desktop tables are breakpoint-hidden', async () => {
    renderDashboard();
    await screen.findByRole('heading', { name: 'Products' }, { timeout: 2000 });
    expect(screen.getByTestId('desktop-listing-table')).toHaveClass('hidden');
    expect(screen.getByTestId('mobile-listing-cards')).toHaveClass('md:hidden');
  });

  it('opens chat and sends a customer message', async () => {
    renderDashboard();
    await screen.findByRole('heading', { name: 'Products' }, { timeout: 2000 });
    await userEvent.click(screen.getByRole('button', { name: 'Messages' }));
    expect(screen.getByRole('heading', { name: 'Messages' })).toBeInTheDocument();
    const draft = screen.getByLabelText('Message Elif Yılmaz');
    await userEvent.type(draft, 'Your order will be ready shortly.');
    await userEvent.click(screen.getByRole('button', { name: 'Send message' }));
    expect(screen.getAllByText('Your order will be ready shortly.')).toHaveLength(2);
  });

  it('opens and saves provider settings', async () => {
    renderDashboard();
    await screen.findByRole('heading', { name: 'Products' }, { timeout: 2000 });
    await userEvent.click(screen.getByRole('button', { name: 'Settings' }));
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('switch', { name: 'Weekly business summary' }));
    await userEvent.click(screen.getByRole('button', { name: 'Save settings' }));
    expect(await screen.findByText('Settings saved for this device.')).toBeInTheDocument();
  });
  it('logs the provider out to the login route', async () => { render(<MemoryRouter initialEntries={['/dashboard/provider']}><Routes><Route path="/dashboard/provider" element={<ProviderDashboard/>}/><Route path="/login" element={<LocationView/>}/></Routes></MemoryRouter>); await screen.findByRole('heading', { name: 'Products' }, { timeout: 2000 }); await userEvent.click(screen.getByRole('button', { name: 'Log out' })); const dialog = screen.getByRole('dialog', { name: 'Log out of Jisr?' }); await userEvent.click(within(dialog).getByRole('button', { name: 'Log out' })); expect(screen.getByLabelText('provider-location')).toHaveTextContent('/login'); });
});
