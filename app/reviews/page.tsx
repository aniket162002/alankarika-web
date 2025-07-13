'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Header from '@/components/ui/Header';

// For a new business, start with no reviews or just one sample
const customerReviews = [];

export default function ReviewsPage() {
  // No filter/sort needed for empty or very few reviews
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4 font-playfair">
            Customer <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Reviews</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            We’re just getting started! Be the first to share your experience and help us grow.
          </p>
        </motion.div>
        {customerReviews.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center py-24"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Heart className="w-16 h-16 text-amber-400 mb-6 animate-bounce" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No reviews yet</h2>
            <p className="text-gray-600 mb-6">Your feedback means the world to us. Be the very first to leave a review and help shape our journey!</p>
            <Button asChild className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-3 text-lg">
              <a href="/shop">Shop Now</a>
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Render reviews here if any exist */}
          </div>
        )}
      </div>
    </div>
  );
}