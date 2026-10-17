# Reflexión y discusión - Clase 09

### 1. ¿Cuántas líneas de código ahorré usando el loop de parametrización?

Me ahorré como 50 líneas de código. Sin usar un bucle, habría tenido que repetir toda la estructura para cada prueba (tres de login y tres de productos), donde la lógica era prácticamente la misma y solo cambiaban los datos. Con el loop, escribo el bloque una sola vez y el ciclo `for` se encarga de generar los tests. Además, si hay que corregir un fallo, se arregla en un solo sitio y no en seis lugares distintos.

---

### 2. ¿Qué pasa si agrego un cuarto usuario al array `usuariosDeLogin`?

Se crea una nueva prueba automáticamente sin necesidad de escribir más código. Solo tengo que añadir un nuevo objeto al array con sus datos (usuario, contraseña, URL esperada y descripción). La próxima vez que corra los tests, Playwright incluirá el nuevo caso en el reporte por su cuenta. Esto facilita muchísimo ampliar la cobertura de pruebas —como probar cuentas con errores o con permisos especiales— de forma rápida y limpia.

---

### 3. ¿Cómo podría leer los datos de prueba desde un archivo CSV externo?

Podríamos guardar los datos en un archivo separado (por ejemplo, en una carpeta de datos) y leerlos usando el módulo `fs` de Node.js junto con alguna librería como `csv-parse`. Eso transforma cada fila del CSV en un objeto idéntico al de nuestro array, permitiendo recorrerlo con el mismo bucle. Un detalle importante es que el archivo CSV interpreta todo como texto plano, por lo que datos especiales (como la expresión regular de la URL esperada) requerirían un pequeño ajuste al cargarlos. La gran ventaja de esto es que los datos y el código quedan completamente separados, facilitando actualizar o meter más casos sin tocar el archivo de las pruebas.


# Reflexión y discusión - Clase 10

### 1. ¿Algún test se comportó diferente en WebKit (Safari) vs. Chrome? ¿Por qué podría ocurrir esto?

Aunque en mi caso todas las pruebas pasaron igual en los diferentes navegadores, es común encontrar discrepancias. Esto pasa porque Chrome usa Blink y Safari usa WebKit, motores que interpretan el código (CSS, JavaScript y diseño) de forma distinta. Probar en Safari es vital porque nos ayuda a detectar bugs visuales o de comportamiento que afectan directamente a una gran parte de los usuarios reales.

---

### 2. ¿Cuántos tests se ejecutaron en total con la configuración multi-browser de 5 projects?

Se corrieron 80 tests en total. La cuenta sale de multiplicar las pruebas principales de smoke y regresión (10 en total) por los 5 projects (dando 50), más los 6 tests de la tarea 10 también multiplicados por los 5 proyectos (otros 30).

---

### 3. ¿Por qué el smoke testing debería ejecutarse antes del regression testing en un pipeline de CI/CD?

El smoke test se ejecuta primero porque valida lo más crítico y básico del sistema (como que la plataforma cargue o permita iniciar sesión). Si esa base falla, se frena el pipeline de inmediato: así evitamos perder tiempo y recursos corriendo una suite de regresión completa que de entrada ya sabemos que va a fallar.

# Reflexión y discusión - Clase 11

### 1. ¿Qué severidad y qué prioridad le asignaste al defecto de las imágenes rotas?

Severidad Media, porque aunque parte del contenido visual no se carga, la página sigue siendo funcional y no se pierde ningún tipo de información. Prioridad P3, porque es un detalle visual que resulta molesto, pero el producto puede salir así a producción y el arreglo se puede programar para el siguiente sprint.

---

### 2. Con test.fail() el test cuenta como pasado. ¿Qué ventaja y qué riesgo tiene dejar un defecto conocido en verde?

La ventaja es que la suite de pruebas se mantiene en verde mientras el bug está documentado, evitando que el equipo se acostumbre a ver fallos en rojo y facilitando la detección de nuevos errores. Además, cuando el problema se corrija en el código, el test fallará para avisar que ya se debe quitar el test.fail(). El riesgo es que genera una falsa sensación de calidad: el defecto queda oculto, puede olvidarse sin corregirse y los reportes de éxito terminan dando una idea equivocada del estado real del producto.

---

### 3. Si un test falla por una conexión que no responde, ¿es un defecto del producto? ¿Qué harías antes de reportarlo?

No necesariamente, ya que puede ser un fallo temporal del ambiente de pruebas o de la red. Antes de reportarlo, repetiría el test para descartar que sea intermitente, revisaría el tráfico en la pestaña Network de las herramientas de desarrollo y probaría el flujo manualmente en otro navegador. Si el test pasa al reintentar, lo tomo como un problema del ambiente y no lo reporto. Solo lo registraría como bug si se repite de forma consistente con el mismo Expected y Received.