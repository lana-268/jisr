import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ListingForm } from './ListingForm';

const categories = [{ id: 'one', name: 'Category' }];
describe('listing form validation', () => {
  it.each(['product', 'service'] as const)('rejects invalid %s values', async (kind) => {
    const onSubmit = vi.fn().mockResolvedValue(true);
    render(<ListingForm kind={kind} categories={categories} saving={false} onSubmit={onSubmit} onCancel={() => undefined}/>);
    await userEvent.click(screen.getByRole('button', { name: `Add ${kind}` }));
    expect(await screen.findByText('A title is required.')).toBeInTheDocument();
    expect(screen.getByText('Choose a category.')).toBeInTheDocument();
    expect(screen.getByText('Enter a price greater than 0.')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
