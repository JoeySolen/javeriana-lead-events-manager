# Javeriana Lead & Events Manager

SPA de la prueba técnica frontend de la Pontificia Universidad Javeriana.

## Estado: etapa 2, filtros y registro de leads

Incluye React + TypeScript estricto, Vite, Tailwind CSS, Context API, un catálogo inicial responsive, consumo HTTP de un mock local, validación del contrato recibido, estados de carga/error/vacío, reintento y pruebas automatizadas. Los programas son ficticios.

Incluye búsqueda por nombre sin distinción de tildes o mayúsculas, filtro combinado por categoría, selección desde las cards y formulario accesible con normalización, validación, detección de duplicados y persistencia en localStorage.

**Pendientes para la entrega:** revisión final, repositorio público y despliegue.

## Requisitos y ejecución

- Node.js 20.19+ o 22.12+ (comprobado localmente con 20.20.1).
- npm; el archivo `package-lock.json` fija las dependencias.

```powershell
cd C:\Users\Joey\Documents\GitHub\javeriana-lead-events-manager
npm ci
npm run dev
```

Abre la dirección local que indique Vite, normalmente http://localhost:5173.
No se necesitan claves ni variables de entorno para empezar.

| Comando                | Uso                                          |
| ---------------------- | -------------------------------------------- |
| `npm run dev`          | Servidor de desarrollo                       |
| `npm run build`        | Revisión de tipos y compilación en `dist/`   |
| `npm run preview`      | Servir la compilación localmente             |
| `npm run typecheck`    | Revisar TypeScript sin generar la aplicación |
| `npm run lint`         | Análisis estático con Oxlint                 |
| `npm test`             | Ejecutar tests una vez                       |
| `npm run test:watch`   | Tests en modo observación                    |
| `npm run format`       | Aplicar formato con Prettier                 |
| `npm run format:check` | Comprobar formato                            |
| `npm run check`        | Tipos, lint, formato, tests y build          |

## Organización

```text
src/
  app/                     # Composición de pantalla y proveedores
  features/
    programs/
      api/                 # Acceso HTTP y validación de respuesta
      components/          # Catálogo y card
      context/             # Estado asíncrono compartido y hook de acceso
      hooks/               # Filtros combinados con useMemo
      types.ts             # Program y categorías
    leads/
      components/          # Formulario y resumen de registros
      hooks/               # Estado del formulario y persistencia
      storage/             # Lectura, escritura y contrato local versionado
      utils/               # Validación y normalización
      types.ts             # Lead y LeadInput
  shared/components/       # Layout reutilizable
  styles/                  # Tailwind y estilos globales
  test/                    # Configuración común de tests
public/api/programs.json   # Datos ficticios del mock
```

## Decisiones técnicas

- Estructura por funcionalidad: componentes, tipos y acceso a datos cercanos al dominio que los usa. Solo los elementos reutilizados van en `shared`.
- Context API administra la carga del catálogo, con estados discriminados de TypeScript. El formulario y los filtros mantienen su estado local en hooks separados para evitar actualizaciones globales por cada pulsación.
- `fetch` con `async/await` y `AbortController` permite cancelar al desmontar, incluso durante las comprobaciones de React StrictMode. Se verifica la respuesta en ejecución porque TypeScript no valida datos externos.
- Tailwind usa su plugin oficial para Vite. La pantalla inicial incluye HTML semántico, foco visible, enlace para saltar al contenido y distribución responsive.
- Se conserva Oxlint de la plantilla oficial de Vite; Prettier unifica formato. TypeScript activa `strict`, `noUncheckedIndexedAccess` y `exactOptionalPropertyTypes`, sin tipos `any` en el código de aplicación.
- Vitest + Testing Library verifican carga, error/reintento, catálogo vacío, cancelación, contrato HTTP, filtros combinados, selección desde cards, validación, normalización, duplicados, recuperación al remontar y fallos de almacenamiento.

Referencias de configuración: [Vite](https://vite.dev/guide/) y [Tailwind con Vite](https://tailwindcss.com/docs/installation/using-vite).

## API mock

Por defecto se realiza `GET /api/programs.json` al archivo servido por Vite (también se incluye en `dist`). Es un mock HTTP estático de lectura, sin backend ni operaciones de escritura. Permite ejecutar la base sin servicios externos. Antes de la entrega final se puede sustituir por un endpoint REST de Mockaroo o equivalente.

Para conectar otra API, copia `.env.example` a `.env.local`, define `VITE_PROGRAMS_API_URL` y reinicia Vite. La API debe permitir CORS si usa otro origen y devolver un array con este contrato:

```json
[
  {
    "id": "programa-1",
    "name": "Nombre del programa",
    "category": "Pregrado",
    "description": "Descripción del programa"
  }
]
```

Las categorías admitidas son `Pregrado`, `Posgrado` y `Educación Continua`; los IDs deben ser únicos. No guardes secretos en variables `VITE_*`: se incluyen en la aplicación pública.

## Reglas de registro

- Nombre obligatorio de 2 a 100 caracteres una vez normalizado: letras Unicode, espacios, guiones y apóstrofos. Se quitan espacios exteriores, se colapsan espacios repetidos y se capitaliza cada parte del nombre.
- Correo obligatorio con estructura válida, sin espacios internos; se recortan espacios exteriores y se convierte a minúsculas. Se recomienda `@javeriana.edu.co`, pero se aceptan dominios externos para no excluir aspirantes. No se verifica la existencia del buzón ni se envían correos.
- El programa debe pertenecer al catálogo cargado; el botón de una card lo preselecciona y enfoca el nombre. Los filtros del catálogo no limitan las opciones del formulario.
- Se impide registrar dos veces el mismo correo en el mismo programa. El mismo correo puede interesarse en programas distintos.
- El éxito muestra nombre y correo normalizados; solo se vacía el formulario después de guardar correctamente. Ante errores se mantienen los datos para corregir o reintentar.

## Persistencia local

La clave `javeriana.leads.v1` contiene `{ "version": 1, "leads": [...] }`. Cada lead incluye `id`, `fullName`, `email`, `programId` y `createdAt` (ISO). Se valida el contrato al leer y se consulta de nuevo antes de añadir, evitando sobrescribir registros guardados desde una vista anterior. Los eventos `storage` actualizan el contador entre pestañas. localStorage no proporciona transacciones; escrituras exactamente simultáneas entre pestañas no están garantizadas y requerirían un backend o un mecanismo adicional de bloqueo.

Los datos permanecen solo en el navegador y origen actuales; no se envían a la Universidad. El formulario lo informa antes del registro. No es una inscripción oficial. Borrar los datos del sitio elimina los registros.

Si el navegador bloquea la lectura o no tiene espacio para escribir, se muestra el error y no se anuncia éxito. Si el contenido está dañado o tiene una versión incompatible, se conserva sin sobrescribir. Para recuperar un entorno de demostración, exporta primero el valor de la clave desde las herramientas del navegador y repara sus datos; si decides descartarlos, elimina únicamente esa clave y recarga. No hay borrado automático.

## Verificación manual

1. Buscar `ingenieria` y combinarlo con una categoría; probar cero resultados y limpiar filtros.
2. Pulsar `Inscribirme`, comprobar la selección y enviar el formulario vacío para revisar errores y foco.
3. Registrar un nombre con espacios/mayúsculas y un correo válido; comprobar los datos normalizados en el éxito.
4. Recargar: el contador debe conservarse. Repetir correo/programa: debe impedir el duplicado. Elegir otro programa: debe permitirlo.
5. Revisar a 390 px y en escritorio. Los tests automatizados cubren además errores HTTP y de localStorage sin modificar registros del navegador real.

## Siguientes etapas

1. Revisar el acabado visual y la accesibilidad del flujo completo.
2. Conectar un servicio mock REST externo si se requiere; el mock HTTP local ya permite ejecutar y probar el flujo.
3. Publicar repositorio y despliegue y añadir sus enlaces al README.

El enunciado indica entrega el lunes 28 de septiembre de 2026 a las 12:00 p. m. El repositorio y el despliegue públicos quedan pendientes.
