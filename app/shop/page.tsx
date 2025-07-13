'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, Heart, ShoppingCart, Star, Eye } from 'lucide-react';
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

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      let query = supabase.from('products').select('*').eq('in_stock', true);
      const { data, error } = await query;
      if (!error) setProducts(data || []);
    };
    fetchProducts();
  }, []);

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

  const handleAddToCart = (product: any) => {
    addToCart(product);
  };

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-2 block">Category</Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.filter((category): category is string => typeof category === 'string').map(category => (
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

  const ProductCard = ({ product }: { product: any }) => {
    let imageSrc = product.image_url && product.image_url.trim() !== '' ? product.image_url : '/alankarika-logo.png';
    imageSrc = imageSrc.replace(/([^:]\/)\/+/, '$1');
    const hasDiscount = typeof product.discount === 'number' && !isNaN(product.discount) && product.discount > 0;
    let originalPrice = hasDiscount ? product.price / (1 - product.discount / 100) : null;
    return (
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="group"
      >
        <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="relative overflow-hidden">
            <Image
              src={imageSrc}
              alt={product.name || 'Product'}
              width={400}
              height={256}
              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
            />
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
            <h3 className="font-semibold text-lg text-gray-900 mb-2">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.short_description}</p>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-green-600">{formatCurrency(product.price)}</span>
              {hasDiscount && originalPrice !== null && (
                <span className="text-lg text-gray-400 line-through">{formatCurrency(originalPrice)}</span>
              )}
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
              disabled={!product.in_stock}
              onClick={() => handleAddToCart(product)}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <Header />

      <div className="container mx-auto px-2 sm:px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Filters</h2>
              <FilterSidebar />
            </Card>
          </div>
          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Controls */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search jewelry..."
                    className="pl-10 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Sheet open={showFilters} onOpenChange={setShowFilters}>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                      <div className="py-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Filters</h2>
                        <FilterSidebar />
                      </div>
                    </SheetContent>
                  </Sheet>
                  <p className="text-gray-600">
                    {sortedProducts.length} products found
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSelectedCategory('All');
                    setPriceRange([0, 100000]);
                    setSearchTerm('');
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}