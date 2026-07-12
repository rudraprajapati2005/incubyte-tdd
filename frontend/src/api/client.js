/**
 * ---------------------------------------------------------------------------
 * API client
 * ---------------------------------------------------------------------------
 * This is the ONLY file that should need edits if your backend's response
 * shapes differ from the assumptions below. Everything else in the app talks
 * to the functions exported here, never to fetch() directly.
 *
 * Assumptions baked in (per the kata spec's endpoint list):
 *   POST /auth/register   { name, email, password }        -> { token, user }
 *   POST /auth/login      { email, password }               -> { token, user }
 *   GET  /vehicles                                          -> Vehicle[] (or { vehicles: Vehicle[] })
 *   GET  /vehicles/search ?make=&model=&category=&minPrice=&maxPrice=
 *   POST /vehicles        (admin)  { make, model, category, price, quantity, year? }
 *   PUT  /vehicles/:id
 *   DELETE /vehicles/:id  (admin)
 *   POST /vehicles/:id/purchase { quantity? }
 *   POST /vehicles/:id/restock  { quantity } (admin)
 *
 *   user.role is expected to be "admin" | "user". If your backend instead
 *   sends `isAdmin: boolean`, see normalizeUser() below — it already checks
 *   for both, so no change needed unless your field is named differently.
 * ---------------------------------------------------------------------------
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'lotline_token';
const USER_KEY = 'lotline_user';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setSession(token, user) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Normalizes whatever shape the user object comes back in to a consistent
 *  { id, name, email, role, isAdmin } shape used throughout the app. */
function normalizeUser(user) {
  if (!user) return null;
  const isAdmin =
    user.role === 'admin' ||
    user.isAdmin === true ||
    user.role === 'ADMIN' ||
    (Array.isArray(user.roles) && user.roles.includes('admin'));
  return {
    id: user.id ?? user._id ?? user.userId,
    name: user.name ?? user.username ?? user.email,
    email: user.email,
    role: isAdmin ? 'admin' : 'user',
    isAdmin,
  };
}

class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function request(path, { method = 'GET', body, auth = false, params } = {}) {
  let url = `${BASE_URL}${path}`;
  if (params) {
    const query = Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');
    if (query) url += `?${query}`;
  }

  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    throw new ApiError(
      `Could not reach the API at ${BASE_URL}. Is the backend running and is VITE_API_BASE_URL correct?`,
      0,
      networkErr
    );
  }

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await res.json().catch(() => null) : await res.text();

  if (!res.ok) {
    const message =
      (isJson && (payload?.message || payload?.error || payload?.errors?.[0]?.message)) ||
      `Request failed (${res.status})`;
    throw new ApiError(message, res.status, payload);
  }

  return payload;
}

/* ------------------------------- Auth ---------------------------------- */

export async function registerUser({ name, email, password }) {
  const data = await request('/auth/register', {
    method: 'POST',
    body: { name, email, password },
  });
  const user = normalizeUser(data.user ?? data);
  const token = data.token ?? data.accessToken;
  if (token) setSession(token, user);
  return { token, user };
}

export async function loginUser({ email, password }) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
  const user = normalizeUser(data.user ?? data);
  const token = data.token ?? data.accessToken;
  if (token) setSession(token, user);
  return { token, user };
}

export function logoutUser() {
  clearSession();
}

/* ------------------------------ Vehicles -------------------------------- */

/** Normalizes a list response that might be a bare array or wrapped
 *  ({ vehicles: [...] } / { data: [...] }). */
function normalizeList(data) {
  if (Array.isArray(data)) return data;
  return data?.vehicles ?? data?.data ?? data?.results ?? [];
}

function normalizeVehicle(v) {
  if (!v) return v;
  return {
    id: v.id ?? v._id,
    make: v.make,
    model: v.model,
    category: v.category,
    price: Number(v.price),
    quantity: Number(v.quantity ?? v.stock ?? 0),
    year: v.year,
  };
}

export async function fetchVehicles() {
  const data = await request('/vehicles', { auth: true });
  return normalizeList(data).map(normalizeVehicle);
}

export async function searchVehicles({ make, model, category, minPrice, maxPrice } = {}) {
  const data = await request('/vehicles/search', {
    auth: true,
    params: { make, model, category, minPrice, maxPrice },
  });
  return normalizeList(data).map(normalizeVehicle);
}

export async function createVehicle(vehicle) {
  const data = await request('/vehicles', { method: 'POST', body: vehicle, auth: true });
  return normalizeVehicle(data.vehicle ?? data);
}

export async function updateVehicle(id, updates) {
  const data = await request(`/vehicles/${id}`, { method: 'PUT', body: updates, auth: true });
  return normalizeVehicle(data.vehicle ?? data);
}

export async function deleteVehicle(id) {
  await request(`/vehicles/${id}`, { method: 'DELETE', auth: true });
}

export async function purchaseVehicle(id, quantity = 1) {
  const data = await request(`/vehicles/${id}/purchase`, {
    method: 'POST',
    body: { quantity },
    auth: true,
  });
  return normalizeVehicle(data.vehicle ?? data);
}

export async function restockVehicle(id, quantity) {
  const data = await request(`/vehicles/${id}/restock`, {
    method: 'POST',
    body: { quantity },
    auth: true,
  });
  return normalizeVehicle(data.vehicle ?? data);
}

export { ApiError, normalizeUser, BASE_URL };