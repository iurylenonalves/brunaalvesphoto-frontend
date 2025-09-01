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
  },    
  trailingSlash: true, // Adds a trailing slash to URLs
  reactStrictMode: true, // Enables React strict mode
};

export default nextConfig;