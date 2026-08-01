import { test, expect } from '@playwright/test';

test.describe('Pruebas Base Clase 03', () => {

  // 1. Locator por texto
  test('Locator por texto: verificar elementos del menú', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('#navbarExample');
    await expect(nav.getByText('Home')).toBeVisible();
    await expect(nav.getByText('Contact')).toBeVisible();
    await expect(nav.getByText('About us')).toBeVisible();
    await expect(nav.getByText('Cart', { exact: true })).toBeVisible();
  });

  // 2. Locator por CSS
  test('Locator por CSS: productos en la página principal', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.card-title');
    const tarjetas = page.locator('.card');
    const cantidad = await tarjetas.count();
    expect(cantidad).toBeGreaterThan(0);

    const primerProducto = page.locator('.card-title a').first();
    const nombreProducto = await primerProducto.textContent();
    expect(nombreProducto).not.toBeNull();
  });

  // 3. Locator por ID
  test('Locator por ID: campos del modal de login', async ({ page }) => {
    await page.goto('/');
    await page.locator('#navbarExample')
      .getByRole('link', { name: 'Log in', exact: true }).click();
    await page.waitForSelector('#logInModal', { state: 'visible' });
    await expect(page.locator('#loginusername')).toBeVisible();
    await expect(page.locator('#loginpassword')).toBeVisible();
  });

  // 4. Locator por Atributo
  test('Locator por atributo: imagen del primer producto', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.card-title');
    await page.locator('.card-title a').first().click();
    await page.waitForLoadState('domcontentloaded');
    const imagenProducto = page.locator('.product-image img');
    await expect(imagenProducto).toBeVisible();
    const srcImagen = await imagenProducto.getAttribute('src');
    expect(srcImagen).not.toBeNull();
  });

  // 5. Locators Encadenados
  test('Locators encadenados: precio dentro de una tarjeta', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.card-title');
    const primeraTarjeta = page.locator('.card').first();
    const precio = primeraTarjeta.locator('h5');
    await expect(precio).toBeVisible();
  });

  // 6. Negación
  test('Verificar que NO existe un elemento (negación)', async ({ page }) => {
    await page.goto('/');
    const mensajeVacio = page.getByText('No products found');
    await expect(mensajeVacio).not.toBeVisible();
  });
  
  test.describe('Tests Reto - Clase 03', () => {


  test('Reto 1: Verificar botón Place Order en carrito por rol', async ({ page }) => {
    await page.goto('/cart.html');
    const botonPlaceOrder = page.getByRole('button', { name: 'Place Order' });
    await expect(botonPlaceOrder).toBeVisible();
  });


  test('Reto 2: Filtrar producto por nombre y verificar su precio', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.card');
    

    const tarjetaSamsung = page.locator('.card').filter({ hasText: 'Samsung galaxy s6' });
    await expect(tarjetaSamsung).toBeVisible();

  
    const precio = tarjetaSamsung.locator('h5');
    await expect(precio).toBeVisible();
    await expect(precio).toContainText('$360');
  });

 
  test('Reto 3: Verificar categorías del sidebar usando atributo parcial', async ({ page }) => {
    await page.goto('/');
    

    const categoriaPhones = page.locator('a[onclick*="byCat(\'phone\')"]');
    const categoriaLaptops = page.locator('a[onclick*="byCat(\'notebook\')"]');
    const categoriaMonitors = page.locator('a[onclick*="byCat(\'monitor\')"]');

    await expect(categoriaPhones).toBeVisible();
    await expect(categoriaLaptops).toBeVisible();
    await expect(categoriaMonitors).toBeVisible();
  });

});

});