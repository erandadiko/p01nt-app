'use client';

import { motion } from 'framer-motion';
import Card from './Card';

interface MatchCardProps {
  id: string | number;
  team1: { name: string; logoUrl?: string };
  team2: { name: string; logoUrl?: string };
  date: string;
  score?: string;
  status: 'scheduled' | 'live' | 'completed';
  venue?: string;
  federation: string;
}

export default function MatchCard({
  team1,
  team2,
  date,
  score,
  status,
  venue,
  federation,
}: MatchCardProps) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const formattedTime = new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const statusColors = {
    scheduled: 'bg-grayish-blue',
    live: 'bg-primary-red animate-pulse',
    completed: 'bg-dark-blue',
  };

  const statusText = {
    scheduled: 'Upcoming',
    live: 'LIVE',
    completed: 'Final',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="relative overflow-hidden">
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-xs font-semibold text-white rounded ${statusColors[status]}`}>
            {statusText[status]}
          </span>
        </div>

        {/* Federation */}
        <div className="text-xs text-grayish-blue mb-4">{federation}</div>

        {/* Teams */}
        <div className="flex items-center justify-between">
          {/* Team 1 */}
          <div className="flex-1 text-center">
            <div className="w-12 h-12 mx-auto rounded-full overflow-hidden bg-light-gray mb-2">
              {team1.logoUrl ? (
                <img src={team1.logoUrl} alt={team1.name} className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-dark-blue to-grayish-blue">
                  <span className="text-sm font-bold text-white">{team1.name.substring(0, 2)}</span>
                </div>
              )}
            </div>
            <p className="text-sm font-medium text-dark-blue truncate px-2">{team1.name}</p>
          </div>

          {/* Score / VS */}
          <div className="flex-shrink-0 px-4">
            {status === 'completed' && score ? (
              <div className="text-2xl font-bold text-dark-blue">{score}</div>
            ) : status === 'live' && score ? (
              <div className="text-2xl font-bold text-primary-red">{score}</div>
            ) : (
              <div className="text-xl font-bold text-grayish-blue">VS</div>
            )}
          </div>

          {/* Team 2 */}
          <div className="flex-1 text-center">
            <div className="w-12 h-12 mx-auto rounded-full overflow-hidden bg-light-gray mb-2">
              {team2.logoUrl ? (
                <img src={team2.logoUrl} alt={team2.name} className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-dark-blue to-grayish-blue">
                  <span className="text-sm font-bold text-white">{team2.name.substring(0, 2)}</span>
                </div>
              )}
            </div>
            <p className="text-sm font-medium text-dark-blue truncate px-2">{team2.name}</p>
          </div>
        </div>

        {/* Date & Venue */}
        <div className="mt-4 pt-4 border-t border-card-border text-center">
          <p className="text-sm font-medium text-dark-blue">
            {formattedDate} • {formattedTime}
          </p>
          {venue && (
            <p className="text-xs text-grayish-blue mt-1">{venue}</p>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
