import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';

const CATEGORIES = [
  "SEDAN",
        "HATCHBACK",
        "SUV",
        "COMPACT_SUV",
        "COUPE",
        "CONVERTIBLE",
        "PICKUP",
        "MPV",
        "WAGON",
        "CROSSOVER",
        "SPORTS",
        "LUXURY",
        "ELECTRIC",
        "HYBRID",
        "OFF_ROAD",
]
export default function SearchBar({ filters, onChange, onReset, resultCount }) {
  const [expanded, setExpanded] = useState(false);

  const hasActiveFilters =
    filters.category || filters.minPrice || filters.maxPrice || filters.q;

  return (
    <div className="bg-asphalt-800 rounded-lg border border-asphalt-600 shadow-sm">
      <div className="flex items-center gap-2 p-2.5">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-asphalt-300"
          />
          <input
            type="text"
            value={filters.q}
            onChange={(e) => onChange({ ...filters, q: e.target.value })}
            placeholder="Search make or model — e.g. Toyota Camry"
            className="focus-ring w-full bg-asphalt-700 text-concrete placeholder:text-asphalt-300 text-sm rounded-md pl-9 pr-3 py-2.5 border border-transparent focus:border-signal"
          />
        </div>
        <button
          onClick={() => setExpanded((v) => !v)}
          className={`focus-ring inline-flex items-center gap-1.5 rounded-md text-sm px-3 py-2.5 border transition-colors ${
            expanded || hasActiveFilters
              ? 'bg-signal text-asphalt-900 border-signal font-semibold'
              : 'border-asphalt-500 text-asphalt-200 hover:text-concrete'
          }`}
        >
          <SlidersHorizontal size={15} />
          <span className="hidden sm:inline">Filters</span>
        </button>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="focus-ring inline-flex items-center gap-1 text-sm text-asphalt-300 hover:text-racing px-2 py-2.5"
            title="Clear all filters"
          >
            <X size={15} />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>

      {expanded && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 px-2.5 pb-2.5">
          <select
            value={filters.category}
            onChange={(e) => onChange({ ...filters, category: e.target.value })}
            className="focus-ring bg-asphalt-700 text-concrete text-sm rounded-md px-3 py-2 border border-transparent focus:border-signal"
          >
            <option value="">Any category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="0"
            value={filters.minPrice}
            onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
            placeholder="Min price (₹)"
            className="focus-ring bg-asphalt-700 text-concrete placeholder:text-asphalt-300 text-sm rounded-md px-3 py-2 border border-transparent focus:border-signal"
          />
          <input
            type="number"
            min="0"
            value={filters.maxPrice}
            onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
            placeholder="Max price (₹)"
            className="focus-ring bg-asphalt-700 text-concrete placeholder:text-asphalt-300 text-sm rounded-md px-3 py-2 border border-transparent focus:border-signal"
          />
        </div>
      )}

      {typeof resultCount === 'number' && (
        <div className="px-3.5 pb-2 text-[11px] font-mono uppercase tracking-wider text-asphalt-300">
          {resultCount} {resultCount === 1 ? 'vehicle' : 'vehicles'} on the lot
        </div>
      )}
    </div>
  );
}
