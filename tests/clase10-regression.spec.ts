import { test, expect } from '@playwright/test';
import { loginAs } from '../helpers/auth';

test.describe('Regression Tests - Sauce Demo', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'standard_user');
    await expect(page).toHaveURL(/inventory/);
  });

  test('Ordenamiento A-Z funciona', { tag: '@regression' }, async ({ page }, testInfo) => {
    await page.locator('[data-test="product-sort-container"]').selectOption('az');
    const textos = await page.locator('.inventory_item_name').allTextContents();
    expect(textos).toEqual([...textos].sort((a, b) => a.localeCompare(b)));

    await page.screenshot({
      path: `evidencias/clase10/regression_${testInfo.project.name}_01_orden_az.png`,
      fullPage: true,
    });
  });

  test('Ordenamiento Z-A funciona', { tag: '@regression' }, async ({ page }, testInfo) => {
    await page.locator('[data-test="product-sort-container"]').selectOption('za');
    const textos = await page.locator('.inventory_item_name').allTextContents();
    const esperado = [...textos].sort((a, b) => a.localeCompare(b)).reverse();
    expect(textos).toEqual(esperado);

    await page.screenshot({
      path: `evidencias/clase10/regression_${testInfo.project.name}_02_orden_za.png`,
      fullPage: true,
    });
  });

  test('Precio de menor a mayor funciona', { tag: '@regression' }, async ({ page }, testInfo) => {
    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
    const precios = await page.locator('.inventory_item_price').allTextContents();
    const numericos = precios.map(p => parseFloat(p.replace('$', '')));
    for (let i = 0; i < numericos.length - 1; i++) {
      expect(numericos[i]).toBeLessThanOrEqual(numericos[i + 1]);
    }

    await page.screenshot({
      path: `evidencias/clase10/regression_${testInfo.project.name}_03_precio_lohi.png`,
      fullPage: true,
    });
  });

  test('El boton "Remove" aparece despues de agregar al carrito',
    { tag: '@regression' }, async ({ page }, testInfo) => {
      const primerBoton = page.locator('.btn_inventory').first();
      await expect(primerBoton).toHaveText('Add to cart');
      await primerBoton.click();
      await expect(primerBoton).toHaveText('Remove');

      await page.screenshot({
        path: `evidencias/clase10/regression_${testInfo.project.name}_04_boton_remove.png`,
        fullPage: true,
      });

      await primerBoton.click();
      await expect(primerBoton).toHaveText('Add to cart');
    });

  test('Navegar al detalle del producto y regresar',
    { tag: '@regression' }, async ({ page }, testInfo) => {
      const primerNombre = await page.locator('.inventory_item_name').first().textContent();
      await page.locator('.inventory_item_name').first().click();
      await expect(page).toHaveURL(/inventory-item/);
      await expect(page.locator('.inventory_details_name'))
        .toContainText(primerNombre!);

      await page.screenshot({
        path: `evidencias/clase10/regression_${testInfo.project.name}_05_detalle.png`,
        fullPage: true,
      });

      await page.locator('[data-test="back-to-products"]').click();
      await expect(page).toHaveURL(/inventory/);
    });

});