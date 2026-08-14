# Tabla de Decisión — Proceso de Checkout en Sauce Demo

## 1. Propósito

El proceso de checkout de Sauce Demo depende de varias condiciones que pueden
combinarse entre sí: si el usuario tiene sesión activa, si el carrito tiene
productos, si el formulario de datos personales está completo y si se
confirma la compra. Probar cada condición por separado no garantiza cubrir
lo que ocurre cuando varias fallan o se cumplen al mismo tiempo — para eso
sirve esta tabla.

---

## 2. Condiciones consideradas

| ID | Condición | Valores posibles |
|----|-----------|-------------------|
| C1 | Sesión de usuario activa | Sí / No |
| C2 | El carrito tiene al menos un producto | Sí / No |
| C3 | Los 3 campos del formulario (First Name, Last Name, Postal Code) están llenos | Sí / No |
| C4 | El usuario presiona `Finish` en el resumen | Sí / No |

## 3. Resultados posibles

| ID | Resultado del sistema |
|----|------------------------|
| Y1 | Redirige a la pantalla de login |
| Y2 | Avanza al formulario de checkout (`checkout-step-one.html`) |
| Y3 | Bloquea el avance y muestra un mensaje de campo requerido |
| Y4 | Llega al resumen de la orden (`checkout-step-two.html`) |
| Y5 | Genera la orden y muestra `checkout-complete.html` |

---

## 4. Combinaciones y resultado esperado

| # | C1 Sesión | C2 Carrito con items | C3 Formulario completo | C4 Presiona Finish | Resultado |
|---|:---:|:---:|:---:|:---:|-----------|
| 1 | No  | –   | –   | –   | Y1 — no puede acceder a ninguna pantalla de checkout |
| 2 | Sí  | Sí  | No  | –   | Y2 → Y3 — entra al formulario pero no puede avanzar hasta llenar el campo faltante |
| 3 | Sí  | No  | Sí  | Sí  | Y2 → Y4 → Y5 — Sauce Demo no valida que el carrito tenga productos, así que la orden se completa igual, con resumen en $0.00 |
| 4 | Sí  | Sí  | Sí  | No  | Y2 → Y4 — llega al resumen pero se queda ahí porque no confirmó |
| 5 | Sí  | Sí  | Sí  | Sí  | Y2 → Y4 → Y5 — flujo completo exitoso, mensaje "Thank you for your order!" |
| 6 | Sí  | Sí  | No (dato con formato inválido, ej. letras en código postal) | – | Y2 → Y4 — Sauce Demo solo valida que el campo no esté vacío, no el formato, por lo que sí avanza |

---

## 5. Detalle de cada combinación

**#1 — Sin sesión.** Cualquier intento de entrar directo a una URL de
checkout debe devolver al usuario al login con un mensaje de error, sin
importar el estado del carrito o del formulario.

**#2 — Formulario incompleto.** El sistema debe identificar cuál campo falta
y mostrarlo en el mensaje de error, sin dejar avanzar al paso siguiente.

**#3 — Carrito vacío.** Es la combinación menos intuitiva: uno esperaría que
el sistema bloquee una compra sin productos, pero Sauce Demo lo permite. Por
eso en la Clase 05 se advirtió que el botón `Checkout` aparece aunque el
carrito esté vacío — no basta con comprobar que el botón existe, hay que
comprobar el conteo real de items.

**#4 — Falta confirmar.** El usuario puede llenar todo correctamente y aun
así no completar la compra si no presiona `Finish`; el sistema no debe
generar la orden por su cuenta.

**#5 — Camino feliz.** Es la combinación que valida el flujo completo de
principio a fin, y es la que más impacto tiene si falla (por eso el login y
este flujo se consideran de mayor riesgo en la Clase 05).

**#6 — Validación superficial.** Es un caso de "confirmación de la
Regla" más que de comportamiento esperado ideal: el sistema técnicamente
"funciona" pero no valida formato, lo cual podría reportarse como hallazgo
de calidad si se estuviera auditando la app en un proyecto real.