'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const ROLE_HOME: Record<string, string> = {
  trainer: '/dashboard/trainer',
  player: '/dashboard/player',
  sportlover: '/dashboard/sportlover',
};

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    router.replace(ROLE_HOME[user.role] ?? '/login');
  }, [isLoading, router, user]);

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-light-gray">
      <p className="text-dark-blue">Loading dashboard…</p>
    </div>
  );
}
