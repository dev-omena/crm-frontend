'use client';

import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
}

interface SearchFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  showFilters: boolean;
  onToggleFilters: () => void;
  filterOptions?: Array<{
    label: string;
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
    type?: 'select' | 'buttons';
  }>;
  activeFilters?: Record<string, string>;
}

export default function SearchFilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  showFilters,
  onToggleFilters,
  filterOptions = [],
  activeFilters = {},
}: SearchFilterBarProps) {
  return (
    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        {/* Filter Button */}
        <button
          onClick={onToggleFilters}
          className={`px-4 py-2 text-sm border rounded-lg transition-all flex items-center gap-2 ${
            showFilters
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Filter Options */}
      {showFilters && filterOptions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 pt-3 border-t border-gray-100"
        >
          <div className={`grid grid-cols-1 ${filterOptions.length > 2 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
            {filterOptions.map((filter) =>
              filter.type === 'buttons' ? (
                <div key={filter.label} className="col-span-full">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {filter.label}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {filter.options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => filter.onChange(option.value)}
                        className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                          activeFilters[filter.label] === option.value
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div key={filter.label}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {filter.label}
                  </label>
                  <select
                    value={activeFilters[filter.label] || filter.options[0]?.value || ''}
                    onChange={(e) => filter.onChange(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
