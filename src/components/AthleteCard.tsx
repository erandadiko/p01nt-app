'use client';

import { motion } from 'framer-motion';
import Card from './Card';

interface AthleteCardProps {
  id: string | number;
  name: string;
  sport: string;
  position?: string;
  teamName?: string;
  age?: number;
  gender?: string;
  imageUrl?: string;
  stats?: Record<string, unknown>;
}

export default function AthleteCard({
  id: _id,
  name,
  sport,
  position,
  teamName,
  age,
  gender,
  imageUrl,
  stats,
}: AthleteCardProps) {
  void _id;

  const sportColors: Record<string, string> = {
    football: 'bg-green-500',
    basketball: 'bg-orange-500',
    volleyball: 'bg-blue-500',
    taekwondo: 'bg-purple-500',
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card>
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <div className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden bg-light-gray">
            {imageUrl ? (
              <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-dark-blue to-primary-red">
                <span className="text-xl font-bold text-white">
                  {name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-grow min-w-0">
            <h3 className="text-lg font-semibold text-dark-blue truncate">
              {name}
            </h3>
            <div className="flex items-center space-x-2 text-sm">
              <span className={`px-2 py-0.5 text-xs text-white rounded ${sportColors[sport] || 'bg-grayish-blue'}`}>
                {sport.charAt(0).toUpperCase() + sport.slice(1)}
              </span>
              {position && (
                <span className="text-grayish-blue">{position}</span>
              )}
            </div>
            {teamName && (
              <p className="text-sm text-grayish-blue mt-1 truncate">{teamName}</p>
            )}
            {gender && (
              <p className="text-sm text-grayish-blue mt-1">Gender: {gender}</p>
            )}
          </div>

          {/* Age */}
          {age && (
            <div className="flex-shrink-0 text-center">
              <div className="text-lg font-bold text-dark-blue">{age}</div>
              <div className="text-xs text-grayish-blue">years</div>
            </div>
          )}
        </div>

        {/* Stats Preview */}
        {stats && Object.keys(stats).length > 0 && (
          <div className="mt-4 pt-4 border-t border-card-border">
            <div className="flex justify-between text-sm">
              {Object.entries(stats).slice(0, 3).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div className="font-semibold text-dark-blue">{String(value)}</div>
                  <div className="text-xs text-grayish-blue capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
