'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/ui/Header';

const collections = [
  { name: 'Kundan Collection', description: 'Beautifully crafted traditional Kundan jewelry.', year: '2021' },
  { name: 'Meenakari Vibrance', description: 'Vibrant and colorful Meenakari designs.', year: '2020' },
  { name: 'Classic Gold', description: 'Timeless pieces in pure gold.', year: '2019' }
];

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <Header />
      <section className="py-16 bg-white">
        <div className="container mx-auto px-2 sm:px-4">
          <motion.div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Collections</h2>
            <p className="text-xl text-gray-600">Explore our exclusive collections of exquisite jewelry</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((collection, index) => (
              <motion.div key={collection.name} className="flex items-center justify-center">
                <Card className="p-6">
                  <CardContent>
                    <Badge className="bg-orange-100 text-orange-800 text-lg px-3 py-1">{collection.year}</Badge>
                    <h3 className="text-2xl font-semibold text-gray-800 mt-4">{collection.name}</h3>
                    <p className="text-gray-600 mt-2">{collection.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
