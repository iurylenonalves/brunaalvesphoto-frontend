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
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 85],
    deviceSizes: [384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    minimumCacheTTL: 31536000,
  },    
  trailingSlash: true,
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,

  async redirects() {
    return [
      { source: '/links', destination: '/?utm_source=instagram&utm_medium=social&utm_campaign=link_bio', permanent: false },
      { source: '/about', destination: '/en/about/', permanent: true },
      { source: '/contact', destination: '/en/contact/', permanent: true },
      { source: '/portfolio', destination: '/en/portfolio/', permanent: true },
      { source: '/blog', destination: '/en/blog/', permanent: true },
      { source: '/sobre', destination: '/pt/about/', permanent: true },
      { source: '/contato', destination: '/pt/contact/', permanent: true },
    ];
  },
};

export default nextConfig;