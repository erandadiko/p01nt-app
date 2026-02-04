'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Card from './Card';

interface NewsCardProps {
  id: string | number;
  title: string;
  description: string;
  date: string;
  federation: string;
  imageUrl?: string;
  link?: string;
}

export default function NewsCard({
  id,
  title,
  description,
  date,
  federation,
  imageUrl,
  link,
}: NewsCardProps) {
  const federationColors: Record<string, string> = {
    FSHF: 'bg-green-500',
    FSHB: 'bg-orange-500',
    FSHV: 'bg-blue-500',
    ATF: 'bg-purple-500',
  };

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const content = (
    <Card padding="none" className="overflow-hidden h-full flex flex-col">
      {/* Image */}
      <div className="relative h-48 bg-light-gray">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-dark-blue to-primary-red">
            <span className="text-4xl font-bold text-white opacity-50">P01NT</span>
          </div>
        )}
        {/* Federation Badge */}
        <span
          className={`absolute top-3 left-3 px-2 py-1 text-xs font-semibold text-white rounded ${
            federationColors[federation] || 'bg-grayish-blue'
          }`}
        >
          {federation}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-sm text-grayish-blue mb-2">{formattedDate}</span>
        <h3 className="text-lg font-semibold text-dark-blue mb-2 line-clamp-2 group-hover:text-primary-red transition-colors">
          {title}
        </h3>
        <p className="text-grayish-blue text-sm line-clamp-3 flex-grow">
          {description}
        </p>
        <div className="mt-4 flex items-center text-primary-red font-medium text-sm">
          <span>Read More</span>
          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Card>
  );

  if (link) {
    return (
      <motion.a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="group block"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.div
      className="group"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/news/${id}`}>
        {content}
      </Link>
    </motion.div>
  );
}
