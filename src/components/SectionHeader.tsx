import Link from 'next/link';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  viewAllLink?: string;
  viewAllText?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  viewAllLink,
  viewAllText = 'View All',
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-dark-blue">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-grayish-blue">{subtitle}</p>
        )}
      </div>
      {viewAllLink && (
        <Link
          href={viewAllLink}
          className="mt-2 sm:mt-0 text-primary-red hover:text-dark-blue font-medium transition-colors flex items-center space-x-1"
        >
          <span>{viewAllText}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  );
}
