import { test, expect } from '@playwright/test';
import { loginAs } from '../helpers/auth';

// { tag: '@smoke' } habilita: npx playwright test --grep "@smoke"
test.describe('Smoke Tests - Sauce Demo', () => {

  test('La pagina de login carga', { tag: '@smoke' }, async ({ page }, testInfo) => {
    await page.goto('https://www.saucedemo.com');
    await expect(page).toHaveTitle(/Swag Labs/);
    await expect(page.locator('#login-button')).toBeVisible();

    await page.screenshot({
      path: `evidencias/clase10/smoke_${testInfo.project.name}_01_login_carga.png`,
      fullPage: true,
    });
  });

  test('Login con usuario estandar funciona', { tag: '@smoke' }, async ({ page }, testInfo) => {
    await loginAs(page, 'standard_user');
    await expect(page).toHaveURL(/inventory/);

    await page.screenshot({
      path: `evidencias/clase10/smoke_${testInfo.project.name}_02_login_estandar.png`,
      fullPage: true,
    });
  });

  test('El inventario muestra productos', { tag: '@smoke' }, async ({ page }, testInfo) => {
    await loginAs(page, 'standard_user');
    const items = page.locator('.inventory_item');
    await expect(items).toHaveCount(6);

    await page.screenshot({
      path: `evidencias/clase10/smoke_${testInfo.project.name}_03_inventario.png`,
      fullPage: true,
    });
  });

  test('El carrito es accesible', { tag: '@smoke' }, async ({ page }, testInfo) => {
    await loginAs(page, 'standard_user');
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/cart/);

    await page.screenshot({
      path: `evidencias/clase10/smoke_${testInfo.project.name}_04_carrito.png`,
      fullPage: true,
    });
  });

  test('El checkout inicia correctamente', { tag: '@smoke' }, async ({ page }, testInfo) => {
    await loginAs(page, 'standard_user');
    await page.locator('.btn_inventory').first().click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/checkout-step-one/);

    await page.screenshot({
      path: `evidencias/clase10/smoke_${testInfo.project.name}_05_checkout.png`,
      fullPage: true,
    });
  });

});