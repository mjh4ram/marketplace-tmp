'use client';

import Header from '@/components/layout/Header';
import Section from '@/components/ui/Section';

export default function Home() {
  const handleViewAll = (category: string) => {
    console.log(`View all ${category}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Section 
          title="Pokemon Cards" 
          showViewAll={true} 
          onViewAll={() => handleViewAll('Pokemon Cards')}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {/* Placeholder cards */}
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4">
                <div className="aspect-[3/4] bg-gray-200 rounded-md mb-3"></div>
                <h3 className="font-medium text-sm mb-1">Destined Rivals Booster Box</h3>
                <p className="text-xs text-gray-600 mb-2">SV10: Destined Rivals</p>
                <p className="font-bold text-lg">$63.29</p>
              </div>
            ))}
          </div>
        </Section>

        <Section 
          title="Magic: The Gathering" 
          showViewAll={true} 
          onViewAll={() => handleViewAll('Magic: The Gathering')}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {/* Placeholder cards */}
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4">
                <div className="aspect-[3/4] bg-gray-200 rounded-md mb-3"></div>
                <h3 className="font-medium text-sm mb-1">Ame no Habakiri no Mitsurugi</h3>
                <p className="text-xs text-gray-600 mb-2">Alliance Insight (ALIN)</p>
                <p className="font-bold text-lg">$63.29</p>
              </div>
            ))}
          </div>
        </Section>
      </main>
    </div>
  );
}