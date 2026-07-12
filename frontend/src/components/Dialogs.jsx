import { createPortal } from 'react-dom';
import { useState } from 'react';
import { AlertTriangle, PackagePlus, X } from 'lucide-react';

export function ConfirmDialog({
  title,
  message,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger,
  onConfirm,
  onClose,
}) {
  const [busy, setBusy] = useState(false);
  const handleConfirm = async () => {
    setBusy(true);
    try {
      await onConfirm();
    } finally {
      setBusy(false);
    }
  };
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-asphalt-900/70 backdrop-blur-sm p-4"
      role="alertdialog"
      aria-modal="true"
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm p-5">
        <div className="flex items-start gap-3">
          <span className={`p-2 rounded-full ${danger ? 'bg-racing/10 text-racing' : 'bg-signal/15 text-signal-dim'}`}>
            <AlertTriangle size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-lg uppercase tracking-wide text-asphalt-800">{title}</h3>
            {message && <p className="text-sm text-asphalt-500 mt-1">{message}</p>}
            {children}
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button
            onClick={onClose}
            className="focus-ring flex-1 rounded-md border border-asphalt-200 text-asphalt-600 font-medium text-sm py-2.5 hover:bg-asphalt-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={handleConfirm}
            disabled={busy}
            className={`focus-ring flex-1 rounded-md font-semibold text-sm py-2.5 text-white disabled:opacity-60 ${
              danger ? 'bg-racing hover:bg-racing/90' : 'bg-lot hover:bg-lot/90'
            }`}
          >
            {busy ? 'Working…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function RestockDialog({ vehicle, onClose, onSubmit }) {
  const [amount, setAmount] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (amount <= 0) return;
    setSubmitting(true);
    try {
      await onSubmit(amount);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-asphalt-900/70 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="bg-asphalt-800 px-5 py-4 flex items-center justify-between border-b-4 border-lot">
          <h2 className="font-display text-xl text-concrete uppercase tracking-wide flex items-center gap-2">
            <PackagePlus size={18} className="text-lot" />
            Restock
          </h2>
          <button onClick={onClose} className="focus-ring p-1 rounded text-asphalt-300 hover:text-concrete" aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <p className="text-sm text-asphalt-500">
            {vehicle.year ? `${vehicle.year} ` : ''}
            {vehicle.make} {vehicle.model} — currently{' '}
            <span className="font-semibold text-asphalt-700">{vehicle.quantity}</span> in stock.
          </p>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-asphalt-500 font-medium">Units to add</span>
            <input
              type="number"
              min="1"
              autoFocus
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="focus-ring rounded-md border border-asphalt-200 focus:border-lot px-3 py-2 text-sm text-asphalt-800"
            />
          </label>
          <div className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="focus-ring flex-1 rounded-md border border-asphalt-200 text-asphalt-600 font-medium text-sm py-2.5 hover:bg-asphalt-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || amount <= 0}
              className="focus-ring flex-1 rounded-md bg-lot text-white font-semibold text-sm py-2.5 hover:bg-lot/90 disabled:opacity-60"
            >
              {submitting ? 'Restocking…' : 'Confirm restock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
