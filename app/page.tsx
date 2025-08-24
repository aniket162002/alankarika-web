'use client';

import { useState, useEffect, useRef } from 'react';
import { HomeJsonLd } from './JsonLd';
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
import FlyToCart from '@/components/ui/FlyToCart';
import ColorSelector, { hasColorOptions, isParijaatProduct } from '@/components/ui/ColorSelector';
import Player from 'lottie-react';
import successLottie from '@/components/lottie/success.json';
import loadingLottie from '@/components/lottie/loading.json';
import emptyLottie from '@/components/lottie/empty.json';
import CountdownTimer from '@/components/ui/CountdownTimer';
import CustomerFeedback from '@/components/feedback/CustomerFeedback';

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
  images?: string[]; // Added images array
  [key: string]: any;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_id?: string;
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

// Refactored SparkleOverlay to avoid hydration errors
const SparkleOverlay = ({ count = 18, className = "" }) => {
  const [positions, setPositions] = useState<{ left: string; top: string }[]>([]);
  useEffect(() => {
    // Only run on client
    setPositions(
      Array.from({ length: count }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }))
    );
  }, [count]);
  return (
    <>
      {positions.map((pos, i) => (
        <motion.div
          key={i}
          className={`absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full pointer-events-none ${className}`}
          style={pos}
          animate={{
            scale: [0, 1.2, 0.8, 1, 0],
            opacity: [0, 1, 0.7, 1, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: Math.random() * 2 + 2.5,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
        />
      ))}
    </>
  );
};

// Add a WavyDivider component
const WavyDivider = ({ flip = false, color = '#fbbf24' }) => (
  <svg className="section-divider" viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: flip ? 'scaleY(-1)' : undefined }}>
    <path d="M0,30 Q360,60 720,30 T1440,30 V60 H0 Z" fill={color} fillOpacity="0.12" />
  </svg>
);

// Add a BrandMotif component (simple SVG paisley/jewelry motif)
const BrandMotif = ({ className = "", style = {} }) => (
  <svg className={className} style={style} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="60" cy="60" rx="50" ry="30" fill="#fbbf24" fillOpacity="0.08" />
    <ellipse cx="60" cy="60" rx="30" ry="15" fill="#f43f5e" fillOpacity="0.07" />
    <path d="M60 30 Q80 60 60 90 Q40 60 60 30 Z" fill="#6366f1" fillOpacity="0.06" />
    <circle cx="60" cy="60" r="8" fill="#10b981" fillOpacity="0.12" />
  </svg>
);

// Add a Confetti component for festive mode
const Confetti = () => {
  const [confetti, setConfetti] = useState<any[]>([]);
  useEffect(() => {
    setConfetti(
      Array.from({ length: 40 }, () => ({
        left: `${Math.random() * 100}vw`,
        top: `${Math.random() * 100}vh`,
        width: `${Math.random() * 8 + 6}px`,
        height: `${Math.random() * 8 + 6}px`,
        duration: Math.random() * 2 + 2.5,
        delay: Math.random() * 2,
        y: Math.random() * 120 + 60,
        rotate: Math.random() * 360,
      }))
    );
  }, []);
  if (confetti.length === 0) return null;
  return (
    <div className="confetti">
      {confetti.map((c, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: c.left,
            top: c.top,
            width: c.width,
            height: c.height,
            background: `linear-gradient(135deg, #fbbf24, #f43f5e, #6366f1, #10b981)`,
            opacity: 0.7
          }}
          animate={{
            y: [0, c.y],
            rotate: [0, c.rotate],
            opacity: [0.7, 0.9, 0.7]
          }}
          transition={{
            duration: c.duration,
            repeat: Infinity,
            delay: c.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [carouselImages, setCarouselImages] = useState<CarouselSlide[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
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
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const carouselRef = useRef(null);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragDelta, setDragDelta] = useState(0);
  const { user, logout, loading: userLoading } = useUser();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const [flyToCartState, setFlyToCartState] = useState({ visible: false, from: { x: 0, y: 0, width: 0, height: 0 }, to: { x: 0, y: 0, width: 0, height: 0 }, image: '' });
  const [showSuccess, setShowSuccess] = useState(false);
  const [countdown, setCountdown] = useState<any>(null);
  useEffect(() => {
    fetch('/api/countdown')
      .then(res => {
        if (!res.ok) return null;
        return res.text().then(text => text ? JSON.parse(text) : null);
      })
      .then(data => {
        if (data && data.success && data.timer) setCountdown(data.timer);
      });
  }, []);

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
          fetchCarouselSlides(),
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

  // Fetch wishlist from API if logged in
  useEffect(() => {
    if (!user) return;
    fetch('/api/user/wishlist')
      .then(res => {
        if (!res.ok) return null;
        return res.text().then(text => text ? JSON.parse(text) : null);
      })
      .then(data => {
        if (data && data.success) {
          setWishlist(data.wishlist.map((w: any) => w.product_id));
        }
      });
  }, [user]);

  // Toggle wishlist with API
  const toggleWishlist = async (productId: string) => {
    if (!user) {
      setWishlist((prev: string[]) =>
        prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId]
      );
      return;
    }
    if (wishlist.includes(productId)) {
      // Remove from wishlist
      setWishlist(prev => prev.filter(id => id !== productId));
      await fetch('/api/user/wishlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId })
      });
    } else {
      // Add to wishlist
      setWishlist(prev => [...prev, productId]);
      await fetch('/api/user/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId })
      });
    }
  };

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

  const handleAddToCart = (product: Product, e?: React.MouseEvent, options?: any) => {
    // Find image position
    if (e) {
      const img = (e.currentTarget.closest('.card-animated') as HTMLElement)?.querySelector('img');
      const cartIcon = document.getElementById('cart-icon');
      if (img && cartIcon) {
        const imgRect = img.getBoundingClientRect();
        const cartRect = cartIcon.getBoundingClientRect();
        setFlyToCartState({
          visible: true,
          from: { x: imgRect.left, y: imgRect.top, width: imgRect.width, height: imgRect.height },
          to: { x: cartRect.left, y: cartRect.top, width: cartRect.width, height: cartRect.height },
          image: img.src
        });
      }
    }
    // Merge options (size/customName) into product
    addToCart({ ...product, ...options });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1200);
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

  // Update ProductCard to use images array for alternate angles
  const ProductCard = ({ product, onAddToCart }: { product: Product, onAddToCart: (product: Product, e?: React.MouseEvent, options?: any) => void }) => {
    const [size, setSize] = useState('');
    const [customName, setCustomName] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [customColor, setCustomColor] = useState('');
    const [error, setError] = useState('');
    let images: string[] = Array.isArray(product.images) ? product.images : [];
    let mainImage = images[0] || product.image_url || '/alankarika-logo.png';
    let hoverImage = images[1] || mainImage;
    mainImage = mainImage.replace(/([^:]\/)\/+/g, '$1');
    hoverImage = hoverImage.replace(/([^:]\/)\/+/g, '$1');
    const isMangalsutra = (product.category || '').trim().toLowerCase() === 'मंगळसूत्र';
    const isHairband = (product.category || '').trim().toLowerCase() === 'हेरबँड';
    const isParijaatItem = isParijaatProduct(product.name);
    const hasColors = hasColorOptions(product);

    const handleAdd = (e: React.MouseEvent) => {
      setError('');
      if (isMangalsutra && !size) {
        setError('Please select a size');
        return;
      }
      if (isHairband && !customName.trim()) {
        setError('Please enter a name');
        return;
      }
      if (isParijaatItem && !selectedColor && !customColor.trim()) {
        setError('Please select a color or enter a custom color');
        return;
      }
      const options: any = {};
      if (isMangalsutra) options.size = size;
      if (isHairband) options.customName = customName.trim();
      if (isParijaatItem) {
        options.selectedColor = customColor.trim() || selectedColor;
      }
      onAddToCart(product, e, options);
    };
    return (
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="group relative"
      >
        <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 card-animated rounded-xl p-2 sm:p-0">
          <div className="relative overflow-hidden">
            <div className="w-full h-40 sm:h-64 md:h-80 relative flex items-center justify-center bg-white">
              <Image
                src={mainImage}
                alt={product.name}
                width={400}
                height={256}
                className="w-full h-40 sm:h-64 md:h-80 object-contain rounded-lg sm:rounded-lg transition-transform duration-500 group-hover:scale-110 cursor-pointer"
                onClick={() => setOpenImageUrl(mainImage)}
                onError={(e) => { (e.target as HTMLImageElement).src = '/alankarika-logo.png'; }}
                style={{ opacity: 1, transition: 'opacity 0.4s' }}
              />
              {hoverImage !== mainImage && (
                <Image
                  src={hoverImage}
                  alt={product.name + ' alternate'}
                  width={400}
                  height={256}
 
                  className="hidden sm:block w-full h-64 md:h-80 object-contain rounded-lg transition-transform duration-500 group-hover:scale-110 absolute top-0 left-0 z-20 opacity-0 group-hover:opacity-100"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/alankarika-logo.png'; }}
                  style={{ transition: 'opacity 0.4s' }}
                />
              )}
            </div>
            {product.discount && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white animate-gradient-border">
                  {product.discount}% OFF
                </Badge>
              </div>
            )}
            {/* Wishlist and Try-On buttons, etc. */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                className="bg-white/90 hover:bg-white"
                onClick={() => toggleWishlist(product.id)}
              >
                <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button
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
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-sm text-gray-600 ml-1">(5)</span>
            </div>
            <h3 className="font-semibold text-lg text-gray-900 mb-2">{product.name}</h3>
            {product.short_description ? (
              <p className="text-gray-600 text-sm mb-1 line-clamp-2">{product.short_description}</p>
            ) : product.description ? (
              <p className="text-gray-600 text-sm mb-1 line-clamp-2">{product.description}</p>
            ) : null}
            {product.description && product.short_description && (
              <p className="text-gray-700 text-xs mb-4 whitespace-pre-line line-clamp-4">{product.description}</p>
            )}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-green-600">{formatCurrency(product.price)}</span>
              {product.discount && (
                <span className="text-lg text-gray-400 line-through">{formatCurrency(product.price / (1 - product.discount / 100))}</span>
              )}
            </div>
            {isMangalsutra && (
              <div className="mb-3">
                <Label>Size (inch)</Label>
                <Select value={size} onValueChange={setSize}>
                  <SelectTrigger><SelectValue placeholder="Select Size" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30"</SelectItem>
                    <SelectItem value="32">32"</SelectItem>
                    <SelectItem value="34">34"</SelectItem>
                    <SelectItem value="36">36"</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {isHairband && (
              <div className="mb-3">
                <Label>Name</Label>
                <Input value={customName} onChange={e => setCustomName(e.target.value)} placeholder="Enter Name" className="w-full mt-1" />
              </div>
            )}
            {isParijaatItem && (
              <div className="mb-3">
                <ColorSelector
                  colors={require('@/components/ui/ColorSelector').getParijaatColors()}
                  selectedColor={selectedColor}
                  onColorSelect={(color) => {
                    setSelectedColor(color.value);
                    setCustomColor(''); // Clear custom color when predefined is selected
                  }}
                  size="md"
                  allowCustomColor={false}
                />
              </div>
            )}
            {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
            <div className="flex gap-2 mb-3">
              <Button 
                className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 btn-animated"
                onClick={handleAdd}
              >
                Add to Cart
              </Button>
              <Button 
                className=""
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

  // Dynamic filter options
  const categoryOptions = ['All', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];
  const minPrice = Math.min(...products.map(p => p.price), 0);
  const maxPrice = Math.max(...products.map(p => p.price), 100000);

  // Replace FilterSidebar with a dynamic, mobile-friendly version
  const DynamicFilterSidebar = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => (
    <div className={`bg-white border-r h-full ${isOpen ? 'block' : 'hidden'} lg:block w-80`}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between lg:justify-center">
          <h2 className="text-xl font-bold text-gray-900">Filters</h2>
          <Button className="lg:hidden" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Category</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map(category => (
                  category ? <SelectItem key={category} value={category}>{category}</SelectItem> : null
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Price Range: {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
            </Label>
            <Slider
              value={priceRange}
              onValueChange={(val: number[]) => setPriceRange([val[0], val[1]] as [number, number])}
              max={maxPrice}
              min={minPrice}
              step={1000}
              className="w-full"
            />
          </div>
        <Button 
          className="w-full"
          onClick={() => {
              setSelectedCategory('All');
              setPriceRange([minPrice, maxPrice]);
              setSearchTerm('');
          }}
        >
          Clear Filters
        </Button>
        </div>
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

  // Add state for image modal
  const [openImageUrl, setOpenImageUrl] = useState<string | null>(null);

  // Modal close handler
  useEffect(() => {
    if (!openImageUrl) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenImageUrl(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openImageUrl]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <Player autoplay loop animationData={loadingLottie} style={{ height: 120, width: 120 }} />
        <p className="mt-4 text-lg text-gray-500">Loading products...</p>
      </div>
    );
  }

  return (
    <div className={`relative min-h-screen flex flex-col justify-between ${
      festiveMode
        ? 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 festive-mode'
        : 'bg-gradient-to-br from-orange-50 to-amber-50'
    }`}>
      {/* Countdown Timer (if active) */}
      {countdown && (
        <div className="py-8 animate-fade-in">
          <CountdownTimer endTime={countdown.end_time} title={countdown.title} description={countdown.description} />
        </div>
      )}
      <Header />
      {/* Enhanced Hero Section with Dynamic Carousel */}
      <section className="relative w-full h-[34vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] flex items-center justify-center overflow-hidden bg-white sm:bg-gradient-to-br sm:from-amber-50 sm:via-orange-50 sm:to-yellow-50">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Geometric patterns */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 border-2 border-amber-400 rotate-45 animate-pulse"></div>
            <div className="absolute top-20 right-20 w-16 h-16 border-2 border-orange-400 rounded-full animate-bounce"></div>
            <div className="absolute bottom-20 left-20 w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rotate-12 animate-spin"></div>
          </div>

          {/* Enhanced Parallax layers */}
          <motion.div
            className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-2xl opacity-20"
            animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-32 right-20 w-40 h-40 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full blur-2xl opacity-15"
            animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          />
          <motion.div
            className="absolute bottom-20 left-32 w-28 h-28 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full blur-2xl opacity-20"
            animate={{ scale: [1, 1.4, 1], rotate: [0, -180, -360], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 6 }}
          />

          {/* Enhanced Sparkling effects */}
          <SparkleOverlay count={25} />
        </div>
        {/* Enhanced Carousel Background */}
        <div className="absolute inset-0 z-5">
          <AnimatePresence mode="wait">
            {displayCarouselImages[currentCarouselSlide] && (
              <motion.div
                key={displayCarouselImages[currentCarouselSlide].id}
                className="relative w-full h-full"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 + Math.abs(dragDelta) / 1000 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                style={{ x: dragDelta * 0.2 }}
              >
                <img
                  src={displayCarouselImages[currentCarouselSlide].image_url}
                  alt={displayCarouselImages[currentCarouselSlide].title}
                  className="w-full h-full max-h-[220px] sm:max-h-full object-contain sm:object-cover rounded-xl shadow-lg select-none bg-white mx-auto"
                  style={{ objectPosition: 'center' }}
                  draggable={false}
                  onTouchStart={handleDragStart}
                  onTouchMove={handleDragMove}
                  onTouchEnd={handleDragEnd}
                  onMouseDown={handleDragStart}
                  onMouseMove={dragStartX !== null ? handleDragMove : undefined}
                  onMouseUp={handleDragEnd}
                  onMouseLeave={handleDragEnd}
                />
                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className  ="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Enhanced Carousel Overlay Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Brand Badge */}
            {/* <motion.div
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 mb-6 border border-white/30"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              {/* <span className="text-white text-sm font-medium">Premium Jewelry Collection</span> */}
            {/* </motion.div> */} 

            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white drop-shadow-2xl font-playfair mb-6 tracking-wide leading-tight"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              {/* Only show title if it's not just a number */}
              {(() => {
                const title = displayCarouselImages[currentCarouselSlide]?.title;
                // Hide if title is only a number (integer or float)
                if (typeof title === 'string' && title.trim().match(/^\d+(\.\d+)?$/)) {
                  return (
                    <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-300 bg-clip-text text-transparent">
                    </span>
                  );
                }
                return (
                  <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-300 bg-clip-text text-transparent">
                    {title}
                  </span>
                );
              })()}
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 mb-8 max-w-3xl mx-auto drop-shadow-lg leading-relaxed"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.4 }}
            >
              {displayCarouselImages[currentCarouselSlide]?.subtitle || ""}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.6 }}
            >
              
             
            </motion.div>
          </motion.div>
        </div>
        {/* Enhanced Carousel Navigation & Drag/Swipe */}
        <div
          className="absolute inset-0 z-30 cursor-grab active:cursor-grabbing"
          onMouseDown={handleDragStart}
          onMouseMove={dragStartX !== null ? handleDragMove : undefined}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          {/* Enhanced Navigation Arrows */}
          <button
            onClick={prevCarouselSlide}
            className="hidden lg:flex absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/25 hover:bg-white/40 text-white rounded-full p-4 shadow-2xl transition-all duration-300 backdrop-blur-md border border-white/20 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextCarouselSlide}
            className="hidden lg:flex absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/25 hover:bg-white/40 text-white rounded-full p-4 shadow-2xl transition-all duration-300 backdrop-blur-md border border-white/20 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Enhanced Carousel Indicators */}
          {/* <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 bg-black/20 backdrop-blur-md rounded-full px-4 py-2">
            {displayCarouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentCarouselSlide(index)}
                className={`transition-all duration-300 ${
                  index === currentCarouselSlide
                    ? 'w-8 h-3 bg-white rounded-full shadow-lg'
                    : 'w-3 h-3 bg-white/60 hover:bg-white/80 rounded-full hover:scale-110'
                }`}
              />
            ))}
          </div> */}

          {/* Mobile swipe indicator */}
          {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 lg:hidden">
            <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md rounded-full px-3 py-1">
              <div className="w-6 h-1 bg-white/60 rounded-full"></div>
              <span className="text-white/80 text-xs">Swipe</span>
              <div className="w-6 h-1 bg-white/60 rounded-full"></div>
            </div>
          </div> */}
        </div>
      </section>

      {/* New Featured Highlights Section */}
      <section id="featured-section" className="py-16 bg-gradient-to-b from-white to-amber-50/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/20 to-orange-50/20 opacity-50"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              Featured Collection
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-playfair">
              Why Choose <span className="text-amber-600">Alankarika</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Experience the perfect blend of traditional craftsmanship and modern elegance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              {
                icon: <Sparkles className="w-8 h-8 text-amber-500" />,
                title: "Premium Quality",
                description: "Handcrafted with finest materials and attention to detail"
              },
              {
                icon: <Heart className="w-8 h-8 text-red-500" />,
                title: "Traditional Design",
                description: "Authentic Indian jewelry with cultural significance"
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                ),
                title: "FREE Delivery",
                description: "No shipping charges anywhere in India. Shop worry-free!"
              },
              {
                icon: <Camera className="w-8 h-8 text-blue-500" />,
                title: "Custom Orders",
                description: "Personalized jewelry designed just for you"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-gray-100">
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <WavyDivider color="#fbbf24" />


      {/* Jewels of India - Storytelling Section */}
      <section className="py-16 bg-white relative">
        <BrandMotif className="absolute right-8 bottom-8 w-32 h-32 z-0" style={{ opacity: 0.13 }} />
        <div className="container mx-auto px-2 sm:px-4 relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="luxury-heading mb-4">Jewels of India</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Each piece in our collection tells a story of India&apos;s rich cultural heritage, 
              passed down through generations of master craftsmen.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => {
              let imageSrc = product.image_url && product.image_url.trim() !== '' ? product.image_url : '/alankarika-logo.png';
              imageSrc = imageSrc.replace(/([^:]\/)\/+/g, '$1');
              return (
                <motion.div
                  key={product.id}
                  className="text-center card-animated"
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
                      className="w-full h-40 object-contain rounded-lg shadow-lg"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/alankarika-logo.png'; }}
                    />
                    <SparkleOverlay count={8} className="z-10" />
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
      <WavyDivider color="#f43f5e" flip />

      {/* Enhanced Main Products Section */}
      <section id="products-section" className="py-16 bg-gradient-to-b from-white to-gray-50 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 to-amber-50/20 opacity-50"></div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Enhanced Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Handcrafted Collection
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-playfair">
              Our Exquisite <span className="text-amber-600">Collection</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
              Discover our carefully curated selection of traditional and contemporary jewelry pieces
            </p>
          </motion.div>

          {/* Mobile Filter Button */}
          <div className="flex flex-col gap-4 mb-8 lg:hidden">
            <div className="flex justify-center">
              <Sheet open={showFilterSidebar} onOpenChange={setShowFilterSidebar}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-white shadow-lg border-amber-200 text-amber-700 hover:bg-amber-50 px-6 py-3 rounded-full font-medium"
                    onClick={() => setShowFilterSidebar(true)}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Filters & Search
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <DynamicFilterSidebar isOpen={showFilterSidebar} onClose={() => setShowFilterSidebar(false)} />
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Desktop Filter Summary */}
          <div className="hidden lg:flex items-center justify-between mb-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-4">
              <span className="text-gray-600 font-medium">Showing {filteredProducts.length} products</span>
              {selectedCategory !== "All" && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  {selectedCategory}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <Select defaultValue="featured">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Enhanced Product Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 lg:gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <ProductCard product={product} onAddToCart={handleAddToCart} />
              </motion.div>
            ))}
          </motion.div>

          {/* Enhanced Empty State */}
          {filteredProducts.length === 0 && (
            <motion.div
              className="flex flex-col items-center justify-center py-20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-full p-8 mb-6">
                <Player autoplay loop animationData={emptyLottie} style={{ height: 120, width: 120 }} />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Products Found</h3>
              <p className="text-lg text-gray-500 mb-6 text-center max-w-md">
                We couldn't find any products matching your criteria. Try adjusting your filters.
              </p>
              <Button
                onClick={() => {
                  setSelectedCategory("All");
                  setSelectedMaterial("All");
                  setSelectedOccasion("All");
                  setSearchTerm("");
                  setPriceRange([0, 100000]);
                }}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-full font-medium"
              >
                Clear All Filters
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      <WavyDivider color="#fbbf24" />

      {/* Customer Feedback Section */}
      <CustomerFeedback />

      {/* Style Quiz Section */}
      <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="container mx-auto px-2 sm:px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-4xl font-bold text-amber-700 mb-4 font-playfair">Discover Your Perfect Jewelry Style</h2>
            <p className="text-xl text-gray-700 mb-6 max-w-xl">Take our quick, fun quiz and get personalized recommendations for pieces that match your unique taste and personality. Find the jewelry that truly speaks to you!</p>
            <Button asChild size="lg" className="bg-gradient-to-r from-amber-600 to-orange-600 text-white text-lg font-semibold shadow-lg hover:from-orange-600 hover:to-amber-700">
              <a href="/register">Start the Style Quiz</a>
            </Button>
          </div>
          <div className="flex-1 flex justify-center">
            <Image
              src="/about.jpeg"
              alt="Jewelry Style Quiz Illustration"
              width={400}
              height={320}
              className="rounded-xl shadow-lg object-cover"
              priority
            />
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
                  onClick={() => openWhatsApp(`Hi! I'd like to try ${(selectedProduct as Product | null)?.name ?? ''}. Can we schedule a visit?`)}
                >
                  Schedule a visit
                </Button>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">अलंकारिका</h3>
              <p className="text-gray-400 mb-4">Where Tradition Meets Elegance</p>
              {/* Social media icons removed */}
                </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About अलंकारिका</Link></li>
                <li><Link href="/shop" className="hover:text-white transition-colors">Shop</Link></li>
                <li><Link href="/reviews" className="hover:text-white transition-colors">Customer Reviews</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/shipping-info" className="hover:text-white transition-colors">Shipping Information</Link></li>
                <li><Link href="/size-guide" className="hover:text-white transition-colors">Size Guide</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">No Return Policy</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/no-return-refund-policy" className="hover:text-white transition-colors">Read Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              </ul>
                </div>
            {/* Newsletter section removed */}
                </div>
          <Separator className="my-8 bg-gray-800" />
          <div className="text-center text-gray-400 space-y-3">
            <p>&copy; 2025 अलंकारिका. All rights reserved.</p>
            <div className="flex items-center justify-center gap-2 text-sm">
              <span>Powered by</span>
              <a
                href="https://akrixsolutions.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors duration-200 font-medium"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                Akrix Solutions
              </a>
            </div>
          </div>
        </div>
      </footer>
      {festiveMode && <Confetti />}
      <FlyToCart
        image={flyToCartState.image}
        from={flyToCartState.from}
        to={flyToCartState.to}
        visible={flyToCartState.visible}
        onComplete={() => setFlyToCartState(s => ({ ...s, visible: false }))}
      />
      {showSuccess && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[9999]">
          <Player
            autoplay
            loop={false}
            animationData={successLottie}
            style={{ height: 80, width: 80 }}
          />
        </div>
      )}
      {openImageUrl && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setOpenImageUrl(null)}>
          <div className="relative max-w-full max-h-full p-2" onClick={e => e.stopPropagation()}>
            <button
              className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg z-10"
              onClick={() => setOpenImageUrl(null)}
              aria-label="Close image"
            >
              <X className="w-6 h-6 text-gray-800" />
            </button>
            <img
              src={openImageUrl}
              alt="Product Full"
              className="max-w-[90vw] max-h-[80vh] rounded-lg shadow-xl object-contain bg-white"
            />
          </div>
        </div>
      )}
    </div>
  );
}