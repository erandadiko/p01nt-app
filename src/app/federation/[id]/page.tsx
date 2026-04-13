import { notFound } from 'next/navigation';
import Link from 'next/link';
import SectionHeader from '@/components/SectionHeader';
import NewsCard from '@/components/NewsCard';
import AthleteCard from '@/components/AthleteCard';
import MatchCard from '@/components/MatchCard';
import Card from '@/components/Card';
import { getFederationById } from '@/data/federations';
import prisma from '@/lib/db';
import { Federation, Sport } from '@prisma/client';

const sportIcons: Record<string, string> = {
  football: '⚽',
  basketball: '🏀',
  volleyball: '🏐',
  taekwondo: '🥋',
};

const sportFromFederation: Record<string, string> = {
  FSHF: 'football',
  FSHB: 'basketball',
  FSHV: 'volleyball',
  ATF: 'taekwondo',
};

async function getFederationData(federationId: string) {
  const federationMap: Record<string, { id: number; name: string; sport: Sport }> = {
    fshf: { id: 1, name: 'FSHF', sport: 'football' },
    fshb: { id: 2, name: 'FSHB', sport: 'basketball' },
    fshv: { id: 3, name: 'FSHV', sport: 'volleyball' },
    atf: { id: 4, name: 'ATF', sport: 'taekwondo' },
  };
  const upperFedId = federationMap[federationId.toLowerCase()];

  if (!upperFedId) {
    return { teams: [], players: [], matches: [], news: [] };
  }
  
  try {
    const [teams, players, matches, news] = await Promise.all([
      prisma.team.findMany({
        where: { federationId: upperFedId.id },
        include: {
          trainer: { select: { name: true } },
          _count: { select: { players: true } },
        },
        orderBy: { name: 'asc' },
      }),
      prisma.player.findMany({
        where: { sport: upperFedId.sport },
        include: {
          team: { select: { name: true } },
        },
        take: 6,
        orderBy: { name: 'asc' },
      }),
      prisma.match.findMany({
        where: { federation: upperFedId.name },
        include: {
          team1: { select: { id: true, name: true, logoUrl: true } },
          team2: { select: { id: true, name: true, logoUrl: true } },
        },
        take: 6,
        orderBy: { date: 'desc' },
      }),
      prisma.news.findMany({
        where: { federation: upperFedId.name },
        take: 6,
        orderBy: { date: 'desc' },
      }),
    ]);
    
    return { teams, players, matches, news };
  } catch (error) {
    console.error('Error fetching federation data:', error);
    return { teams: [], players: [], matches: [], news: [] };
  }
}

export default async function FederationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const federation = getFederationById(id);
  
  if (!federation) {
    notFound();
  }

  const { teams, players, matches, news } = await getFederationData(id);

  const totalPlayers = teams.reduce((sum, t) => sum + t._count.players, 0);

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
              <div className="text-3xl font-bold text-primary-red">{teams.length || federation.teamsCount}</div>
              <div className="text-gray-300">Teams</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-primary-red">{totalPlayers || federation.athletesCount}</div>
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
          <SectionHeader 
            title="Teams" 
            subtitle={`${federation.sport.charAt(0).toUpperCase() + federation.sport.slice(1)} teams in ${federation.name}`}
            viewAllLink="/teams"
          />
          {teams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team) => (
                <Link href="/teams" key={team.id}>
                  <Card className="flex items-center space-x-4 cursor-pointer hover:border-primary-red transition-colors">
                    <div className="w-16 h-16 rounded-lg bg-light-gray flex items-center justify-center">
                      {team.logoUrl ? (
                        <img src={team.logoUrl} alt={team.name} className="w-12 h-12 object-contain" />
                      ) : (
                        <span className="text-2xl">{sportIcons[federation.sport]}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark-blue">{team.name}</h3>
                      {team.trainer && (
                        <p className="text-sm text-grayish-blue">Coach: {team.trainer.name}</p>
                      )}
                      <p className="text-xs text-grayish-blue">{team._count.players} players</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-grayish-blue">No teams registered yet for this federation.</p>
            </div>
          )}
        </div>
      </section>

      {/* Athletes Section */}
      <section className="py-12 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Featured Athletes" viewAllLink="/athletes" />
          {players.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {players.map((player) => (
                <AthleteCard
                  key={player.id}
                  id={player.id}
                  name={player.name}
                  sport={player.sport}
                  position={player.position || undefined}
                  teamName={player.team?.name}
                  age={player.age || undefined}
                  imageUrl={player.imageUrl || undefined}
                  stats={player.stats as Record<string, unknown> | undefined}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-grayish-blue">No athletes registered yet for this federation.</p>
            </div>
          )}
        </div>
      </section>

      {/* Matches Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Matches" viewAllLink="/matches" />
          {matches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match) => (
                <MatchCard
                  key={match.id}
                  id={match.id}
                  team1={match.team1}
                  team2={match.team2}
                  date={match.date.toISOString()}
                  score={match.score || undefined}
                  status={match.status as 'scheduled' | 'live' | 'completed'}
                  venue={match.venue || undefined}
                  federation={match.federation}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-grayish-blue">No matches scheduled yet for this federation.</p>
            </div>
          )}
        </div>
      </section>

      {/* News Section */}
      <section className="py-12 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Latest News" viewAllLink="/news" />
          {news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <NewsCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  description={item.description}
                  date={item.date.toISOString()}
                  federation={item.federation}
                  imageUrl={item.imageUrl || undefined}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-grayish-blue">No news articles available yet for this federation.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
