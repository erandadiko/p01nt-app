'use client';

import { useAuth } from '@/contexts/AuthContext';
import SectionHeader from '@/components/SectionHeader';
import NewsCard from '@/components/NewsCard';
import MatchCard from '@/components/MatchCard';
import Card from '@/components/Card';
import { getLatestNews } from '@/data/news';
import { getUpcomingMatches } from '@/data/matches';
import { federations } from '@/data/federations';

export default function SportloverDashboard() {
  const { user } = useAuth();
  const latestNews = getLatestNews(4);
  const upcomingMatches = getUpcomingMatches(4);

  return (
    <div className="min-h-screen bg-light-gray py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-blue">
            Welcome back, {user?.name || 'Sport Lover'}!
          </h1>
          <p className="text-grayish-blue mt-1">
            Stay updated with the latest from Albanian sports
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {federations.map((fed) => (
            <Card key={fed.id} className="text-center">
              <div className="text-3xl mb-2">
                {fed.sport === 'football' && '⚽'}
                {fed.sport === 'basketball' && '🏀'}
                {fed.sport === 'volleyball' && '🏐'}
                {fed.sport === 'taekwondo' && '🥋'}
              </div>
              <h3 className="font-semibold text-dark-blue">{fed.name}</h3>
              <p className="text-sm text-grayish-blue">{fed.teamsCount} teams</p>
            </Card>
          ))}
        </div>

        {/* Upcoming Matches */}
        <section className="mb-8">
          <SectionHeader title="Upcoming Matches" viewAllLink="/matches" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

        {/* Latest News */}
        <section>
          <SectionHeader title="Latest News" viewAllLink="/news" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {latestNews.map((item) => (
              <NewsCard
                key={item.id}
                id={item.id}
                title={item.title}
                description={item.description}
                date={item.date}
                federation={item.federation}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
