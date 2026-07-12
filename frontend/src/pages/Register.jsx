import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import AuthLayout from '../components/AuthLayout';

export default function Register() {
  const { register, loading, authError, clearAuthError } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [mismatch, setMismatch] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearAuthError();
    if (password !== confirm) {
      setMismatch(true);
      return;
    }
    setMismatch(false);
    const { success, autoLoggedIn } = await register(name, email, password);
    if (success) {
      if (autoLoggedIn) {
        navigate('/', { replace: true });
      } else {
        push('Account created — sign in to continue.', 'success');
        navigate('/login', { replace: true });
      }
    }
  };

  return (
    <AuthLayout
      eyebrow="Join the dealership"
      title="Get your keys to the inventory system."
      subtitle="Register to start browsing vehicles and placing purchases. Admin accounts unlock full inventory management."
    >
      <h2 className="font-display text-2xl uppercase text-asphalt-800 mb-1">Create account</h2>
      <p className="text-sm text-asphalt-400 mb-6">It only takes a minute.</p>

      {authError && (
        <div className="mb-4 rounded-md bg-racing/10 border border-racing/30 text-racing text-sm px-3 py-2.5">
          {authError}
        </div>
      )}
      {mismatch && (
        <div className="mb-4 rounded-md bg-racing/10 border border-racing/30 text-racing text-sm px-3 py-2.5">
          Passwords don't match.
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-asphalt-500 font-medium">Full name</span>
          <input
            required
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jordan Reyes"
            className="focus-ring rounded-md border border-asphalt-200 focus:border-signal px-3 py-2.5 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-asphalt-500 font-medium">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="focus-ring rounded-md border border-asphalt-200 focus:border-signal px-3 py-2.5 text-sm"
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-asphalt-500 font-medium">Password</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="focus-ring rounded-md border border-asphalt-200 focus:border-signal px-3 py-2.5 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-asphalt-500 font-medium">Confirm</span>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              className="focus-ring rounded-md border border-asphalt-200 focus:border-signal px-3 py-2.5 text-sm"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="focus-ring mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-asphalt-800 text-concrete font-semibold text-sm py-3 hover:bg-asphalt-700 disabled:opacity-60 transition-colors"
        >
          <UserPlus size={16} />
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="text-sm text-asphalt-400 mt-6 text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-asphalt-800 font-semibold hover:text-signal-dim underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
