import { useCallback, useEffect, useMemo, useState } from 'react';
import { CarFront } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { fetchVehicles, purchaseVehicle, searchVehicles } from '../api/client';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import VehicleCard from '../components/VehicleCard';

const emptyFilters = { q: '', category: '', minPrice: '', maxPrice: '' };

export default function Dashboard() {
  const { push } = useToast();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [filters, setFilters] = useState(emptyFilters);

  const hasActiveFilters =
    filters.category || filters.minPrice || filters.maxPrice || filters.q;

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = hasActiveFilters
        ? await searchVehicles({
            make: filters.q,
            model: filters.q,
            category: filters.category,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
          })
        : await fetchVehicles();
      setVehicles(data);
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.category, filters.minPrice, filters.maxPrice, filters.q]);

  // Debounce so we don't hammer /vehicles/search on every keystroke.
  useEffect(() => {
    const id = setTimeout(load, 300);
    return () => clearTimeout(id);
  }, [load]);

  // Client-side fallback filtering in case the backend's /search doesn't
  // free-text match against both make and model the way we're calling it.
  const visibleVehicles = useMemo(() => {
    if (!filters.q) return vehicles;
    const q = filters.q.toLowerCase();
    return vehicles.filter(
      (v) =>
        v.make?.toLowerCase().includes(q) ||
        v.model?.toLowerCase().includes(q) ||
        String(v.year ?? '').includes(q)
    );
  }, [vehicles, filters.q]);

  const handlePurchase = async (vehicle) => {
    try {
      const updated = await purchaseVehicle(vehicle.id, 1);
      setVehicles((prev) =>
        prev.map((v) => (v.id === vehicle.id ? { ...v, ...updated } : v))
      );
      push(`Purchased ${vehicle.make} ${vehicle.model}.`, 'success');
    } catch (err) {
      push(err.message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-concrete">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-5">
        <div>
          <h1 className="font-display text-3xl uppercase text-asphalt-800 tracking-wide">
            The lot
          </h1>
          <p className="text-asphalt-400 text-sm mt-0.5">
            Browse available inventory, updated in real time.
          </p>
        </div>

        <SearchBar
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(emptyFilters)}
          resultCount={loading ? undefined : visibleVehicles.length}
        />

        {loadError && (
          <div className="rounded-md bg-racing/10 border border-racing/30 text-racing text-sm px-4 py-3">
            Couldn't load vehicles: {loadError}
          </div>
        )}

        {loading ? (
          <SkeletonGrid />
        ) : visibleVehicles.length === 0 ? (
          <EmptyState hasActiveFilters={hasActiveFilters} onReset={() => setFilters(emptyFilters)} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {visibleVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                isAdmin={false}
                onPurchase={handlePurchase}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg border border-asphalt-200/60 bg-white overflow-hidden animate-pulse"
        >
          <div className="h-20 bg-asphalt-200" />
          <div className="p-4 flex flex-col gap-3">
            <div className="h-3 w-1/2 bg-asphalt-100 rounded" />
            <div className="h-8 w-2/3 bg-asphalt-100 rounded" />
            <div className="h-9 w-full bg-asphalt-100 rounded mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ hasActiveFilters, onReset }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4 rounded-lg border-2 border-dashed border-asphalt-200 bg-white/50">
      <CarFront size={40} className="text-asphalt-300 mb-3" />
      <h3 className="font-display text-xl uppercase text-asphalt-600">
        {hasActiveFilters ? 'No vehicles match your search' : 'The lot is empty'}
      </h3>
      <p className="text-asphalt-400 text-sm mt-1 max-w-xs">
        {hasActiveFilters
          ? 'Try widening your filters or clearing them to see the full inventory.'
          : 'Once vehicles are added, they will show up here.'}
      </p>
      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="focus-ring mt-4 text-sm font-semibold text-asphalt-800 underline underline-offset-2 hover:text-signal-dim"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
