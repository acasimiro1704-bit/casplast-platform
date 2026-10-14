# CASPLAST · Primera versión

Web pública (Quiénes somos, Catálogo, Contáctenos e Ingreso) y administrador para modelos, cotizador, presupuestos, ventas y caja.

## Requisitos

- Node.js 24 LTS.
- Un proceso del servidor y un disco persistente. No usar GitHub Pages ni hosting exclusivamente estático: la autenticación y los datos necesitan Node.js.
- En producción: HTTPS mediante el proveedor o un proxy inverso, y un volumen persistente para `DATA_DIR`.

## Ejecutar en tu computadora

1. Copiar `.env.example` a `.env`.
2. Completar `ADMIN_EMAIL` y una contraseña única de al menos 16 caracteres en `ADMIN_PASSWORD`. No existe una contraseña predeterminada.
3. Ejecutar `npm start`.
4. Abrir `http://localhost:4173`. Ingreso conduce al administrador.

No hay dependencias npm de terceros para el servidor. `npm test` ejecuta las verificaciones de sintaxis y pruebas de integración.

## Datos compartidos y privacidad

El servidor guarda `DATA_DIR/database.json`, con reemplazo atómico y una copia anterior `database.json.previous`. Las fotos se guardan en `DATA_DIR/tile-images`. Los visitantes solo reciben modelos activos, colores y configuración pública. Presupuestos, clientes, precios internos, ventas y caja requieren sesión.

La sesión administrativa usa cookie HttpOnly, SameSite Strict y caduca a las ocho horas. En producción usa Secure. Cambiar la contraseña y reiniciar revoca las sesiones. Las escrituras requieren origen autorizado y una revisión actual: dos pestañas no pueden sobrescribirse silenciosamente. Si un guardado falla, el administrador muestra el error y permite descargar los cambios pendientes.

Esta versión admite **una instancia del servidor**. No configurar escalado horizontal ni múltiples réplicas con el archivo JSON. Para crecer, migrar la persistencia a una base transaccional. Las ventas representan un registro interno y los presupuestos PDF no son comprobantes fiscales.

## Migrar los datos de la versión local anterior

1. En la computadora y el mismo navegador donde se cargaron los datos, conservar una copia de la carpeta anterior completa, especialmente `tile-images`. Los datos previos del navegador no se eliminan automáticamente.
2. Iniciar esta versión con la misma dirección `http://localhost:4173` y entrar con las credenciales del servidor.
3. En Configuraciones → Datos y respaldo, usar **Importar datos de este navegador**. Solo se permite cuando el servidor está vacío; la importación pide confirmación.
4. Para otro equipo/dominio: exportar el JSON, usar **Importar archivo JSON** en el servidor vacío y copiar las imágenes a `DATA_DIR/tile-images` manteniendo sus nombres.
5. Comprobar modelos, fotos, presupuestos, ventas y caja. Abrir la web pública en otro navegador para confirmar que el catálogo ya es compartido.

Los datos no se migran mediante Git: clientes, movimientos, fotos y credenciales están excluidos del repositorio. Si la carpeta antigua contenía fotos, copiarlas antes del primer uso de los PDF.

## Preparar GitHub

El repositorio no debe contener `.env`, `data`, `tile-images`, respaldos ni `outputs`. Revisar `git status` antes de subir. Crear un repositorio vacío en GitHub y conectar su URL real:

```sh
git init -b main
git add .
git diff --cached --stat
git commit -m "Primera versión CASPLAST"
git remote add origin URL_DEL_REPOSITORIO
git push -u origin main
```

`.github/workflows/ci.yml` ejecuta las pruebas con cada push y pull request. No se publica automáticamente.

## Desplegar cuando tengas hosting

Se incluye `Dockerfile` o se puede ejecutar directamente `npm start` con Node 24. Configurar:

| Variable | Producción |
| --- | --- |
| `NODE_ENV` | `production` |
| `HOST` | `0.0.0.0` |
| `PORT` | Puerto asignado por el hosting, por defecto `4173` |
| `APP_ORIGIN` | URL HTTPS exacta, sin barra final, por ejemplo `https://casplast.example` |
| `ADMIN_EMAIL` | Email de ingreso |
| `ADMIN_PASSWORD` | Contraseña privada, mínimo 16 caracteres |
| `DATA_DIR` | Ruta montada en disco persistente, por ejemplo `/app/data` |

El volumen debe permitir escritura al usuario `node` (UID 1000 en Docker). El proxy debe enviar el tráfico a Node; no publicar directamente el directorio del proyecto. El endpoint `/health` debe responder 200. No exponer el puerto de Node públicamente fuera del proxy HTTPS.

Antes de publicar: importar datos, copiar imágenes, completar contacto y fondo, comprobar ingreso/cierre de sesión, PDF y venta al entregar un presupuesto. Crear un respaldo completo de `DATA_DIR` antes de cada actualización; hacer respaldos externos periódicos. La copia `.previous` no sustituye un backup.

## Estado de entrega

Código y configuración preparados para GitHub. Crear el repositorio, contratar/configurar el hosting, importar datos reales, verificar visualmente con esos datos y publicar son pasos posteriores. La instalación local anterior en `outputs/casplast-demo` se conserva para no interrumpir el trabajo actual.
