import { useState } from 'react';
import { Pencil, PackagePlus, Trash2, ShoppingCart } from 'lucide-react';

const CATEGORY_COLORS = {
  sedan: 'bg-lot/15 text-lot border-lot/30',
  suv: 'bg-signal/15 text-signal-dim border-signal/30',
  truck: 'bg-racing/15 text-racing border-racing/30',
  coupe: 'bg-asphalt-500/40 text-chrome border-chrome/30',
  default: 'bg-asphalt-500/40 text-chrome border-chrome/30',
};

function categoryClass(category) {
  return CATEGORY_COLORS[category?.toLowerCase()] ?? CATEGORY_COLORS.default;
}

export default function VehicleCard({ vehicle, isAdmin, onPurchase, onEdit, onDelete, onRestock }) {
  const [purchasing, setPurchasing] = useState(false);
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
            {vehicle.category || 'Uncategorized'}
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
            ${Number(vehicle.price).toLocaleString()}
          </p>
        </div>

        <div className="mt-auto pt-2 flex gap-2">
          <button
            onClick={handlePurchase}
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
    </article>
  );
}
