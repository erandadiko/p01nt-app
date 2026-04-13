'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '@/components/Card';
import { useTrainerTeamAccess } from '@/lib/trainerAccess';

type PlayersPageProps = {
  params: Promise<{ id: string }>;
};

type Player = {
  id: number;
  name: string;
  position: string | null;
  age: number | null;
  gender: string | null;
};

const formatGender = (gender: string | null) => {
  if (!gender) {
    return '-';
  }
  const normalized = gender.toUpperCase();
  if (normalized === 'M' || normalized === 'MALE') {
    return 'Male';
  }
  if (normalized === 'F' || normalized === 'FEMALE') {
    return 'Female';
  }
  return '-';
};

export default function TeamPlayersPage({ params }: PlayersPageProps) {
  const [teamId, setTeamId] = useState<number | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(true);
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
    const fetchPlayers = async () => {
      if (!teamId) {
        return;
      }

      const response = await fetch(`/api/players?teamId=${teamId}&limit=200`);
      if (!response.ok) {
        setIsLoadingPlayers(false);
        return;
      }

      const data = await response.json();
      setPlayers((data.players ?? []) as Player[]);
      setIsLoadingPlayers(false);
    };

    void fetchPlayers();
  }, [teamId]);

  if (isAccessLoading || isLoadingPlayers) {
    return <div className="min-h-screen bg-light-gray py-8 px-4">Loading players...</div>;
  }

  return (
    <div className="min-h-screen bg-light-gray py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-dark-blue">Team Players</h1>
          <p className="text-grayish-blue mt-1">All players assigned to your team.</p>
        </div>

        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-light-gray">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-dark-blue">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-dark-blue">Position</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-dark-blue">Age</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-dark-blue">Gender</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border">
                {players.map((player) => (
                  <tr key={player.id} className="hover:bg-light-gray/50">
                    <td className="px-4 py-3 text-dark-blue">{player.name}</td>
                    <td className="px-4 py-3 text-grayish-blue">{player.position ?? '-'}</td>
                    <td className="px-4 py-3 text-grayish-blue">{player.age ?? '-'}</td>
                    <td className="px-4 py-3 text-grayish-blue">
                      {formatGender(player.gender)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {players.length === 0 && (
            <div className="p-4 text-sm text-grayish-blue">No players found for your team.</div>
          )}
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
