'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

type AuthenticatedTrainer = {
  id: number;
  role: string;
  trainedTeam: { id: number } | null;
};

export function useTrainerTeamAccess(routeTeamId?: number) {
  const { isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [trainer, setTrainer] = useState<AuthenticatedTrainer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAccess = async () => {
      if (authLoading) {
        return;
      }

      const token = localStorage.getItem('p01nt_token');
      if (!token) {
        router.replace('/login');
        return;
      }

      const response = await fetch('/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        router.replace('/login');
        return;
      }

      const data = await response.json();
      const user = data.user as AuthenticatedTrainer;

      if (!user || user.role !== 'trainer') {
        router.replace('/login');
        return;
      }

      if (!user.trainedTeam) {
        router.replace('/login');
        return;
      }

      if (routeTeamId && user.trainedTeam.id !== routeTeamId) {
        router.replace(`/dashboard/team/${user.trainedTeam.id}`);
        return;
      }

      setTrainer(user);
      setIsLoading(false);
    };

    void verifyAccess();
  }, [authLoading, routeTeamId, router]);

  return { trainer, isLoading: isLoading || authLoading };
}
