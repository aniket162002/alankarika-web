import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Admin client with service role key for server-side operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Admin database operations
export const adminDb = {
  // Products
  async getProducts(filters?: any) {
    let query = supabaseAdmin.from('products').select('*')
    
    if (filters?.category && filters.category !== 'all') {
      query = query.eq('category', filters.category)
    }
    if (filters?.material && filters.material !== 'all') {
      query = query.eq('material', filters.material)
    }
    if (filters?.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active)
    }
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }
    
    return query.order('created_at', { ascending: false })
  },

  async createProduct(product: any) {
    return supabaseAdmin.from('products').insert(product).select().single()
  },

  async updateProduct(id: string, updates: any) {
    return supabaseAdmin.from('products').update(updates).eq('id', id).select().single()
  },

  async deleteProduct(id: string) {
    return supabaseAdmin.from('products').delete().eq('id', id)
  },

  // Orders
  async getOrders(filters?: any) {
    let query = supabaseAdmin.from('orders').select('*')
    
    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status)
    }
    if (filters?.payment_status && filters.payment_status !== 'all') {
      query = query.eq('payment_status', filters.payment_status)
    }
    if (filters?.date_from) {
      query = query.gte('created_at', filters.date_from)
    }
    if (filters?.date_to) {
      query = query.lte('created_at', filters.date_to)
    }
    
    return query.order('created_at', { ascending: false })
  },

  async updateOrder(id: string, updates: any) {
    return supabaseAdmin.from('orders').update(updates).eq('id', id).select().single()
  },

  // Reviews
  async getReviews(filters?: any) {
    let query = supabaseAdmin.from('reviews').select(`
      *,
      products (name, images)
    `)
    
    if (filters?.is_approved !== undefined) {
      query = query.eq('is_approved', filters.is_approved)
    }
    if (filters?.product_id) {
      query = query.eq('product_id', filters.product_id)
    }
    
    return query.order('created_at', { ascending: false })
  },

  async updateReview(id: string, updates: any) {
    return supabaseAdmin.from('reviews').update(updates).eq('id', id).select().single()
  },

  async deleteReview(id: string) {
    return supabaseAdmin.from('reviews').delete().eq('id', id)
  },

  // Advertisements
  async getAdvertisements() {
    return supabaseAdmin.from('advertisements').select('*').order('created_at', { ascending: false })
  },

  async createAdvertisement(ad: any) {
    return supabaseAdmin.from('advertisements').insert(ad).select().single()
  },

  async updateAdvertisement(id: string, updates: any) {
    return supabaseAdmin.from('advertisements').update(updates).eq('id', id).select().single()
  },

  async deleteAdvertisement(id: string) {
    return supabaseAdmin.from('advertisements').delete().eq('id', id)
  },

  // Site Settings
  async getSiteSettings() {
    return supabaseAdmin.from('site_settings').select('*').order('category')
  },

  async updateSiteSetting(key: string, value: any) {
    return supabaseAdmin.from('site_settings').upsert({
      key,
      value,
      updated_at: new Date().toISOString()
    }).select().single()
  },

  // Shipping Zones
  async getShippingZones() {
    return supabaseAdmin.from('shipping_zones').select('*').order('name')
  },

  async updateShippingZone(id: string, updates: any) {
    return supabaseAdmin.from('shipping_zones').update(updates).eq('id', id).select().single()
  },

  // Festive Themes
  async getFestiveThemes() {
    return supabaseAdmin.from('festive_themes').select('*').order('created_at', { ascending: false })
  },

  async createFestiveTheme(theme: any) {
    return supabaseAdmin.from('festive_themes').insert(theme).select().single()
  },

  async updateFestiveTheme(id: string, updates: any) {
    return supabaseAdmin.from('festive_themes').update(updates).eq('id', id).select().single()
  },

  async activateFestiveTheme(id: string) {
    // Deactivate all themes first
    await supabaseAdmin.from('festive_themes').update({ is_active: false }).neq('id', id)
    // Activate the selected theme
    return supabaseAdmin.from('festive_themes').update({ is_active: true }).eq('id', id).select().single()
  },

  // Dashboard Stats
  async getDashboardStats() {
    const [
      { count: totalProducts },
      { count: totalOrders },
      { count: pendingReviews },
      { data: recentOrders }
    ] = await Promise.all([
      supabaseAdmin.from('products').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('reviews').select('*', { count: 'exact', head: true }).eq('is_approved', false),
      supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false }).limit(5)
    ])

    // Calculate total revenue
    const { data: orders } = await supabaseAdmin.from('orders').select('total_amount').eq('payment_status', 'paid')
    const totalRevenue = orders?.reduce((sum, order) => sum + parseFloat(order.total_amount), 0) || 0

    return {
      totalProducts: totalProducts || 0,
      totalOrders: totalOrders || 0,
      totalRevenue,
      pendingReviews: pendingReviews || 0,
      recentOrders: recentOrders || []
    }
  }
}