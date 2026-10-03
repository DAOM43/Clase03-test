# Reflexión y discusión - Clase 09

### 1. ¿Cuántas líneas de código ahorré usando el loop de parametrización?

Me ahorré como 50 líneas de código. Sin usar un bucle, habría tenido que repetir toda la estructura para cada prueba (tres de login y tres de productos), donde la lógica era prácticamente la misma y solo cambiaban los datos. Con el loop, escribo el bloque una sola vez y el ciclo `for` se encarga de generar los tests. Además, si hay que corregir un fallo, se arregla en un solo sitio y no en seis lugares distintos.

---

### 2. ¿Qué pasa si agrego un cuarto usuario al array `usuariosDeLogin`?

Se crea una nueva prueba automáticamente sin necesidad de escribir más código. Solo tengo que añadir un nuevo objeto al array con sus datos (usuario, contraseña, URL esperada y descripción). La próxima vez que corra los tests, Playwright incluirá el nuevo caso en el reporte por su cuenta. Esto facilita muchísimo ampliar la cobertura de pruebas —como probar cuentas con errores o con permisos especiales— de forma rápida y limpia.

---

### 3. ¿Cómo podría leer los datos de prueba desde un archivo CSV externo?

Podríamos guardar los datos en un archivo separado (por ejemplo, en una carpeta de datos) y leerlos usando el módulo `fs` de Node.js junto con alguna librería como `csv-parse`. Eso transforma cada fila del CSV en un objeto idéntico al de nuestro array, permitiendo recorrerlo con el mismo bucle. Un detalle importante es que el archivo CSV interpreta todo como texto plano, por lo que datos especiales (como la expresión regular de la URL esperada) requerirían un pequeño ajuste al cargarlos. La gran ventaja de esto es que los datos y el código quedan completamente separados, facilitando actualizar o meter más casos sin tocar el archivo de las pruebas.
