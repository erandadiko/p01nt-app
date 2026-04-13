'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '@/components/SectionHeader';
import LoadingSpinner from '@/components/LoadingSpinner';
import Card from '@/components/Card';
import TeamModal from '@/components/TeamModal';

interface Team {
  id: number;
  name: string;
  sport: string;
  gender: string; // ✅ ADDED
  federation: { id: number; name: string; sport: string };
  logoUrl: string | null;
  stats: Record<string, unknown> | null;
  _count: {
    players: number;
  };
  trainer: {
    id: number;
    name: string;
  } | null;
}

interface TeamDetails {
  id: number;
  name: string;
  sport: string;
  federation: {
    id: number;
    name: string;
    sport: string;
    createdAt?: string;
    updatedAt?: string;
  };
  logoUrl: string | null;
  stats: Record<string, unknown> | null;
  players: {
    id: number;
    name: string;
    age: number | null;
    position: string | null;
    imageUrl: string | null;
  }[];
  trainer: {
    id: number;
    name: string;
    imageUrl: string | null;
  } | null;
}

const sportIcons: Record<string, string> = {
  football: '⚽',
  basketball: '🏀',
  volleyball: '🏐',
  taekwondo: '🥋',
};

const sportColors: Record<string, string> = {
  football: 'bg-green-500',
  basketball: 'bg-orange-500',
  volleyball: 'bg-blue-500',
  taekwondo: 'bg-purple-500',
};

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedSport, setSelectedSport] = useState<string | null>(null);

  // ✅ NEW FILTER STATES
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState<string | null>(null); // ✅ ADDED

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<TeamDetails | null>(null);
  const [isLoadingTeam, setIsLoadingTeam] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    let filtered = [...teams];

    // Team filter
    if (selectedTeamId) {
      filtered = filtered.filter(t => t.id === selectedTeamId);
    }

    // Sport filter
    if (selectedSport) {
      filtered = filtered.filter(t => t.sport === selectedSport);
    }

    // ✅ Gender filter
    if (selectedGender) {
      filtered = filtered.filter(t => t.gender === selectedGender);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => a.name.localeCompare(b.name));
    setFilteredTeams(filtered);
  }, [teams, selectedTeamId, selectedSport, searchQuery, selectedGender]); // ✅ UPDATED

  const fetchTeams = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/teams?limit=100');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch teams');
      }

      setTeams(data.teams || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTeamClick = async (teamId: number) => {
    setIsModalOpen(true);
    setIsLoadingTeam(true);
    setSelectedTeam(null);

    try {
      const response = await fetch(`/api/teams/${teamId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch team details');
      }

      setSelectedTeam(data.team);
    } catch (err) {
      console.error('Error fetching team details:', err);
    } finally {
      setIsLoadingTeam(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTeam(null);
  };

  const sports = [
    { id: null, name: 'All Sports' },
    { id: 'football', name: 'Football' },
    { id: 'basketball', name: 'Basketball' },
    { id: 'volleyball', name: 'Volleyball' },
    { id: 'taekwondo', name: 'Taekwondo' },
  ];

  return (
    <div className="min-h-screen bg-light-gray py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader 
          title="Teams" 
          subtitle="Explore teams from all Albanian sports federations"
        />

        {/* FILTER BAR */}
        <div className="bg-white rounded-xl shadow-card p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            
            {/* Search */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-dark-blue mb-1">Search</label>
              <input
                type="text"
                placeholder="Search team..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-card-border rounded-lg bg-white text-dark-blue focus:outline-none focus:ring-2 focus:ring-primary-red"
              />
            </div>

            {/* Team */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-dark-blue mb-1">Team</label>
              <select
                value={selectedTeamId ?? ''}
                onChange={(e) =>
                  setSelectedTeamId(e.target.value ? Number(e.target.value) : null)
                }
                className="w-full px-4 py-2 border border-card-border rounded-lg bg-white text-dark-blue focus:outline-none focus:ring-2 focus:ring-primary-red"
              >
                <option value="">All Teams</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sport */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-dark-blue mb-1">Sport</label>
              <select
                value={selectedSport || ''}
                onChange={(e) => setSelectedSport(e.target.value || null)}
                className="w-full px-4 py-2 border border-card-border rounded-lg bg-white text-dark-blue focus:outline-none focus:ring-2 focus:ring-primary-red"
              >
                {sports.map((sport) => (
                  <option key={sport.id || 'all'} value={sport.id || ''}>
                    {sport.name}
                  </option>
                ))}
              </select>
            </div>

            {/* ✅ Gender */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-dark-blue mb-1">Gender</label>
              <select
                value={selectedGender || ''}
                onChange={(e) => setSelectedGender(e.target.value || null)}
                className="w-full px-4 py-2 border border-card-border rounded-lg bg-white text-dark-blue focus:outline-none focus:ring-2 focus:ring-primary-red"
              >
                <option value="">All</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

          </div>
        </div>

        {/* CONTENT */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-red-500">{error}</p>
            <button 
              onClick={fetchTeams}
              className="mt-4 px-4 py-2 bg-primary-red text-white rounded-lg hover:bg-opacity-90"
            >
              Try Again
            </button>
          </div>
        ) : filteredTeams.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🏟️</div>
            <p className="text-grayish-blue">No teams found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team) => (
              <motion.div
                key={team.id}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card 
                  className="cursor-pointer group h-full"
                  onClick={() => handleTeamClick(team.id)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-light-gray flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                      {team.logoUrl ? (
                        <img src={team.logoUrl} alt={team.name} className="w-12 h-12 object-contain" />
                      ) : (
                        sportIcons[team.sport] || '🏆'
                      )}
                    </div>

                    <div className="flex-grow min-w-0">
                      <h3 className="text-lg font-bold text-dark-blue group-hover:text-primary-red transition-colors truncate">
                        {team.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 text-xs text-white rounded ${sportColors[team.sport] || 'bg-grayish-blue'}`}>
                          {team.sport.charAt(0).toUpperCase() + team.sport.slice(1)}
                        </span>
                        <span className="text-xs text-grayish-blue">{team.federation?.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-card-border">
                    <div className="flex justify-between items-center">
                      <div className="text-center">
                        <div className="text-xl font-bold text-primary-red">{team._count.players}</div>
                        <div className="text-xs text-grayish-blue">Players</div>
                      </div>
                      {team.trainer && (
                        <div className="text-right">
                          <div className="text-sm font-medium text-dark-blue truncate max-w-[120px]">
                            {team.trainer.name}
                          </div>
                          <div className="text-xs text-grayish-blue">Coach</div>
                        </div>
                      )}
                      <div className="flex items-center text-primary-red group-hover:translate-x-1 transition-transform">
                        <span className="text-sm font-medium">View</span>
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && filteredTeams.length > 0 && (
          <div className="mt-8 text-center text-grayish-blue">
            Showing {filteredTeams.length} of {teams.length} teams
          </div>
        )}
      </div>

      <TeamModal
        isOpen={isModalOpen}
        onClose={closeModal}
        team={selectedTeam}
        isLoading={isLoadingTeam}
      />
    </div>
  );
}