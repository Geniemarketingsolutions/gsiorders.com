import { test, expect } from '@playwright/test';

test('Home hero CTA navigation', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-testid="hero-cta"]');
  await expect(page).toHaveURL('/shop');
});

test('Mega-menu open and close', async ({ page }) => {
  await page.goto('/');
  await page.hover('[data-testid="shop-menu"]');
  await expect(page.locator('[data-testid="mega-menu"]')).toBeVisible();
  await page.mouse.move(0, 0);
  await expect(page.locator('[data-testid="mega-menu"]')).not.toBeVisible();
}); 