'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

interface Player {
  id: number;
  name: string;
  age: number | null;
  position: string | null;
  imageUrl: string | null;
}

interface Trainer {
  id: number;
  name: string;
  imageUrl: string | null;
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
  players: Player[];
  trainer: Trainer | null;
}

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: TeamDetails | null;
  isLoading: boolean;
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

export default function TeamModal({ isOpen, onClose, team, isLoading }: TeamModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  if (isLoading) return <LoadingSpinner />;
  if (!team) return null;

  return (
    <AnimatePresence>
      <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-4 md:inset-10 lg:inset-20 z-50 overflow-hidden"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full h-full flex flex-col overflow-hidden">
              {/* Header */}
              <div className="bg-dark-blue text-white p-6 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center">
                    {team.logoUrl ? (
                      <img src={team.logoUrl} alt={team.name} className="w-12 h-12 object-contain" />
                    ) : (
                      <span className="text-3xl">{sportIcons[team.sport] || '🏆'}</span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{team.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 text-xs text-white rounded ${sportColors[team.sport] || 'bg-grayish-blue'}`}>
                        {team.sport.charAt(0).toUpperCase() + team.sport.slice(1)}
                      </span>
                      <span className="text-gray-300 text-sm">{team.federation?.name}</span>
                    </div>
                  </div>
                </div>
                
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-8">
                    {/* Coach Section */}
                    <section>
                      <h3 className="text-lg font-semibold text-dark-blue mb-4 flex items-center">
                        <span className="mr-2">👨‍🏫</span>
                        Coach
                      </h3>
                      {team.trainer ? (
                        <div className="bg-light-gray rounded-xl p-4 flex items-center space-x-4">
                          <div className="w-16 h-16 rounded-full overflow-hidden bg-white flex-shrink-0">
                            {team.trainer.imageUrl ? (
                              <img 
                                src={team.trainer.imageUrl} 
                                alt={team.trainer.name} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-dark-blue to-primary-red">
                                <span className="text-xl font-bold text-white">
                                  {team.trainer.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-dark-blue text-lg">{team.trainer.name}</h4>
                            <p className="text-grayish-blue text-sm">Head Coach</p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-light-gray rounded-xl p-4 text-center text-grayish-blue">
                          No coach information available
                        </div>
                      )}
                    </section>

                    {/* Team Stats Section */}
                    {team.stats && Object.keys(team.stats).length > 0 && (
                      <section>
                        <h3 className="text-lg font-semibold text-dark-blue mb-4 flex items-center">
                          <span className="mr-2">📊</span>
                          Team Stats
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {Object.entries(team.stats).map(([key, value]) => (
                            <div key={key} className="bg-light-gray rounded-xl p-4 text-center">
                              <div className="text-2xl font-bold text-primary-red">{String(value)}</div>
                              <div className="text-sm text-grayish-blue capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {/* Players Section */}
                    <section>
                      <h3 className="text-lg font-semibold text-dark-blue mb-4 flex items-center">
                        <span className="mr-2">🏃</span>
                        Players ({team.players.length})
                      </h3>
                      {team.players.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {team.players.map((player) => (
                            <div 
                              key={player.id} 
                              className="bg-white border border-card-border rounded-xl p-4 flex items-center space-x-3 hover:shadow-card transition-shadow"
                            >
                              <div className="w-12 h-12 rounded-full overflow-hidden bg-light-gray flex-shrink-0">
                                {player.imageUrl ? (
                                  <img 
                                    src={player.imageUrl} 
                                    alt={player.name} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-dark-blue to-primary-red">
                                    <span className="text-sm font-bold text-white">
                                      {player.name.split(' ').map(n => n[0]).join('')}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="flex-grow min-w-0">
                                <h4 className="font-medium text-dark-blue truncate">{player.name}</h4>
                                <div className="flex items-center gap-2 text-sm">
                                  {player.position && (
                                    <span className="text-grayish-blue">{player.position}</span>
                                  )}
                                  {player.age && (
                                    <span className="text-grayish-blue">• {player.age} yrs</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-light-gray rounded-xl p-8 text-center text-grayish-blue">
                          No players found for this team
                        </div>
                      )}
                    </section>
                  </div>
              </div>
            </div>
          </motion.div>
      </>
    </AnimatePresence>
  );
}
