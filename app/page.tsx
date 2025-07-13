'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, Search, Menu, X, Phone, Mail, MapPin, MessageCircle, Sparkles, Camera, ChevronLeft, ChevronRight, User as UserIcon, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/cart/CartProvider';
import { CartIcon } from '@/components/ui/CartIcon';
import { formatNumber, formatCurrency } from '@/lib/utils/formatNumber';
import { createClient } from '@supabase/supabase-js'
import { useSupabaseRealtime } from '@/hooks/useSupabaseRealtime';
import { useUser } from '@/hooks/useUser';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import Header from '@/components/ui/Header';  

// Update Product type to match Supabase schema
// Fetch product data from Supabase
// type Product = {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   originalPrice: number;
//   category: string;
//   material: string;
//   occasion: string;
//   image: string;
//   hoverImage: string;
//   rating: number;
//   reviews: number;
//   story: string;
// };

// Updated Product type
interface Product {
  id: string;
  name: string;
  short_description?: string;
  description?: string;
  price: number;
  category?: string;
  discount?: number;
  image_url?: string;
  in_stock?: boolean;
  created_at?: string;
  story?: string;
  [key: string]: any;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const fetchProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('in_stock', true)
    .order('name', { ascending: true });

  if (error) console.error('Error fetching products:', error);
  return data as Product[];
};


const categories = ["All", "Necklaces", "Earrings", "Bangles", "Rings"];
const materials = ["All", "Gold", "Silver", "Kundan", "Meenakari"];
const occasions = ["All", "Bridal", "Festive", "Daily Wear"];

const customerReviews = [
  {
    id: 1,
    name: "Priya Sharma",
    rating: 5,
    comment: "Absolutely stunning! The craftsmanship is beyond expectations. I wore this for my wedding and received countless compliments.",
    product: "Rajwada Kundan Necklace",
    image: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=200",
    customerPhoto: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
    date: "2025-01-10"
  },
  {
    id: 2,
    name: "Anita Patel",
    rating: 5,
    comment: "Perfect for festivals! The colors are vibrant and the quality is excellent. Highly recommended!",
    product: "Peacock Meenakari Earrings",
    image: "https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg?auto=compress&cs=tinysrgb&w=200",
    customerPhoto: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100",
    date: "2025-01-08"
  },
  {
    id: 3,
    name: "Sushma Reddy",
    rating: 5,
    comment: "These bangles are a treasure! The gold work is intricate and beautiful. Worth every penny.",
    product: "Maharani Gold Bangles",
    image: "https://images.pexels.com/photos/1458688/pexels-photo-1458688.jpeg?auto=compress&cs=tinysrgb&w=200",
    customerPhoto: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=100",
    date: "2025-01-05"
  }
];

// Fetch carousel data from Supabase
type CarouselSlide = {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  button_text: string;
  button_link: string;
  display_order: number;
  is_active: boolean;
};

const fetchCarouselSlides = async () => {
  const { data, error } = await supabase
    .from('carousel_slides')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) console.error('Error fetching carousel slides:', error);
  return data as CarouselSlide[];
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [carouselImages, setCarouselImages] = useState<CarouselSlide[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("All");
  const [selectedOccasion, setSelectedOccasion] = useState<string>("All");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [festiveMode, setFestiveMode] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isVirtualTryOnOpen, setIsVirtualTryOnOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentCarouselSlide, setCurrentCarouselSlide] = useState(0);
const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragDelta, setDragDelta] = useState(0);
  const { user, logout, loading: userLoading } = useUser();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }
    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileDropdownOpen]);

  // Real-time carousel data
  const realtimeCarouselImages = useSupabaseRealtime(fetchCarouselSlides, 'carousel_slides', []);
  useEffect(() => {
    if (realtimeCarouselImages) setCarouselImages(realtimeCarouselImages);
  }, [realtimeCarouselImages]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productsData, carouselData] = await Promise.all([
          fetchProducts(),
          fetchCarouselSlides()
        ]);

        setProducts(productsData || []);
        setCarouselImages(carouselData || []);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Fallback carousel images if no data from Supabase
  const fallbackCarouselImages = [
    {
      id: '1',
      title: 'Bridal Collection',
      subtitle: 'Exquisite jewelry for your special day',
      image_url: 'https://images.pexels.com/photos/1689731/pexels-photo-1689731.jpeg?auto=compress&cs=tinysrgb&w=1200',
      button_text: 'Shop Now',
      button_link: '/collections/bridal',
      display_order: 1,
      is_active: true
    },
    {
      id: '2',
      title: 'Festival Specials',
      subtitle: 'Celebrate with our traditional designs',
      image_url: 'https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg?auto=compress&cs=tinysrgb&w=1200',
      button_text: 'Explore',
      button_link: '/collections/festival',
      display_order: 2,
      is_active: true
    },
    {
      id: '3',
      title: 'Heritage Collection',
      subtitle: 'Timeless pieces inspired by royal traditions',
      image_url: 'https://images.pexels.com/photos/1458688/pexels-photo-1458688.jpeg?auto=compress&cs=tinysrgb&w=1200',
      button_text: 'Discover',
      button_link: '/collections/heritage',
      display_order: 3,
      is_active: true
    }
  ];

  // Use carousel data or fallback
  const displayCarouselImages = carouselImages.length > 0 ? carouselImages : fallbackCarouselImages;

  // Animated carousel logic
  useEffect(() => {
    if (displayCarouselImages.length > 1) {
      const timer = setInterval(() => {
        setCurrentCarouselSlide((prev) => (prev + 1) % displayCarouselImages.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [displayCarouselImages.length]);

  const nextCarouselSlide = () => {
    setCurrentCarouselSlide((prev) => (prev + 1) % displayCarouselImages.length);
  };

  const prevCarouselSlide = () => {
    setCurrentCarouselSlide((prev) => (prev - 1 + displayCarouselImages.length) % displayCarouselImages.length);
  };

  const { addToCart } = useCart();

  // Jewelry carousel images

  const filteredProducts = products.filter((product: Product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesMaterial = selectedMaterial === "All" || product.material === selectedMaterial;
    const matchesOccasion = selectedOccasion === "All" || product.occasion === selectedOccasion;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description ? product.description.toLowerCase().includes(searchTerm.toLowerCase()) : false);
    return matchesCategory && matchesMaterial && matchesOccasion && matchesPrice && matchesSearch;
  });

  const featuredProducts = products.slice(0, 3);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    // Show a better notification
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev: string[]) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const openWhatsApp = (message: string = "Hello! I'm interested in your jewelry collection.") => {
    const phoneNumber = "9769432565";
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter signup logic here
    setNewsletterEmail("");
  };

  // Update ProductCard to use image_url and fallback logic
  const ProductCard = ({ product }: { product: Product }) => {
    let imageSrc = product.image_url && product.image_url.trim() !== '' ? product.image_url : '/alankarika-logo.png';
    imageSrc = imageSrc.replace(/([^:]\/)\/+/, '$1');
    return (
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="group relative"
      >
        <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="relative overflow-hidden">
            <Image
              src={imageSrc}
              alt={product.name}
              width={400}
              height={256}
              className="w-full h-64 sm:h-72 md:h-80 object-cover group-hover:scale-110 transition-transform duration-500 rounded-lg"
              onError={(e) => { (e.target as HTMLImageElement).src = '/alankarika-logo.png'; }}
            />
            {product.discount && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                  {product.discount}% OFF
                </Badge>
              </div>
            )}
            {/* Wishlist and Try-On buttons, etc. */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                size="icon"
                variant="outline"
                className="bg-white/90 hover:bg-white"
                onClick={() => toggleWishlist(product.id)}
              >
                <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="bg-white/90 hover:bg-white"
                onClick={() => {
                  setSelectedProduct(product as Product);
                  setIsVirtualTryOnOpen(true);
                }}
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            {festiveMode && (
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 festive-sparkle" />
            )}
          </div>
          <CardContent className="p-6">
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
              ))}
              <span className="text-sm text-gray-600 ml-1">({product.reviews || 0})</span>
            </div>
            <h3 className="font-semibold text-lg text-gray-900 mb-2">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.short_description || product.description}</p>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-green-600">{formatCurrency(product.price)}</span>
              {product.discount && (
                <span className="text-lg text-gray-400 line-through">{formatCurrency(product.price / (1 - product.discount / 100))}</span>
              )}
            </div>
            <div className="flex gap-2 mb-3">
              <Button 
                className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => openWhatsApp(`Hi! I'm interested in ${product.name}. Can you provide more details?`)}
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-xs text-gray-500 italic">{product.story}</div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const FilterSidebar = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => (
    <div className={`bg-white border-r h-full ${isOpen ? 'block' : 'hidden'} lg:block`}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between lg:justify-center">
          <h2 className="text-xl font-bold text-gray-900">Filters</h2>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Material</label>
            <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {materials.map(material => (
                  <SelectItem key={material} value={material}>{material}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Occasion</label>
            <Select value={selectedOccasion} onValueChange={setSelectedOccasion}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {occasions.map(occasion => (
                  <SelectItem key={occasion} value={occasion}>{occasion}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Price Range: {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
            </label>
            <Slider
              value={priceRange}
              onValueChange={(val: number[]) => setPriceRange([val[0], val[1]] as [number, number])}
              max={100000}
              min={0}
              step={1000}
              className="w-full"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="festive-mode"
              checked={festiveMode}
              onCheckedChange={setFestiveMode}
            />
            <Label htmlFor="festive-mode" className="text-sm font-medium text-gray-700">
              Festive Mode
            </Label>
          </div>
        </div>

        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => {
            setSelectedCategory("All");
            setSelectedMaterial("All");
            setSelectedOccasion("All");
            setPriceRange([0, 100000]);
            setSearchTerm("");
          }}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );

  // Drag/swipe handlers
  const handleDragStart = (event: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in event ? event.touches[0].clientX : (event as React.MouseEvent).clientX;
    setDragStartX(clientX);
  };
  const handleDragMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (dragStartX !== null) {
      const clientX = 'touches' in event ? event.touches[0].clientX : (event as React.MouseEvent).clientX;
      setDragDelta(clientX - dragStartX);
    }
  };
  const handleDragEnd = () => {
    if (dragDelta > 50) {
      prevCarouselSlide();
    } else if (dragDelta < -50) {
      nextCarouselSlide();
    }
    setDragStartX(null);
    setDragDelta(0);
  };

  return (
    <div className={`min-h-screen ${festiveMode ? 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 festive-mode' : 'bg-gradient-to-br from-orange-50 to-amber-50'}`}>
      <Header />
      {/* Hero Section with Dynamic Carousel */}
      <section className="relative min-h-[60vw] sm:min-h-[70vh] overflow-hidden">
        {/* Parallax & animated background (hidden on mobile for performance) */}
        <div className="absolute inset-0 z-0 pointer-events-none hidden sm:block">
          {/* Parallax layers */}
          <motion.div 
            className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-xl opacity-30"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            style={{ y: dragDelta * 0.1 }}
          />
          <motion.div 
            className="absolute top-32 right-20 w-40 h-40 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full blur-xl opacity-25"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
              opacity: [0.25, 0.5, 0.25]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            style={{ y: dragDelta * 0.05 }}
          />
          <motion.div 
            className="absolute bottom-20 left-32 w-28 h-28 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full blur-xl opacity-30"
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -180, -360],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            style={{ y: dragDelta * 0.08 }}
          />
          {/* Sparkling effects */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        {/* In the carousel overlay, set z-0 and pointer-events-none to ensure it does not block clicks */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 via-pink-900/50 to-orange-900/70 z-0 pointer-events-none" />
        {/* Carousel Background */}
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            {displayCarouselImages[currentCarouselSlide] && (
              <motion.img
                key={displayCarouselImages[currentCarouselSlide].id}
                src={displayCarouselImages[currentCarouselSlide].image_url}
                alt={displayCarouselImages[currentCarouselSlide].title}
                className="w-full h-full object-cover select-none sm:rounded-lg"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 + Math.abs(dragDelta) / 1000 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.7, ease: 'easeInOut' }}
                style={{ x: dragDelta * 0.2 }}
                draggable={false}
                onTouchStart={handleDragStart}
                onTouchMove={handleDragMove}
                onTouchEnd={handleDragEnd}
                onMouseDown={handleDragStart}
                onMouseMove={dragStartX !== null ? handleDragMove : undefined}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
              />
            )}
          </AnimatePresence>
        </div>
        {/* Carousel Navigation & Drag/Swipe */}
        <div
          className="absolute inset-0 z-20 cursor-grab active:cursor-grabbing"
          onMouseDown={handleDragStart}
          onMouseMove={dragStartX !== null ? handleDragMove : undefined}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          {/* Hide arrows on mobile, show on sm+ */}
          <button
            onClick={prevCarouselSlide}
            className="hidden sm:flex absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 shadow-lg transition-all duration-200 backdrop-blur-sm"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextCarouselSlide}
            className="hidden sm:flex absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 shadow-lg transition-all duration-200 backdrop-blur-sm"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          {/* Carousel Indicators - always visible, smaller on mobile */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {displayCarouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentCarouselSlide(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                  index === currentCarouselSlide 
                    ? 'bg-white scale-125' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </div>
        {/* No overlay content: only animated carousel images and navigation remain */}
      </section>


      {/* Jewels of India - Storytelling Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-2 sm:px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-playfair">Jewels of India</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Each piece in our collection tells a story of India&apos;s rich cultural heritage, 
              passed down through generations of master craftsmen.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => {
              let imageSrc = product.image_url && product.image_url.trim() !== '' ? product.image_url : '/alankarika-logo.png';
              // Remove accidental double slashes (except after 'https://')
              imageSrc = imageSrc.replace(/([^:]\/)\/+/, '$1');
              return (
                <motion.div
                  key={product.id}
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <div className="relative mb-6">
                    <Image
                      src={imageSrc}
                      alt={product.name}
                      width={400}
                      height={256}
                      className="w-full h-64 sm:h-72 md:h-80 object-cover rounded-lg shadow-lg"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/alankarika-logo.png'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="font-bold text-lg">{product.name}</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">{product.story}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-2 sm:px-4 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar isOpen={true} onClose={() => {}} />
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Our Collection</h2>
              <Button
                variant="outline"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-2 sm:px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-playfair">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">Real experiences from our jewelry family</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {customerReviews.map((review, index) => (
              <motion.div
                key={review.id}
                className="bg-white p-6 rounded-lg shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src={review.customerPhoto}
                    alt={review.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{review.name}</h4>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{review.comment}</p>
                <div className="flex items-center gap-2">
                  <Image
                    src={review.image}
                    alt={review.product}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{review.product}</p>
                    <p className="text-xs text-gray-500">{review.date}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Virtual Try-On Dialog */}
      <Dialog open={isVirtualTryOnOpen} onOpenChange={setIsVirtualTryOnOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Virtual Try-On</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <div className="text-gray-500">
                  <Camera className="w-16 h-16 mx-auto mb-4" />
                  <p>Virtual Try-On feature coming soon!</p>
                  <p className="text-sm">Upload your photo to see how jewelry looks on you</p>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-amber-600 to-orange-600">
                Upload Photo
              </Button>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Want to see this jewelry in person? 
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-amber-600"
                  onClick={() => openWhatsApp(`Hi! I&apos;d like to try ${(selectedProduct as Product | null)?.name ?? ''}. Can we schedule a visit?`)}
                >
                  Schedule a visit
                </Button>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* WhatsApp Floating Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
      >
        <Button
          size="lg"
          aria-label="Chat on WhatsApp"
          className="bg-white hover:bg-white border-2 border-green-500 rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:shadow-green-400/60 hover:scale-105 transition-transform duration-200"
          onClick={() => { console.log('WhatsApp button clicked'); openWhatsApp(); }}
        >
          <img src="/whatsapp-logo.png" width={36} height={36} alt="WhatsApp" style={{ display: 'block' }} />
        </Button>
      </motion.div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">अलंकारिका</h3>
              <p className="text-gray-400 mb-4">Where Tradition Meets Elegance</p>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                  <span className="text-white text-sm">f</span>
                </div>
                <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-pink-700 transition-colors">
                  <span className="text-white text-sm">i</span>
                </div>
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors">
                  <span className="text-white text-sm">p</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About अलंकारिका</Link></li>
                <li><Link href="/collections" className="hover:text-white transition-colors">Collections</Link></li>
                <li><Link href="/shop" className="hover:text-white transition-colors">Shop</Link></li>
                <li><Link href="/reviews" className="hover:text-white transition-colors">Customer Reviews</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping Info</Link></li>
                <li><Link href="/returns" className="hover:text-white transition-colors">Returns</Link></li>
                <li><Link href="/size-guide" className="hover:text-white transition-colors">Size Guide</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Newsletter</h4>
              <p className="text-gray-400 mb-4">Subscribe to get updates on new collections and festive offers</p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
                <Button type="submit" className="w-full bg-gradient-to-r from-amber-600 to-orange-600">
                  Subscribe
                </Button>
              </form>
              <div className="mt-4 space-y-2 text-gray-400">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+91 9769432565</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>akrutiutekar@gmail.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Mumbai, India</span>
                </div>
              </div>
            </div>
          </div>
          
          <Separator className="my-8 bg-gray-800" />
          
          <div className="text-center text-gray-400">
            <p>&copy; 2025 अलंकारिका. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}