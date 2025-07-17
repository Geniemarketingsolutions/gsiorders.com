import * as fs from 'fs';
import * as path from 'path';
import * as PNG from 'pngjs';
import * as pixelmatch from 'pixelmatch';

async function generateDiff() {
  try {
    // Check if files exist
    const img1Path = 'design_output/shop-all/screenshots/home.png';
    const img2Path = 'design_output/shop-all/styled/home-styled.png';
    const outputPath = 'design_output/shop-all/diff-heatmap.png';
    
    if (!fs.existsSync(img1Path)) {
      console.error(`File not found: ${img1Path}`);
      return;
    }
    
    if (!fs.existsSync(img2Path)) {
      console.error(`File not found: ${img2Path}`);
      return;
    }
    
    const img1 = PNG.PNG.sync.read(fs.readFileSync(img1Path));
    const img2 = PNG.PNG.sync.read(fs.readFileSync(img2Path));
    const {width, height} = img1;
    const diff = new PNG.PNG({width, height});

    const numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, {threshold: 0.1});
    
    fs.writeFileSync(outputPath, PNG.PNG.sync.write(diff));
    
    console.log(`✅ Diff heatmap generated: ${outputPath}`);
    console.log(`📊 Diff pixels: ${numDiffPixels} / ${width * height} (${((numDiffPixels / (width * height)) * 100).toFixed(2)}%)`);
  } catch (error) {
    console.error('Error generating diff:', error);
  }
}

generateDiff(); 