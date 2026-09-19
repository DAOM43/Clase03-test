import { test, expect, Page, Browser } from '@playwright/test';
import { loginAs } from '../helpers/auth';
import * as fs from 'fs';

const CARPETA_EVIDENCIAS = './evidencias/tarea08';
fs.mkdirSync(CARPETA_EVIDENCIAS, { recursive: true });

//RETO 1: Suite serial con página compartida 
test.describe('Tarea 08 - Reto 1: Suite serial con página compartida', () => {
  test.describe.configure({ mode: 'serial' });

  let page: Page;

  test.beforeAll(async ({ browser }: { browser: Browser }) => {
    page = await browser.newPage();
    await loginAs(page, 'standard_user');
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('Reto 1a - Agregar un producto al carrito', async () => {
    await page.locator('.btn_inventory').first().click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    await page.screenshot({ path: `${CARPETA_EVIDENCIAS}/reto1a-agregar-producto.png`, fullPage: true });
  });

  test('Reto 1b - El carrito mantiene el producto agregado antes', async () => {
    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('.cart_item')).toHaveCount(1);
    await page.screenshot({ path: `${CARPETA_EVIDENCIAS}/reto1b-carrito-persistente.png`, fullPage: true });
  });
});

//RETO 2: test.slow() en vez de confiar en el margen global
test.describe('Tarea 08 - Reto 2: test.slow()', () => {
  test.afterEach(async ({ page }) => {
    await page.screenshot({ path: `${CARPETA_EVIDENCIAS}/reto2-usuario-lento.png`, fullPage: true });
  });

  test('Reto 2 - Usuario con lentitud artificial (marcado como slow)', async ({ page }, testInfo) => {
    testInfo.setTimeout(testInfo.timeout * 3);

    const inicio = Date.now();
    await loginAs(page, 'performance_glitch_user');
    const tiempoLogin = Date.now() - inicio;

    console.log(`Tiempo de login con timeout triplicado: ${tiempoLogin}ms`);
    await expect(page).toHaveURL(/inventory/);
  });
});

//RETO 3: test.skip() dinámico 
test.describe('Tarea 08 - Reto 3: test.skip() dinámico', () => {
  test.afterEach(async ({ page }) => {
    try {
      await page.screenshot({ path: `${CARPETA_EVIDENCIAS}/reto3-skip-dinamico.png`, fullPage: true });
    } catch (e) {
      console.log('No se pudo capturar screenshot (posible test omitido):', e);
    }
  });

  test('Reto 3 - Omitir test según condición evaluada en tiempo de ejecución', async ({ page }) => {
    await loginAs(page, 'standard_user');
    await page.locator('.inventory_item').first().waitFor({ state: 'visible' });

    const cantidadProductos = await page.locator('.inventory_item').count();

    test.skip(
      cantidadProductos !== 6,
      `Se omite: se esperaban 6 productos y la app mostró ${cantidadProductos}. Posible cambio en el catálogo de datos de prueba.`
    );

    await expect(page.locator('.inventory_item')).toHaveCount(6);
  });
});