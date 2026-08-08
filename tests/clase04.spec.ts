import { test, expect, Page } from '@playwright/test';

const usuario = {
    username: `testuser_${Date.now().toString().slice(-6)}`,
    password: 'Password123'
};

async function loginConReintento(page: Page, username: string, password: string, intentos = 5) {
    for (let i = 0; i < intentos; i++) {
        await page.locator('#navbarExample').getByRole('link', { name: 'Log in', exact: true }).click();
        await page.waitForSelector('#logInModal', { state: 'visible' });
        await page.locator('#loginusername').fill(username);
        await page.locator('#loginpassword').fill(password);
        await page.locator('#logInModal').getByRole('button', { name: 'Log in' }).click();

        try {
            await page.waitForSelector('#nameofuser', { state: 'visible', timeout: 4000 });
            return;
        } catch {
            console.log(`Login intento ${i + 1}/${intentos} sin éxito todavía, reintentando...`);
            await page.waitForTimeout(1500);
        }
    }
    throw new Error(`No se pudo iniciar sesión con ${username} tras ${intentos} intentos`);
}

test.describe('Clase 04 - Flujo completo de usuario en DemoBlaze', () => {
    test('Registrar un nuevo usuario', async ({ page }) => {
        await page.goto('/');

        await page.locator('#navbarExample').getByRole('link', { name: 'Sign up', exact: true }).click();
        await page.waitForSelector('#signInModal', { state: 'visible' });

        await page.locator('#sign-username').fill(usuario.username);
        await page.locator('#sign-password').fill(usuario.password);
        
        // Guardar evidencia en evidencias/clase04/
        await page.locator('#signInModal').screenshot({ path: './evidencias/clase04/registro-llenado.png' });

        const dialogPromise = new Promise<void>((resolve) => {
            page.once('dialog', async (dialog) => {
                console.log(`Alert dice: ${dialog.message()}`);
                await dialog.accept();
                resolve();
            });
        });

        await page.locator('#signInModal').getByRole('button', { name: 'Sign up' }).click();
        await dialogPromise;

        console.log(`Usuario ${usuario.username} registrado`);
    });

    test('Login con el usuario registrado', async ({ page }) => {
        page.on('dialog', async (dialog) => {
            console.log(`Dialog: ${dialog.message()}`);
            await dialog.accept();
        });

        await page.goto('/');
        await loginConReintento(page, usuario.username, usuario.password);

        const nombreUsuario = await page.locator('#nameofuser').textContent();
        expect(nombreUsuario).toContain(usuario.username);

        console.log(`Login exitoso como: ${nombreUsuario}`);
    });

    test('Flujo completo: login -> agregar producto -> verificar carrito', async ({ page }) => {
        page.on('dialog', async (dialog) => {
            await dialog.accept();
        });

        await page.goto('/');
        await loginConReintento(page, usuario.username, usuario.password);

        await page.waitForSelector('.card-title a');
        const primerProducto = page.locator('.card-title a').first();
        const nombreProducto = await primerProducto.textContent();
        await primerProducto.click();

        await page.waitForLoadState('domcontentloaded');

        await page.getByText('Add to cart').click();
        await page.waitForTimeout(2000);

        await page.locator('#navbarExample').getByRole('link', { name: 'Cart', exact: true }).click();
        await page.waitForURL('**/cart.html');
        await page.waitForTimeout(1500);

        const itemsCarrito = page.locator('#tbodyid tr');
        const cantidadItems = await itemsCarrito.count();
        expect(cantidadItems).toBeGreaterThanOrEqual(1);

        console.log(`Flujo completo exitoso. Producto "${nombreProducto}" en carrito.`);
        console.log(`Items en carrito: ${cantidadItems}`);

        // Guardar evidencia en evidencias/clase04/
        await page.screenshot({ path: './evidencias/clase04/carrito-con-producto.png', fullPage: true });
    });

    test('Intentar login con credenciales incorrectas', async ({ page }) => {
        await page.goto('/');
        await page.locator('#navbarExample').getByRole('link', { name: 'Log in', exact: true }).click();
        await page.waitForSelector('#logInModal', { state: 'visible' });

        await page.locator('#loginusername').fill('usuario_que_no_existe');
        await page.locator('#loginpassword').fill('password_incorrecta');

        const dialogPromise = new Promise<string>((resolve) => {
            page.once('dialog', async (dialog) => {
                await dialog.accept();
                resolve(dialog.message());
            });
        });

        await page.locator('#logInModal').getByRole('button', { name: 'Log in' }).click();
        const mensajeAlert = await dialogPromise;

        expect(mensajeAlert).toBeTruthy();
        console.log(`Error mostrado: ${mensajeAlert}`);

        const usuarioLogueado = page.locator('#nameofuser');
        await expect(usuarioLogueado).not.toBeVisible();
    });

    // TESTS RETO — Tarea 04

    // Reto 1 — Formulario con fill()
    test('Reto 1 - Llenar formulario Place Order con fill()', async ({ page }) => {
        page.on('dialog', async (dialog) => {
            await dialog.accept();
        });

        await page.goto('/');
        await loginConReintento(page, usuario.username, usuario.password);

        await page.waitForSelector('.card-title a');
        await page.locator('.card-title a').first().click();
        await page.waitForLoadState('domcontentloaded');
        await page.getByText('Add to cart').click();
        await page.waitForTimeout(2000);

        await page.locator('#navbarExample').getByRole('link', { name: 'Cart', exact: true }).click();
        await page.waitForURL('**/cart.html');
        await page.waitForTimeout(1500);

        await page.getByRole('button', { name: 'Place Order' }).click();
        await page.waitForSelector('#orderModal', { state: 'visible' });

        await page.locator('#name').fill('Juan Perez');
        await page.locator('#country').fill('Guatemala');
        await page.locator('#city').fill('Cuilapa');
        await page.locator('#card').fill('4111111111111111');

        // Guardar evidencia en evidencias/clase04/
        await page.locator('#orderModal').screenshot({ path: './evidencias/clase04/reto1-formulario-lleno.png' });

        const botonPurchase = page.getByRole('button', { name: 'Purchase' });
        await expect(botonPurchase).toBeVisible();
        await expect(botonPurchase).toBeEnabled();

        console.log('Reto 1: formulario Place Order llenado correctamente con fill()');
    });

    // Reto 2 — Cerrar un modal
    test('Reto 2 - Cerrar el modal de login con el botón Close', async ({ page }) => {
        await page.goto('/');
        await page.locator('#navbarExample').getByRole('link', { name: 'Log in', exact: true }).click();
        await page.waitForSelector('#logInModal', { state: 'visible' });

        await page.locator('#logInModal').getByRole('button', { name: 'Close' }).last().click();

        await expect(page.locator('#logInModal')).not.toBeVisible();

        console.log('Reto 2: modal de login cerrado correctamente con Close');
    });

    // Reto 3 — clear()
    test('Reto 3 - Limpiar un campo con clear()', async ({ page }) => {
        await page.goto('/');
        await page.locator('#navbarExample').getByRole('link', { name: 'Log in', exact: true }).click();
        await page.waitForSelector('#logInModal', { state: 'visible' });

        const campoUsuario = page.locator('#loginusername');
        await campoUsuario.fill('texto_de_prueba');
        expect(await campoUsuario.inputValue()).toBe('texto_de_prueba');

        await campoUsuario.clear();
        expect(await campoUsuario.inputValue()).toBe('');

        console.log('Reto 3: campo limpiado correctamente con clear()');
    });
});