'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Plus, 
  Edit, 
  Trash2, 
  Star, 
  Eye, 
  EyeOff,
  Search,
  Filter,
  Heart,
  Award,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils/formatNumber';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Feedback {
  id: string;
  customer_name: string;
  customer_email?: string;
  rating: number;
  feedback_text: string;
  product_name?: string;
  order_id?: string;
  image_url?: string;
  is_featured: boolean;
  is_approved: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export default function FeedbackManagement() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<Feedback[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    rating: 5,
    feedback_text: '',
    product_name: '',
    image_url: '',
    is_featured: false,
    is_approved: true,
    display_order: 0
  });

  // Image upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Fetch feedbacks
  const fetchFeedbacks = async () => {
    try {
      const { data, error } = await supabase
        .from('customer_feedback')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeedbacks(data || []);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      toast.error('Error fetching feedbacks');
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // Image upload function
  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `feedback/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('feedback-images')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('feedback-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Filter feedbacks
  useEffect(() => {
    let filtered = feedbacks;

    if (searchTerm) {
      filtered = filtered.filter(feedback =>
        feedback.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.feedback_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.product_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'approved') {
        filtered = filtered.filter(feedback => feedback.is_approved);
      } else if (statusFilter === 'pending') {
        filtered = filtered.filter(feedback => !feedback.is_approved);
      } else if (statusFilter === 'featured') {
        filtered = filtered.filter(feedback => feedback.is_featured);
      }
    }

    setFilteredFeedbacks(filtered);
  }, [feedbacks, searchTerm, statusFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalFormData = { ...formData };

      // Upload image if selected
      if (imageFile) {
        setUploadingImage(true);
        try {
          const imageUrl = await uploadImage(imageFile);
          finalFormData.image_url = imageUrl;
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          toast.error('Error uploading image');
          return;
        } finally {
          setUploadingImage(false);
        }
      }

      // Ensure required fields are not empty
      if (!finalFormData.customer_name.trim()) {
        toast.error('Customer name is required');
        return;
      }
      if (!finalFormData.feedback_text.trim()) {
        toast.error('Feedback text is required');
        return;
      }

      if (selectedFeedback) {
        // Update existing feedback
        const { error } = await supabase
          .from('customer_feedback')
          .update(finalFormData)
          .eq('id', selectedFeedback.id);

        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        toast.success('Feedback updated successfully!');
      } else {
        // Create new feedback - ensure all required fields are included
        const insertData = {
          customer_name: finalFormData.customer_name.trim(),
          customer_email: finalFormData.customer_email?.trim() || null,
          rating: finalFormData.rating,
          feedback_text: finalFormData.feedback_text.trim(),
          product_name: finalFormData.product_name?.trim() || null,
          image_url: finalFormData.image_url || null,
          is_featured: finalFormData.is_featured,
          is_approved: finalFormData.is_approved,
          display_order: finalFormData.display_order
        };

        const { error } = await supabase
          .from('customer_feedback')
          .insert([insertData]);

        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        toast.success('Feedback added successfully!');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchFeedbacks();
    } catch (error: any) {
      console.error('Error saving feedback:', error);
      toast.error(`Error saving feedback: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setFormData({
      customer_name: feedback.customer_name,
      customer_email: feedback.customer_email || '',
      rating: feedback.rating,
      feedback_text: feedback.feedback_text,
      product_name: feedback.product_name || '',
      image_url: feedback.image_url || '',
      is_featured: feedback.is_featured,
      is_approved: feedback.is_approved,
      display_order: feedback.display_order
    });
    // Reset image upload state when editing
    setImageFile(null);
    setImagePreview('');
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return;

    try {
      const { error } = await supabase
        .from('customer_feedback')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Feedback deleted successfully!');
      fetchFeedbacks();
    } catch (error) {
      console.error('Error deleting feedback:', error);
      toast.error('Error deleting feedback');
    }
  };

  const toggleApproval = async (feedback: Feedback) => {
    try {
      const { error } = await supabase
        .from('customer_feedback')
        .update({ is_approved: !feedback.is_approved })
        .eq('id', feedback.id);

      if (error) throw error;
      toast.success(`Feedback ${!feedback.is_approved ? 'approved' : 'unapproved'} successfully!`);
      fetchFeedbacks();
    } catch (error) {
      console.error('Error updating approval status:', error);
      toast.error('Error updating approval status');
    }
  };

  const toggleFeatured = async (feedback: Feedback) => {
    try {
      const { error } = await supabase
        .from('customer_feedback')
        .update({ is_featured: !feedback.is_featured })
        .eq('id', feedback.id);

      if (error) throw error;
      toast.success(`Feedback ${!feedback.is_featured ? 'featured' : 'unfeatured'} successfully!`);
      fetchFeedbacks();
    } catch (error) {
      console.error('Error updating featured status:', error);
      toast.error('Error updating featured status');
    }
  };

  const resetForm = () => {
    setSelectedFeedback(null);
    setFormData({
      customer_name: '',
      customer_email: '',
      rating: 5,
      feedback_text: '',
      product_name: '',
      image_url: '',
      is_featured: false,
      is_approved: true,
      display_order: 0
    });
    setImageFile(null);
    setImagePreview('');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const feedbackStats = {
    total: feedbacks.length,
    approved: feedbacks.filter(f => f.is_approved).length,
    pending: feedbacks.filter(f => !f.is_approved).length,
    featured: feedbacks.filter(f => f.is_featured).length,
    averageRating: feedbacks.length > 0 
      ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
      : '0'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-amber-600" />
            Customer Feedback Management
          </h1>
          <p className="text-gray-600">Manage customer testimonials and reviews</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Feedback</p>
                  <p className="text-2xl font-bold text-gray-900">{feedbackStats.total}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{feedbackStats.approved}</p>
                </div>
                <Eye className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{feedbackStats.pending}</p>
                </div>
                <EyeOff className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Featured</p>
                  <p className="text-2xl font-bold text-purple-600">{feedbackStats.featured}</p>
                </div>
                <Award className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-amber-600">{feedbackStats.averageRating}</p>
                </div>
                <Star className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Add Button */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search feedback..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Feedback</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-gradient-to-r from-amber-600 to-orange-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Feedback
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedFeedback ? 'Edit Feedback' : 'Add New Feedback'}
                </DialogTitle>
                <DialogDescription>
                  {selectedFeedback ? 'Update the feedback details below.' : 'Add a new customer feedback entry.'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customer_name">Customer Name *</Label>
                    <Input
                      id="customer_name"
                      value={formData.customer_name}
                      onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer_email">Customer Email</Label>
                    <Input
                      id="customer_email"
                      type="email"
                      value={formData.customer_email}
                      onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rating">Rating *</Label>
                    <Select
                      value={formData.rating.toString()}
                      onValueChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Star</SelectItem>
                        <SelectItem value="2">2 Stars</SelectItem>
                        <SelectItem value="3">3 Stars</SelectItem>
                        <SelectItem value="4">4 Stars</SelectItem>
                        <SelectItem value="5">5 Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="product_name">Product Name</Label>
                    <Input
                      id="product_name"
                      value={formData.product_name}
                      onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="feedback_text">Feedback Text *</Label>
                  <Textarea
                    id="feedback_text"
                    value={formData.feedback_text}
                    onChange={(e) => setFormData({ ...formData, feedback_text: e.target.value })}
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="image_upload">Customer Feedback Image</Label>
                  <div className="space-y-4">
                    <Input
                      id="image_upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="cursor-pointer"
                    />
                    {imagePreview && (
                      <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview('');
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    )}
                    {formData.image_url && !imagePreview && (
                      <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                        <img
                          src={formData.image_url}
                          alt="Current"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                          Current Image
                        </div>
                      </div>
                    )}
                    <p className="text-sm text-gray-500">
                      Upload a customer feedback screenshot or image (max 5MB)
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_approved"
                      checked={formData.is_approved}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_approved: checked })}
                    />
                    <Label htmlFor="is_approved">Approved</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                    />
                    <Label htmlFor="is_featured">Featured</Label>
                  </div>
                  <div>
                    <Label htmlFor="display_order">Display Order</Label>
                    <Input
                      id="display_order"
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading || uploadingImage}>
                    {uploadingImage ? 'Uploading Image...' : loading ? 'Saving...' : selectedFeedback ? 'Update' : 'Add'} Feedback
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Feedback Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Customer Feedback ({filteredFeedbacks.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Feedback</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFeedbacks.map((feedback) => (
                  <TableRow key={feedback.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{feedback.customer_name}</div>
                        {feedback.customer_email && (
                          <div className="text-sm text-gray-500">{feedback.customer_email}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {renderStars(feedback.rating)}
                        <span className="text-sm text-gray-600 ml-1">({feedback.rating})</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm truncate" title={feedback.feedback_text}>
                          {feedback.feedback_text}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {feedback.product_name && (
                        <Badge variant="outline">{feedback.product_name}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge className={feedback.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {feedback.is_approved ? 'Approved' : 'Pending'}
                        </Badge>
                        {feedback.is_featured && (
                          <Badge className="bg-purple-100 text-purple-800">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(feedback.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleApproval(feedback)}
                          title={feedback.is_approved ? 'Unapprove' : 'Approve'}
                        >
                          {feedback.is_approved ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleFeatured(feedback)}
                          title={feedback.is_featured ? 'Unfeature' : 'Feature'}
                        >
                          <Award className={`w-4 h-4 ${feedback.is_featured ? 'text-purple-600' : 'text-gray-400'}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(feedback)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(feedback.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredFeedbacks.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No feedback found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
