import { useState, useEffect, createContext, useContext } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface AdminUser {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};

export const useAdminAuthProvider = () => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = () => {
      try {
        const sessionToken = localStorage.getItem('admin_session_token');
        const adminData = localStorage.getItem('admin_data');
        
        if (sessionToken && adminData) {
          try {
            const parsedAdmin = JSON.parse(adminData);
            setAdmin(parsedAdmin);
            
            // Ensure cookie is set for middleware
            const isSecure = window.location.protocol === 'https:';
            document.cookie = `admin_session_token=${sessionToken}; path=/; max-age=${7 * 24 * 60 * 60}; ${isSecure ? 'secure; ' : ''}samesite=strict`;
          } catch (parseError) {
            console.error('Failed to parse admin data:', parseError);
            localStorage.removeItem('admin_session_token');
            localStorage.removeItem('admin_data');
          }
        }
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);

      // Try API route first
      try {
        const response = await fetch('/api/admin/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        const result = await response.json();

        if (result.success) {
          // Store session and set admin
          localStorage.setItem('admin_session_token', result.session_token);
          localStorage.setItem('admin_data', JSON.stringify(result.admin));
          
          // Set cookie for middleware
          const isSecure = window.location.protocol === 'https:';
          document.cookie = `admin_session_token=${result.session_token}; path=/; max-age=${7 * 24 * 60 * 60}; ${isSecure ? 'secure; ' : ''}samesite=strict`;
          
          setAdmin(result.admin);
          return { success: true };
        } else {
          return { success: false, error: result.error };
        }
      } catch (apiError) {
        
        // Fallback authentication for development/testing
        if (process.env.NODE_ENV === 'development') {
          console.log('🔄 Trying fallback authentication...');
          console.log('🔄 Username check:', username === 'alankarika_admin');
          console.log('🔄 Password check:', password === 'alankarika@2025');
          
          if (username === 'alankarika_admin' && password === 'alankarika@2025') {
            console.log('✅ Fallback authentication successful');
            const mockAdmin = {
              id: '1',
              username: 'alankarika_admin',
              email: 'admin@alankarika.com',
              full_name: 'Alankarika Admin',
              role: 'Super Admin',
              is_active: true,
              last_login: new Date().toISOString(),
              created_at: new Date().toISOString()
            };
            
            const sessionToken = 'mock_session_' + Date.now();
            localStorage.setItem('admin_session_token', sessionToken);
            localStorage.setItem('admin_data', JSON.stringify(mockAdmin));
            
            // Set cookie for middleware
            const isSecure = window.location.protocol === 'https:';
            document.cookie = `admin_session_token=${sessionToken}; path=/; max-age=${7 * 24 * 60 * 60}; ${isSecure ? 'secure; ' : ''}samesite=strict`;
            
            setAdmin(mockAdmin);
            return { success: true };
          } else {
            console.log('❌ Fallback authentication failed');
            return { success: false, error: 'Invalid username or password' };
          }
        } else {
          return { success: false, error: 'Login failed' };
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const sessionToken = localStorage.getItem('admin_session_token');
      if (sessionToken) {
        // Delete session from database
        await supabase
          .from('admin_sessions')
          .delete()
          .eq('session_token', sessionToken);
      }

      // Clear local storage and state
      localStorage.removeItem('admin_session_token');
      localStorage.removeItem('admin_data');
      
      // Clear cookie
      document.cookie = 'admin_session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      
      setAdmin(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return {
    admin,
    loading,
    login,
    logout,
    isAuthenticated: !!admin
  };
};

export const AdminAuthProvider = AdminAuthContext.Provider;
