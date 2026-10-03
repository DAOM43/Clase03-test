import { test as base, expect } from '@playwright/test';

type TestFixtures = {
  cronometro: void;
};

type WorkerFixtures = {
  contadorWorker: { valor: number };
};

const test = base.extend<TestFixtures, WorkerFixtures>({

  // Reto 1
  cronometro: async ({ page }, use, testInfo) => {
    const inicio = Date.now();

    await use(); 
    const duracion = Date.now() - inicio;
    console.log(`⏱  "${testInfo.title}" tardó ${duracion} ms (estado: ${testInfo.status})`);

    await page.screenshot({
      path: `evidencias/clase09/Reto1_${testInfo.title}.png`,
      fullPage: true,
    });
  },

  // Reto 2
  contadorWorker: [
    async ({}, use) => {
      const estado = { valor: 0 };
      await use(estado);
    },
    { scope: 'worker' },
  ],
});

// Reto 1 
test.describe('Reto 1 - Fixture con teardown real', () => {

  test('El cronómetro mide un test que pasa', async ({ page, cronometro }) => {
    await page.goto('https://www.saucedemo.com');
    await expect(page.locator('#login-button')).toBeVisible();
  });

  test('El cronómetro imprime la duración aunque el test falle',
    async ({ page, cronometro }) => {
      test.fail();
      await page.goto('https://www.saucedemo.com');
      await expect(page.locator('#elemento-que-no-existe'))
        .toBeVisible({ timeout: 2000 });
    });

});

// Reto 2 
test.describe('Reto 2 - Fixture de alcance worker', () => {
  test.describe.configure({ mode: 'serial' });

  test('Primer test: el contador sube a 1', async ({ contadorWorker, page }) => {
    contadorWorker.valor++;
    console.log(`Contador worker: ${contadorWorker.valor}`);
    expect(contadorWorker.valor).toBe(1);

    await page.setContent(`<h1 style="font-family:sans-serif">Reto 2 - Contador worker: ${contadorWorker.valor}</h1>`);
    await page.screenshot({
      path: 'evidencias/clase09/Reto2_primer_test_contador_1.png',
      fullPage: true,
    });
  });

  test('Segundo test: el contador persiste y sube a 2', async ({ contadorWorker, page }) => {
    contadorWorker.valor++;
    console.log(`Contador worker: ${contadorWorker.valor}`);
    expect(contadorWorker.valor).toBe(2);

    await page.setContent(`<h1 style="font-family:sans-serif">Reto 2 - Contador worker: ${contadorWorker.valor}</h1>`);
    await page.screenshot({
      path: 'evidencias/clase09/Reto2_segundo_test_contador_2.png',
      fullPage: true,
    });
  });

});

// Reto 3 
const viewports = [
  { nombre: 'móvil',      width: 375,  height: 667 },
  { nombre: 'escritorio', width: 1280, height: 720 },
];

for (const vp of viewports) {
  test.describe(`Reto 3 - Viewport ${vp.nombre} (${vp.width}x${vp.height})`, () => {

    test.use({ viewport: { width: vp.width, height: vp.height } });

    test(`Login e inventario visibles en ${vp.nombre}`, async ({ page }) => {
      await page.goto('https://www.saucedemo.com');
      await page.locator('#user-name').fill('standard_user');
      await page.locator('#password').fill('secret_sauce');
      await page.locator('#login-button').click();
      await expect(page).toHaveURL(/inventory/);

      const size = page.viewportSize();
      expect(size?.width).toBe(vp.width);
      expect(size?.height).toBe(vp.height);

      await expect(page.locator('.inventory_item').first()).toBeVisible();
      console.log(`Inventario visible en ${vp.nombre}`);

      await page.screenshot({
        path: `evidencias/clase09/Reto3_viewport_${vp.nombre}_${vp.width}x${vp.height}.png`,
        fullPage: true,
      });
    });

  });
}