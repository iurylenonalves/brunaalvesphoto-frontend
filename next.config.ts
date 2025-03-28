/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Habilita exportação estática
  images: {
    unoptimized: true, // Permite imagens sem otimização
  },
  trailingSlash: true,
  reactStrictMode: true,
  
  // Configurações para rotas estáticas
  exportPathMap: async function () {
    return {
      '/': { page: '/' },
    };
  },
};

module.exports = nextConfig;