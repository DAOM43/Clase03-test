# SQA Plan mínimo — Sauce Demo

**Propósito:** Con estas pruebas quiero asegurarme de que las partes más importantes de la tienda (iniciar sesión, ver los productos y completar la compra) no se rompan cada vez que se hace un cambio en el código, antes de que eso llegue a producción.

**Alcance:** Cubro el login con diferentes tipos de usuario, que el inventario cargue bien (los 6 productos, con su precio y su imagen), que el menú lateral abra y cierre, el logout y el flujo de checkout hasta el primer paso. Dejo fuera cosas como el diseño exacto de los estilos o el proceso de pago real, porque Sauce Demo es un sitio de práctica y no tiene una pasarela de pago de verdad.

**Herramientas:** Uso Playwright con TypeScript para escribir y correr los tests, y la terminal (`npx playwright test`) para ejecutarlos y ver el reporte.

**Criterios de salida:** Para mí las pruebas están completas cuando el login, el inventario y el checkout —que son las funciones críticas— pasan al 100%, ya sea corriendo los tests en paralelo o uno por uno.