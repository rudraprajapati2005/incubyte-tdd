import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const CATEGORIES = ['Sedan', 'SUV', 'Truck', 'Coupe', 'Hatchback', 'Convertible', 'Van'];

const emptyForm = { make: '', model: '', category: 'Sedan', price: '', quantity: '', year: '' };

export default function VehicleFormModal({ vehicle, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const isEdit = !!vehicle;

  useEffect(() => {
    if (vehicle) {
      setForm({
        make: vehicle.make ?? '',
        model: vehicle.model ?? '',
        category: vehicle.category ?? 'Sedan',
        price: vehicle.price ?? '',
        quantity: vehicle.quantity ?? '',
        year: vehicle.year ?? '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [vehicle]);

  const validate = () => {
    const e = {};
    if (!form.make.trim()) e.make = 'Required';
    if (!form.model.trim()) e.model = 'Required';
    if (form.price === '' || Number(form.price) < 0) e.price = 'Enter a valid price';
    if (form.quantity === '' || Number(form.quantity) < 0) e.quantity = 'Enter a valid quantity';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity),
        year: form.year ? Number(form.year) : undefined,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-asphalt-900/70 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vehicle-form-title"
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-asphalt-800 px-5 py-4 flex items-center justify-between border-b-4 border-signal">
          <h2 id="vehicle-form-title" className="font-display text-xl text-concrete uppercase tracking-wide">
            {isEdit ? 'Edit vehicle' : 'Add vehicle to lot'}
          </h2>
          <button
            onClick={onClose}
            className="focus-ring p-1 rounded text-asphalt-300 hover:text-concrete"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Make" error={errors.make}>
              <input
                autoFocus
                value={form.make}
                onChange={(e) => setForm({ ...form, make: e.target.value })}
                placeholder="Toyota"
                className={inputClass(errors.make)}
              />
            </Field>
            <Field label="Model" error={errors.model}>
              <input
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                placeholder="Camry"
                className={inputClass(errors.model)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputClass()}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Year (optional)">
              <input
                type="number"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                placeholder="2026"
                className={inputClass()}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Price ($)" error={errors.price}>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="24999"
                className={inputClass(errors.price)}
              />
            </Field>
            <Field label="Quantity in stock" error={errors.quantity}>
              <input
                type="number"
                min="0"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                placeholder="4"
                className={inputClass(errors.quantity)}
              />
            </Field>
          </div>

          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="focus-ring flex-1 rounded-md border border-asphalt-200 text-asphalt-600 font-medium text-sm py-2.5 hover:bg-asphalt-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="focus-ring flex-1 rounded-md bg-signal text-asphalt-900 font-semibold text-sm py-2.5 hover:bg-signal-dim disabled:opacity-60"
            >
              {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Add to lot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-asphalt-500 font-medium">{label}</span>
      {children}
      {error && <span className="text-racing text-xs">{error}</span>}
    </label>
  );
}

function inputClass(error) {
  return `focus-ring rounded-md border px-3 py-2 text-sm text-asphalt-800 ${
    error ? 'border-racing' : 'border-asphalt-200 focus:border-signal'
  }`;
}
