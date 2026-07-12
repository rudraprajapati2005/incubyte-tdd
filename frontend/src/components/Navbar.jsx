import { LogOut, Wrench } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onAddVehicle }) {
  const { user, isAdmin, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-asphalt-800 border-b-4 border-signal shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-signal text-asphalt-900 font-display font-bold text-lg">
            L
          </span>
          <span className="font-display text-2xl tracking-wide text-concrete uppercase">
            Lotline
          </span>
          <span className="hidden sm:inline text-xs font-mono text-asphalt-300 border border-asphalt-500 rounded px-1.5 py-0.5 ml-1">
            Inventory
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={onAddVehicle}
              className="focus-ring hidden sm:inline-flex items-center gap-1.5 rounded-md bg-signal text-asphalt-900 font-body font-semibold text-sm px-3.5 py-2 hover:bg-signal-dim transition-colors"
            >
              <Wrench size={15} strokeWidth={2.5} />
              Add vehicle
            </button>
          )}
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
    </header>
  );
}
