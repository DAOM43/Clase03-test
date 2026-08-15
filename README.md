# Clase 03
---
## Estructura del Repositorio

* `casos-de-prueba/TC-001.md`: Especificación detallada del caso de prueba escrito para "Agregar un producto al carrito en DemoBlaze".
* `tests/clase03.spec.ts`: Suite de pruebas automatizadas con Playwright que incluye:
  * 6 Tests base desarrollados durante el laboratorio (locators por texto, CSS, ID, atributo, encadenados y negación).
  * 3 Tests reto asignados en la tarea (locator por rol, filtro por texto y atributo parcial).
---
# Clase 04
---
## Evidencias

Las capturas de pantalla se generan automáticamente en la carpeta
`evidencias/` al ejecutar los tests:

- `evidencias/registro-llenado.png` — formulario de registro lleno
- `evidencias/carrito-con-producto.png` — carrito con producto agregado
- `evidencias/reto1-formulario-lleno.png` — formulario "Place Order" lleno (Reto 1)

## Contenido de los tests

**Tests de clase:**
1. Registrar un nuevo usuario
2. Login con el usuario registrado
3. Flujo completo: login → agregar producto → verificar carrito
4. Intentar login con credenciales incorrectas

**Tests reto (Tarea 04):**
5. Reto 1 — Llenar formulario "Place Order" con `fill()`
6. Reto 2 — Cerrar el modal de login con el botón "Close" (`.last()`)
7. Reto 3 — Limpiar un campo con `clear()` y verificar con `inputValue()`

## Reflexión

Ver `tareas/tarea-04.md`.
