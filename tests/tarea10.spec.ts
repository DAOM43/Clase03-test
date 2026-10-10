import { test, expect } from '@playwright/test';
import { loginAs } from '../helpers/auth';

// Reto 1
test.describe('Reto 1 - Tags multiples', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'standard_user');
    await expect(page).toHaveURL(/inventory/);
  });

  test('El titulo del inventario es visible',
    { tag: ['@regression', '@ui'] }, async ({ page }, testInfo) => {
      await expect(page.locator('.title')).toHaveText('Products');
      await expect(page.locator('.app_logo')).toBeVisible();

      await page.screenshot({
        path: `evidencias/clase10/tarea_${testInfo.project.name}_reto1_titulo_ui.png`,
        fullPage: true,
      });
    });

  test('Los 6 productos muestran su imagen',
    { tag: ['@regression', '@ui'] }, async ({ page }, testInfo) => {
      const imagenes = page.locator('.inventory_item_img img');
      await expect(imagenes).toHaveCount(6);
      await expect(imagenes.first()).toBeVisible();

      await page.screenshot({
        path: `evidencias/clase10/tarea_${testInfo.project.name}_reto1_imagenes_ui.png`,
        fullPage: true,
      });
    });

  test('El contador del carrito sube al agregar un producto',
    { tag: '@regression' }, async ({ page }, testInfo) => {
      await page.locator('.btn_inventory').first().click();
      await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

      await page.screenshot({
        path: `evidencias/clase10/tarea_${testInfo.project.name}_reto1_contador_carrito.png`,
        fullPage: true,
      });
    });

});

// Reto 2
test.describe('Reto 2 - expect.soft()', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'standard_user');
    await expect(page).toHaveURL(/inventory/);
  });

  test('Verificar varios atributos del primer producto con soft assertions',
    async ({ page }, testInfo) => {
      const producto = page.locator('.inventory_item').first();

      await expect.soft(producto.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
      await expect.soft(producto.locator('.inventory_item_price')).toHaveText('$29.99');
      await expect.soft(producto.locator('.inventory_item_desc')).toContainText('carry.allTheThings()');
      await expect.soft(producto.locator('.inventory_item_img img')).toBeVisible();
      await expect.soft(producto.locator('.btn_inventory')).toHaveText('Add to cart');

      console.log(`Errores soft acumulados: ${testInfo.errors.length}`);

      await page.screenshot({
        path: `evidencias/clase10/tarea_${testInfo.project.name}_reto2_soft_ok.png`,
        fullPage: true,
      });
    });

  test('Las soft assertions acumulan varios errores sin detener el test',
    async ({ page }, testInfo) => {
      test.fail();
      const producto = page.locator('.inventory_item').first();

      await expect.soft(producto.locator('.inventory_item_name'), 'nombre incorrecto a proposito')
        .toHaveText('Producto Que No Existe', { timeout: 2000 });
      await expect.soft(producto.locator('.inventory_item_price'), 'precio incorrecto a proposito')
        .toHaveText('$0.00', { timeout: 2000 });

      console.log(`Errores acumulados por expect.soft: ${testInfo.errors.length}`);

      await page.screenshot({
        path: `evidencias/clase10/tarea_${testInfo.project.name}_reto2_soft_errores.png`,
        fullPage: true,
      });
    });

});

// Reto 3
test.describe('Reto 3 - fixture browserName', () => {

  test('El motor real del navegador coincide con el esperado',
    async ({ page, browserName }, testInfo) => {
      await page.goto('https://www.saucedemo.com');
      const userAgent = await page.evaluate(() => navigator.userAgent);
      console.log(`Proyecto: ${testInfo.project.name} | Motor: ${browserName} | UA: ${userAgent}`);

      const reglasPorMotor: Record<string, RegExp> = {
        chromium: /Chrome\//,   // Blink
        firefox: /Firefox\//,   // Gecko
        webkit: /Safari\//,     // WebKit
      };
      expect(userAgent).toMatch(reglasPorMotor[browserName]);

      if (browserName === 'webkit') {
        expect(userAgent).not.toMatch(/Chrome\//);
      }

      await loginAs(page, 'standard_user');
      await expect(page).toHaveURL(/inventory/);

      await page.screenshot({
        path: `evidencias/clase10/tarea_${testInfo.project.name}_reto3_motor_${browserName}.png`,
        fullPage: true,
      });
    });

});