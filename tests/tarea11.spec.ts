import { test, expect } from '@playwright/test';

const BASE_URL = 'https://practice.expandtesting.com';
const TEXTO_CORRECTO = "Sometimes you'll see a typo, other times you won't.";

const normalizar = (t: string) =>
  t.replace(/[\u2018\u2019]/g, "'").replace(/\s+/g, ' ').trim();

test.describe('Tarea 11 - Documentar defectos con Playwright', () => {

  // Reto 1

  test('Reto 1: medir con qué frecuencia aparece el error de texto en /typos',
    { tag: '@bug' }, async ({ page }, testInfo) => {
      const REPETICIONES = 12;
      let conError = 0;
      const detalle: string[] = [];

      await page.goto(`${BASE_URL}/typos`);
      for (let i = 1; i <= REPETICIONES; i++) {
        if (i > 1) await page.reload();
        const texto = await page.getByText(/^Sometimes/).innerText();
        const hayError = normalizar(texto) !== normalizar(TEXTO_CORRECTO);
        if (hayError) conError++;
        detalle.push(`Carga ${i}: ${hayError ? 'CON ERROR' : 'correcto'} -> ${normalizar(texto)}`);
      }

      const frecuencia = `${conError} de ${REPETICIONES}`;
      console.log(`Frecuencia del error en /typos: ${frecuencia}`);

      await testInfo.attach('frecuencia-typos', {
        body: `Error de texto en ${frecuencia} cargas\n\n${detalle.join('\n')}`,
        contentType: 'text/plain',
      });

      testInfo.annotations.push({
        type: 'frecuencia',
        description: `Error de texto en ${frecuencia} cargas de /typos (intermitente)`,
      });

      await page.screenshot({
        path: 'evidencias/tarea11/reto1_typos_ultima_carga.png',
        fullPage: true,
      });

      expect(detalle).toHaveLength(REPETICIONES);
    });

  // Reto 2

  test('Reto 2: el texto de /typos debe estar siempre sin errores',
    {
      tag: '@bug',
      annotation: {
        type: 'issue',
        description: 'https://github.com/TU-USUARIO/TU-REPOSITORIO/issues/1',
      },
    },
    async ({ page }) => {
      test.fixme(true, 'Defecto abierto: /typos introduce un error de texto al azar');

      await page.goto(`${BASE_URL}/typos`);
      await expect(page.getByText(/^Sometimes/)).toHaveText(TEXTO_CORRECTO);
    });

});

// Reto 3

test.describe('Tarea 11 - Reto 3: borrador de reporte automático', () => {

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.errors.length === 0) return;

    const sinColores = (t: string) => t.replace(/\u001b\[[0-9;]*m/g, '');
    const obtenido = testInfo.errors
      .map(e => sinColores(e.message ?? '').split('\n').slice(0, 8).join('\n'))
      .join('\n---\n');

    const borrador = [
      '# Borrador de Bug Report',
      '',
      `**Título:** ${testInfo.title}`,
      `**Fecha:** ${new Date().toLocaleDateString('es-GT')}`,
      `**Ambiente:** ${process.platform}, project ${testInfo.project.name}`,
      `**URL:** ${page.url()}`,
      '',
      '## Resultado obtenido',
      '```',
      obtenido,
      '```',
      '',
      '## Pendiente de completar',
      '- Severidad, prioridad, frecuencia, pasos para reproducir y evidencia',
    ].join('\n');

    await testInfo.attach('borrador-bug-report', {
      body: borrador,
      contentType: 'text/markdown',
    });
  });

  test('Reto 3: las imágenes de /broken-images generan un borrador de reporte',
    { tag: '@bug' }, async ({ page }) => {

      test.fail(true, 'BUG-001: asdf.jpg y hjkl.jpg responden 404');

      await page.goto(`${BASE_URL}/broken-images`);
      const imagenes = page.locator('main img');
      await expect.poll(() => imagenes.evaluateAll(
        imgs => imgs.every(img => (img as HTMLImageElement).complete),
      )).toBe(true);

      await page.screenshot({
        path: 'evidencias/tarea11/reto3_broken_images.png',
        fullPage: true,
      });

      const anchos = await imagenes.evaluateAll(
        imgs => imgs.map(img => (img as HTMLImageElement).naturalWidth),
      );
      for (const ancho of anchos) {
        expect(ancho).toBeGreaterThan(0);
      }
    });

});