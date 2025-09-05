// Script para otimizar imagens para Google Cards
// Execute este script para gerar uma imagem 1200x630 otimizada

const sharp = require('sharp');
const path = require('path');

async function createGoogleCardImage() {
  try {
    const inputImage = path.join(__dirname, '../public/images/hero-image-large.webp');
    const outputImage = path.join(__dirname, '../public/images/google-card-image.webp');
    
    await sharp(inputImage)
      .resize(1200, 630, {
        fit: 'cover', // Isso garante que a imagem preencha completamente sem bordas
        position: 'center'
      })
      .webp({ quality: 85 })
      .toFile(outputImage);
      
    console.log('✅ Imagem otimizada para Google Cards criada: google-card-image.webp');
    
    // Também criar versão da about image
    const inputAbout = path.join(__dirname, '../public/images/about-image-large.webp');
    const outputAbout = path.join(__dirname, '../public/images/about-google-card.webp');
    
    await sharp(inputAbout)
      .resize(1200, 630, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 85 })
      .toFile(outputAbout);
      
    console.log('✅ Imagem About otimizada para Google Cards criada: about-google-card.webp');
    
  } catch (error) {
    console.error('❌ Erro ao criar imagem para Google Cards:', error);
  }
}

createGoogleCardImage();
