# Javeriana Lead & Events Manager

SPA de la prueba técnica frontend de la Pontificia Universidad Javeriana.

## Estado: etapa 1, base ejecutable

Incluye React + TypeScript estricto, Vite, Tailwind CSS, Context API, un catálogo inicial responsive, consumo HTTP de un mock local, validación del contrato recibido, estados de carga/error/vacío, reintento y pruebas automatizadas. Los programas son ficticios.

**Aún pendientes:** filtros por nombre/categoría, formulario de leads, normalización/validación, persistencia en localStorage y despliegue. El modelo `Lead` está definido para esa siguiente etapa. Esta base no constituye la entrega final de la prueba.

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
      types.ts             # Program y categorías
    leads/
      types.ts             # Lead y LeadInput; funcionalidad pendiente
  shared/components/       # Layout reutilizable
  styles/                  # Tailwind y estilos globales
  test/                    # Configuración común de tests
public/api/programs.json   # Datos ficticios del mock
```

## Decisiones técnicas

- Estructura por funcionalidad: componentes, tipos y acceso a datos cercanos al dominio que los usa. Solo los elementos reutilizados van en `shared`.
- Context API administra la carga del catálogo, con estados discriminados de TypeScript. El formulario y los filtros tendrán su propio estado cuando se implementen; no se añaden capas vacías.
- `fetch` con `async/await` y `AbortController` permite cancelar al desmontar, incluso durante las comprobaciones de React StrictMode. Se verifica la respuesta en ejecución porque TypeScript no valida datos externos.
- Tailwind usa su plugin oficial para Vite. La pantalla inicial incluye HTML semántico, foco visible, enlace para saltar al contenido y distribución responsive.
- Se conserva Oxlint de la plantilla oficial de Vite; Prettier unifica formato. TypeScript activa `strict`, `noUncheckedIndexedAccess` y `exactOptionalPropertyTypes`, sin tipos `any` en el código de aplicación.
- Vitest + Testing Library verifican carga, error/reintento, catálogo vacío, cancelación y contrato HTTP.

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

## Siguientes etapas

1. Añadir búsqueda por nombre y filtro por categoría sin recarga, con pruebas de su combinación.
2. Implementar formulario accesible: nombre, correo y programa; limpiar espacios, capitalizar nombres y normalizar correo. El PDF prefiere validar el dominio `@javeriana.edu.co`; definir esa regla explícitamente en la implementación.
3. Guardar leads en localStorage, manejar datos corruptos/fallos de escritura y comprobar persistencia tras recarga.
4. Revisar diseño móvil y accesibilidad; publicar repositorio y despliegue, y añadir los enlaces al README.

El enunciado indica entrega el lunes 28 de septiembre de 2026 a las 12:00 p. m. El repositorio y el despliegue públicos quedan pendientes.
