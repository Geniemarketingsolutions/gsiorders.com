import { chromium } from 'playwright';
import * as fs from 'fs/promises';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://mood.com');

  const tokens = {
    typography: await page.evaluate(() => {
      const body = document.body;
      const computed = window.getComputedStyle(body);
      return {
        fontFamily: computed.fontFamily,
        fontSize: computed.fontSize,
        fontWeight: computed.fontWeight,
        lineHeight: computed.lineHeight
      };
    }),
    colors: await page.evaluate(() => {
      const root = document.documentElement;
      const computed = window.getComputedStyle(root);
      return {
        background: computed.backgroundColor,
        primary: computed.getPropertyValue('--primary-color') || '#000000',
        secondary: computed.getPropertyValue('--secondary-color') || '#ffffff'
      };
    }),
    borders: await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let borderRadius = '0px';
      let boxShadow = 'none';
      for (const el of elements) {
        const style = window.getComputedStyle(el);
        if (style.borderRadius !== '0px') borderRadius = style.borderRadius;
        if (style.boxShadow !== 'none') boxShadow = style.boxShadow;
      }
      return { borderRadius, boxShadow };
    }),
    buttons: await page.evaluate(() => {
      const button = document.querySelector('button') || document.querySelector('[role="button"]');
      if (!button) return {};
      const style = window.getComputedStyle(button);
      return {
        background: style.backgroundColor,
        color: style.color,
        padding: style.padding,
        borderRadius: style.borderRadius
      };
    })
  };

  await fs.writeFile('design_output/tokens/mood_tokens.json', JSON.stringify(tokens, null, 2));

  await browser.close();
})(); 