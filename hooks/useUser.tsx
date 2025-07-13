"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  mobile: string;
  role: string;
  created_at?: string;
  updated_at?: string;
}

interface UserContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (mobile: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, mobile: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  requireAuthForCart: () => boolean;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Try to load user from localStorage/cookie
    const storedUser = localStorage.getItem('user_data');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Helper for cart: if not logged in, redirect to /register
  const requireAuthForCart = () => {
    if (!user) {
      router.push('/register');
      return false;
    }
    return true;
  };

  const login = async (mobile: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        setLoading(false);
        return { success: true };
      } else {
        setLoading(false);
        return { success: false, error: data.error };
      }
    } catch (e: any) {
      setLoading(false);
      return { success: false, error: e.message };
    }
  };

  const register = async (name: string, email: string, mobile: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, mobile })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        setLoading(false);
        return { success: true };
      } else {
        setLoading(false);
        return { success: false, error: data.error };
      }
    } catch (e: any) {
      setLoading(false);
      return { success: false, error: e.message };
    }
  };

  const logout = async () => {
    setLoading(true);
    await fetch('/api/user/logout', { method: 'POST' });
    setUser(null);
    localStorage.removeItem('user_data');
    setLoading(false);
  };

  return (
    <UserContext.Provider value={{ user, loading, login, register, logout, requireAuthForCart }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
} 