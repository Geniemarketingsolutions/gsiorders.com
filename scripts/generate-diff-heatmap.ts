import * as fs from 'fs';
import * as path from 'path';
import * as PNG from 'pngjs';
import * as pixelmatch from 'pixelmatch';

async function generateDiff() {
  const img1 = PNG.PNG.sync.read(fs.readFileSync('design_output/homepage/screenshots/home.png'));
  const img2 = PNG.PNG.sync.read(fs.readFileSync('design_output/homepage/styled/home-styled.png'));
  const {width, height} = img1;
  const diff = new PNG.PNG({width, height});

  pixelmatch(img1.data, img2.data, diff.data, width, height, {threshold: 0.1});

  fs.writeFileSync('design_output/homepage/diff-heatmap.png', PNG.PNG.sync.write(diff));
}

generateDiff(); 