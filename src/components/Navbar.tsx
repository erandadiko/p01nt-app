'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

const sports = [
  { id: 'football', name: 'Football', federation: 'FSHF', href: '/federation/fshf' },
  { id: 'basketball', name: 'Basketball', federation: 'FSHB', href: '/federation/fshb' },
  { id: 'volleyball', name: 'Volleyball', federation: 'FSHV', href: '/federation/fshv' },
  { id: 'taekwondo', name: 'Taekwondo', federation: 'ATF', href: '/federation/atf' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSportsOpen, setIsSportsOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-dark-blue shadow-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white">P<span className="text-primary-red">01</span>NT</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-primary-red transition-colors">
              Home
            </Link>
            
            {/* Sports Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSportsOpen(!isSportsOpen)}
                onMouseEnter={() => setIsSportsOpen(true)}
                className="text-white hover:text-primary-red transition-colors flex items-center space-x-1"
              >
                <span>Sports</span>
                <svg className={`w-4 h-4 transition-transform ${isSportsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <AnimatePresence>
                {isSportsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onMouseLeave={() => setIsSportsOpen(false)}
                    className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden"
                  >
                    {sports.map((sport) => (
                      <Link
                        key={sport.id}
                        href={sport.href}
                        className="block px-4 py-3 text-dark-blue hover:bg-light-gray hover:text-primary-red transition-colors"
                        onClick={() => setIsSportsOpen(false)}
                      >
                        <span className="font-medium">{sport.name}</span>
                        <span className="block text-xs text-grayish-blue">{sport.federation}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/news" className="text-white hover:text-primary-red transition-colors">
              News
            </Link>
            <Link href="/matches" className="text-white hover:text-primary-red transition-colors">
              Matches
            </Link>
            <Link href="/athletes" className="text-white hover:text-primary-red transition-colors">
              Athletes
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  href={`/dashboard/${user.role}`}
                  className="text-white hover:text-primary-red transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-white border border-white rounded-lg hover:bg-white hover:text-dark-blue transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-white hover:text-primary-red transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-primary-red text-white rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark-blue border-t border-grayish-blue"
          >
            <div className="px-4 py-4 space-y-3">
              <Link href="/" className="block text-white hover:text-primary-red" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              {sports.map((sport) => (
                <Link
                  key={sport.id}
                  href={sport.href}
                  className="block text-white hover:text-primary-red pl-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {sport.name}
                </Link>
              ))}
              <Link href="/news" className="block text-white hover:text-primary-red" onClick={() => setIsMenuOpen(false)}>
                News
              </Link>
              <Link href="/matches" className="block text-white hover:text-primary-red" onClick={() => setIsMenuOpen(false)}>
                Matches
              </Link>
              <Link href="/athletes" className="block text-white hover:text-primary-red" onClick={() => setIsMenuOpen(false)}>
                Athletes
              </Link>
              
              <div className="pt-4 border-t border-grayish-blue space-y-3">
                {user ? (
                  <>
                    <Link
                      href={`/dashboard/${user.role}`}
                      className="block text-white hover:text-primary-red"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => { logout(); setIsMenuOpen(false); }}
                      className="block text-white hover:text-primary-red"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block text-white hover:text-primary-red" onClick={() => setIsMenuOpen(false)}>
                      Login
                    </Link>
                    <Link href="/register" className="block text-primary-red font-medium" onClick={() => setIsMenuOpen(false)}>
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
