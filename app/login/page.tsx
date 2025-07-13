"use client";
import { useUser } from '@/hooks/useUser';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const { login, loading } = useUser();
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await login(mobile);
    if (res.success) {
      toast({ title: 'Login successful!' });
      router.push('/profile');
    } else {
      setError(res.error || 'Login failed');
      toast({ title: 'Login failed', description: res.error || 'Login failed', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-100 to-yellow-50 relative overflow-hidden">
      {/* Animated festive background sparkles */}
      <motion.div
        className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-amber-300 to-orange-400 rounded-full blur-2xl opacity-30 animate-fade-in"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 1.2 }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tr from-yellow-200 to-orange-300 rounded-full blur-2xl opacity-20 animate-fade-in"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />
      <motion.div
        className="w-full max-w-md z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="bg-white/95 rounded-2xl shadow-2xl px-8 py-10 flex flex-col items-center relative border border-orange-100 animate-fade-in">
          <Image
            src="/alankarika-logo.png"
            alt="Alankarika Logo"
            width={64}
            height={64}
            className="mb-4 drop-shadow-lg animate-fade-in"
            priority
          />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2 font-playfair animate-fade-in">Login to अलंकारिका</h1>
          <p className="text-gray-600 mb-6 animate-fade-in">Welcome back! Enter your mobile number to access your account.</p>
          <form onSubmit={handleLogin} className="space-y-4 w-full animate-slide-up">
            <Input
              name="mobile"
              placeholder="Mobile Number"
              value={mobile}
              onChange={e => setMobile(e.target.value)}
              required
              disabled={loading}
              className="rounded-lg border-amber-200 focus:border-amber-500 focus:ring-amber-400/30 shadow-sm"
            />
            {error && <div className="text-red-600 text-sm animate-fade-in">{error}</div>}
            <Button type="submit" className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-lg font-semibold shadow-lg rounded-lg transition-all duration-200" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <div className="mt-6 text-sm text-gray-500 animate-fade-in">
            Don't have an account?{' '}
            <a href="/register" className="text-amber-600 font-semibold underline hover:text-orange-600 transition">Register</a>
          </div>
          <div className="mt-8 text-center animate-fade-in">
            <span className="inline-block bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 px-4 py-2 rounded-full shadow-sm font-medium">
              Where Tradition Meets Elegance
            </span>
            <p className="text-xs text-gray-400 mt-2">Trusted by thousands of happy customers</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 