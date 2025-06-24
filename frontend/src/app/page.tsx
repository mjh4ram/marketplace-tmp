import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';

export default function Home() {
  return (
    <Layout>
      <Container>
        <Section 
          title="Pokemon Cards" 
          showViewAll 
          onViewAll={() => console.log('View all Pokemon Cards')}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Placeholder for product cards */}
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                  <div className="w-16 h-16 bg-gray-200 rounded opacity-50"></div>
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                  Destined Rivals Booster Box
                </h3>
                <p className="text-xs text-gray-500 mb-2">SV10: Destined Rivals</p>
                <p className="text-lg font-bold text-gray-900">$63.29</p>
              </div>
            ))}
          </div>
        </Section>

        <Section 
          title="Magic: The Gathering" 
          showViewAll 
          onViewAll={() => console.log('View all Magic cards')}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Placeholder for product cards */}
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                  <div className="w-16 h-16 bg-gray-200 rounded opacity-50"></div>
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                  Ame no Habakiri no Mitsurugi
                </h3>
                <p className="text-xs text-gray-500 mb-2">Alliance Insight (ALIN)</p>
                <p className="text-lg font-bold text-gray-900">$63.29</p>
              </div>
            ))}
          </div>
        </Section>
      </Container>
    </Layout>
  );
}