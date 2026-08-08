Tarea 04 — Reflexión
Para mí, el más importante es el Principio 2: Las pruebas exhaustivas son imposibles. En la clase lo vi claro al probar el login con datos incorrectos: no probamos infinitas combinaciones de usuario y contraseña, sino un caso representativo (usuario_que_no_existe / password_incorrecta). Probarlo todo no es viable; el esfuerzo debe guiarse por el riesgo y la prioridad.

Esto se conecta con el Principio 5 (La paradoja del pesticida): si siempre ejecutamos la misma prueba, deja de aportar valor. Lo clave es elegir casos que de verdad evalúen el riesgo real. Por ejemplo, validar que el sistema rechaza credenciales inválidas se logra con un test bien diseñado, no con mil contraseñas distintas.

En la práctica, esto se refleja en la función loginConReintento: en lugar de poner un waitForTimeout larguísimo para cubrir cualquier demora del backend, se definió un límite de 5 intentos. Fue una decisión basada en priorizar y gestionar el riesgo, no en buscar exhaustividad. 