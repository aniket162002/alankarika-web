"use client";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Player from "lottie-react";
import emptyLottie from "@/components/lottie/empty.json";

export default function WishlistPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/wishlist");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    setLoadingWishlist(true);
    fetch("/api/user/wishlist")
      .then((res) => res.json())
      .then(async (data) => {
        if (data.success && data.wishlist.length > 0) {
          setWishlist(data.wishlist);
          // Fetch product details for all wishlist items
          const ids = data.wishlist.map((w: any) => w.product_id);
          const res = await fetch("/api/user/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids }),
          });
          const pdata = await res.json();
          setProducts(pdata.products || []);
        } else {
          setWishlist([]);
          setProducts([]);
        }
        setLoadingWishlist(false);
      });
  }, [user]);

  const removeFromWishlist = async (productId: string) => {
    setWishlist((prev) => prev.filter((w) => w.product_id !== productId));
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    await fetch("/api/user/wishlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId }),
    });
  };

  if (loading || loadingWishlist) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 luxury-heading">My Wishlist</h1>
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Player autoplay loop animationData={emptyLottie} style={{ height: 120, width: 120 }} />
            <p className="mt-4 text-lg text-gray-500">Your wishlist is empty.</p>
            <Button asChild className="mt-6 bg-gradient-to-r from-amber-600 to-orange-600">
              <Link href="/shop">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card key={product.id} className="relative group card-animated">
                <div className="relative w-full h-56 rounded-t-lg overflow-hidden">
                  <Image
                    src={product.image_url || "/alankarika-logo.png"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute top-3 right-3 bg-white/90 hover:bg-white z-10"
                    onClick={() => removeFromWishlist(product.id)}
                  >
                    <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  </Button>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.short_description || product.description}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-green-600">₹{product.price?.toLocaleString()}</span>
                    {product.discount && (
                      <span className="text-lg text-gray-400 line-through">₹{(product.price / (1 - product.discount / 100)).toLocaleString()}</span>
                    )}
                  </div>
                  <Button asChild className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                    <Link href={`/shop?product=${product.id}`}>
                      <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 