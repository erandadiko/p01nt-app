import HeroSection from '@/components/HeroSection';
import SectionHeader from '@/components/SectionHeader';
import FederationCard from '@/components/FederationCard';
import NewsCard from '@/components/NewsCard';
import MatchCard from '@/components/MatchCard';
import { federations } from '@/data/federations';
import { getLatestNews } from '@/data/news';
import { getUpcomingMatches } from '@/data/matches';

export default function HomePage() {
  const latestNews = getLatestNews(4);
  const upcomingMatches = getUpcomingMatches(4);

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
            {federations.map((federation) => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestNews.map((item) => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-dark-blue text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join the P01NT Community
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Whether you're a trainer, player, or sport lover, P01NT has something for you. 
            Sign up today to access personalized content and features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="px-8 py-4 bg-primary-red text-white rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-all"
            >
              Create Account
            </a>
            <a
              href="/login"
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white hover:text-dark-blue transition-all"
            >
              Sign In
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
