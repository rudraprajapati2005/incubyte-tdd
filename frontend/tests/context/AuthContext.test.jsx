import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../../src/context/AuthContext';

// AuthContext delegates all network work to api/client — we mock that
// boundary so these tests exercise only the context's state machine.
vi.mock('../../src/api/client', () => ({
  getStoredUser: vi.fn(() => null),
  getToken: vi.fn(() => null),
  loginUser: vi.fn(),
  logoutUser: vi.fn(),
  registerUser: vi.fn(),
}));

import { getToken, loginUser, logoutUser, registerUser } from '../../src/api/client';

function Probe() {
  const { user, isAuthenticated, isAdmin, authError, login, register, logout } = useAuth();
  return (
    <div>
      <span data-testid="user">{user ? user.email : 'none'}</span>
      <span data-testid="authed">{String(isAuthenticated)}</span>
      <span data-testid="admin">{String(isAdmin)}</span>
      <span data-testid="error">{authError ?? ''}</span>
      <button onClick={() => login('a@b.com', 'pw')}>login</button>
      <button onClick={() => register('Ann', 'a@b.com', 'pw')}>register</button>
      <button onClick={logout}>logout</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <AuthProvider>
      <Probe />
    </AuthProvider>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getToken.mockReturnValue(null);
  });

  it('starts logged out', () => {
    renderWithProvider();
    expect(screen.getByTestId('user').textContent).toBe('none');
    expect(screen.getByTestId('authed').textContent).toBe('false');
  });

  it('logs in successfully and exposes the returned user', async () => {
    const user = userEvent.setup();
    loginUser.mockResolvedValueOnce({
      token: 'tok',
      user: { id: '1', email: 'a@b.com', role: 'admin', isAdmin: true },
    });
    getToken.mockReturnValue('tok');

    renderWithProvider();
    await user.click(screen.getByText('login'));

    await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('a@b.com'));
    expect(screen.getByTestId('admin').textContent).toBe('true');
    expect(screen.getByTestId('authed').textContent).toBe('true');
  });

  it('surfaces a failed login as authError and stays logged out', async () => {
    const user = userEvent.setup();
    loginUser.mockRejectedValueOnce(new Error('Invalid credentials'));

    renderWithProvider();
    await user.click(screen.getByText('login'));

    await waitFor(() => expect(screen.getByTestId('error').textContent).toBe('Invalid credentials'));
    expect(screen.getByTestId('authed').textContent).toBe('false');
  });

  it('registers and logs the user out again with logout()', async () => {
    const user = userEvent.setup();
    registerUser.mockResolvedValueOnce({
      token: 'tok',
      user: { id: '1', email: 'a@b.com', role: 'user' },
    });
    getToken.mockReturnValue('tok');

    renderWithProvider();
    await user.click(screen.getByText('register'));
    await waitFor(() => expect(screen.getByTestId('authed').textContent).toBe('true'));

    getToken.mockReturnValue(null);
    await user.click(screen.getByText('logout'));

    expect(logoutUser).toHaveBeenCalled();
    await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('none'));
  });
});
