'use client';

import { motion } from 'framer-motion';
import { Heart, Award, Users, Globe, Sparkles, Crown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/ui/Header';

const milestones = [
  { year: '2024', event: 'Alankarika is founded with a dream to bring unique jewelry to everyone', icon: Crown },
  { year: '2024', event: 'First collection launched online', icon: Sparkles },
  { year: '2024', event: 'Welcomed our first happy customers', icon: Heart },
  { year: '2024', event: 'Started building our jewelry community', icon: Users }
];

const values = [
  {
    title: 'Passion',
    description: 'We are driven by a love for jewelry and a desire to create something truly special for every customer.',
    icon: Heart
  },
  {
    title: 'Quality',
    description: 'Every piece is crafted with care, using only trusted materials and attention to detail.',
    icon: Award
  },
  {
    title: 'Originality',
    description: 'We believe in fresh, unique designs that help you express your individuality.',
    icon: Sparkles
  },
  {
    title: 'Customer Focus',
    description: 'Your satisfaction is our top priority. We are here to make your jewelry experience joyful and memorable.',
    icon: Users
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
              Welcome to Alankarika! We are a new jewelry brand with a big dream: to make every moment shine with unique, beautiful pieces designed just for you.
            </p>
            <Badge className="bg-gradient-to-r from-amber-600 to-orange-600 text-white text-lg px-6 py-2">
              Where New Traditions Begin
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
                  Alankarika was born in 2024 from a passion for jewelry and a vision to bring fresh, original designs to everyone. We are a small, dedicated team of creators, dreamers, and jewelry lovers based in Mumbai.
                </p>
                <p>
                  Our journey is just beginning, but our commitment is strong: to offer jewelry that is as unique as you are, crafted with care and attention to detail.
                </p>
                <p>
                  We believe every piece should tell a story—your story. Whether it’s a gift, a celebration, or just because, we want to make your moments sparkle.
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
                alt="Jewelry Crafting"
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
            <p className="text-xl text-gray-600">A new chapter in jewelry begins</p>
          </motion.div>
          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year + milestone.event}
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
            <p className="text-xl text-gray-600">What makes us different</p>
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
              Join Our Journey
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Be part of our story from the very beginning. Discover jewelry that’s made with heart, for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-amber-600 hover:bg-gray-100">
                <Link href="/collections">Explore Collections</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-amber-600">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}