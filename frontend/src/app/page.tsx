'use client';

import { Header } from '@/components/layout/Header';
import { Section } from '@/components/ui/Section';

export default function Home() {
  const handleViewAllPokemon = () => {
    console.log('View all Pokemon cards');
  };

  const handleViewAllMagic = () => {
    console.log('View all Magic: The Gathering cards');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Section 
          title="Pokemon Cards" 
          showViewAll={true}
          onViewAll={handleViewAllPokemon}
        >
          {/* Pokemon cards content will go here */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </Section>

        <Section 
          title="Magic: The Gathering" 
          showViewAll={true}
          onViewAll={handleViewAllMagic}
        >
          {/* Magic cards content will go here */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </Section>
      </main>
    </div>
  );
}