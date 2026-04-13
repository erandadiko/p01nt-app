import HeroSection from '@/components/HeroSection';
import JoinP01ntCommunitySection from '@/components/JoinP01ntCommunitySection';
import SectionHeader from '@/components/SectionHeader';
import FederationCard from '@/components/FederationCard';
import NewsCard from '@/components/NewsCard';
import MatchCard from '@/components/MatchCard';
import { federations } from '@/data/federations';
import { news as fallbackNews } from '@/data/news';
import { matches as fallbackMatches } from '@/data/matches';
import prisma from '@/lib/db';

async function getLatestNews() {
  try {
    const news = await prisma.news.findMany({
      take: 4,
      orderBy: { date: 'desc' },
    });
    return news;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

async function getUpcomingMatches() {
  try {
    const matches = await prisma.match.findMany({
      where: {
        date: { gte: new Date() },
        status: 'scheduled',
      },
      include: {
        team1: { select: { id: true, name: true, logoUrl: true } },
        team2: { select: { id: true, name: true, logoUrl: true } },
      },
      take: 4,
      orderBy: { date: 'asc' },
    });
    return matches;
  } catch (error) {
    console.error('Error fetching matches:', error);
    return [];
  }
}

async function getStats() {
  try {
    const [teamsCount, playersCount, matchesCount] = await Promise.all([
      prisma.team.count(),
      prisma.player.count(),
      prisma.match.count(),
    ]);
    return { teamsCount, playersCount, matchesCount };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return { teamsCount: 0, playersCount: 0, matchesCount: 0 };
  }
}

export default async function HomePage() {
  const [latestNews, upcomingMatches, stats] = await Promise.all([
    getLatestNews(),
    getUpcomingMatches(),
    getStats(),
  ]);
  const homeNews = latestNews.length > 0
    ? latestNews.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        date: item.date.toISOString(),
        federation: item.federation,
        imageUrl: item.imageUrl || undefined,
      }))
    : fallbackNews.slice(0, 4).map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        date: item.date,
        federation: item.federation,
        imageUrl: item.imageUrl,
      }));
  const homeMatches = upcomingMatches.length > 0
    ? upcomingMatches.map((match) => ({
        id: match.id,
        team1: match.team1,
        team2: match.team2,
        date: match.date.toISOString(),
        score: match.score || undefined,
        status: match.status as 'scheduled' | 'live' | 'completed',
        venue: match.venue || undefined,
        federation: match.federation,
      }))
    : fallbackMatches
        .filter((match) => match.status === 'scheduled')
        .slice(0, 4)
        .map((match) => ({
          id: match.id,
          team1: match.team1,
          team2: match.team2,
          date: match.date,
          score: match.score,
          status: match.status,
          venue: match.venue,
          federation: match.federation,
        }));

  // Update federation counts from database
  const updatedFederations = federations.map(fed => ({
    ...fed,
    teamsCount: stats.teamsCount > 0 ? Math.floor(stats.teamsCount / 4) : fed.teamsCount,
    athletesCount: stats.playersCount > 0 ? Math.floor(stats.playersCount / 4) : fed.athletesCount,
  }));

  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Federations Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Albanian Sports Federations"
            subtitle="Explore the official federations governing sports in Albania"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {updatedFederations.map((federation) => (
              <FederationCard
                key={federation.id}
                id={federation.id}
                name={federation.name}
                fullName={federation.fullName}
                sport={federation.sport}
                description={federation.description}
                teamsCount={federation.teamsCount}
                athletesCount={federation.athletesCount}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Latest News"
            subtitle="Stay updated with the latest from Albanian sports"
            viewAllLink="/news"
          />
          {homeNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {homeNews.map((item) => (
                <NewsCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  description={item.description}
                  date={item.date}
                  federation={item.federation}
                  imageUrl={item.imageUrl}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-grayish-blue">No news articles available yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Matches Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Upcoming Matches"
            subtitle="Don't miss the action"
            viewAllLink="/matches"
          />
          {homeMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {homeMatches.map((match) => (
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
          ) : (
            <div className="text-center py-12">
              <p className="text-grayish-blue">No upcoming matches scheduled.</p>
            </div>
          )}
        </div>
      </section>

      <JoinP01ntCommunitySection />
    </div>
  );
}
