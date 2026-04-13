'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useTrainerTeamAccess } from '@/lib/trainerAccess';

type TeamDashboardPageProps = {
  params: Promise<{ id: string }>;
};

type TeamData = {
  id: number;
  name: string;
  sport: string;
  gender: string;
  federation: { name: string };
  trainer: { name: string };
  players: Array<{ id: number }>;
};

export default function TeamDashboardPage({ params }: TeamDashboardPageProps) {
  const router = useRouter();
  const [teamId, setTeamId] = useState<number | null>(null);
  const [team, setTeam] = useState<TeamData | null>(null);
  const [isTeamLoading, setIsTeamLoading] = useState(true);

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      const parsed = parseInt(resolved.id, 10);
      setTeamId(Number.isNaN(parsed) ? null : parsed);
    };

    void resolveParams();
  }, [params]);

  const { trainer, isLoading: isAccessLoading } = useTrainerTeamAccess(teamId ?? undefined);

  useEffect(() => {
    const fetchTeam = async () => {
      if (!teamId || !trainer?.trainedTeam || trainer.trainedTeam.id !== teamId) {
        return;
      }

      const response = await fetch(`/api/teams/${teamId}`);
      if (!response.ok) {
        setIsTeamLoading(false);
        return;
      }

      const data = await response.json();
      setTeam(data.team as TeamData);
      setIsTeamLoading(false);
    };

    void fetchTeam();
  }, [teamId, trainer?.trainedTeam]);

  const isLoading = isAccessLoading || isTeamLoading;
  const safeTeamId = useMemo(() => teamId ?? trainer?.trainedTeam?.id, [teamId, trainer?.trainedTeam?.id]);

  if (isLoading) {
    return <div className="min-h-screen bg-light-gray py-8 px-4">Loading dashboard...</div>;
  }

  if (!team || !safeTeamId) {
    return <div className="min-h-screen bg-light-gray py-8 px-4">Team not found</div>;
  }

  return (
    <div className="min-h-screen bg-light-gray py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-dark-blue mb-2">{team.name}</h1>
        <p className="text-grayish-blue mb-6">
          Team dashboard for {team.sport} ({team.gender})
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <h2 className="text-sm text-grayish-blue">Federation</h2>
            <p className="text-lg font-semibold text-dark-blue">{team.federation.name}</p>
          </Card>
          <Card>
            <h2 className="text-sm text-grayish-blue">Trainer</h2>
            <p className="text-lg font-semibold text-dark-blue">{team.trainer.name}</p>
          </Card>
          <Card>
            <h2 className="text-sm text-grayish-blue">Players</h2>
            <p className="text-lg font-semibold text-dark-blue">{team.players.length}</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="text-center">
            <div className="text-4xl mb-2">👥</div>
            <h3 className="font-semibold text-dark-blue mb-2">Manage Players</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => router.push(`/dashboard/team/${safeTeamId}/players`)}
            >
              View Players
            </Button>
          </Card>
          <Card className="text-center">
            <div className="text-4xl mb-2">📋</div>
            <h3 className="font-semibold text-dark-blue mb-2">Team Roster</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => router.push(`/dashboard/team/${safeTeamId}/roster`)}
            >
              Edit Roster
            </Button>
          </Card>
          <Card className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <h3 className="font-semibold text-dark-blue mb-2">Statistics</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => router.push(`/dashboard/team/${safeTeamId}/stats`)}
            >
              View Stats
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
