import { useCallback, useEffect, useMemo, useState } from 'react';
import { CarFront } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  createVehicle,
  deleteVehicle,
  fetchVehicles,
  purchaseVehicle,
  restockVehicle,
  searchVehicles,
  updateVehicle,
} from '../api/client';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import VehicleCard from '../components/VehicleCard';
import VehicleFormModal from '../components/VehicleFormModal';
import { ConfirmDialog, RestockDialog } from '../components/Dialogs';

const emptyFilters = { q: '', category: '', minPrice: '', maxPrice: '' };

export default function Dashboard() {
  const { isAdmin } = useAuth();
  const { push } = useToast();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [filters, setFilters] = useState(emptyFilters);

  const [formTarget, setFormTarget] = useState(undefined); // undefined=closed, null=add, obj=edit
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [restockTarget, setRestockTarget] = useState(null);

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

  const handleFormSubmit = async (data) => {
    try {
      if (formTarget && formTarget.id) {
        const updated = await updateVehicle(formTarget.id, data);
        setVehicles((prev) => prev.map((v) => (v.id === formTarget.id ? { ...v, ...updated } : v)));
        push('Vehicle updated.', 'success');
      } else {
        const created = await createVehicle(data);
        setVehicles((prev) => [created, ...prev]);
        push('Vehicle added to the lot.', 'success');
      }
      setFormTarget(undefined);
    } catch (err) {
      push(err.message, 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteVehicle(deleteTarget.id);
      setVehicles((prev) => prev.filter((v) => v.id !== deleteTarget.id));
      push('Vehicle removed.', 'success');
      setDeleteTarget(null);
    } catch (err) {
      push(err.message, 'error');
    }
  };

  const handleRestock = async (amount) => {
    try {
      const updated = await restockVehicle(restockTarget.id, amount);
      setVehicles((prev) =>
        prev.map((v) => (v.id === restockTarget.id ? { ...v, ...updated } : v))
      );
      push(`Restocked ${restockTarget.make} ${restockTarget.model}.`, 'success');
      setRestockTarget(null);
    } catch (err) {
      push(err.message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-concrete">
      <Navbar onAddVehicle={() => setFormTarget(null)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display text-3xl uppercase text-asphalt-800 tracking-wide">
              The lot
            </h1>
            <p className="text-asphalt-400 text-sm mt-0.5">
              Browse available inventory, updated in real time.
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setFormTarget(null)}
              className="focus-ring sm:hidden inline-flex items-center gap-1.5 rounded-md bg-signal text-asphalt-900 font-semibold text-sm px-3.5 py-2.5"
            >
              Add vehicle
            </button>
          )}
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
                isAdmin={isAdmin}
                onPurchase={handlePurchase}
                onEdit={(v) => setFormTarget(v)}
                onDelete={(v) => setDeleteTarget(v)}
                onRestock={(v) => setRestockTarget(v)}
              />
            ))}
          </div>
        )}
      </main>

      {formTarget !== undefined && (
        <VehicleFormModal
          vehicle={formTarget}
          onClose={() => setFormTarget(undefined)}
          onSubmit={handleFormSubmit}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete vehicle?"
          message={`This will permanently remove the ${deleteTarget.make} ${deleteTarget.model} from the lot.`}
          confirmLabel="Delete"
          danger
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}

      {restockTarget && (
        <RestockDialog
          vehicle={restockTarget}
          onClose={() => setRestockTarget(null)}
          onSubmit={handleRestock}
        />
      )}
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
