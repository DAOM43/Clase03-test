import { test, expect } from '@playwright/test';
import { loginAs } from '../helpers/auth';
import * as fs from 'fs';

const CARPETA_EVIDENCIAS = './evidencias/clase08';
fs.mkdirSync(CARPETA_EVIDENCIAS, { recursive: true });

test.describe('Clase 08 - Suite de inventario con hooks', () => {
  test.describe.configure({ mode: 'parallel' });

  // Antes de cada test: login automático
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'standard_user');
    // Verificar que llegamos al inventario
    await expect(page).toHaveURL(/inventory/);
  });

  // Después de CADA test (pase o falle): capturar evidencia
  test.afterEach(async ({ page }, testInfo) => {
    const nombreSeguro = testInfo.title
      .replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const estado = testInfo.status === testInfo.expectedStatus ? 'ok' : 'fallo';
    try {
      await page.screenshot({
        path: `${CARPETA_EVIDENCIAS}/${estado}-${nombreSeguro}.png`,
        fullPage: true
      });
      console.log(`Evidencia guardada: ${testInfo.title} (${estado})`);
    } catch (e) {
      // Si la página ya fue cerrada antes del afterEach, el screenshot fallará
      console.log('No se pudo capturar screenshot:', e);
    }
  });

  test('El inventario muestra 6 productos', async ({ page }) => {
    const items = page.locator('.inventory_item');
    await expect(items).toHaveCount(6);
  });

  test('Todos los productos tienen precio visible', async ({ page }) => {
    const precios = page.locator('.inventory_item_price');
    const cantidad = await precios.count();
    for (let i = 0; i < cantidad; i++) {
      const precio = precios.nth(i);
      await expect(precio).toBeVisible();
      const textoPrecio = await precio.textContent();
      expect(textoPrecio).toMatch(/^\$\d+\.\d{2}$/); // formato: $9.99
    }
    console.log(`Todos los ${cantidad} productos tienen precio en formato correcto`);
  });

  test('Todos los productos tienen imagen visible', async ({ page }) => {
    const imagenes = page.locator('.inventory_item img');
    const cantidad = await imagenes.count();

    for (let i = 0; i < cantidad; i++) {
      await expect(imagenes.nth(i)).toBeVisible();
      const src = await imagenes.nth(i).getAttribute('src');
      expect(src).not.toBeNull();
    }
    console.log(`${cantidad} imágenes verificadas`);
  });

  test('El menú de hamburguesa funciona', async ({ page }) => {
    // Abrir menú
    await page.locator('#react-burger-menu-btn').click();
    await page.waitForSelector('.bm-menu', { state: 'visible' });

    // Verificar opciones del menú
    await expect(page.getByText('All Items')).toBeVisible();
    await expect(page.getByText('About')).toBeVisible();
    await expect(page.getByText('Logout')).toBeVisible();
    await expect(page.getByText('Reset App State')).toBeVisible();

    // Cerrar menú
    await page.locator('#react-burger-cross-btn').click();
    await page.waitForSelector('.bm-menu', { state: 'hidden' });
  });

  test('Logout funciona correctamente', async ({ page }) => {
    // Abrir menú y hacer logout
    await page.locator('#react-burger-menu-btn').click();
    await page.getByText('Logout').click();

    // Verificar que regresamos al login
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('#login-button')).toBeVisible();
  });

});

//SUITE SEPARADA: Comportamiento con diferentes usuarios
test.describe('Clase 08 - Comportamiento por tipo de usuario', () => {
  test.describe.configure({ mode: 'parallel' });

  // Esta suite es independiente de la anterior, así que también necesita su propio afterEach
  test.afterEach(async ({ page }, testInfo) => {
    const nombreSeguro = testInfo.title
      .replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const estado = testInfo.status === testInfo.expectedStatus ? 'ok' : 'fallo';
    try {
      await page.screenshot({
        path: `${CARPETA_EVIDENCIAS}/${estado}-${nombreSeguro}.png`,
        fullPage: true
      });
      console.log(`Evidencia guardada: ${testInfo.title} (${estado})`);
    } catch (e) {
      console.log('No se pudo capturar screenshot:', e);
    }
  });

  test('Usuario estándar puede completar el checkout', async ({ page }) => {
    await loginAs(page, 'standard_user');

    await page.locator('.btn_inventory').first().click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();

    await expect(page).toHaveURL(/checkout-step-one/);
    console.log('Usuario estándar llegó al checkout');
  });

  test('Usuario de rendimiento degrado experimenta lentitud',
    async ({ page }) => {
    // NOTA: performance_glitch_user tiene un delay artificial de ~5 segundos en el login.
    // Es comportamiento esperado de la aplicación de demostración, no un error del test.
    // El timeout global (30 000 ms) es suficiente para absorber ese delay.
    const inicio = Date.now();
    await loginAs(page, 'performance_glitch_user');
    const tiempoLogin = Date.now() - inicio;
    console.log(`Tiempo de login (glitch user): ${tiempoLogin}ms`);
    // Este usuario tiene un delay artificial — documentarlo como hallazgo
    expect(tiempoLogin).toBeGreaterThan(0);
    await expect(page).toHaveURL(/inventory/);
  });
});