/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'bwzarlqjvtkhnengccix.supabase.co', // Supabase Storage Bucket
      }
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@supabase/supabase-js', 'next-auth']
  }
};

export default nextConfig;
