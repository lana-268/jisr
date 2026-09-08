import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EmptyState } from './Feedback';

describe('empty states', () => {
  it('renders supplied empty copy', () => { render(<EmptyState title="No orders yet" description="New customer requests will appear here."/>); expect(screen.getByText('No orders yet')).toBeInTheDocument(); });
});
