'use client';

import { useState, useEffect } from 'react';
import AthleteCard from '@/components/AthleteCard';
import AthleteFilters from '@/components/AthleteFilters';
import SectionHeader from '@/components/SectionHeader';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Athlete {
  id: number;
  name: string;
  age: number | null;
  gender: string | null;
  sport: string;
  position: string | null;
  imageUrl: string | null;
  stats: Record<string, unknown> | null;
  team: {
    id: number;
    name: string;
    federation: string;
  } | null;
}

interface FilterValues {
  search: string;
  sport: string | null;
  federation: string | null;
  position: string | null;
  gender: string | null;
}

const normalizeSport = (sport: string | null | undefined): string => {
  if (!sport) {
    return '';
  }
  return sport.toLowerCase().trim();
};

const formatGender = (gender: string | null): string => {
  if (!gender) {
    return '-';
  }
  const normalized = gender.toUpperCase();
  if (normalized === 'M') return 'Male';
  if (normalized === 'F') return 'Female';
  if (normalized === 'MALE') return 'Male';
  if (normalized === 'FEMALE') return 'Female';
  return '-';
};

export default function AthletesPage() {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [filteredAthletes, setFilteredAthletes] = useState<Athlete[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAthletes();
  }, []);

  const fetchAthletes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/players?fetchAll=true');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch athletes');
      }
      
      setAthletes(data.players || []);
      setFilteredAthletes(data.players || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filters: FilterValues) => {
    let filtered = [...athletes];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(a => 
        a.name.toLowerCase().includes(searchLower)
      );
    }

    if (filters.sport) {
      const selectedSport = normalizeSport(filters.sport);
      filtered = filtered.filter((a) => normalizeSport(a.sport) === selectedSport);
    }

    if (filters.federation) {
      filtered = filtered.filter(a => a.team?.federation === filters.federation);
    }

    if (filters.gender) {
      filtered = filtered.filter(
        (a) => (a.gender ? a.gender.toUpperCase() : null) === filters.gender
      );
    }

    setFilteredAthletes(filtered);
  };

  return (
    <div className="min-h-screen bg-light-gray py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader 
          title="Athletes" 
          subtitle="Browse athletes from all Albanian sports federations"
        />

        <div className="bg-white rounded-xl shadow-card p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <AthleteFilters onFilterChange={handleFilterChange} />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-red-500">{error}</p>
            <button 
              onClick={fetchAthletes}
              className="mt-4 px-4 py-2 bg-primary-red text-white rounded-lg hover:bg-opacity-90"
            >
              Try Again
            </button>
          </div>
        ) : filteredAthletes.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🏃</div>
            <p className="text-grayish-blue">No athletes found</p>
            <p className="text-sm text-grayish-blue mt-2">
              {athletes.length === 0 
                ? 'No athletes have been added to the database yet.'
                : 'Try adjusting your filters to see more results.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAthletes.map((athlete) => (
              <AthleteCard
                key={athlete.id}
                id={athlete.id}
                name={athlete.name}
                sport={athlete.sport}
                position={athlete.position || undefined}
                teamName={athlete.team?.name}
                age={athlete.age || undefined}
                gender={formatGender(athlete.gender)}
                imageUrl={athlete.imageUrl || undefined}
                stats={athlete.stats as Record<string, unknown> | undefined}
              />
            ))}
          </div>
        )}

        {!isLoading && filteredAthletes.length > 0 && (
          <div className="mt-8 text-center text-grayish-blue">
            Showing {filteredAthletes.length} of {athletes.length} athletes
          </div>
        )}
      </div>
    </div>
  );
}
