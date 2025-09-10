/** @type {import('next').NextConfig} */
const nextConfig = {
  //output: 'export', // Enables static export
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jxabqvnshu0vr3ka.public.blob.vercel-storage.com',
        port: '',
        pathname: '/posts/**',
      },
    ],   
    //unoptimized: true, // Allows unoptimized images
    qualities: [75, 100],    
    deviceSizes: [384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },    
  trailingSlash: true, // Adds a trailing slash to URLs
  reactStrictMode: true, // Enables React strict mode
};

export default nextConfig;