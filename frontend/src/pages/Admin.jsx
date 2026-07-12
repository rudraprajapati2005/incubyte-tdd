import { useEffect, useState } from 'react';
import { Pencil, PackagePlus, Plus, Trash2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import {
  createVehicle,
  deleteVehicle,
  fetchVehicles,
  restockVehicle,
  updateVehicle,
} from '../api/client';
import Navbar from '../components/Navbar';
import VehicleFormModal from '../components/VehicleFormModal';
import { ConfirmDialog, RestockDialog } from '../components/Dialogs';

export default function Admin() {
  const { push } = useToast();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [formTarget, setFormTarget] = useState(undefined); // undefined=closed, null=add, obj=edit
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [restockTarget, setRestockTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setVehicles(await fetchVehicles());
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

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

      await load();
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
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display text-3xl uppercase text-asphalt-800 tracking-wide">
              Manage inventory
            </h1>
            <p className="text-asphalt-400 text-sm mt-0.5">
              Add, edit, restock, or remove vehicles from the lot.
            </p>
          </div>
          <button
            onClick={() => setFormTarget(null)}
            className="focus-ring inline-flex items-center gap-1.5 rounded-md bg-signal text-asphalt-900 font-semibold text-sm px-4 py-2.5 hover:bg-signal-dim transition-colors"
          >
            <Plus size={16} strokeWidth={2.5} />
            Add vehicle
          </button>
        </div>

        {loadError && (
          <div className="rounded-md bg-racing/10 border border-racing/30 text-racing text-sm px-4 py-3">
            Couldn't load vehicles: {loadError}
          </div>
        )}

        {loading ? (
          <SkeletonTable />
        ) : vehicles.length === 0 ? (
          <div className="text-center py-16 rounded-lg border-2 border-dashed border-asphalt-200 bg-white/50">
            <p className="font-display text-lg uppercase text-asphalt-500">No vehicles yet</p>
            <p className="text-asphalt-400 text-sm mt-1">Add your first vehicle to get started.</p>
          </div>
        ) : (
          <div className="rounded-lg border border-asphalt-200/60 bg-white shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="bg-asphalt-800 text-concrete text-left">
                  <th className="font-mono text-[11px] uppercase tracking-wider font-medium px-4 py-3">Stock #</th>
                  <th className="font-mono text-[11px] uppercase tracking-wider font-medium px-4 py-3">Vehicle</th>
                  <th className="font-mono text-[11px] uppercase tracking-wider font-medium px-4 py-3">Category</th>
                  <th className="font-mono text-[11px] uppercase tracking-wider font-medium px-4 py-3 text-right">Price</th>
                  <th className="font-mono text-[11px] uppercase tracking-wider font-medium px-4 py-3 text-right">Stock</th>
                  <th className="font-mono text-[11px] uppercase tracking-wider font-medium px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((vehicle, i) => (
                  <tr
                    key={vehicle.id}
                    className={`border-t border-asphalt-100 ${i % 2 ? 'bg-asphalt-50/40' : ''}`}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-asphalt-400">
                      #{String(vehicle.id).slice(-6).toUpperCase()}
                    </td>
                    <td className="px-4 py-3 font-medium text-asphalt-800">
                      {vehicle.year ? `${vehicle.year} ` : ''}
                      {vehicle.make} {vehicle.model}
                    </td>
                    <td className="px-4 py-3 text-asphalt-500">{vehicle.category || '—'}</td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-asphalt-800">
                      ${Number(vehicle.price).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`font-mono tabular-nums font-semibold ${
                          vehicle.quantity <= 0
                            ? 'text-racing'
                            : vehicle.quantity <= 2
                            ? 'text-signal-dim'
                            : 'text-lot'
                        }`}
                      >
                        {vehicle.quantity}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setRestockTarget(vehicle)}
                          className="focus-ring p-1.5 rounded hover:bg-lot/10 text-asphalt-400 hover:text-lot transition-colors"
                          title="Restock"
                          aria-label={`Restock ${vehicle.make} ${vehicle.model}`}
                        >
                          <PackagePlus size={16} />
                        </button>
                        <button
                          onClick={() => setFormTarget(vehicle)}
                          className="focus-ring p-1.5 rounded hover:bg-asphalt-100 text-asphalt-400 hover:text-asphalt-700 transition-colors"
                          title="Edit"
                          aria-label={`Edit ${vehicle.make} ${vehicle.model}`}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(vehicle)}
                          className="focus-ring p-1.5 rounded hover:bg-racing/10 text-asphalt-400 hover:text-racing transition-colors"
                          title="Delete"
                          aria-label={`Delete ${vehicle.make} ${vehicle.model}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

function SkeletonTable() {
  return (
    <div className="rounded-lg border border-asphalt-200/60 bg-white overflow-hidden">
      <div className="h-11 bg-asphalt-800" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-14 border-t border-asphalt-100 px-4 flex items-center gap-6 animate-pulse">
          <div className="h-3 w-16 bg-asphalt-100 rounded" />
          <div className="h-3 w-40 bg-asphalt-100 rounded" />
          <div className="h-3 w-20 bg-asphalt-100 rounded" />
        </div>
      ))}
    </div>
  );
}
