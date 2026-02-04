'use client';

import { useState } from 'react';
import Button from './Button';

interface AthleteFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
}

interface FilterValues {
  search: string;
  sport: string | null;
  federation: string | null;
  position: string | null;
}

const sports = [
  { id: '', name: 'All Sports' },
  { id: 'football', name: 'Football' },
  { id: 'basketball', name: 'Basketball' },
  { id: 'volleyball', name: 'Volleyball' },
  { id: 'taekwondo', name: 'Taekwondo' },
];

const federations = [
  { id: '', name: 'All Federations' },
  { id: 'FSHF', name: 'FSHF - Football' },
  { id: 'FSHB', name: 'FSHB - Basketball' },
  { id: 'FSHV', name: 'FSHV - Volleyball' },
  { id: 'ATF', name: 'ATF - Taekwondo' },
];

export default function AthleteFilters({ onFilterChange }: AthleteFiltersProps) {
  const [filters, setFilters] = useState<FilterValues>({
    search: '',
    sport: null,
    federation: null,
    position: null,
  });

  const handleChange = (key: keyof FilterValues, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value || null,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      sport: null,
      federation: null,
      position: null,
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white rounded-xl shadow-card p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="md:col-span-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search athletes..."
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-grayish-blue"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Sport Filter */}
        <div>
          <select
            value={filters.sport || ''}
            onChange={(e) => handleChange('sport', e.target.value)}
            className="w-full px-4 py-2 border border-card-border rounded-lg bg-white text-dark-blue focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent"
          >
            {sports.map((sport) => (
              <option key={sport.id} value={sport.id}>
                {sport.name}
              </option>
            ))}
          </select>
        </div>

        {/* Federation Filter */}
        <div>
          <select
            value={filters.federation || ''}
            onChange={(e) => handleChange('federation', e.target.value)}
            className="w-full px-4 py-2 border border-card-border rounded-lg bg-white text-dark-blue focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent"
          >
            {federations.map((fed) => (
              <option key={fed.id} value={fed.id}>
                {fed.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters & Reset */}
      {(filters.search || filters.sport || filters.federation) && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="px-3 py-1 bg-light-gray rounded-full text-sm text-dark-blue">
                Search: {filters.search}
              </span>
            )}
            {filters.sport && (
              <span className="px-3 py-1 bg-light-gray rounded-full text-sm text-dark-blue">
                Sport: {filters.sport}
              </span>
            )}
            {filters.federation && (
              <span className="px-3 py-1 bg-light-gray rounded-full text-sm text-dark-blue">
                Federation: {filters.federation}
              </span>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
}
