'use client';

import { useAuth } from '@/contexts/AuthContext';
import SectionHeader from '@/components/SectionHeader';
import Card from '@/components/Card';
import MatchCard from '@/components/MatchCard';
import { getUpcomingMatches } from '@/data/matches';

export default function PlayerDashboard() {
  const { user } = useAuth();
  const upcomingMatches = getUpcomingMatches(3);

  // Sample stats for demo
  const stats = {
    matches: 24,
    goals: 8,
    assists: 5,
    rating: 7.2,
  };

  return (
    <div className="min-h-screen bg-light-gray py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-dark-blue to-primary-red flex items-center justify-center text-3xl font-bold text-white mb-4 md:mb-0">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'P'}
            </div>
            <div className="flex-grow">
              <h1 className="text-2xl font-bold text-dark-blue">{user?.name || 'Player'}</h1>
              <p className="text-grayish-blue">Professional Athlete</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-3 py-1 bg-primary-red/10 text-primary-red rounded-full text-sm">
                  Football
                </span>
                <span className="px-3 py-1 bg-dark-blue/10 text-dark-blue rounded-full text-sm">
                  Forward
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <div className="text-3xl font-bold text-primary-red">{stats.matches}</div>
            <div className="text-grayish-blue">Matches</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-primary-red">{stats.goals}</div>
            <div className="text-grayish-blue">Goals</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-primary-red">{stats.assists}</div>
            <div className="text-grayish-blue">Assists</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-primary-red">{stats.rating}</div>
            <div className="text-grayish-blue">Avg Rating</div>
          </Card>
        </div>

        {/* Upcoming Matches */}
        <section className="mb-8">
          <SectionHeader title="Upcoming Matches" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingMatches.map((match) => (
              <MatchCard
                key={match.id}
                id={match.id}
                team1={match.team1}
                team2={match.team2}
                date={match.date}
                score={match.score}
                status={match.status}
                venue={match.venue}
                federation={match.federation}
              />
            ))}
          </div>
        </section>

        {/* Performance Overview */}
        <section>
          <SectionHeader title="Performance Overview" />
          <Card>
            <div className="text-center py-8 text-grayish-blue">
              <div className="text-4xl mb-4">📊</div>
              <p>Detailed performance charts and analytics coming soon!</p>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
