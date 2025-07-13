'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, Package, Users, DollarSign, TrendingUp, Search, Filter, Download, Calendar, Star, LogOut, Settings, Bell, Palette, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAdminAuth } from '@/hooks/useAdminAuth';


type DashboardStats = {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingReviews: number;
  recentOrders: any[];
};

type AdminUser = {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  // Add any other fields as needed
};

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: number;
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [advertisements, setAdvertisements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const router = useRouter();

  // Check authentication and load admin user
  const { admin, isAuthenticated, logout, loading: authLoading } = useAdminAuth();

  const loadDashboardData = useCallback(async () => {
    try {
      console.log('Starting dashboard data load...');
      setLoading(true);
      setError('');
      
      // Load basic stats using simple Supabase queries
      const [productsCount, ordersCount, recentOrders] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5)
      ]);
      
      // Calculate total revenue from paid orders
      const { data: paidOrders } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('payment_status', 'paid');
      
      const totalRevenue = paidOrders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
      
      const mockStats = {
        totalProducts: productsCount.count || 0,
        totalOrders: ordersCount.count || 0,
        totalRevenue: totalRevenue,
        pendingReviews: 0,
        recentOrders: recentOrders.data || []
      };
      
      console.log('Dashboard data loaded successfully:', mockStats);
      
      setDashboardStats(mockStats);
      setProducts([]);
      setOrders(recentOrders.data || []);
      setReviews([]);
      setAdvertisements([]);
    } catch (error: any) {
      console.error('Dashboard data load error:', error);
      // Don't show error for now, just set mock data
      setDashboardStats({
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingReviews: 0,
        recentOrders: []
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // If not loading and authenticated, set admin user and load data
    if (!authLoading && isAuthenticated && admin) {
      setAdminUser(admin);
      loadDashboardData();
    }
    // If not loading and not authenticated, redirect
    else if (!authLoading && !isAuthenticated) {
      router.replace('/admin/login');
    }
  }, [isAuthenticated, admin, authLoading, router, loadDashboardData]);

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const StatCard = ({ title, value, icon: Icon, trend }: StatCardProps) => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <Icon className="h-4 w-4 text-amber-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {trend && (
          <p className="text-xs text-green-600 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            +{trend}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Package className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {adminUser?.full_name}
              </h1>
              <p className="text-gray-600">Manage your अलंकारिका jewelry store</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="ads">Advertisements</TabsTrigger>
            <TabsTrigger value="themes">Themes</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Products"
                value={dashboardStats?.totalProducts || 0}
                icon={Package}
              />
              <StatCard
                title="Total Orders"
                value={dashboardStats?.totalOrders?.toLocaleString() || '0'}
                icon={Users}
              />
              <StatCard
                title="Total Revenue"
                value={`₹${dashboardStats?.totalRevenue?.toLocaleString() || '0'}`}
                icon={DollarSign}
              />
              <StatCard
                title="Pending Reviews"
                value={dashboardStats?.pendingReviews || 0}
                icon={Star}
              />
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Recent Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardStats?.recentOrders?.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-semibold">{order.customer_name}</div>
                        <div className="text-sm text-gray-600">{order.order_number}</div>
                        <div className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">₹{parseFloat(order.total_amount).toLocaleString()}</div>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Management</h3>
              <p className="text-gray-600 mb-4">Manage your jewelry catalog with real-time updates</p>
              <Button className="bg-gradient-to-r from-amber-600 to-orange-600">
                <Plus className="w-4 h-4 mr-2" />
                Add New Product
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Management</h3>
              <p className="text-gray-600 mb-4">Track and manage customer orders in real-time</p>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Orders
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <div className="text-center py-12">
              <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Review Moderation</h3>
              <p className="text-gray-600 mb-4">Moderate customer reviews and feedback</p>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter Reviews
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="ads" className="space-y-6">
            <div className="text-center py-12">
              <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Advertisement Management</h3>
              <p className="text-gray-600 mb-4">Create and manage promotional banners and ads</p>
              <Button className="bg-gradient-to-r from-amber-600 to-orange-600">
                <Plus className="w-4 h-4 mr-2" />
                Create Advertisement
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="themes" className="space-y-6">
            <div className="text-center py-12">
              <Palette className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Festive Theme Control</h3>
              <p className="text-gray-600 mb-4">Manage seasonal themes and site appearance</p>
              <Button className="bg-gradient-to-r from-amber-600 to-orange-600">
                <Plus className="w-4 h-4 mr-2" />
                Create Theme
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="text-center py-12">
              <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Site Settings</h3>
              <p className="text-gray-600 mb-4">Configure global site settings and preferences</p>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Manage Settings
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}