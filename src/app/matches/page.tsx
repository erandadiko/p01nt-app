'use client';

import { useState, useEffect } from 'react';
import MatchCard from '@/components/MatchCard';
import SectionHeader from '@/components/SectionHeader';
import LoadingSpinner from '@/components/LoadingSpinner';
import { matches as fallbackMatches } from '@/data/matches';

interface Match {
  id: number | string;
  date: string;
  score: string | null;
  status: string;
  venue: string | null;
  federation: string;
  team1: {
    id: number | string;
    name: string;
    logoUrl: string | null;
  };
  team2: {
    id: number | string;
    name: string;
    logoUrl: string | null;
  };
}

const toMatches = (items: typeof fallbackMatches): Match[] =>
  items.map((match) => ({
    id: match.id,
    date: match.date,
    score: match.score ?? null,
    status: match.status,
    venue: match.venue ?? null,
    federation: match.federation,
    team1: {
      id: match.team1.id,
      name: match.team1.name,
      logoUrl: match.team1.logoUrl ?? null,
    },
    team2: {
      id: match.team2.id,
      name: match.team2.name,
      logoUrl: match.team2.logoUrl ?? null,
    },
  }));

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFederation, setSelectedFederation] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);

  const federationIdMap: Record<string, number> = {
    FSHF: 1,
    FSHB: 2,
    FSHV: 3,
    ATF: 4,
  };

  useEffect(() => {
    void fetchMatches();
  }, [selectedFederation, statusFilter]);

  const fetchMatches = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.set('fetchAll', 'true');
      if (selectedFederation) {
        params.set('federation', selectedFederation);
        const mappedId = federationIdMap[selectedFederation];
        if (mappedId) {
          params.set('federationId', String(mappedId));
        }
      }
      if (statusFilter !== 'all') {
        params.set('status', statusFilter);
      }

      const response = await fetch(`/api/matches?${params.toString()}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch matches');
      }

      const apiMatches = data.matches || [];
      const resolvedMatches = apiMatches.length > 0 ? apiMatches : toMatches(fallbackMatches);
      setMatches(resolvedMatches);
      setFilteredMatches(resolvedMatches);
    } catch (err) {
      console.error('Falling back to local matches data:', err);
      const fallback = toMatches(fallbackMatches)
        .filter((match) => (selectedFederation ? match.federation === selectedFederation : true))
        .filter((match) => (statusFilter !== 'all' ? match.status === statusFilter : true));
      setMatches(fallback);
      setFilteredMatches(fallback);
      setError(null);
    } finally {
      setIsLoading(false);
    }
  };


  const federations = [
    { id: null, name: 'All Federations' },
    { id: 'FSHF', name: 'FSHF - Football' },
    { id: 'FSHB', name: 'FSHB - Basketball' },
    { id: 'FSHV', name: 'FSHV - Volleyball' },
    { id: 'ATF', name: 'ATF - Taekwondo' },
  ];

  return (
    <div className="min-h-screen bg-light-gray py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader 
          title="Matches" 
          subtitle="View upcoming and past matches across all federations"
        />

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-card p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-dark-blue mb-1">Federation</label>
              <select
                value={selectedFederation || ''}
                onChange={(e) => setSelectedFederation(e.target.value || null)}
                className="w-full px-4 py-2 border border-card-border rounded-lg bg-white text-dark-blue focus:outline-none focus:ring-2 focus:ring-primary-red"
              >
                {federations.map((fed) => (
                  <option key={fed.id || 'all'} value={fed.id || ''}>
                    {fed.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-dark-blue mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-card-border rounded-lg bg-white text-dark-blue focus:outline-none focus:ring-2 focus:ring-primary-red"
              >
                <option value="all">All Matches</option>
                <option value="scheduled">Upcoming</option>
                <option value="live">Live</option>
                <option value="completed">Completed</option>
              </select>
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
              onClick={fetchMatches}
              className="mt-4 px-4 py-2 bg-primary-red text-white rounded-lg hover:bg-opacity-90"
            >
              Try Again
            </button>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">⚽</div>
            <p className="text-grayish-blue">No matches found</p>
            <p className="text-sm text-grayish-blue mt-2">
              {matches.length === 0 
                ? 'No matches have been scheduled yet.'
                : 'Try adjusting your filters to see more results.'}
            </p>
          </div>
        ) : (
          <>
            {/* Upcoming Matches */}
            {filteredMatches.filter(m => m.status === 'scheduled').length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-dark-blue mb-4">Upcoming Matches</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMatches
                    .filter(m => m.status === 'scheduled')
                    .map((match) => (
                      <MatchCard
                        key={match.id}
                        id={match.id}
                        team1={match.team1}
                        team2={match.team2}
                        date={match.date}
                        score={match.score || undefined}
                        status={match.status as 'scheduled' | 'live' | 'completed'}
                        venue={match.venue || undefined}
                        federation={match.federation}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* Live Matches */}
            {filteredMatches.filter(m => m.status === 'live').length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-primary-red mb-4">🔴 Live Now</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMatches
                    .filter(m => m.status === 'live')
                    .map((match) => (
                      <MatchCard
                        key={match.id}
                        id={match.id}
                        team1={match.team1}
                        team2={match.team2}
                        date={match.date}
                        score={match.score || undefined}
                        status={match.status as 'scheduled' | 'live' | 'completed'}
                        venue={match.venue || undefined}
                        federation={match.federation}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* Completed Matches */}
            {filteredMatches.filter(m => m.status === 'completed').length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-dark-blue mb-4">Recent Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMatches
                    .filter(m => m.status === 'completed')
                    .map((match) => (
                      <MatchCard
                        key={match.id}
                        id={match.id}
                        team1={match.team1}
                        team2={match.team2}
                        date={match.date}
                        score={match.score || undefined}
                        status={match.status as 'scheduled' | 'live' | 'completed'}
                        venue={match.venue || undefined}
                        federation={match.federation}
                      />
                    ))}
                </div>
              </div>
            )}
          </>
        )}

        {!isLoading && filteredMatches.length > 0 && (
          <div className="mt-8 text-center text-grayish-blue">
            Showing {filteredMatches.length} of {matches.length} matches
          </div>
        )}
      </div>
    </div>
  );
}
