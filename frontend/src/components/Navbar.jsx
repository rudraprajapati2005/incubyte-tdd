import { NavLink } from 'react-router-dom';
import { LogOut, Wrench } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navLinkClass = ({ isActive }) =>
  [
    'focus-ring rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
    isActive
      ? 'bg-signal text-asphalt-900'
      : 'text-asphalt-200 hover:text-concrete hover:bg-asphalt-700',
  ].join(' ');

export default function Navbar() {
  const { user, isAdmin, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-asphalt-800 border-b-4 border-signal shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-signal text-asphalt-900 font-display font-bold text-lg">
            L
          </span>
          <span className="font-display text-2xl tracking-wide text-concrete uppercase">
            IncubVent
          </span>
        </div>

        {isAuthenticated && (
          <nav className="hidden sm:flex items-center gap-1.5">
            <NavLink to="/" end className={navLinkClass}>
              The lot
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className={navLinkClass}>
                <span className="inline-flex items-center gap-1.5">
                  <Wrench size={13} strokeWidth={2.5} />
                  Manage inventory
                </span>
              </NavLink>
            )}
          </nav>
        )}

        <div className="flex items-center gap-3 shrink-0">
          {isAuthenticated && (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end leading-tight">
                <span className="text-concrete text-sm font-medium">{user?.name}</span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-signal">
                  {isAdmin ? 'Admin' : 'Member'}
                </span>
              </div>
              <button
                onClick={logout}
                className="focus-ring inline-flex items-center gap-1.5 rounded-md border border-asphalt-500 text-asphalt-200 hover:text-concrete hover:border-chrome text-sm px-3 py-2 transition-colors"
              >
                <LogOut size={15} />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {isAuthenticated && (
        <nav className="sm:hidden flex items-center gap-1.5 px-4 pb-2.5">
          <NavLink to="/" end className={navLinkClass}>
            The lot
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={navLinkClass}>
              Manage inventory
            </NavLink>
          )}
        </nav>
      )}
    </header>
  );
}
