/*
  # Admin Portal Database Schema

  1. New Tables
    - `admin_users` - Admin user management
    - `products` - Product catalog with dynamic fields
    - `orders` - Order management
    - `reviews` - Customer reviews
    - `advertisements` - Banner and promotion management
    - `shipping_zones` - Shipping configuration
    - `site_settings` - Global site configuration
    - `festive_themes` - Theme management

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access
    - Add policies for public read access where needed

  3. Real-time
    - Enable real-time subscriptions for admin tables
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'moderator')),
  avatar_url text,
  is_active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Products Table (Enhanced)
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  short_description text,
  price decimal(10,2) NOT NULL,
  original_price decimal(10,2) NOT NULL,
  category text NOT NULL,
  material text NOT NULL,
  occasion text NOT NULL,
  images jsonb DEFAULT '[]'::jsonb,
  specifications jsonb DEFAULT '{}'::jsonb,
  stock_quantity integer DEFAULT 0,
  sku text UNIQUE,
  weight decimal(8,2),
  dimensions jsonb,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  seo_title text,
  seo_description text,
  tags text[],
  rating decimal(3,2) DEFAULT 0,
  review_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Orders Table (Enhanced)
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  shipping_address jsonb NOT NULL,
  billing_address jsonb,
  items jsonb NOT NULL,
  subtotal decimal(10,2) NOT NULL,
  discount_amount decimal(10,2) DEFAULT 0,
  shipping_cost decimal(10,2) DEFAULT 0,
  tax_amount decimal(10,2) DEFAULT 0,
  total_amount decimal(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  payment_method text NOT NULL,
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_id text,
  tracking_number text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Reviews Table (Enhanced)
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  comment text NOT NULL,
  images jsonb DEFAULT '[]'::jsonb,
  is_verified boolean DEFAULT false,
  is_approved boolean DEFAULT false,
  admin_response text,
  helpful_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Advertisements Table
CREATE TABLE IF NOT EXISTS advertisements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  link_url text,
  position text NOT NULL CHECK (position IN ('hero', 'banner', 'sidebar', 'popup', 'footer')),
  is_active boolean DEFAULT true,
  start_date timestamptz,
  end_date timestamptz,
  click_count integer DEFAULT 0,
  impression_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Shipping Zones Table
CREATE TABLE IF NOT EXISTS shipping_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  regions text[] NOT NULL,
  base_cost decimal(8,2) NOT NULL,
  per_kg_cost decimal(8,2) DEFAULT 0,
  free_shipping_threshold decimal(10,2),
  estimated_days_min integer NOT NULL,
  estimated_days_max integer NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'general',
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Festive Themes Table
CREATE TABLE IF NOT EXISTS festive_themes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  colors jsonb NOT NULL,
  fonts jsonb,
  images jsonb,
  css_overrides text,
  is_active boolean DEFAULT false,
  start_date timestamptz,
  end_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE festive_themes ENABLE ROW LEVEL SECURITY;

-- Admin Users Policies
CREATE POLICY "Admin users can read all admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.id = auth.uid() AND au.is_active = true
    )
  );

CREATE POLICY "Super admins can manage admin users"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.id = auth.uid() AND au.role = 'super_admin' AND au.is_active = true
    )
  );

-- Products Policies
CREATE POLICY "Anyone can read active products"
  ON products
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage products"
  ON products
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.id = auth.uid() AND au.is_active = true
    )
  );

-- Orders Policies
CREATE POLICY "Admins can manage orders"
  ON orders
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.id = auth.uid() AND au.is_active = true
    )
  );

-- Reviews Policies
CREATE POLICY "Anyone can read approved reviews"
  ON reviews
  FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Admins can manage reviews"
  ON reviews
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.id = auth.uid() AND au.is_active = true
    )
  );

-- Advertisements Policies
CREATE POLICY "Anyone can read active advertisements"
  ON advertisements
  FOR SELECT
  USING (is_active = true AND (start_date IS NULL OR start_date <= now()) AND (end_date IS NULL OR end_date >= now()));

CREATE POLICY "Admins can manage advertisements"
  ON advertisements
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.id = auth.uid() AND au.is_active = true
    )
  );

-- Shipping Zones Policies
CREATE POLICY "Anyone can read active shipping zones"
  ON shipping_zones
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage shipping zones"
  ON shipping_zones
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.id = auth.uid() AND au.is_active = true
    )
  );

-- Site Settings Policies
CREATE POLICY "Anyone can read public site settings"
  ON site_settings
  FOR SELECT
  USING (is_public = true);

CREATE POLICY "Admins can manage site settings"
  ON site_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.id = auth.uid() AND au.is_active = true
    )
  );

-- Festive Themes Policies
CREATE POLICY "Anyone can read active festive themes"
  ON festive_themes
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage festive themes"
  ON festive_themes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.id = auth.uid() AND au.is_active = true
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_material ON products(material);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_is_approved ON reviews(is_approved);

-- Insert default site settings
INSERT INTO site_settings (key, value, description, category, is_public) VALUES
('site_name', '"अलंकारिका"', 'Site name', 'general', true),
('site_description', '"Where Tradition Meets Elegance"', 'Site description', 'general', true),
('contact_email', '"akrutiutekar@gmail.com"', 'Contact email', 'contact', true),
('contact_phone', '"+91 9769432565"', 'Contact phone', 'contact', true),
('whatsapp_number', '"919876543210"', 'WhatsApp number', 'contact', true),
('free_shipping_threshold', '50000', 'Free shipping threshold amount', 'shipping', true),
('currency', '"INR"', 'Site currency', 'general', true),
('festive_mode_enabled', 'false', 'Enable festive mode', 'theme', true)
ON CONFLICT (key) DO NOTHING;

-- Insert default shipping zones
INSERT INTO shipping_zones (name, regions, base_cost, per_kg_cost, free_shipping_threshold, estimated_days_min, estimated_days_max) VALUES
('Metro Cities', '["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad"]', 200, 50, 50000, 2, 4),
('Tier 1 Cities', '["Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam"]', 300, 75, 50000, 3, 6),
('Tier 2 Cities', '["Agra", "Meerut", "Rajkot", "Kalyan-Dombivali", "Vasai-Virar", "Varanasi", "Srinagar", "Dhanbad"]', 400, 100, 50000, 4, 8),
('Rest of India', '["Others"]', 500, 125, 50000, 5, 10)
ON CONFLICT DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_advertisements_updated_at BEFORE UPDATE ON advertisements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shipping_zones_updated_at BEFORE UPDATE ON shipping_zones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_festive_themes_updated_at BEFORE UPDATE ON festive_themes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();