import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export default function Card({ children, className, hover = true, padding = 'md', onClick }: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white rounded-xl shadow-card',
        hover && 'hover:shadow-card-hover transition-shadow duration-300',
        paddingStyles[padding],
        className
      )}
    >
      {children}
    </div>
  );
}
