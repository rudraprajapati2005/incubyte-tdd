import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VehicleCard from '../../src/components/VehicleCard';

const baseVehicle = {
  id: 'abc123',
  make: 'Toyota',
  model: 'Camry',
  category: 'SEDAN',
  price: 24999,
  quantity: 3,
  year: 2026,
};

function renderCard(overrides = {}, props = {}) {
  const handlers = {
    onPurchase: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onRestock: vi.fn(),
    ...props,
  };
  render(<VehicleCard vehicle={{ ...baseVehicle, ...overrides }} isAdmin={false} {...handlers} />);
  return handlers;
}

describe('VehicleCard', () => {
  it('renders make, model, category and price', () => {
    renderCard();
    expect(screen.getByText(/Toyota Camry/)).toBeInTheDocument();
    expect(screen.getByText('Sedan')).toBeInTheDocument();
    expect(screen.getByText('₹24,999')).toBeInTheDocument();
  });

  it('shows quantity in stock when available', () => {
    renderCard({ quantity: 3 });
    expect(screen.getByText('3 in stock')).toBeInTheDocument();
  });

  it('enables the Purchase button when quantity is above zero', () => {
    renderCard({ quantity: 3 });
    expect(screen.getByRole('button', { name: /purchase/i })).toBeEnabled();
  });

  it('disables the Purchase button and shows "Sold out" when quantity is zero', () => {
    renderCard({ quantity: 0 });
    const button = screen.getByRole('button', { name: /sold out/i });
    expect(button).toBeDisabled();
    expect(screen.getAllByText(/sold out/i).length).toBeGreaterThan(0);
  });

  it('shows a purchase confirmation before calling onPurchase', async () => {
    const user = userEvent.setup();
    const handlers = renderCard({ quantity: 2 });

    await user.click(screen.getByRole('button', { name: /purchase/i }));

    const dialog = screen.getByRole('alertdialog');
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText(/are you sure you want to purchase the item/i)).toBeInTheDocument();
    expect(within(dialog).getByText('$24,999')).toBeInTheDocument();
    expect(handlers.onPurchase).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: /yes/i }));

    expect(handlers.onPurchase).toHaveBeenCalledWith(expect.objectContaining({ id: 'abc123' }));
  });

  it('does not render admin controls for non-admin users', () => {
    renderCard({}, {});
    expect(screen.queryByLabelText(/edit toyota camry/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/delete toyota camry/i)).not.toBeInTheDocument();
  });

  it('renders admin controls (edit, delete, restock) for admin users', () => {
    const handlers = {
      onPurchase: vi.fn(),
      onEdit: vi.fn(),
      onDelete: vi.fn(),
      onRestock: vi.fn(),
    };
    render(<VehicleCard vehicle={baseVehicle} isAdmin={true} {...handlers} />);

    expect(screen.getByLabelText(/edit toyota camry/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/delete toyota camry/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/restock toyota camry/i)).toBeInTheDocument();
  });

  it('calls onDelete with the vehicle when the admin delete control is clicked', async () => {
    const user = userEvent.setup();
    const handlers = {
      onPurchase: vi.fn(),
      onEdit: vi.fn(),
      onDelete: vi.fn(),
      onRestock: vi.fn(),
    };
    render(<VehicleCard vehicle={baseVehicle} isAdmin={true} {...handlers} />);

    await user.click(screen.getByLabelText(/delete toyota camry/i));

    expect(handlers.onDelete).toHaveBeenCalledWith(expect.objectContaining({ id: 'abc123' }));
  });
});
