/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Habilita exportação estática
  images: {
    unoptimized: true, // Permite imagens sem otimização
  },
  trailingSlash: true, // Adiciona uma barra no final das URLs
  reactStrictMode: true, // Habilita o modo estrito do React
  };

module.exports = nextConfig;