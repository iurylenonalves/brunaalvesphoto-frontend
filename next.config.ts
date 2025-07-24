/** @type {import('next').NextConfig} */
const nextConfig = {
  //output: 'export', // Enables static export
  images: {
    unoptimized: true, // Allows unoptimized images
  },
  trailingSlash: true, // Adds a trailing slash to URLs
  reactStrictMode: true, // Enables React strict mode
  };

module.exports = nextConfig;