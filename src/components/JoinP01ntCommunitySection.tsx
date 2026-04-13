'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function JoinP01ntCommunitySection() {
  const { user, isLoading } = useAuth();

  if (!isLoading && user?.role === 'trainer') {
    return null;
  }

  return (
    <section className="py-20 bg-dark-blue text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Join the P01NT Community
        </h2>
        <p className="text-lg text-gray-300 mb-8">
          Are you a trainer? Sign in to manage your teams and players and access your personalized dashboard.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/login"
            className="px-8 py-4 bg-primary-red text-white rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-all"
          >
            Sign in
          </a>
        </div>
      </div>
    </section>
  );
}
