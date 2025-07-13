'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Truck, 
  Edit, 
  Eye, 
  Search,
  Package,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Route,
  Calendar,
  Phone,
  Mail,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useSupabaseRealtime } from '@/hooks/useSupabaseRealtime';
import { createClient } from '@supabase/supabase-js';
import { formatCurrency } from '@/lib/utils/formatNumber';
import toast from 'react-hot-toast';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ShippingRecord {
  id: string;
  order_id: string;
  tracking_number: string;
  shipping_provider: string;
  status: 'pending' | 'packed' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'returned' | 'cancelled';
  shipped_at: string;
  estimated_delivery: string;
  delivered_at: string;
  shipping_address: any;
  notes: string;
  created_at: string;
  updated_at: string;
  // Joined order data
  order?: {
    id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    total_amount: number;
  };
}

// Fetch shipping records with order details
const fetchShippingRecords = async () => {
  const { data, error } = await supabase
    .from('shipping')
    .select(`
      *,
      orders!inner(
        id,
        customer_name,
        customer_email,
        customer_phone,
        total_amount
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching shipping records:', error);
    throw error;
  }
  return data as ShippingRecord[];
};

export default function ShippingManagement() {
  const [shippingRecords, setShippingRecords] = useState<ShippingRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<ShippingRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState<ShippingRecord | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shippingProvider, setShippingProvider] = useState('');
  const [shippingStatus, setShippingStatus] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [shippingNotes, setShippingNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Real-time shipping data
  const shippingData = useSupabaseRealtime(fetchShippingRecords, 'shipping', []);

  useEffect(() => {
    if (shippingData) {
      setShippingRecords(shippingData);
      setFilteredRecords(shippingData);
    }
  }, [shippingData]);

  // Filter shipping records
  useEffect(() => {
    let filtered = shippingRecords;

    if (searchTerm) {
      filtered = filtered.filter(record => 
        record.tracking_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.order?.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.order?.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.order_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(record => record.status === statusFilter);
    }

    setFilteredRecords(filtered);
  }, [shippingRecords, searchTerm, statusFilter]);

  const handleUpdateShipping = async () => {
    if (!selectedShipping) return;
    
    setLoading(true);
    try {
      const updateData: any = {
        tracking_number: trackingNumber,
        shipping_provider: shippingProvider,
        status: shippingStatus,
        estimated_delivery: estimatedDelivery,
        notes: shippingNotes,
        updated_at: new Date().toISOString()
      };

      // Set specific timestamps based on status
      if (shippingStatus === 'shipped' && selectedShipping.status !== 'shipped') {
        updateData.shipped_at = new Date().toISOString();
      }
      if (shippingStatus === 'delivered' && selectedShipping.status !== 'delivered') {
        updateData.delivered_at = new Date().toISOString();
      }

      const response = await fetch('/api/admin/shipping', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedShipping.id, data: updateData }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      // Send email notification to customer
      if (selectedShipping.order) {
        await fetch('/api/admin/shipping/send-update-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: selectedShipping.order_id,
            customerName: selectedShipping.order.customer_name,
            customerEmail: selectedShipping.order.customer_email,
            trackingNumber: trackingNumber,
            shippingProvider: shippingProvider,
            status: shippingStatus,
            estimatedDelivery: estimatedDelivery,
            trackingUrl: `https://track.${shippingProvider.toLowerCase()}.com/${trackingNumber}`
          })
        });
      }

      // Create notification for user
      await supabase.from('notifications').insert({
        type: 'shipping_update',
        title: 'Shipping Update',
        message: `Your order shipping status has been updated to: ${shippingStatus}`,
        recipient_email: selectedShipping.order?.customer_email,
        recipient_name: selectedShipping.order?.customer_name,
        data: {
          orderId: selectedShipping.order_id,
          trackingNumber: trackingNumber,
          status: shippingStatus
        }
      });

      toast.success('Shipping information updated successfully!');
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error updating shipping:', error);
      toast.error('Error updating shipping information');
    } finally {
      setLoading(false);
    }
  };

  const handleViewShipping = (shipping: ShippingRecord) => {
    setSelectedShipping(shipping);
    setTrackingNumber(shipping.tracking_number || '');
    setShippingProvider(shipping.shipping_provider || 'BlueDart');
    setShippingStatus(shipping.status);
    setEstimatedDelivery(shipping.estimated_delivery || '');
    setShippingNotes(shipping.notes || '');
    setIsDialogOpen(true);
  };

  const handleDeleteShipping = async (shippingId: string) => {
    if (!confirm('Are you sure you want to delete this shipping record?')) return;
    setLoading(true);
    try {
      const response = await fetch('/api/admin/shipping', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: shippingId }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      toast.success('Shipping record deleted successfully!');
      // Refetch shipping records
      const data = await fetchShippingRecords();
      setShippingRecords(data);
      setFilteredRecords(data);
    } catch (error) {
      console.error('Error deleting shipping record:', error);
      toast.error('Error deleting shipping record');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedShipping(null);
    setTrackingNumber('');
    setShippingProvider('');
    setShippingStatus('');
    setEstimatedDelivery('');
    setShippingNotes('');
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      packed: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      in_transit: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      out_for_delivery: 'bg-orange-100 text-orange-800 border-orange-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      returned: 'bg-red-100 text-red-800 border-red-200',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return (status in colors ? colors[status as keyof typeof colors] : 'bg-gray-100 text-gray-800 border-gray-200');
  };

  const shippingStats = {
    total: shippingRecords.length,
    pending: shippingRecords.filter(s => s.status === 'pending').length,
    shipped: shippingRecords.filter(s => s.status === 'shipped').length,
    in_transit: shippingRecords.filter(s => s.status === 'in_transit').length,
    delivered: shippingRecords.filter(s => s.status === 'delivered').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shipping Management</h1>
          <p className="text-gray-600 mt-1">Track and manage order shipments</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Shipments</p>
                <p className="text-2xl font-bold text-gray-900">{shippingStats.total}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{shippingStats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Shipped</p>
                <p className="text-2xl font-bold text-purple-600">{shippingStats.shipped}</p>
              </div>
              <Truck className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Transit</p>
                <p className="text-2xl font-bold text-indigo-600">{shippingStats.in_transit}</p>
              </div>
              <Route className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-green-600">{shippingStats.delivered}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search by tracking number, customer, or order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="packed">Packed</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Shipments ({filteredRecords.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Tracking Number</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Estimated Delivery</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((shipping) => (
                <TableRow key={shipping.id}>
                  <TableCell>
                    <div className="font-mono text-sm">{shipping.order_id.slice(0, 8)}</div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{shipping.order?.customer_name}</div>
                      <div className="text-sm text-gray-500">{shipping.order?.customer_email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-mono">
                      {shipping.tracking_number || 'Not assigned'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {shipping.shipping_provider || 'Not assigned'}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(shipping.status)}>
                      {shipping.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {shipping.estimated_delivery ? 
                      new Date(shipping.estimated_delivery).toLocaleDateString() : 
                      'Not set'
                    }
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewShipping(shipping)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteShipping(shipping.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredRecords.length === 0 && (
            <div className="text-center py-12">
              <Truck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No shipments found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shipping Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update Shipping Information</DialogTitle>
            <DialogDescription>
              Update tracking and delivery information for this order
            </DialogDescription>
          </DialogHeader>

          {selectedShipping && (
            <div className="space-y-6">
              {/* Order Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Order ID:</span>
                      <div className="font-mono">{selectedShipping.order_id}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Customer:</span>
                      <div>{selectedShipping.order?.customer_name}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Email:</span>
                      <div>{selectedShipping.order?.customer_email}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Amount:</span>
                      <div className="font-bold">{formatCurrency(selectedShipping.order?.total_amount || 0)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tracking_number">Tracking Number</Label>
                    <Input
                      id="tracking_number"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Enter tracking number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="shipping_provider">Shipping Provider</Label>
                    <Select value={shippingProvider} onValueChange={setShippingProvider}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BlueDart">BlueDart</SelectItem>
                        <SelectItem value="FedEx">FedEx</SelectItem>
                        <SelectItem value="DHL">DHL</SelectItem>
                        <SelectItem value="DTDC">DTDC</SelectItem>
                        <SelectItem value="IndiaPost">India Post</SelectItem>
                        <SelectItem value="Delhivery">Delhivery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Shipping Status</Label>
                    <Select value={shippingStatus} onValueChange={setShippingStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="packed">Packed</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="in_transit">In Transit</SelectItem>
                        <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="returned">Returned</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="estimated_delivery">Estimated Delivery</Label>
                    <Input
                      id="estimated_delivery"
                      type="date"
                      value={estimatedDelivery}
                      onChange={(e) => setEstimatedDelivery(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Shipping Notes</Label>
                  <Textarea
                    id="notes"
                    value={shippingNotes}
                    onChange={(e) => setShippingNotes(e.target.value)}
                    placeholder="Add notes about shipping..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleUpdateShipping}
                    disabled={loading}
                    className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                  >
                    {loading ? 'Updating...' : 'Update Shipping'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
