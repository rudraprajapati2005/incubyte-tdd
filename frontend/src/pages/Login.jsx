import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';

export default function Login() {
  const { login, loading, authError, clearAuthError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearAuthError();
    const ok = await login(email, password);
    if (ok) navigate(from, { replace: true });
  };

  return (
    <AuthLayout
      eyebrow="Dealer access"
      title="Walk the lot without leaving your desk."
      subtitle="Sign in to browse live inventory, place holds, and — for admins — manage stock across the whole dealership."
    >
      <h2 className="font-display text-2xl uppercase text-asphalt-800 mb-1">Sign in</h2>
      <p className="text-sm text-asphalt-400 mb-6">Welcome back. Enter your details below.</p>

      {authError && (
        <div className="mb-4 rounded-md bg-racing/10 border border-racing/30 text-racing text-sm px-3 py-2.5">
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-asphalt-500 font-medium">Email</span>
          <input
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="focus-ring rounded-md border border-asphalt-200 focus:border-signal px-3 py-2.5 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-asphalt-500 font-medium">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="focus-ring rounded-md border border-asphalt-200 focus:border-signal px-3 py-2.5 text-sm"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="focus-ring mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-asphalt-800 text-concrete font-semibold text-sm py-3 hover:bg-asphalt-700 disabled:opacity-60 transition-colors"
        >
          <LogIn size={16} />
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="text-sm text-asphalt-400 mt-6 text-center">
        New to IncubVent?{' '}
        <Link to="/register" className="text-asphalt-800 font-semibold hover:text-signal-dim underline underline-offset-2">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
