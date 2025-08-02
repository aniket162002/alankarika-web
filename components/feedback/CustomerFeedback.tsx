'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Feedback {
  id: string;
  customer_name: string;
  rating: number;
  feedback_text: string;
  product_name?: string;
  image_url?: string;
  is_featured: boolean;
  created_at: string;
}

interface CustomerFeedbackProps {
  className?: string;
  showTitle?: boolean;
  maxItems?: number;
}

export default function CustomerFeedback({ 
  className = '', 
  showTitle = true, 
  maxItems = 6 
}: CustomerFeedbackProps) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch feedback data
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('customer_feedback')
          .select('*')
          .eq('is_approved', true)
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: false })
          .limit(maxItems);

        if (error) throw error;
        setFeedbacks(data || []);
      } catch (err) {
        console.error('Error fetching feedback:', err);
        setError('Failed to load customer feedback');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();

    // Set up real-time subscription
    const subscription = supabase
      .channel('customer_feedback_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'customer_feedback',
          filter: 'is_approved=eq.true'
        }, 
        () => {
          fetchFeedbacks(); // Refetch when data changes
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [maxItems]);

  // Auto-rotate feedback every 5 seconds
  useEffect(() => {
    if (feedbacks.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % feedbacks.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [feedbacks.length]);

  const nextFeedback = () => {
    setCurrentIndex((prev) => (prev + 1) % feedbacks.length);
  };

  const prevFeedback = () => {
    setCurrentIndex((prev) => (prev - 1 + feedbacks.length) % feedbacks.length);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className={`py-16 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading customer feedback...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || feedbacks.length === 0) {
    return null; // Don't show anything if there's an error or no feedback
  }

  const currentFeedback = feedbacks[currentIndex];

  return (
    <section className={`py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden ${className}`}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-yellow-200/30 to-amber-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {showTitle && (
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mb-6 shadow-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              Happy Customers
            </h2>
            <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
              Discover what our valued customers say about their experience with our exquisite jewelry collection
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-12 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
              <div className="w-3 h-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
              <div className="w-12 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
            </div>
          </motion.div>
        )}

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-orange-50/50"></div>
                  <CardContent className="relative p-8 md:p-12">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      {/* Customer Avatar/Image */}
                      <div className="flex-shrink-0 relative">
                        {currentFeedback.image_url ? (
                          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden shadow-xl ring-4 ring-amber-200">
                            <img
                              src={currentFeedback.image_url}
                              alt={`${currentFeedback.customer_name}'s feedback`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex items-center justify-center text-white text-2xl md:text-3xl font-bold shadow-xl ring-4 ring-amber-200">
                            {currentFeedback.customer_name.charAt(0)}
                          </div>
                        )}
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>

                      {/* Feedback Content */}
                      <div className="flex-1 text-center md:text-left">
                        <div className="relative">
                          <Quote className="w-10 h-10 text-amber-500 mb-4 mx-auto md:mx-0 opacity-80" />
                          <div className="absolute -top-2 -left-2 w-6 h-6 bg-amber-100 rounded-full"></div>
                        </div>

                        <blockquote className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed font-medium italic">
                          "{currentFeedback.feedback_text}"
                        </blockquote>

                        <div className="space-y-4">
                          <div className="flex items-center justify-center md:justify-start gap-3">
                            <div className="flex items-center gap-1">
                              {renderStars(currentFeedback.rating)}
                            </div>
                            <span className="text-sm font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                              {currentFeedback.rating}/5 Stars
                            </span>
                          </div>

                          <div className="border-t border-gray-100 pt-4">
                            <p className="font-bold text-gray-900 text-xl mb-1">
                              {currentFeedback.customer_name}
                            </p>
                            <p className="text-sm text-gray-500 mb-2">Verified Customer</p>
                            {currentFeedback.product_name && (
                              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100">
                                📿 {currentFeedback.product_name}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            {feedbacks.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg border-amber-200 hover:border-amber-300 text-amber-600 hover:text-amber-700 transition-all duration-200"
                  onClick={prevFeedback}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg border-amber-200 hover:border-amber-300 text-amber-600 hover:text-amber-700 transition-all duration-200"
                  onClick={nextFeedback}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </>
            )}
          </div>

          {/* Dots Indicator */}
          {feedbacks.length > 1 && (
            <div className="flex justify-center mt-10 gap-3">
              {feedbacks.map((_, index) => (
                <button
                  key={index}
                  className={`relative transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-8 h-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-lg'
                      : 'w-3 h-3 bg-gray-300 hover:bg-amber-300 rounded-full hover:scale-110'
                  }`}
                  onClick={() => setCurrentIndex(index)}
                >
                  {index === currentIndex && (
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Customer count badge */}
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-amber-200">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-gray-700">
                {feedbacks.length} Happy Customer{feedbacks.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
