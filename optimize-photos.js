import { Jimp } from 'jimp';
import fs from 'fs';
import path from 'path';

const photosDir = './public/photos';

async function optimizeImages() {
  try {
    const files = fs.readdirSync(photosDir);
    console.log(`Encontrados ${files.length} archivos en ${photosDir}\n`);

    let totalOriginalSize = 0;
    let totalNewSize = 0;

    for (const file of files) {
      if (!file.match(/\.(jpg|jpeg|png)$/i)) continue;
      if (file === 'test_quality.jpg') {
        fs.unlinkSync(path.join(photosDir, file));
        continue;
      }

      const filePath = path.join(photosDir, file);
      const originalStats = fs.statSync(filePath);
      totalOriginalSize += originalStats.size;

      console.log(`-----------------------------------------------`);
      console.log(`Procesando: ${file} (${(originalStats.size / 1024).toFixed(2)} KB)`);

      try {
        const image = await Jimp.read(filePath);
        const originalWidth = image.width;
        const originalHeight = image.height;
        let resized = false;

        // Si la imagen es más grande que 1200px en su lado más largo, la redimensionamos
        if (originalWidth > 1200 || originalHeight > 1200) {
          if (originalWidth > originalHeight) {
            image.resize({ w: 1200 });
          } else {
            image.resize({ h: 1200 });
          }
          resized = true;
          console.log(`  📏 Redimensionada de ${originalWidth}x${originalHeight} a ${image.width}x${image.height}`);
        } else {
          console.log(`  ✅ Dimensiones adecuadas: ${originalWidth}x${originalHeight}`);
        }

        // Guardar con calidad de compresión 75%
        await image.write(filePath, { quality: 75 });
        
        const newStats = fs.statSync(filePath);
        totalNewSize += newStats.size;
        
        const changePct = ((originalStats.size - newStats.size) / originalStats.size * 100).toFixed(1);
        console.log(`  💾 Guardada con calidad 75%. Nuevo tamaño: ${(newStats.size / 1024).toFixed(2)} KB (reducción del ${changePct}%)`);
      } catch (err) {
        console.error(`  ❌ Error optimizando ${file}:`, err);
        totalNewSize += originalStats.size; // mantener el tamaño original si falla
      }
    }

    console.log(`===============================================`);
    console.log(`RESULTADO GLOBAL:`);
    console.log(`- Tamaño total original: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- Tamaño total nuevo: ${(totalNewSize / 1024 / 1024).toFixed(2)} MB`);
    const globalChangePct = ((totalOriginalSize - totalNewSize) / totalOriginalSize * 100).toFixed(1);
    console.log(`- Reducción total de peso: ${globalChangePct}%\n`);

  } catch (err) {
    console.error('Error general en la optimización:', err);
  }
}

optimizeImages();
