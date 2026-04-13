'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTrainerTeamAccess } from '@/lib/trainerAccess';

export default function TrainerDashboard() {
  const router = useRouter();
  const { trainer, isLoading } = useTrainerTeamAccess();

  useEffect(() => {
    if (!isLoading && trainer?.trainedTeam?.id) {
      router.replace(`/dashboard/team/${trainer.trainedTeam.id}`);
    }
  }, [isLoading, router, trainer?.trainedTeam?.id]);

  return <div className="min-h-screen bg-light-gray py-8 px-4">Redirecting to your team dashboard...</div>;
}
