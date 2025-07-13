'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  ToggleLeft,
  ToggleRight,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSupabaseRealtime } from '@/hooks/useSupabaseRealtime';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface CarouselSlide {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  button_text: string;
  button_link: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Fetch carousel slides
const fetchCarouselSlides = async () => {
  const { data, error } = await supabase
    .from('carousel_slides')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching carousel slides:', error);
    throw error;
  }
  return data as CarouselSlide[];
};

export default function CarouselManagement() {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentSlide, setCurrentSlide] = useState<Partial<CarouselSlide>>({});
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Real-time carousel data
  const slidesData = useSupabaseRealtime(fetchCarouselSlides, 'carousel_slides', [isDialogOpen, loading]);

  useEffect(() => {
    if (slidesData) {
      setSlides(slidesData);
    }
  }, [slidesData]);

  // Helper to upload image to Supabase Storage
  const uploadImageToSupabase = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from('carousel-images')
      .upload(fileName, file, { upsert: true });
    if (error) throw error;
    const { data: publicUrlData } = supabase.storage
      .from('carousel-images')
      .getPublicUrl(fileName);
    return publicUrlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = currentSlide.image_url || '';
      if (imageFile) {
        // Upload image and get public URL
        imageUrl = await uploadImageToSupabase(imageFile);
        if (!imageUrl) throw new Error('Image upload failed');
      } else if (!imageUrl) {
        toast.error('Please select an image.');
        setLoading(false);
        return;
      }
      const slideData = {
        title: currentSlide.title,
        subtitle: currentSlide.subtitle,
        image_url: imageUrl,
        button_text: currentSlide.button_text || 'Explore Collection',
        button_link: currentSlide.button_link || '/collections',
        display_order: currentSlide.display_order || (slides.length + 1),
        is_active: currentSlide.is_active ?? true,
        updated_at: new Date().toISOString()
      };
      if (isEditMode && currentSlide.id) {
        const { error } = await supabase
          .from('carousel_slides')
          .update(slideData)
          .eq('id', currentSlide.id);
        if (error) throw error;
        toast.success('Carousel slide updated successfully!');
      } else {
        const { error } = await supabase
          .from('carousel_slides')
          .insert([{ ...slideData, created_at: new Date().toISOString() }]);
        if (error) throw error;
        toast.success('Carousel slide added successfully!');
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving carousel slide:', error);
      toast.error('Error saving carousel slide');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (slide: CarouselSlide) => {
    setCurrentSlide(slide);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (slideId: string) => {
    if (!confirm('Are you sure you want to delete this carousel slide?')) return;

    try {
      const { error } = await supabase
        .from('carousel_slides')
        .delete()
        .eq('id', slideId);

      if (error) throw error;
      toast.success('Carousel slide deleted successfully!');
    } catch (error) {
      console.error('Error deleting carousel slide:', error);
      toast.error('Error deleting carousel slide');
    }
  };

  const handleToggleActive = async (slideId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('carousel_slides')
        .update({ 
          is_active: !isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', slideId);

      if (error) throw error;
      toast.success(`Carousel slide ${!isActive ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      console.error('Error toggling carousel slide:', error);
      toast.error('Error toggling carousel slide');
    }
  };

  const handleReorder = async (slideId: string, direction: 'up' | 'down') => {
    const slide = slides.find(s => s.id === slideId);
    if (!slide) return;

    const currentOrder = slide.display_order;
    const targetOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;
    
    const targetSlide = slides.find(s => s.display_order === targetOrder);
    if (!targetSlide) return;

    try {
      // Swap display orders
      await Promise.all([
        supabase
          .from('carousel_slides')
          .update({ 
            display_order: targetOrder,
            updated_at: new Date().toISOString()
          })
          .eq('id', slideId),
        supabase
          .from('carousel_slides')
          .update({ 
            display_order: currentOrder,
            updated_at: new Date().toISOString()
          })
          .eq('id', targetSlide.id)
      ]);

      toast.success('Slide order updated successfully!');
    } catch (error) {
      console.error('Error reordering slides:', error);
      toast.error('Error reordering slides');
    }
  };

  const resetForm = () => {
    setCurrentSlide({});
    setIsEditMode(false);
    setImageFile(null); // Reset image file state
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Carousel Management</h1>
          <p className="text-gray-600 mt-1">Manage homepage carousel slides</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
              onClick={resetForm}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Slide
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? 'Edit Carousel Slide' : 'Add New Carousel Slide'}
              </DialogTitle>
              <DialogDescription>
                {isEditMode ? 'Update carousel slide information' : 'Create a new carousel slide for the homepage'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={currentSlide.title || ''}
                    onChange={(e) => setCurrentSlide(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter slide title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={currentSlide.subtitle || ''}
                    onChange={(e) => setCurrentSlide(prev => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="Enter slide subtitle"
                  />
                </div>

                <div>
                  <Label htmlFor="image_upload">Image *</Label>
                  <input
                    id="image_upload"
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setImageFile(e.target.files[0]);
                        setCurrentSlide(prev => ({ ...prev, image_url: '' }));
                      }
                    }}
                    required={!isEditMode}
                  />
                  {(currentSlide.image_url || imageFile) && (
                    <div className="mt-2">
                      <Image
                        src={imageFile ? URL.createObjectURL(imageFile) : currentSlide.image_url || "/alankarika-logo.png"}
                        alt="Preview"
                        width={400}
                        height={128}
                        className="w-full h-32 object-cover rounded-lg"
                        style={imageFile ? { width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '128px' } : {}}
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="button_text">Button Text</Label>
                    <Input
                      id="button_text"
                      value={currentSlide.button_text || ''}
                      onChange={(e) => setCurrentSlide(prev => ({ ...prev, button_text: e.target.value }))}
                      placeholder="Explore Collection"
                    />
                  </div>
                  <div>
                    <Label htmlFor="button_link">Button Link</Label>
                    <Input
                      id="button_link"
                      value={currentSlide.button_link || ''}
                      onChange={(e) => setCurrentSlide(prev => ({ ...prev, button_link: e.target.value }))}
                      placeholder="/collections"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="display_order">Display Order</Label>
                    <Input
                      id="display_order"
                      type="number"
                      value={currentSlide.display_order || ''}
                      onChange={(e) => setCurrentSlide(prev => ({ ...prev, display_order: parseInt(e.target.value) }))}
                      placeholder="1"
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      id="is_active"
                      checked={currentSlide.is_active ?? true}
                      onCheckedChange={(checked) => setCurrentSlide(prev => ({ ...prev, is_active: checked }))}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                >
                  {loading ? 'Saving...' : (isEditMode ? 'Update Slide' : 'Add Slide')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Carousel Slides */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Carousel Slides ({slides.length})
          </CardTitle>
          <CardDescription>
            Manage the carousel slides that appear on the homepage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Preview</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slides.map((slide) => (
                <TableRow key={slide.id}>
                  <TableCell>
                    <div className="w-20 h-12 rounded-lg overflow-hidden bg-gray-100">
                      <Image 
                        src={slide.image_url} 
                        alt={slide.title}
                        width={80}
                        height={48}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-image.jpg';
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{slide.title}</div>
                      {slide.subtitle && (
                        <div className="text-sm text-gray-500">{slide.subtitle}</div>
                      )}
                      <div className="text-xs text-gray-400 mt-1">
                        Button: {slide.button_text} → {slide.button_link}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">{slide.display_order}</span>
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleReorder(slide.id, 'up')}
                          disabled={slide.display_order === 1}
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleReorder(slide.id, 'down')}
                          disabled={slide.display_order === slides.length}
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={slide.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {slide.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleActive(slide.id, slide.is_active)}
                      >
                        {slide.is_active ? (
                          <ToggleRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ToggleLeft className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(slide)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(slide.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {slides.length === 0 && (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No carousel slides</h3>
              <p className="text-gray-500">Add your first carousel slide to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
