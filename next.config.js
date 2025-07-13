/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
    
  },
  images: {
    domains: ['ljvrtryayjlwtankpfrm.supabase.co', 'images.pexels.com'],
  },
};

module.exports = nextConfig;
