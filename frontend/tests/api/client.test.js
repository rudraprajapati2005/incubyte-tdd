import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// api/client.js reads import.meta.env.VITE_API_BASE_URL once at import time
// via `|| 'http://localhost:5000/api'`, so we don't need to mock env for
// these tests — we just assert against that default base URL.
import {
  loginUser,
  registerUser,
  logoutUser,
  fetchVehicles,
  searchVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle,
  getToken,
  getStoredUser,
  normalizeUser,
  ApiError,
} from '../../src/api/client';

function jsonResponse(body, { ok = true, status = 200 } = {}) {
  return {
    ok,
    status,
    headers: { get: () => 'application/json' },
    json: async () => body,
  };
}

beforeEach(() => {
  localStorage.clear();
  global.fetch = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('normalizeUser', () => {
  it('marks a user with role "admin" as admin', () => {
    const u = normalizeUser({ id: '1', email: 'a@b.com', role: 'admin' });
    expect(u.isAdmin).toBe(true);
    expect(u.role).toBe('admin');
  });

  it('marks a user with isAdmin: true as admin even without a role field', () => {
    const u = normalizeUser({ id: '1', email: 'a@b.com', isAdmin: true });
    expect(u.isAdmin).toBe(true);
  });

  it('treats a plain user as non-admin', () => {
    const u = normalizeUser({ id: '1', email: 'a@b.com', role: 'user' });
    expect(u.isAdmin).toBe(false);
  });

  it('returns null for a null/undefined input', () => {
    expect(normalizeUser(null)).toBeNull();
  });
});

describe('auth flows', () => {
  it('logs in, stores the token, and returns the normalized user', async () => {
    global.fetch.mockResolvedValueOnce(
      jsonResponse({ token: 'abc123', user: { id: '1', name: 'Ann', email: 'ann@x.com', role: 'admin' } })
    );

    const { token, user } = await loginUser({ email: 'ann@x.com', password: 'secret' });

    expect(token).toBe('abc123');
    expect(user.isAdmin).toBe(true);
    expect(getToken()).toBe('abc123');
    expect(getStoredUser().email).toBe('ann@x.com');
  });

  it('sends the register payload to /auth/register', async () => {
    global.fetch.mockResolvedValueOnce(
      jsonResponse({ token: 't', user: { id: '2', name: 'Bo', email: 'bo@x.com' } })
    );

    await registerUser({ name: 'Bo', email: 'bo@x.com', password: 'secret' });

    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toContain('/auth/register');
    expect(JSON.parse(options.body)).toEqual({ name: 'Bo', email: 'bo@x.com', password: 'secret' });
  });

  it('clears the stored session on logout', async () => {
    global.fetch.mockResolvedValueOnce(
      jsonResponse({ token: 'abc', user: { id: '1', email: 'a@b.com' } })
    );
    await loginUser({ email: 'a@b.com', password: 'x' });
    expect(getToken()).toBe('abc');

    logoutUser();

    expect(getToken()).toBeNull();
    expect(getStoredUser()).toBeNull();
  });

  it('throws an ApiError with the server message on a failed login', async () => {
    global.fetch.mockResolvedValueOnce(
      jsonResponse({ message: 'Invalid credentials' }, { ok: false, status: 401 })
    );

    await expect(loginUser({ email: 'x@x.com', password: 'wrong' })).rejects.toMatchObject({
      message: 'Invalid credentials',
    });
  });
});

describe('vehicle reads', () => {
  it('normalizes a bare array response from GET /vehicles', async () => {
    global.fetch.mockResolvedValueOnce(
      jsonResponse([{ id: '1', make: 'Toyota', model: 'Camry', category: 'Sedan', price: '24999', quantity: '3' }])
    );

    const vehicles = await fetchVehicles();

    expect(vehicles).toHaveLength(1);
    expect(vehicles[0]).toMatchObject({ id: '1', make: 'Toyota', price: 24999, quantity: 3 });
  });

  it('normalizes a wrapped { vehicles: [...] } response', async () => {
    global.fetch.mockResolvedValueOnce(
      jsonResponse({ vehicles: [{ id: '2', make: 'Honda', model: 'Civic', price: 21000, quantity: 0 }] })
    );

    const vehicles = await fetchVehicles();

    expect(vehicles).toHaveLength(1);
    expect(vehicles[0].make).toBe('Honda');
  });

  it('builds a query string of only the provided search params', async () => {
    global.fetch.mockResolvedValueOnce(jsonResponse([]));

    await searchVehicles({ make: 'Ford', minPrice: '10000' });

    const [url] = global.fetch.mock.calls[0];
    expect(url).toContain('/vehicles/search?');
    expect(url).toContain('make=Ford');
    expect(url).toContain('minPrice=10000');
    expect(url).not.toContain('model=');
  });
});

describe('vehicle mutations (require auth)', () => {
  beforeEach(async () => {
    global.fetch.mockResolvedValueOnce(
      jsonResponse({ token: 'admin-token', user: { id: '1', email: 'admin@x.com', role: 'admin' } })
    );
    await loginUser({ email: 'admin@x.com', password: 'x' });
  });

  it('attaches the Authorization header when creating a vehicle', async () => {
    global.fetch.mockResolvedValueOnce(
      jsonResponse({ id: '10', make: 'Kia', model: 'Soul', category: 'Hatchback', price: 18000, quantity: 5 })
    );

    await createVehicle({ make: 'Kia', model: 'Soul', category: 'Hatchback', price: 18000, quantity: 5 });

    const [, options] = global.fetch.mock.calls[1];
    expect(options.headers.Authorization).toBe('Bearer admin-token');
    expect(options.method).toBe('POST');
  });

  it('sends a PUT to /vehicles/:id on update', async () => {
    global.fetch.mockResolvedValueOnce(jsonResponse({ id: '10', make: 'Kia', model: 'Soul', price: 17500, quantity: 5 }));

    await updateVehicle('10', { price: 17500 });

    const [url, options] = global.fetch.mock.calls[1];
    expect(url).toContain('/vehicles/10');
    expect(options.method).toBe('PUT');
  });

  it('sends a DELETE to /vehicles/:id', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, status: 204, headers: { get: () => null }, text: async () => '' });

    await deleteVehicle('10');

    const [url, options] = global.fetch.mock.calls[1];
    expect(url).toContain('/vehicles/10');
    expect(options.method).toBe('DELETE');
  });

  it('posts a quantity to /vehicles/:id/purchase', async () => {
    global.fetch.mockResolvedValueOnce(jsonResponse({ id: '10', make: 'Kia', model: 'Soul', price: 17500, quantity: 4 }));

    const updated = await purchaseVehicle('10', 1);

    const [url, options] = global.fetch.mock.calls[1];
    expect(url).toContain('/vehicles/10/purchase');
    expect(JSON.parse(options.body)).toEqual({ quantity: 1 });
    expect(updated.quantity).toBe(4);
  });

  it('posts a quantity to /vehicles/:id/restock', async () => {
    global.fetch.mockResolvedValueOnce(jsonResponse({ id: '10', make: 'Kia', model: 'Soul', price: 17500, quantity: 9 }));

    const updated = await restockVehicle('10', 5);

    const [url, options] = global.fetch.mock.calls[1];
    expect(url).toContain('/vehicles/10/restock');
    expect(JSON.parse(options.body)).toEqual({ quantity: 5 });
    expect(updated.quantity).toBe(9);
  });
});

describe('network failure handling', () => {
  it('wraps a fetch rejection in a descriptive ApiError', async () => {
    global.fetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

    await expect(fetchVehicles()).rejects.toBeInstanceOf(ApiError);
  });

  it('gives the ApiError a message that points at the network/config issue', async () => {
    global.fetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

    await expect(fetchVehicles()).rejects.toThrow(/Could not reach the API/);
  });
});
