import { notFound } from 'next/navigation';
import SectionHeader from '@/components/SectionHeader';
import NewsCard from '@/components/NewsCard';
import AthleteCard from '@/components/AthleteCard';
import MatchCard from '@/components/MatchCard';
import Card from '@/components/Card';
import { getFederationById } from '@/data/federations';
import { getNewsByFederation } from '@/data/news';
import { getTeamsByFederation } from '@/data/teams';
import { getAthletesByFederation } from '@/data/athletes';
import { getMatchesByFederation } from '@/data/matches';

const sportIcons: Record<string, string> = {
  football: '⚽',
  basketball: '🏀',
  volleyball: '🏐',
  taekwondo: '🥋',
};

export default function FederationPage({ params }: { params: { id: string } }) {
  const federation = getFederationById(params.id);
  
  if (!federation) {
    notFound();
  }

  const news = getNewsByFederation(federation.id);
  const teams = getTeamsByFederation(federation.id);
  const athletes = getAthletesByFederation(federation.id);
  const matches = getMatchesByFederation(federation.id);

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="bg-dark-blue text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-xl bg-white/10 flex items-center justify-center text-5xl">
              {sportIcons[federation.sport] || '🏆'}
            </div>
            <div>
              <h1 className="text-4xl font-bold">{federation.name}</h1>
              <p className="text-xl text-gray-300 mt-1">{federation.fullName}</p>
              <p className="text-grayish-blue mt-2">{federation.description}</p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-primary-red">{federation.teamsCount}</div>
              <div className="text-gray-300">Teams</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-primary-red">{federation.athletesCount}</div>
              <div className="text-gray-300">Athletes</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-primary-red">{matches.length}</div>
              <div className="text-gray-300">Matches</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-primary-red">{news.length}</div>
              <div className="text-gray-300">News</div>
            </div>
          </div>
        </div>
      </div>

      {/* Teams Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Teams" subtitle={`${federation.sport.charAt(0).toUpperCase() + federation.sport.slice(1)} teams in ${federation.name}`} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <Card key={team.id} className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-lg bg-light-gray flex items-center justify-center">
                  {team.logoUrl ? (
                    <img src={team.logoUrl} alt={team.name} className="w-12 h-12 object-contain" />
                  ) : (
                    <span className="text-2xl">{sportIcons[team.sport]}</span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-dark-blue">{team.name}</h3>
                  <p className="text-sm text-grayish-blue">{team.city}</p>
                  <p className="text-xs text-grayish-blue">{team.playersCount} players</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Athletes Section */}
      <section className="py-12 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Featured Athletes" viewAllLink="/athletes" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {athletes.slice(0, 6).map((athlete) => (
              <AthleteCard
                key={athlete.id}
                id={athlete.id}
                name={athlete.name}
                sport={athlete.sport}
                position={athlete.position}
                teamName={athlete.teamName}
                age={athlete.age}
                stats={athlete.stats}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Matches Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Matches" viewAllLink="/matches" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
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

      {/* News Section */}
      <section className="py-12 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Latest News" viewAllLink="/news" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
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
        </div>
      </section>
    </div>
  );
}
