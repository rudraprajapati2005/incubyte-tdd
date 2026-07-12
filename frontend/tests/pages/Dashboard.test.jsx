import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from '../../src/pages/Dashboard';
import { ToastProvider } from '../../src/context/ToastContext';

vi.mock('../../src/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));
vi.mock('../../src/api/client', () => ({
  fetchVehicles: vi.fn(),
  searchVehicles: vi.fn(),
  createVehicle: vi.fn(),
  updateVehicle: vi.fn(),
  deleteVehicle: vi.fn(),
  purchaseVehicle: vi.fn(),
  restockVehicle: vi.fn(),
}));

import { useAuth } from '../../src/context/AuthContext';
import { fetchVehicles, purchaseVehicle, createVehicle } from '../../src/api/client';

const vehicles = [
  { id: '1', make: 'Toyota', model: 'Camry', category: 'Sedan', price: 24999, quantity: 3, year: 2026 },
  { id: '2', make: 'Ford', model: 'F-150', category: 'Truck', price: 41000, quantity: 0, year: 2025 },
];

function setup({ isAdmin = false } = {}) {
  useAuth.mockReturnValue({ isAdmin, user: { name: 'Test User' }, isAuthenticated: true, logout: vi.fn() });
  fetchVehicles.mockResolvedValue(vehicles);
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Dashboard', () => {
  it('loads and displays vehicles from the API', async () => {
    setup();
    render(<ToastProvider><Dashboard /></ToastProvider>);

    expect(await screen.findByText(/Toyota Camry/)).toBeInTheDocument();
    expect(screen.getByText(/Ford F-150/)).toBeInTheDocument();
    expect(fetchVehicles).toHaveBeenCalled();
  });

  it('shows a sold-out vehicle with a disabled purchase button', async () => {
    setup();
    render(<ToastProvider><Dashboard /></ToastProvider>);
    await screen.findByText(/Ford F-150/);

    const fordCard = screen.getByText(/Ford F-150/).closest('article');
    expect(within(fordCard).getByRole('button', { name: /sold out/i })).toBeDisabled();
  });

  it('purchases a vehicle and reflects the updated quantity', async () => {
    const user = userEvent.setup();
    setup();
    purchaseVehicle.mockResolvedValueOnce({ ...vehicles[0], quantity: 2 });

    render(<ToastProvider><Dashboard /></ToastProvider>);
    await screen.findByText(/Toyota Camry/);

    const camryCard = screen.getByText(/Toyota Camry/).closest('article');
    await user.click(within(camryCard).getByRole('button', { name: /purchase/i }));

    await waitFor(() => expect(purchaseVehicle).toHaveBeenCalledWith('1', 1));
    await waitFor(() => expect(within(camryCard).getByText('2 in stock')).toBeInTheDocument());
  });

  it('does not show admin controls for a regular user', async () => {
    setup({ isAdmin: false });
    render(<ToastProvider><Dashboard /></ToastProvider>);
    await screen.findByText(/Toyota Camry/);

    expect(screen.queryByRole('button', { name: /add vehicle/i })).not.toBeInTheDocument();
  });

  it('lets an admin add a new vehicle through the form modal', async () => {
    const user = userEvent.setup();
    setup({ isAdmin: true });
    createVehicle.mockResolvedValueOnce({
      id: '3',
      make: 'Kia',
      model: 'Soul',
      category: 'Hatchback',
      price: 18000,
      quantity: 5,
    });

    render(<ToastProvider><Dashboard /></ToastProvider>);
    await screen.findByText(/Toyota Camry/);

    await user.click(screen.getAllByRole('button', { name: /add vehicle/i })[0]);
    await user.type(screen.getByPlaceholderText('Toyota'), 'Kia');
    await user.type(screen.getByPlaceholderText('Camry'), 'Soul');
    await user.type(screen.getByPlaceholderText('24999'), '18000');
    await user.type(screen.getByPlaceholderText('4'), '5');
    await user.click(screen.getByRole('button', { name: /add to lot/i }));

    await waitFor(() => expect(createVehicle).toHaveBeenCalled());
    expect(await screen.findByText(/Kia Soul/)).toBeInTheDocument();
  });

  it('shows an empty state message when there are no vehicles', async () => {
    setup();
    fetchVehicles.mockResolvedValue([]);
    render(<ToastProvider><Dashboard /></ToastProvider>);

    expect(await screen.findByText(/the lot is empty/i)).toBeInTheDocument();
  });
});
