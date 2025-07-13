'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, Camera, ThumbsUp, MessageCircle, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Link from 'next/link';
import Image from 'next/image';
import { CartIcon } from '@/components/ui/CartIcon';
import Header from '@/components/ui/Header';

const customerReviews = [
  {
    id: 1,
    name: "Priya Sharma",
    rating: 5,
    comment: "Absolutely stunning! The craftsmanship is beyond expectations. I wore this for my wedding and received countless compliments. The Kundan work is exquisite and the gold quality is premium. Worth every penny!",
    product: "Rajwada Kundan Necklace",
    productImage: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=200",
    customerPhoto: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
    date: "2025-01-10",
    verified: true,
    helpful: 24,
    location: "Mumbai, Maharashtra"
  },
  {
    id: 2,
    name: "Anita Patel",
    rating: 5,
    comment: "Perfect for festivals! The colors are vibrant and the Meenakari work is detailed. The peacock design is so elegant. I've worn these to multiple occasions and they always get noticed. Great quality and fast delivery!",
    product: "Peacock Meenakari Earrings",
    productImage: "https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg?auto=compress&cs=tinysrgb&w=200",
    customerPhoto: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100",
    date: "2025-01-08",
    verified: true,
    helpful: 18,
    location: "Ahmedabad, Gujarat"
  },
  {
    id: 3,
    name: "Sushma Reddy",
    rating: 5,
    comment: "These bangles are a treasure! The gold work is intricate and beautiful. They feel substantial and well-made. Perfect for my daughter's wedding. The traditional design with modern finish is exactly what I was looking for.",
    product: "Maharani Gold Bangles",
    productImage: "https://images.pexels.com/photos/1458688/pexels-photo-1458688.jpeg?auto=compress&cs=tinysrgb&w=200",
    customerPhoto: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=100",
    date: "2025-01-05",
    verified: true,
    helpful: 31,
    location: "Hyderabad, Telangana"
  },
  {
    id: 4,
    name: "Kavita Singh",
    rating: 4,
    comment: "Beautiful temple jewelry! The oxidized silver finish is perfect and the goddess motifs are detailed. Only reason for 4 stars is that delivery took a bit longer than expected, but the quality makes up for it.",
    product: "Silver Temple Necklace",
    productImage: "https://images.pexels.com/photos/1454166/pexels-photo-1454166.jpeg?auto=compress&cs=tinysrgb&w=200",
    customerPhoto: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100",
    date: "2025-01-03",
    verified: true,
    helpful: 12,
    location: "Delhi, India"
  },
  {
    id: 5,
    name: "Meera Jain",
    rating: 5,
    comment: "The Polki work is exceptional! This ring is now my favorite piece. The rose gold setting complements the diamonds perfectly. Received so many compliments at the party. अलंकारिका never disappoints!",
    product: "Polki Diamond Ring",
    productImage: "https://images.pexels.com/photos/1721933/pexels-photo-1721933.jpeg?auto=compress&cs=tinysrgb&w=200",
    customerPhoto: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
    date: "2025-01-01",
    verified: true,
    helpful: 19,
    location: "Jaipur, Rajasthan"
  },
  {
    id: 6,
    name: "Deepika Nair",
    rating: 4,
    comment: "Lovely jhumkas! The antique finish is beautiful and they're comfortable to wear all day. The pearl drops add a nice touch. Good value for money. Will definitely shop again from अलंकारिका.",
    product: "Antique Jhumka Earrings",
    productImage: "https://images.pexels.com/photos/1454166/pexels-photo-1454166.jpeg?auto=compress&cs=tinysrgb&w=200",
    customerPhoto: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=100",
    date: "2024-12-28",
    verified: true,
    helpful: 8,
    location: "Kochi, Kerala"
  }
];

const reviewStats = {
  totalReviews: 247,
  averageRating: 4.8,
  ratingDistribution: {
    5: 189,
    4: 42,
    3: 12,
    2: 3,
    1: 1
  }
};

export default function ReviewsPage() {
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);

  const filteredReviews = customerReviews.filter(review => {
    if (filterRating === 'all') return true;
    return review.rating === parseInt(filterRating);
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'rating-high':
        return b.rating - a.rating;
      case 'rating-low':
        return a.rating - b.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      default: // newest
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  const WriteReviewForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="product">Product</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select a product you purchased" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rajwada-kundan">Rajwada Kundan Necklace</SelectItem>
            <SelectItem value="peacock-earrings">Peacock Meenakari Earrings</SelectItem>
            <SelectItem value="gold-bangles">Maharani Gold Bangles</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Rating</Label>
        <div className="flex gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-6 h-6 cursor-pointer hover:fill-yellow-400 hover:text-yellow-400" />
          ))}
        </div>
      </div>
      <div>
        <Label htmlFor="review">Your Review</Label>
        <Textarea
          id="review"
          placeholder="Share your experience with this product..."
          className="min-h-32"
        />
      </div>
      <div>
        <Label htmlFor="name">Your Name</Label>
        <Input id="name" placeholder="Enter your name" />
      </div>
      <div className="flex gap-2">
        <Button className="bg-gradient-to-r from-amber-600 to-orange-600">
          Submit Review
        </Button>
        <Button variant="outline" onClick={() => setIsWriteReviewOpen(false)}>
          Cancel
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
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
            Real experiences from our jewelry family
          </p>
        </motion.div>

        {/* Review Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="text-center p-6">
            <CardContent className="p-0">
              <div className="text-4xl font-bold text-amber-600 mb-2">{reviewStats.averageRating}</div>
              <div className="flex justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.floor(reviewStats.averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                ))}
              </div>
              <p className="text-gray-600">Average Rating</p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="p-0">
              <div className="text-4xl font-bold text-amber-600 mb-2">{reviewStats.totalReviews}</div>
              <p className="text-gray-600">Total Reviews</p>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardContent className="p-0">
              <div className="text-4xl font-bold text-amber-600 mb-2">98%</div>
              <p className="text-gray-600">Recommend Us</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Rating Distribution */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Card className="p-6">
            <CardHeader className="p-0 mb-6">
              <CardTitle>Rating Distribution</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-4">
                    <div className="flex items-center gap-1 w-16">
                      <span>{rating}</span>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full"
                        style={{
                          width: `${((reviewStats.ratingDistribution[rating as keyof typeof reviewStats.ratingDistribution] ?? 0) / reviewStats.totalReviews) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12">
                      {reviewStats.ratingDistribution[rating as keyof typeof reviewStats.ratingDistribution]}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters and Write Review */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex gap-4">
            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="rating-high">Highest Rating</SelectItem>
                <SelectItem value="rating-low">Lowest Rating</SelectItem>
                <SelectItem value="helpful">Most Helpful</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Dialog open={isWriteReviewOpen} onOpenChange={setIsWriteReviewOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-amber-600 to-orange-600">
                Write a Review
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Write Your Review</DialogTitle>
              </DialogHeader>
              <WriteReviewForm />
            </DialogContent>
          </Dialog>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {sortedReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="p-6">
                <CardContent className="p-0">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={review.customerPhoto} alt={review.name} />
                      <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            {review.name}
                            {review.verified && (
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                Verified Purchase
                              </Badge>
                            )}
                          </h4>
                          <p className="text-sm text-gray-500">{review.location}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                            ))}
                          </div>
                          <p className="text-sm text-gray-500">{review.date}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <Image
                          src={review.productImage}
                          alt={review.product}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <span className="text-sm font-medium text-gray-700">{review.product}</span>
                      </div>
                      
                      <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>
                      
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          Helpful ({review.helpful})
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Reviews
          </Button>
        </div>
      </div>
    </div>
  );
}