'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, Heart, ShoppingCart, Star, Eye, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/cart/CartProvider';
import { CartIcon } from '@/components/ui/CartIcon';
import { formatNumber, formatCurrency } from '@/lib/utils/formatNumber';
import { supabase } from '@/lib/supabase';
import Header from '@/components/ui/Header';
import FlyToCart from '@/components/ui/FlyToCart';
import Player from 'lottie-react';
import successLottie from '@/components/lottie/success.json';
import loadingLottie from '@/components/lottie/loading.json';
import emptyLottie from '@/components/lottie/empty.json';

// Add Product type for proper typing
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

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [flyToCartState, setFlyToCartState] = useState({ visible: false, from: { x: 0, y: 0, width: 0, height: 0 }, to: { x: 0, y: 0, width: 0, height: 0 }, image: '' });
  const [showSuccess, setShowSuccess] = useState(false);
  // Add state for image modal
  const [openImageUrl, setOpenImageUrl] = useState<string | null>(null);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Fetch products
      let query = supabase.from('products').select('*').eq('in_stock', true);
      const { data: prodData, error: prodError } = await query;
      if (!prodError) setProducts(prodData || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Modal close handler
  useEffect(() => {
    if (!openImageUrl) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenImageUrl(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openImageUrl]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.short_description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return new Date(b.created_at ?? '').getTime() - new Date(a.created_at ?? '').getTime();
      default:
        return 0;
    }
  });

  const handleAddToCart = (product: any, e?: React.MouseEvent) => {
    // Find image position
    if (e) {
      const img = (e.currentTarget.closest('.group') as HTMLElement)?.querySelector('img');
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
    addToCart(product);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1200);
  };

  // Remove all categories state and Supabase fetch for categories
  // Instead, derive categories from products:
  const categories = Array.from(new Set(products.map(p => p.category).filter((c): c is string => !!c)));

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-2 block">Category</Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {['All', ...categories].map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
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
          onValueChange={setPriceRange}
          max={100000}
          min={0}
          step={1000}
          className="w-full"
        />
      </div>

      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => {
          setSelectedCategory('All');
          setPriceRange([0, 100000]);
          setSearchTerm('');
        }}
      >
        Clear Filters
      </Button>
    </div>
  );

  const ProductCard = ({ product, onAddToCart }: { product: any, onAddToCart: (product: any, e?: React.MouseEvent) => void }) => {
    // Use images array if available, else fallback to image_url, else fallback to logo
    let images: string[] = Array.isArray(product.images) ? product.images : [];
    let mainImage = images[0] || product.image_url || '/alankarika-logo.png';
    let hoverImage = images[1] || mainImage;
    mainImage = mainImage.replace(/([^:]\/)\/+/g, '$1');
    hoverImage = hoverImage.replace(/([^:]\/)\/+/g, '$1');
    const hasDiscount = typeof product.discount === 'number' && !isNaN(product.discount) && product.discount > 0;
    let originalPrice = hasDiscount ? product.price / (1 - product.discount / 100) : null;
    return (
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="group"
      >
        <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl p-2 sm:p-0">
          <div className="relative overflow-hidden">
            <div className="w-full h-40 sm:h-64 relative flex items-center justify-center bg-white">
              <Image
                src={mainImage}
                alt={product.name || 'Product'}
                width={400}
                height={256}
                className="w-full h-40 object-contain rounded-lg sm:h-64 sm:object-cover sm:rounded-lg transition-transform duration-500 group-hover:scale-110 cursor-pointer"
                onClick={() => setOpenImageUrl(mainImage)}
                onError={(e) => { (e.target as HTMLImageElement).src = '/alankarika-logo.png'; }}
                style={{ opacity: 1, transition: 'opacity 0.4s' }}
              />
              {/* Show hover image on hover if available (desktop only) */}
              {hoverImage !== mainImage && (
                <Image
                  src={hoverImage}
                  alt={(product.name || 'Product') + ' alternate'}
                  width={400}
                  height={256}
                  className="hidden sm:block w-full h-64 object-cover rounded-lg transition-transform duration-500 group-hover:scale-110 absolute top-0 left-0 z-20 opacity-0 group-hover:opacity-100"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/alankarika-logo.png'; }}
                  style={{ transition: 'opacity 0.4s' }}
                />
              )}
            </div>
            {hasDiscount && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                  {product.discount}% OFF
                </Badge>
              </div>
            )}
            {!product.in_stock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive" className="text-lg px-4 py-2">Out of Stock</Badge>
              </div>
            )}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button size="icon" variant="outline" className="bg-white/90 hover:bg-white">
                <Eye className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="outline" className="bg-white/90 hover:bg-white">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
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
              {hasDiscount && originalPrice !== null && (
                <span className="text-lg text-gray-400 line-through">{formatCurrency(originalPrice)}</span>
              )}
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
              disabled={!product.in_stock}
              onClick={(e) => onAddToCart(product, e)}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <Player autoplay loop animationData={loadingLottie} style={{ height: 120, width: 120 }} />
        <p className="mt-4 text-lg text-gray-500">Loading products...</p>
      </div>
    );
  }

  // Group products by category
  const productsByCategory: { [category: string]: Product[] } = {};
  categories.forEach(cat => {
    productsByCategory[cat] = products.filter(p => p.category === cat);
  });

  // Render only category cards
  return (
    <div className="shop-page py-8 px-4 min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="outline">
            <Link href="/">Back to Home</Link>
          </Button>
          <h1 className="text-3xl font-bold text-amber-700">Shop by Category</h1>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {categories.map(category => {
            const categoryProduct = products.find(p => p.category === category && p.image_url);
            return (
              <Link key={category} href={`/shop/category/${encodeURIComponent(category)}`} className="block group">
                <div className="rounded-xl shadow-lg bg-white hover:shadow-2xl transition p-6 flex flex-col items-center border border-amber-100 hover:border-amber-400">
                  <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mb-4 border-2 border-amber-200 overflow-hidden">
                    {categoryProduct ? (
                      <img src={categoryProduct.image_url} alt={category} className="w-16 h-16 object-cover rounded-full" />
                    ) : (
                      <span className="text-3xl text-amber-400 font-bold">{category[0]}</span>
                    )}
                  </div>
                  <div className="text-lg font-bold text-amber-700 group-hover:text-orange-600 mb-1">{category}</div>
                  <div className="text-sm text-gray-500">{products.filter(p => p.category === category).length} products</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}