'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Card from './Card';

interface FederationCardProps {
  id: string;
  name: string;
  fullName: string;
  sport: string;
  description: string;
  logoUrl?: string;
  teamsCount: number;
  athletesCount: number;
}

const sportIcons: Record<string, string> = {
  football: '⚽',
  basketball: '🏀',
  volleyball: '🏐',
  taekwondo: '🥋',
};

export default function FederationCard({
  id,
  name,
  fullName,
  sport,
  description,
  logoUrl,
  teamsCount,
  athletesCount,
}: FederationCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/federation/${id.toLowerCase()}`}>
        <Card className="h-full group cursor-pointer">
          <div className="flex items-start space-x-4">
            {/* Logo/Icon */}
            <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-light-gray flex items-center justify-center text-3xl">
              {logoUrl ? (
                <img src={logoUrl} alt={name} className="w-12 h-12 object-contain" />
              ) : (
                sportIcons[sport] || '🏆'
              )}
            </div>
            
            {/* Info */}
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-dark-blue group-hover:text-primary-red transition-colors">
                {name}
              </h3>
              <p className="text-sm text-grayish-blue">{fullName}</p>
            </div>
          </div>

          <p className="mt-4 text-grayish-blue text-sm line-clamp-2">
            {description}
          </p>

          {/* Stats */}
          <div className="mt-4 pt-4 border-t border-card-border flex justify-between">
            <div className="text-center">
              <div className="text-lg font-bold text-primary-red">{teamsCount}</div>
              <div className="text-xs text-grayish-blue">Teams</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-primary-red">{athletesCount}</div>
              <div className="text-xs text-grayish-blue">Athletes</div>
            </div>
            <div className="flex items-center text-primary-red">
              <span className="text-sm font-medium">View</span>
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
