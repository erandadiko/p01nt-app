'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useTrainerTeamAccess } from '@/lib/trainerAccess';

type RosterPageProps = {
  params: Promise<{ id: string }>;
};

type TeamData = {
  id: number;
  name: string;
  sport: string;
  players: Array<{ id: number; name: string; position: string | null; age: number | null; gender: string | null }>;
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

export default function TeamRosterPage({ params }: RosterPageProps) {
  const [teamId, setTeamId] = useState<number | null>(null);
  const [team, setTeam] = useState<TeamData | null>(null);
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | ''>('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingTeam, setIsLoadingTeam] = useState(true);
  const { isLoading: isAccessLoading } = useTrainerTeamAccess(teamId ?? undefined);

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      const parsed = parseInt(resolved.id, 10);
      setTeamId(Number.isNaN(parsed) ? null : parsed);
    };

    void resolveParams();
  }, [params]);

  const fetchTeam = async (id: number) => {
    const response = await fetch(`/api/teams/${id}`);
    if (!response.ok) {
      setIsLoadingTeam(false);
      return;
    }
    const data = await response.json();
    setTeam(data.team as TeamData);
    setIsLoadingTeam(false);
  };

  useEffect(() => {
    if (!teamId) {
      return;
    }
    void fetchTeam(teamId);
  }, [teamId]);

  const handleAddPlayer = async (e: FormEvent) => {
    e.preventDefault();
    if (!teamId || !team) {
      return;
    }

    setError('');
    setIsSaving(true);

    const response = await fetch('/api/players', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        position: position || null,
        age: age ? parseInt(age, 10) : null,
        gender: gender || null,
        sport: team.sport,
        teamId,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || 'Failed to add player');
      setIsSaving(false);
      return;
    }

    setName('');
    setPosition('');
    setAge('');
    setGender('');
    setIsSaving(false);
    await fetchTeam(teamId);
  };

  if (isAccessLoading || isLoadingTeam) {
    return <div className="min-h-screen bg-light-gray py-8 px-4">Loading roster...</div>;
  }

  if (!team) {
    return <div className="min-h-screen bg-light-gray py-8 px-4">Team not found</div>;
  }

  return (
    <div className="min-h-screen bg-light-gray py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-dark-blue">Edit Team Roster</h1>
          <p className="text-grayish-blue mt-1">Add players and manage your team lineup.</p>
        </div>

        <Card className="mb-6">
          <form onSubmit={handleAddPlayer} className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Player Name"
              required
              className="px-4 py-2 border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red"
            />
            <input
              name="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Position"
              className="px-4 py-2 border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red"
            />
            <input
              name="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              type="number"
              min={8}
              max={60}
              placeholder="Age"
              className="px-4 py-2 border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red"
            />
            <select
              name="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value as 'MALE' | 'FEMALE' | '')}
              className="px-4 py-2 border border-card-border rounded-lg bg-white text-dark-blue focus:outline-none focus:ring-2 focus:ring-primary-red"
            >
              <option value="">Gender (optional)</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
            <Button type="submit" loading={isSaving} fullWidth>
              Add Player
            </Button>
          </form>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </Card>

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
                {team.players.map((player) => (
                  <tr key={player.id}>
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
