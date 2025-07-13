'use client';

import { motion } from 'framer-motion';
import { Heart, Award, Users, Globe, Sparkles, Crown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { CartIcon } from '@/components/ui/CartIcon';
import Header from '@/components/ui/Header';

const milestones = [
  { year: '1985', event: 'Founded by Master Craftsman Rajesh Kumar', icon: Crown },
  { year: '1995', event: 'Expanded to traditional Kundan jewelry', icon: Sparkles },
  { year: '2005', event: 'Introduced Meenakari collections', icon: Heart },
  { year: '2015', event: 'Launched online presence', icon: Globe },
  { year: '2020', event: 'Reached 10,000+ happy customers', icon: Users },
  { year: '2025', event: 'Leading traditional jewelry brand', icon: Award }
];

const values = [
  {
    title: 'Authenticity',
    description: 'Every piece reflects genuine Indian craftsmanship and traditional techniques passed down through generations.',
    icon: Crown
  },
  {
    title: 'Quality',
    description: 'We use only the finest materials - pure gold, sterling silver, and authentic gemstones.',
    icon: Award
  },
  {
    title: 'Heritage',
    description: 'Our designs are inspired by the rich cultural heritage of India, from Mughal courts to Rajasthani palaces.',
    icon: Sparkles
  },
  {
    title: 'Customer Love',
    description: 'Every customer is part of our family. We ensure each piece brings joy and confidence.',
    icon: Heart
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-maroon-900/20 to-orange-900/20" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-playfair">
              About <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">अलंकारिका</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              For over four decades, अलंकारिका has been the custodian of India&apos;s rich jewelry heritage,
              creating timeless pieces that celebrate the beauty of traditional craftsmanship.
            </p>
            <Badge className="bg-gradient-to-r from-amber-600 to-orange-600 text-white text-lg px-6 py-2">
              Where Tradition Meets Elegance
            </Badge>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6 font-playfair">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  अलंकारिका was born from a passion for preserving India&apos;s magnificent jewelry traditions.
                  Founded in 1985 by Master Craftsman Rajesh Kumar, our journey began in the bustling lanes 
                  of Old Delhi, where generations of artisans have perfected their craft.
                </p>
                <p>
                  What started as a small workshop has grown into a celebrated brand, but our commitment 
                  remains unchanged - to create jewelry that tells stories, celebrates heritage, and 
                  makes every woman feel like royalty.
                </p>
                <p>
                  Each piece in our collection is a testament to the skill of our master craftsmen, 
                  who have inherited techniques from the Mughal era and the royal courts of Rajasthan. 
                  We don&apos;t just make jewelry; we create heirlooms.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <Image
                src="https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Traditional Jewelry Crafting"
                width={800}
                height={384}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-lg" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-playfair">Our Journey</h2>
            <p className="text-xl text-gray-600">Four decades of excellence and tradition</p>
          </motion.div>
          
          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                className="flex items-center gap-6 mb-8 last:mb-0"
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full flex items-center justify-center">
                    <milestone.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <Card className="p-6">
                    <CardContent className="p-0">
                      <div className="flex items-center gap-4">
                        <Badge className="bg-amber-100 text-amber-800 text-lg px-3 py-1">
                          {milestone.year}
                        </Badge>
                        <p className="text-gray-700 font-medium">{milestone.event}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-playfair">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full text-center p-6 hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6 font-playfair">
              Experience the अलंकारिका Difference
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have made अलंकारिका their trusted jewelry partner
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-amber-600 hover:bg-gray-100">
                <Link href="/collections">Explore Collections</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-amber-600">
                <Link href="/contact">Visit Our Store</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}