import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../../src/components/SearchBar';

const emptyFilters = { q: '', category: '', minPrice: '', maxPrice: '' };

describe('SearchBar', () => {
  it('renders the result count', () => {
    render(<SearchBar filters={emptyFilters} onChange={vi.fn()} onReset={vi.fn()} resultCount={7} />);
    expect(screen.getByText(/7 vehicles on the lot/i)).toBeInTheDocument();
  });

  it('calls onChange with the updated query as the user types', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SearchBar filters={emptyFilters} onChange={onChange} onReset={vi.fn()} resultCount={0} />);

    await user.type(screen.getByPlaceholderText(/search make or model/i), 'Civic');

    // onChange fires once per keystroke; check the final call reflects the last character typed.
    const lastCall = onChange.mock.calls.at(-1)[0];
    expect(lastCall.q).toBe('c');
    expect(onChange).toHaveBeenCalled();
  });

  it('does not show the Clear button when no filters are active', () => {
    render(<SearchBar filters={emptyFilters} onChange={vi.fn()} onReset={vi.fn()} resultCount={0} />);
    expect(screen.queryByTitle(/clear all filters/i)).not.toBeInTheDocument();
  });

  it('shows and triggers the Clear button when filters are active', async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    render(
      <SearchBar
        filters={{ ...emptyFilters, category: 'SUV' }}
        onChange={vi.fn()}
        onReset={onReset}
        resultCount={2}
      />
    );

    const clearButton = screen.getByTitle(/clear all filters/i);
    expect(clearButton).toBeInTheDocument();
    await user.click(clearButton);
    expect(onReset).toHaveBeenCalled();
  });

  it('reveals category/price filters when the Filters toggle is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchBar filters={emptyFilters} onChange={vi.fn()} onReset={vi.fn()} resultCount={0} />);

    expect(screen.queryByPlaceholderText(/min price/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /filters/i }));

    expect(screen.getByPlaceholderText(/min price/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/max price/i)).toBeInTheDocument();
  });
});
