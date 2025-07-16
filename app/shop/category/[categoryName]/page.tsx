"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCart } from '@/components/cart/CartProvider';
import { ShoppingCart } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CategoryProductsPage() {
  const { categoryName } = useParams();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successProduct, setSuccessProduct] = useState<string | null>(null);

  useEffect(() => {
    if (categoryName) {
      fetchProducts();
    }
    // eslint-disable-next-line
  }, [categoryName]);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*"); // Fetch all products
    // Normalize and filter in JS
    const decodedCategory = decodeURIComponent(categoryName as string).trim().toLowerCase();
    const filtered = (data || []).filter((p: any) => (p.category || '').trim().toLowerCase() === decodedCategory);
    setProducts(filtered);
    setLoading(false);
  };

  const handleAddToCart = (product: any) => {
    addToCart(product);
    setSuccessProduct(product.name);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1200);
  };

  const ProductCard = ({ product }: { product: any }) => {
    let images: string[] = Array.isArray(product.images) ? product.images : [];
    let mainImage = images[0] || product.image_url || '/alankarika-logo.png';
    let hoverImage = images[1] || mainImage;
    mainImage = mainImage.replace(/([^:]\/)\/+/g, '$1');
    hoverImage = hoverImage.replace(/([^:]\/)\/+/g, '$1');
    const hasDiscount = typeof product.discount === 'number' && !isNaN(product.discount) && product.discount > 0;
    let originalPrice = hasDiscount ? product.price / (1 - product.discount / 100) : null;
    return (
      <div className="group">
        <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-xl p-2 sm:p-0 bg-white relative">
          <div className="relative overflow-hidden">
            <div className="w-full h-40 sm:h-64 relative flex items-center justify-center bg-white">
              <img
                src={mainImage}
                alt={product.name || 'Product'}
                width={400}
                height={256}
                className="w-full h-40 object-contain rounded-lg sm:h-64 sm:object-cover sm:rounded-lg transition-transform duration-500 group-hover:scale-110 cursor-pointer"
                onError={(e) => { (e.target as HTMLImageElement).src = '/alankarika-logo.png'; }}
                style={{ opacity: 1, transition: 'opacity 0.4s' }}
              />
              {/* Show hover image on hover if available (desktop only) */}
              {hoverImage !== mainImage && (
                <img
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
                <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-2 py-1 rounded text-xs font-bold">
                  {product.discount}% OFF
                </span>
              </div>
            )}
            {!product.in_stock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-red-600 text-white px-4 py-2 rounded text-lg">Out of Stock</span>
              </div>
            )}
          </div>
          <CardContent className="p-6">
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="w-4 h-4 text-yellow-400">★</span>
              ))}
              <span className="text-sm text-gray-600 ml-1">(5)</span>
            </div>
            <h3 className="font-semibold text-lg text-gray-900 mb-2">{product.name}</h3>
            {product.short_description ? (
              <p className="text-gray-600 text-sm mb-1 line-clamp-2">{product.short_description}</p>
            ) : product.description ? (
              <p className="text-gray-600 text-sm mb-1 line-clamp-2">{product.description}</p>
            ) : null}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
              {hasDiscount && originalPrice !== null && (
                <span className="text-lg text-gray-400 line-through">₹{originalPrice?.toFixed(2)}</span>
              )}
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 flex items-center justify-center gap-2 text-lg font-semibold shadow-md"
              disabled={!product.in_stock}
              onClick={() => handleAddToCart(product)}
            >
              <ShoppingCart className="w-5 h-5 mr-1" />
              {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </CardContent>
          {/* Success message overlay */}
          {showSuccess && successProduct === product.name && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20 rounded-xl animate-fade-in">
              <span className="text-green-600 text-xl font-bold">Added to Cart!</span>
            </div>
          )}
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="outline">
            <Link href="/shop">Back to Shop</Link>
          </Button>
          <h1 className="text-3xl font-bold text-amber-700">{decodeURIComponent(categoryName as string)}</h1>
        </div>
        {loading ? (
          <div className="text-center py-12 text-lg text-gray-500">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-lg text-gray-500">No products found in this category.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 