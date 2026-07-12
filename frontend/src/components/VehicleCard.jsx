import { useState } from 'react';
import { Pencil, PackagePlus, Trash2, ShoppingCart } from 'lucide-react';
import { ConfirmDialog } from './Dialogs';

const CATEGORY_COLORS = {
  SEDAN: 'bg-green-500/15 text-green-400 border-green-500/30',
  HATCHBACK: 'bg-red-500/15 text-red-400 border-red-500/30',
  SUV: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  COMPACT_SUV: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  COUPE: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  CONVERTIBLE: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  PICKUP: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  MPV: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
  WAGON: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
  CROSSOVER: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  SPORTS: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  LUXURY: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  ELECTRIC: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  HYBRID: 'bg-lime-500/15 text-lime-400 border-lime-500/30',
  OFF_ROAD: 'bg-stone-500/15 text-stone-300 border-stone-500/30',
  default: 'bg-gray-500/15 text-gray-300 border-gray-500/30',
};

function categoryClass(category) {
  return CATEGORY_COLORS[category?.toLowerCase()] ?? CATEGORY_COLORS.default;
}

function formatCategory(category) {
  if (!category) return 'Uncategorized';
  return category
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export default function VehicleCard({ vehicle, isAdmin, onPurchase, onEdit, onDelete, onRestock }) {
  const [purchasing, setPurchasing] = useState(false);
  const [showPurchaseConfirm, setShowPurchaseConfirm] = useState(false);
  const soldOut = vehicle.quantity <= 0;
  const lowStock = vehicle.quantity > 0 && vehicle.quantity <= 2;

  const handlePurchase = async () => {
    setPurchasing(true);
    try {
      await onPurchase(vehicle);
    } finally {
      setPurchasing(false);
    }
  };

  const openPurchaseConfirm = () => {
    if (soldOut || purchasing) return;
    setShowPurchaseConfirm(true);
  };

  const confirmPurchase = async () => {
    try {
      await handlePurchase();
      setShowPurchaseConfirm(false);
    } catch {
      // Parent handler handles errors through toasts; keep dialog open only on failure.
    }
  };

  return (
    <article className="group relative bg-white rounded-lg border border-asphalt-200/60 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col">
      {/* perforated tear-off strip */}
      <div className="h-3 w-full perf-edge bg-asphalt-800" aria-hidden="true" />

      {soldOut && (
        <div
          className="absolute top-14 right-[-38px] rotate-[32deg] bg-racing text-white text-xs font-display tracking-widest px-10 py-1 shadow-md z-10 select-none"
          aria-hidden="true"
        >
          SOLD OUT
        </div>
      )}

      <div className="p-4 pb-3 bg-asphalt-800 text-concrete flex items-start justify-between gap-2">
        <div>
          <p className="font-mono text-[10px] tracking-widest text-signal uppercase">
            Stock #{String(vehicle.id).slice(-6).toUpperCase()}
          </p>
          <h3 className="font-display text-xl leading-tight mt-0.5">
            {vehicle.year ? `${vehicle.year} ` : ''}
            {vehicle.make} {vehicle.model}
          </h3>
        </div>
        {isAdmin && (
          <div className="flex gap-1 shrink-0">
            <button
              onClick={() => onEdit(vehicle)}
              className="focus-ring p-1.5 rounded hover:bg-asphalt-600 text-asphalt-200 hover:text-concrete transition-colors"
              aria-label={`Edit ${vehicle.make} ${vehicle.model}`}
              title="Edit vehicle"
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={() => onDelete(vehicle)}
              className="focus-ring p-1.5 rounded hover:bg-racing/20 text-asphalt-200 hover:text-racing transition-colors"
              aria-label={`Delete ${vehicle.make} ${vehicle.model}`}
              title="Delete vehicle"
            >
              <Trash2 size={15} />
            </button>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span
            className={`text-[11px] font-mono uppercase tracking-wide border rounded-full px-2 py-0.5 ${categoryClass(
              vehicle.category
            )}`}
          >
            {formatCategory(vehicle.category)}
          </span>
          <span
            className={`text-[11px] font-body font-medium flex items-center gap-1 ${
              soldOut ? 'text-racing' : lowStock ? 'text-signal-dim' : 'text-lot'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                soldOut ? 'bg-racing' : lowStock ? 'bg-signal' : 'bg-lot'
              }`}
            />
            {soldOut ? 'Out of stock' : `${vehicle.quantity} in stock`}
          </span>
        </div>

        <div className="mt-1 border-t border-dashed border-asphalt-200 pt-3">
          <p className="text-[10px] font-mono uppercase tracking-widest text-asphalt-400">
            Sticker price
          </p>
          <p className="font-mono text-3xl font-bold text-asphalt-800 tabular-nums">
            ₹{Number(vehicle.price).toLocaleString()}
          </p>
        </div>

        <div className="mt-auto pt-2 flex gap-2">
          <button
            onClick={openPurchaseConfirm}
            disabled={soldOut || purchasing}
            className={[
              'focus-ring flex-1 inline-flex items-center justify-center gap-1.5 rounded-md font-body font-semibold text-sm py-2.5 transition-colors',
              soldOut
                ? 'bg-asphalt-100 text-asphalt-300 cursor-not-allowed'
                : 'bg-signal text-asphalt-900 hover:bg-signal-dim disabled:opacity-60',
            ].join(' ')}
          >
            <ShoppingCart size={15} strokeWidth={2.5} />
            {soldOut ? 'Sold out' : purchasing ? 'Purchasing…' : 'Purchase'}
          </button>
          {isAdmin && (
            <button
              onClick={() => onRestock(vehicle)}
              className="focus-ring inline-flex items-center justify-center gap-1.5 rounded-md border border-asphalt-200 text-asphalt-600 hover:border-lot hover:text-lot text-sm px-3 transition-colors"
              title="Restock vehicle"
              aria-label={`Restock ${vehicle.make} ${vehicle.model}`}
            >
              <PackagePlus size={16} />
            </button>
          )}
        </div>
      </div>

      {showPurchaseConfirm && (
        <ConfirmDialog
          title="Purchase item?"
          message="Are you sure you want to purchase the item?"
          confirmLabel="Yes"
          cancelLabel="No"
          onConfirm={confirmPurchase}
          onClose={() => setShowPurchaseConfirm(false)}
        >
          <div className="mt-3 rounded-md border border-asphalt-200 bg-asphalt-50 p-3 text-sm text-asphalt-600">
            <p className="font-medium text-asphalt-800">
              {vehicle.year ? `${vehicle.year} ` : ''}
              {vehicle.make} {vehicle.model}
            </p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <span className="uppercase tracking-wider text-[11px] text-asphalt-400">Price</span>
              <span className="font-mono text-lg font-bold text-lot tabular-nums">
                ₹{Number(vehicle.price).toLocaleString()}
              </span>
            </div>
            <p className="mt-2 text-xs text-asphalt-500">
              Category: {formatCategory(vehicle.category)} · {vehicle.quantity} in stock
            </p>
          </div>
        </ConfirmDialog>
      )}
    </article>
  );
}
