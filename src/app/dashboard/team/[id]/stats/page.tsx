'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Card from '@/components/Card';
import { useTrainerTeamAccess } from '@/lib/trainerAccess';

type StatsPageProps = {
  params: Promise<{ id: string }>;
};

type Match = {
  id: number;
  status: 'scheduled' | 'live' | 'completed' | string;
  score: string | null;
  team1: { id: number; name: string };
  team2: { id: number; name: string };
};

export default function TeamStatsPage({ params }: StatsPageProps) {
  const [teamId, setTeamId] = useState<number | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(true);
  const { isLoading: isAccessLoading } = useTrainerTeamAccess(teamId ?? undefined);

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      const parsed = parseInt(resolved.id, 10);
      setTeamId(Number.isNaN(parsed) ? null : parsed);
    };

    void resolveParams();
  }, [params]);

  useEffect(() => {
    const fetchMatches = async () => {
      if (!teamId) {
        return;
      }

      const response = await fetch('/api/matches?limit=200');
      if (!response.ok) {
        setIsLoadingMatches(false);
        return;
      }

      const data = await response.json();
      const allMatches = (data.matches ?? []) as Match[];
      const teamMatches = allMatches.filter((match) => match.team1.id === teamId || match.team2.id === teamId);
      setMatches(teamMatches);
      setIsLoadingMatches(false);
    };

    void fetchMatches();
  }, [teamId]);

  const completed = useMemo(() => matches.filter((m) => m.status === 'completed'), [matches]);
  const scheduled = useMemo(() => matches.filter((m) => m.status === 'scheduled'), [matches]);
  const live = useMemo(() => matches.filter((m) => m.status === 'live'), [matches]);

  if (isAccessLoading || isLoadingMatches) {
    return <div className="min-h-screen bg-light-gray py-8 px-4">Loading stats...</div>;
  }

  return (
    <div className="min-h-screen bg-light-gray py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-dark-blue">Team Statistics</h1>
          <p className="text-grayish-blue mt-1">Match overview and current team performance snapshot.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <p className="text-sm text-grayish-blue">Total Matches</p>
            <p className="text-2xl font-bold text-dark-blue">{matches.length}</p>
          </Card>
          <Card>
            <p className="text-sm text-grayish-blue">Completed</p>
            <p className="text-2xl font-bold text-dark-blue">{completed.length}</p>
          </Card>
          <Card>
            <p className="text-sm text-grayish-blue">Live</p>
            <p className="text-2xl font-bold text-dark-blue">{live.length}</p>
          </Card>
          <Card>
            <p className="text-sm text-grayish-blue">Scheduled</p>
            <p className="text-2xl font-bold text-dark-blue">{scheduled.length}</p>
          </Card>
        </div>

        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-light-gray">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-dark-blue">Match</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-dark-blue">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-dark-blue">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border">
                {matches.map((match) => (
                  <tr key={match.id}>
                    <td className="px-4 py-3 text-dark-blue">
                      {match.team1.name} vs {match.team2.name}
                    </td>
                    <td className="px-4 py-3 text-grayish-blue capitalize">{match.status}</td>
                    <td className="px-4 py-3 text-grayish-blue">{match.score ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {teamId && (
          <div className="mt-4">
            <Link href={`/dashboard/team/${teamId}`} className="text-primary-red hover:underline">
              Back to Team Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
