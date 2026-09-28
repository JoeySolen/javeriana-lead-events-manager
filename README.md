# Javeriana Lead & Events Manager

SPA de la prueba técnica frontend de la Pontificia Universidad Javeriana.

## Estado actual

Documentación actualizada el 26 de septiembre de 2026.

Incluye React + TypeScript estricto, Vite, Tailwind CSS, Context API, un catálogo responsive, consumo HTTP de un mock local, validación del contrato recibido, estados de carga/error/vacío, reintento y pruebas automatizadas. El catálogo contiene los 237 programas reales de pregrado y posgrado publicados por la Universidad (ver [Datos del catálogo](#datos-del-catálogo)).

Incluye búsqueda por nombre sin distinción de tildes o mayúsculas, filtro combinado por categoría con contador por categoría, catálogo paginado de 12 en 12 («Mostrar más»), selección desde las cards y formulario accesible con normalización, validación, detección de duplicados y persistencia en localStorage.

La interfaz aplica la referencia visual de la página de Derecho: Raleway local, paleta azul/amarillo, fotografía del campus, tarjetas y campos subrayados en el formulario. Incluye modo oscuro con switch, logo blanco transparente, tooltip de estado y toast de confirmación.

**Última validación del código:** `npm run check` correcto, con 63 pruebas en 8 archivos, revisión de tipos, lint, formato y build de producción.

**Pendientes para la entrega:** validación manual con lector de pantalla y en navegadores adicionales, confirmar la visibilidad pública del repositorio, publicar el despliegue y añadir ambos enlaces.

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
      hooks/               # Filtros combinados y paginación con useMemo
      types.ts             # Program y categorías
    leads/
      components/          # Formulario y resumen de registros
      hooks/               # Estado del formulario y persistencia
      storage/             # Lectura, escritura y contrato local versionado
      utils/               # Validación y normalización
      types.ts             # Lead y LeadInput
  assets/                  # Logo y fotografía local del campus
  shared/
    components/            # AppLayout y ThemeSwitch (switch, tooltip y toast)
    hooks/                 # useTheme y prueba del script de tema inicial
  styles/                  # Tailwind y estilos globales
  test/                    # Configuración común de tests
public/api/programs.json   # Catálogo real servido como mock HTTP
public/theme-init.js       # Tema antes del primer render de React
docs/design/              # Referencia, decisiones de diseño y origen de recursos
```

## Referencia de diseño

La [guía de diseño](docs/design/README.md) documenta la paleta, tipografía, espaciado y componentes de la página de Derecho de la Javeriana. Distingue valores extraídos, comportamientos observados y propuestas para esta aplicación, y conserva los archivos de referencia. La interfaz ya aplica esa guía: tokens semánticos en `src/styles/index.css`, tipografía Raleway y la paleta azul/amarillo; las secciones 10–12 de la guía detallan la implementación, el modo oscuro y los avisos. El [origen de recursos visuales](docs/design/assets.md) documenta la fotografía, el logo, la fuente y los iconos.

## Decisiones técnicas

- Estructura por funcionalidad: componentes, tipos y acceso a datos cercanos al dominio que los usa. El layout, el control de tema y su hook viven en `shared`.
- Context API administra la carga del catálogo, con estados discriminados de TypeScript. El formulario y los filtros mantienen su estado local en hooks separados para evitar actualizaciones globales por cada pulsación.
- `fetch` con `async/await` y `AbortController` permite cancelar al desmontar, incluso durante las comprobaciones de React StrictMode. Se verifica la respuesta en ejecución porque TypeScript no valida datos externos.
- Tailwind usa su plugin oficial para Vite. La interfaz incluye HTML semántico, foco visible, enlace para saltar al contenido y distribución responsive.
- Se conserva Oxlint de la plantilla oficial de Vite; Prettier unifica formato. TypeScript activa `strict`, `noUncheckedIndexedAccess` y `exactOptionalPropertyTypes`, sin tipos `any` en el código de aplicación.
- Vitest + Testing Library verifican carga, error/reintento, catálogo vacío, cancelación, contrato HTTP y del catálogo incluido, filtros combinados, paginación y foco, selección desde cards, validación, normalización, duplicados, recuperación al remontar y fallos de almacenamiento. También cubren el tema inicial, el switch, su sincronización, el toast y el tooltip.

Referencias de configuración: [Vite](https://vite.dev/guide/) y [Tailwind con Vite](https://tailwindcss.com/docs/installation/using-vite).

## API mock

Por defecto se realiza `GET /api/programs.json` al archivo servido por Vite (también se incluye en `dist`). Es un mock HTTP estático de lectura, sin backend ni operaciones de escritura. Permite ejecutar el flujo completo sin servicios externos. Se usa `BASE_URL` para resolver el archivo cuando la aplicación se sirve desde un subdirectorio.

### Datos del catálogo

`public/api/programs.json` reúne los programas publicados en [javeriana.edu.co/estudia-en-la-javeriana/programas](https://www.javeriana.edu.co/estudia-en-la-javeriana/programas), consultada el 23 de septiembre de 2026:

- **Pregrado (48):** pestaña «Pregrados - Carreras».
- **Posgrado (189):** pestañas «Posgrados - Especializaciones - Maestrías» y «Doctorados».
- Nombres tal como aparecen en la fuente, sin el asterisco de interdisciplinariedad. Los programas listados en varias facultades aparecen una sola vez.
- La fuente no publica descripciones; cada descripción indica solo el nivel y la facultad (p. ej. «Maestría de la Facultad de Ingeniería.»).
- Se excluyen programas eclesiásticos, técnico laboral y educación continua (esta última está en otro sitio). La categoría `Educación Continua` sigue admitida por el contrato; el filtro solo ofrece categorías con programas, así que no aparece mientras el catálogo no tenga ninguno.
- Es una copia estática: no se actualiza si la Universidad cambia su oferta.

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
- El programa debe pertenecer al catálogo cargado; el botón de una card lo preselecciona y enfoca el nombre. Los filtros del catálogo no limitan las opciones del formulario; el selector agrupa los programas por categoría.
- Se impide registrar dos veces el mismo correo en el mismo programa. El mismo correo puede interesarse en programas distintos.
- El éxito muestra nombre y correo normalizados; solo se vacía el formulario después de guardar correctamente. Ante errores se mantienen los datos para corregir o reintentar.

## Persistencia local

La clave `javeriana.leads.v1` contiene `{ "version": 1, "leads": [...] }`. Cada lead incluye `id`, `fullName`, `email`, `programId` y `createdAt` (ISO). Se valida el contrato al leer y se consulta de nuevo antes de añadir, evitando sobrescribir registros guardados desde una vista anterior. Los eventos `storage` actualizan el contador entre pestañas. localStorage no proporciona transacciones; escrituras exactamente simultáneas entre pestañas no están garantizadas y requerirían un backend o un mecanismo adicional de bloqueo.

Los datos permanecen solo en el navegador y origen actuales; no se envían a la Universidad. El formulario lo informa antes del registro. No es una inscripción oficial. Borrar los datos del sitio elimina los registros.

Si el navegador bloquea la lectura o no tiene espacio para escribir, se muestra el error y no se anuncia éxito. Si el contenido está dañado o tiene una versión incompatible, se conserva sin sobrescribir. Para recuperar un entorno de demostración, exporta primero el valor de la clave desde las herramientas del navegador y repara sus datos; si decides descartarlos, elimina únicamente esa clave y recarga. No hay borrado automático.

## Tema claro y oscuro

El switch de la cabecera muestra solo el control y los iconos de sol/luna, sin texto permanente a su lado. Conserva el nombre accesible «Modo oscuro», `role="switch"`, `aria-checked`, foco visible y una altura interactiva mínima de 44 px. Se activa con clic, Espacio o Enter.

| Situación                                                         | Comportamiento                                                                               |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Sin preferencia guardada, valor inválido o antiguo valor `system` | Sigue `prefers-color-scheme`, incluidos los cambios del sistema en vivo.                     |
| Primera activación del switch                                     | Alterna desde el tema efectivo y guarda `light` o `dark`.                                    |
| Preferencia explícita guardada                                    | Se conserva tras recarga y prevalece sobre el sistema.                                       |
| Cambio o borrado de la clave desde otra pestaña                   | El evento `storage` sincroniza el tema; al borrar la preferencia vuelve a seguir el sistema. |
| localStorage bloqueado o lleno                                    | Permite cambiar el tema de la vista actual, sin garantizar persistencia tras recarga.        |

La clave `javeriana.theme.v1` guarda una cadena independiente de los leads. La interfaz actual es binaria; ya no ofrece un selector de tres opciones ni una acción para volver a Sistema.

`public/theme-init.js`, cargado desde `index.html`, aplica `data-theme` antes del primer render para evitar el destello claro. [useTheme](src/shared/hooks/useTheme.ts) usa `useSyncExternalStore` para observar el sistema y mantiene el tema efectivo y `meta[name="theme-color"]`. La clave, las reglas iniciales y los colores de esa meta deben mantenerse alineados con el script inicial.

Los tokens de `src/styles/index.css` adaptan superficies, textos, campos, acciones y estados. `color-scheme` adapta los controles nativos. El logo conserva el PNG transparente: azul en claro y blanco mediante `brightness(0) invert(1)` en oscuro, sin recuadro. El modo oscuro y sus avisos no añaden dependencias.

### Tooltip y toast

Ambos se implementan en [ThemeSwitch](src/shared/components/ThemeSwitch.tsx), con la misma paleta del tema activo.

| Elemento | Contenido y comportamiento                                                                                                                                                                                                                                                                                                                                                                         |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tooltip  | Aparece al pasar el cursor o enfocar el switch. Muestra «Modo claro activo / Cambiar a modo oscuro» o «Modo oscuro activo / Cambiar a modo claro». Se actualiza al alternar y usa `role="tooltip"` y `aria-describedby`. Permite mover el cursor sobre la ayuda. Se cierra con Escape, incluso si se abrió solo por hover, o cuando ni el control ni la ayuda tienen hover y el botón pierde foco. |
| Toast    | Aparece tras accionar el switch: «Modo claro activado» o «Modo oscuro activado». Se cierra a los 3 segundos; los cambios consecutivos reemplazan el mensaje y reinician el temporizador. Usa una región viva `polite`, no mueve el foco ni intercepta clics. No aparece en la carga inicial ni por cambios automáticos del sistema o de otra pestaña.                                              |

El tooltip se coloca bajo el switch y limita su ancho en móvil. El toast se sitúa abajo a la derecha con márgenes adaptados a pantallas pequeñas. Los listeners y temporizadores se retiran al dejar de ser necesarios o al desmontar.

## Verificación

Última ejecución completa del código, el 27 de septiembre de 2026: **63 pruebas aprobadas en 8 archivos**, junto con tipos, lint, formato y build (`npm run check`). De ellas, 18 cubren el tema y su inicialización: 12 en `ThemeSwitch.test.tsx` y 6 en `themeInit.test.ts`.

| Área                 | Cobertura automatizada                                                                                                                                                  |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API y catálogo       | Contrato y datos incluidos, errores HTTP, carga, reintento, vacío y cancelación.                                                                                        |
| Filtros y paginación | Búsqueda y categoría combinadas, contadores, lotes de 12, reinicio al filtrar y foco en la primera card añadida.                                                        |
| Leads                | Normalización, validación, selección desde card, duplicados, recuperación y fallos de lectura/escritura.                                                                |
| Tema                 | Preferencia del sistema, elección persistida, sincronización entre pestañas, valores inválidos, almacenamiento bloqueado e inicialización previa a React.               |
| Avisos               | Toast en ambos temas, reemplazo y cierre automático, limpieza al desmontar; tooltip por hover/foco, texto actualizado, relación accesible y cierre con Escape o salida. |

Las comprobaciones manuales ya realizadas incluyen la composición a 320, 390, 768 y 1280 px, el flujo de filtro/registro/persistencia, ambos temas, activación del switch con Espacio y Enter, tooltip y toast sin desbordamiento a 320 px, y logo blanco sobre fondo oscuro.

### Revisión de accesibilidad del 27 de septiembre de 2026

| Comprobación         | Resultado                                                                                                                                                                                                                                           |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Estructura accesible | El árbol accesible expone banner, navegación, contenido principal, regiones con nombre, búsqueda, listas, formulario, etiquetas, ayudas y niveles de encabezado coherentes.                                                                         |
| Teclado              | El orden de tabulación recorre todas las acciones visibles sin trampas. «Saltar al contenido» enfoca `main`; el envío inválido enfoca el primer campo con su error; «Inscribirme» enfoca el nombre y «Mostrar más» enfoca la primera tarjeta nueva. |
| Reflujo              | Sin desplazamiento horizontal ni elementos recortados a 640 CSS px, equivalente al reflujo de una ventana de 1280 px al 200 %, ni a 320 CSS px.                                                                                                     |
| Contraste claro      | Texto principal 14.44:1, secundario 8:1, auxiliar 5.57:1, botón principal 7.39:1, campos 5.81:1, éxito 5.13:1 y error 5.64:1.                                                                                                                       |
| Contraste oscuro     | Texto principal 16.17:1, secundario 12.75:1, auxiliar 9.34:1, botón principal 9.99:1, campos 5.57:1, éxito 8.25:1 y error 7.68:1.                                                                                                                   |
| Regiones vivas       | El toast usa una sola región `status` atómica para evitar anuncios duplicados; los resultados del catálogo y avisos del formulario conservan sus roles de estado o alerta.                                                                          |
| Movimiento           | `prefers-reduced-motion` elimina desplazamientos, retardos y duraciones de Framer Motion y reduce las transiciones CSS.                                                                                                                             |

Los textos deshabilitados quedan por debajo de 3:1 en el tema claro, pero los componentes inactivos están exentos del criterio de contraste. Los bordes decorativos de tarjetas tampoco comunican estado ni delimitan campos; los bordes de controles sí superan 3:1. La revisión se realizó con el árbol accesible y el navegador Chromium integrado. Sigue pendiente una sesión práctica con NVDA, JAWS o VoiceOver y comprobaciones en Firefox, Safari y Edge; por ello no se afirma compatibilidad exhaustiva entre lectores o navegadores.

### Recorrido manual reproducible

1. Buscar `ingenieria`, combinar con una categoría, revisar contadores y probar cero resultados. Limpiar filtros, pulsar «Mostrar 12 programas más» y comprobar que el foco pasa a la primera card nueva.
2. Pulsar «Inscribirme», comprobar el programa preseleccionado y enviar el formulario vacío para revisar errores y foco.
3. Registrar un nombre con espacios/mayúsculas y un correo válido de prueba; comprobar los datos normalizados en el éxito.
4. Recargar y verificar el contador. Repetir correo/programa para comprobar el rechazo de duplicados; elegir otro programa debe permitir el registro.
5. Alternar el switch con ratón, Espacio y Enter. Verificar el tema, el icono, el logo, el foco y el toast. Cambiar varias veces y comprobar que solo queda el último aviso durante 3 segundos desde el último cambio.
6. Recargar y comprobar la preferencia guardada. Para verificar el seguimiento del sistema, usar un perfil de prueba sin preferencia de tema guardada; los tests cubren este caso sin modificar los registros del navegador real.
7. Pasar el cursor sobre el switch y sobre su tooltip; comprobar estado/acción. Probar foco con Tab, cambiar de tema, cerrar con Escape y salir del control.
8. Revisar ambos temas a 320, 390, 768 y 1280 px, incluyendo filtros, formulario, mensajes y ayudas. Repetir el reflujo a 640 CSS px y el recorrido completo de teclado. Completar aparte la sesión con lector de pantalla y navegadores adicionales.

## Pendientes de entrega y extras

1. Completar la validación manual con lector de pantalla y ampliar la comprobación a Firefox, Safari y Edge. La revisión de estructura accesible, teclado, reflujo, movimiento y contraste ya está documentada.
2. Confirmar la visibilidad pública del repositorio, publicar el despliegue y añadir ambos enlaces al README. El build genera `dist/`; para un subdirectorio debe configurarse `base` en Vite. No se ha documentado todavía una URL pública de demo.
3. Conectar una API mock externa solo si se requiere; el mock HTTP local ya permite ejecutar y probar el flujo.

TypeScript estricto, modo oscuro y pruebas automatizadas ya están implementados. El enunciado fija la entrega el lunes 28 de septiembre de 2026 a las 12:00 p. m.

## Animaciones

Framer Motion añade entradas discretas a la portada y la fotografía, aparición escalonada de las tarjetas al cargar o mostrar más programas y transición del mensaje de éxito o error del formulario. Las animaciones usan opacidad y desplazamientos cortos, no alteran el orden del DOM ni la gestión del foco.

Los componentes consultan `prefers-reduced-motion` mediante `useReducedMotion`: cuando el usuario solicita menos movimiento, se omiten los desplazamientos, retardos y duraciones. Las transiciones CSS existentes también se reducen desde `src/styles/index.css`.

Para limitar el peso, `AppProviders` carga solo `domAnimation` mediante `LazyMotion` y los componentes usan `m` en lugar de `motion`. El modo `strict` impide volver a usar `motion` por descuido. El JavaScript del build pasa de 75.8 KB gzip sin animaciones a 104.2 KB, frente a 117.6 KB con el componente `motion` completo.
