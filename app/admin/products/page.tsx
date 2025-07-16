'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  Upload,
  Star,
  Package,
  DollarSign,
  Tag,
  Image as ImageIcon,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { useSupabaseRealtime } from '@/hooks/useSupabaseRealtime';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

// Add types for product and formData
interface Product {
  id?: string;
  name: string;
  category: string;
  short_description?: string;
  discount?: number | string;
  price: number | string;
  image_url?: string;
  [key: string]: any;
}

interface FormData {
  name: string;
  description: string;
  price: string;
  category: string;
  short_description: string;
  discount: string;
  imageFile: File | null;
  imageUrl: string;
}

type ProductFormProps = {
  formData: any;
  setFormData: (data: any) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  imagePreview: string | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
  setIsProductDialogOpen: (open: boolean) => void;
  selectedProduct: any;
};

// Move ProductForm outside the main component to avoid re-creation on every render
const ProductForm = ({ formData, setFormData, handleSubmit, imagePreview, fileInputRef, setIsProductDialogOpen, selectedProduct }: ProductFormProps) => (
  <form onSubmit={handleSubmit} className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="name">Product Name *</Label>
        <input
          id="name"
          className="w-full border rounded px-3 py-2"
          value={formData.name}
          onChange={e => setFormData((prev: any) => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="price">Price (₹) *</Label>
        <input
          id="price"
          type="number"
          className="w-full border rounded px-3 py-2"
          value={formData.price}
          onChange={e => setFormData((prev: any) => ({ ...prev, price: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <input
          id="category"
          className="w-full border rounded px-3 py-2"
          value={formData.category}
          onChange={e => setFormData((prev: any) => ({ ...prev, category: e.target.value }))}
        />
      </div>
    </div>
    <div>
      <Label htmlFor="description">Full Description</Label>
      <textarea
        id="description"
        className="w-full border rounded px-3 py-2"
        value={formData.description}
        onChange={e => setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
      />
    </div>
    <div>
      <Label htmlFor="short_description">Short Description</Label>
      <input
        id="short_description"
        className="w-full border rounded px-3 py-2"
        value={formData.short_description}
        onChange={e => setFormData((prev: any) => ({ ...prev, short_description: e.target.value }))}
        placeholder="Brief product description"
      />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="discount">Discount (%)</Label>
        <input
          id="discount"
          type="number"
          className="w-full border rounded px-3 py-2"
          value={formData.discount}
          onChange={e => setFormData((prev: any) => ({ ...prev, discount: e.target.value }))}
          placeholder="Optional discount"
        />
      </div>
      <div>
        <Label htmlFor="image">Product Image *</Label>
        <input
          id="image"
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={e => setFormData((prev: any) => ({ ...prev, imageFile: e.target.files && e.target.files[0] }))}
        />
        {imagePreview && (
          <div className="mt-2">
            <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded border" />
          </div>
        )}
      </div>
    </div>
    <div className="flex justify-end gap-2">
      <Button type="button" variant="outline" onClick={() => setIsProductDialogOpen(false)}>
        Cancel
      </Button>
      <Button type="submit" className="bg-gradient-to-r from-amber-600 to-orange-600">
        <Save className="w-4 h-4 mr-2" />
        {selectedProduct ? 'Update' : 'Create'} Product
      </Button>
    </div>
  </form>
);

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    category: '',
    short_description: '',
    discount: '',
    imageFile: null,
    imageUrl: '',
  });
  const [imagePreview, setImagePreview] = useState('');
  const router = useRouter();
  const fileInputRef = useRef(null);

  // Real-time products data with inline fetch function
  const fetchProducts = async () => {
    let query = supabase.from('products').select('*');
    if (categoryFilter !== 'all') {
      query = query.eq('category', categoryFilter);
    }
    if (searchTerm) {
      query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }
    if (statusFilter === 'active') {
      query = query.eq('in_stock', true);
    } else if (statusFilter === 'inactive') {
      query = query.eq('in_stock', false);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  };
  const productsData = useSupabaseRealtime(fetchProducts, 'products', [searchTerm, categoryFilter, statusFilter]);

  useEffect(() => {
    if (productsData) {
      setProducts(productsData);
      setLoading(false);
    }
  }, [productsData]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, imageFile: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Add a function to refetch products after create/delete
  const refetchProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (e) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  // Update handleSubmit to call refetchProducts after success
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert('Please fill all required fields.');
      return;
    }
    if (!selectedProduct && !formData.imageFile) {
      alert('Please select a product image.');
      return;
    }
    try {
      let imageUrl = formData.imageUrl;
      if (formData.imageFile) {
        const fileExt = formData.imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, formData.imageFile, { upsert: true });
        if (uploadError) {
          console.error('Image upload error:', uploadError);
          alert('Image upload error: ' + JSON.stringify(uploadError));
          return;
        }
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
        imageUrl = publicUrlData.publicUrl;
        imageUrl = imageUrl.replace(/([^:]\/)\/+/, '$1');
      }
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseInt(formData.price),
        category: formData.category,
        short_description: formData.short_description,
        discount: formData.discount ? parseInt(formData.discount) : null,
        image_url: imageUrl,
      };
      let response;
      if (selectedProduct) {
        // For update, call the PUT API
        response = await fetch('/api/admin/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: selectedProduct.id, ...productData }),
        });
      } else {
        response = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
      }
      const result = await response.json();
      if (!result.success) {
        alert('API error: ' + result.error);
        return;
      }
      setIsProductDialogOpen(false);
      setSelectedProduct(null);
      resetForm();
      await refetchProducts(); // Refetch after create
      alert('Product saved successfully!');
    } catch (error: any) {
      console.error('Error saving product:', error);
      alert('Error saving product: ' + (error?.message || JSON.stringify(error)));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      short_description: '',
      discount: '',
      imageFile: null,
      imageUrl: '',
    });
    setImagePreview('');
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      category: product.category || '',
      short_description: product.short_description || '',
      discount: product.discount?.toString() || '',
      price: product.price?.toString() || '',
      imageFile: null,
      imageUrl: product.image_url || '',
    });
    setImagePreview(product.image_url || '');
    setIsProductDialogOpen(true);
  };

  // Update handleDelete to call refetchProducts after success
  const handleDelete = async (productId: string, imageUrl?: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await fetch('/api/admin/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productId, image_url: imageUrl }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      await refetchProducts(); // Refetch after delete
      alert('Product deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please try again.');
    }
  };

  const toggleProductStatus = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ in_stock: !product.in_stock })
        .eq('id', product.id);
      
        if (error) throw error;
        
        alert('Product status updated successfully!');
      } catch (error: any) {
        console.error('Error updating product status:', error);
        alert('Error updating product status. Please try again.');
      }
    };

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
                <p className="text-gray-600">Manage your jewelry catalog</p>
              </div>
              <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-gradient-to-r from-amber-600 to-orange-600"
                    onClick={() => {
                      setSelectedProduct(null);
                      resetForm();
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {selectedProduct ? 'Edit Product' : 'Add New Product'}
                    </DialogTitle>
                  </DialogHeader>
                  <ProductForm 
                    formData={formData}
                    setFormData={setFormData}
                    handleSubmit={handleSubmit}
                    imagePreview={imagePreview}
                    fileInputRef={fileInputRef}
                    setIsProductDialogOpen={setIsProductDialogOpen}
                    selectedProduct={selectedProduct}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search products..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Necklaces">Necklaces</SelectItem>
                    <SelectItem value="Earrings">Earrings</SelectItem>
                    <SelectItem value="Bangles">Bangles</SelectItem>
                    <SelectItem value="Rings">Rings</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Products Table */}
          <Card>
            <CardContent className="pt-6">
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading products...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                            <div>
                              <div className="font-semibold">{product.name}</div>
                              <div className="text-sm text-gray-500">SKU: {product.sku || 'N/A'}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                      <TableCell className="font-semibold">₹{parseFloat(String(product.price)).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={product.in_stock ? 'default' : 'destructive'}>
                          {product.in_stock ? 'Available' : 'Out of Stock'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={product.in_stock}
                            onCheckedChange={() => toggleProductStatus(product)}
                          />
                          <Badge className={product.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {product.in_stock ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleEdit(product)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDelete(String(product.id), product.image_url)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {!loading && products.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No products found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}