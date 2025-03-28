const sharp = require('sharp')
import * as fs from 'fs';
import * as path from 'path';

const inputDir = 'original-photos';
const outputDir = 'public/images';

const sizes: Record<string, number> = {
  thumbnail: 500,
  medium: 1000,
  large: 1500
};

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.readdirSync(inputDir).forEach(file => {
  if (file.match(/\.(jpg|jpeg|png)$/i)) {
    const inputPath = path.join(inputDir, file);
    const filename = path.parse(file).name;

    Object.entries(sizes).forEach(([size, width]) => {
      const outputPath = path.join(outputDir, `${filename}-${size}.webp`);

      sharp(inputPath)
        .resize(width)
        .webp({ quality: 80 })
        .toFile(outputPath)
        .then(() => console.log(`✅ Criado: ${outputPath}`))
        .catch((err: unknown) => {
          if (err instanceof Error) {
            console.error(`❌ Erro processando ${file}:`, err.message);
          } else {
            console.error(`❌ Erro desconhecido ao processar ${file}:`, err);
          }
        });
    });
  }
});