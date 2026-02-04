'use client';

import { useAuth } from '@/contexts/AuthContext';
import SectionHeader from '@/components/SectionHeader';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { teams } from '@/data/teams';
import { athletes } from '@/data/athletes';

export default function TrainerDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-light-gray py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-blue">
            Trainer Dashboard
          </h1>
          <p className="text-grayish-blue mt-1">
            Welcome back, {user?.name || 'Coach'}! Manage your teams and players.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="text-center">
            <div className="text-4xl mb-2">👥</div>
            <h3 className="font-semibold text-dark-blue mb-2">Manage Players</h3>
            <Button variant="outline" size="sm">View Players</Button>
          </Card>
          <Card className="text-center">
            <div className="text-4xl mb-2">📋</div>
            <h3 className="font-semibold text-dark-blue mb-2">Team Roster</h3>
            <Button variant="outline" size="sm">Edit Roster</Button>
          </Card>
          <Card className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <h3 className="font-semibold text-dark-blue mb-2">Statistics</h3>
            <Button variant="outline" size="sm">View Stats</Button>
          </Card>
        </div>

        {/* Teams Overview */}
        <section className="mb-8">
          <SectionHeader title="Teams" subtitle="Teams in the system" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.slice(0, 6).map((team) => (
              <Card key={team.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-dark-blue">{team.name}</h3>
                    <p className="text-sm text-grayish-blue">{team.city}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary-red">{team.playersCount}</div>
                    <div className="text-xs text-grayish-blue">players</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Recent Athletes */}
        <section>
          <SectionHeader title="Athletes" subtitle="Athletes overview" />
          <Card padding="none">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-light-gray">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-dark-blue">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-dark-blue">Sport</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-dark-blue">Position</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-dark-blue">Team</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-dark-blue">Age</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border">
                  {athletes.slice(0, 8).map((athlete) => (
                    <tr key={athlete.id} className="hover:bg-light-gray/50">
                      <td className="px-4 py-3 text-dark-blue">{athlete.name}</td>
                      <td className="px-4 py-3 text-grayish-blue capitalize">{athlete.sport}</td>
                      <td className="px-4 py-3 text-grayish-blue">{athlete.position || '-'}</td>
                      <td className="px-4 py-3 text-grayish-blue">{athlete.teamName || '-'}</td>
                      <td className="px-4 py-3 text-grayish-blue">{athlete.age}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
