'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import AlbanianFlagBackground from './AlbanianFlagBackground';
import { useAuth } from '@/contexts/AuthContext';

export default function HeroSection() {
  const { user, isLoading } = useAuth();
  const isTrainerLoggedIn = Boolean(user?.role === 'trainer');

  return (
    <div className="relative min-h-[600px] flex items-center overflow-hidden">
      <AlbanianFlagBackground />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-dark-blue/70" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Welcome to <span className="text-primary-red">P01NT</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Your centralized hub for Albanian sports federations. 
            Stay updated with the latest news, matches, and athlete information.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={!isLoading && isTrainerLoggedIn ? '/dashboard' : '/login'}
              className="px-8 py-4 bg-primary-red text-white rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-all transform hover:scale-105"
            >
              {!isLoading && isTrainerLoggedIn ? 'Go to Dashboard' : 'Trainer Sign In'}
            </Link>
            <Link
              href="/federation/fshf"
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white hover:text-dark-blue transition-all"
            >
              Explore Sports
            </Link>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary-red">4</div>
              <div className="text-gray-300 mt-1">Federations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary-red">50+</div>
              <div className="text-gray-300 mt-1">Teams</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary-red">500+</div>
              <div className="text-gray-300 mt-1">Athletes</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary-red">100+</div>
              <div className="text-gray-300 mt-1">Matches/Year</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
