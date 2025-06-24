'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

export default function Section({ 
  children, 
  className,
  title,
  subtitle,
  showViewAll = false,
  onViewAll
}: SectionProps) {
  return (
    <section className={cn('py-8', className)}>
      {(title || subtitle) && (
        <div className="flex items-center justify-between mb-6">
          <div>
            {title && (
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                {title}
                <svg 
                  className="ml-2 h-5 w-5 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
              </h2>
            )}
            {subtitle && (
              <p className="text-gray-600">{subtitle}</p>
            )}
          </div>
          {showViewAll && (
            <button
              onClick={onViewAll}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              View All
            </button>
          )}
        </div>
      )}
      {children}
    </section>
  );
}