import { chromium } from 'playwright';
import * as fs from 'fs/promises';
import { execSync } from 'child_process';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://mood.com');

  const assets = await page.evaluate(() => {
    const heroImg = document.querySelector('.hero img') as HTMLImageElement | null;
    const hero = heroImg?.src || '';
    const thumbnailImgs = document.querySelectorAll('.category-thumbnail img') as NodeListOf<HTMLImageElement>;
    const thumbnails = Array.from(thumbnailImgs).map(img => img.src);
    const iconSvgs = document.querySelectorAll('.icon svg') as NodeListOf<SVGSVGElement>;
    const icons = Array.from(iconSvgs).map(svg => svg.outerHTML);
    return { hero, thumbnails, icons };
  });

  // Download hero
  if (assets.hero) {
    execSync(`curl -o public/mood-assets/hero.jpg ${assets.hero}`);
  }

  // Download thumbnails
  assets.thumbnails.forEach((url, index) => {
    if (url) execSync(`curl -o public/mood-assets/thumbnail-${index}.jpg ${url}`);
  });

  // Save icons
  assets.icons.forEach((svg, index) => {
    fs.writeFile(`public/mood-assets/icon-${index}.svg`, svg);
  });

  await browser.close();
})(); 