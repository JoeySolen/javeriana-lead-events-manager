# Guía de diseño: Javeriana Lead & Events Manager

Estado al 26 de septiembre de 2026: adaptación aplicada, modo oscuro, switch, tooltip y toast implementados. Las secciones 1–8 conservan la referencia y la propuesta inicial; las secciones 9–12 documentan el resultado actual.

Esta guía reúne los elementos visuales de la [página de Derecho de la Universidad Javeriana](https://www.javeriana.edu.co/carrera-derecho) que sirvieron de referencia al estilo implementado en el proyecto. No constituye un manual oficial de marca.

## 1. Procedencia y nivel de certeza

La referencia se inspeccionó en escritorio y a 390 px de ancho. La extracción de color se realizó el 24 de septiembre de 2026 (UTC), con el tema `light` y la facultad `ciencias-juridicas` activos.

Se distinguen tres niveles:

- **Extraído:** valor declarado en CSS o resuelto por el navegador. Una variable definida no implica que se utilice en un componente visible.
- **Observado:** composición o comportamiento visto durante la revisión. No equivale a una auditoría de todos los estados, tamaños o navegadores.
- **Propuesto:** decisión para nuestra aplicación; debe revisarse al implementar. No se atribuye a la página de referencia.

Los colores de fotografías, vídeos, iframes y bibliotecas externas no forman parte de la paleta de marca extraída. Las declaraciones de tema oscuro se conservan como referencia, pero no se verificaron visualmente. Las escalas de otras facultades quedan fuera de esta guía.

## 2. Archivos de referencia

- [Paleta en JSON](reference/paleta-javeriana-derecho.json): 121 variables del tema activo, ocho colores accesorios, muestras de componentes y declaraciones oscuras de la facultad.
- [Paleta en CSS](reference/paleta-javeriana-derecho.css): variables de color del tema claro y accesorios. Archivo documental, sin importar en la aplicación.
- [Fundamentos extraídos](reference/fundamentos-javeriana.json): declaraciones de tipografía, espaciado, radios, sombras e interacción. Las referencias `var(...)` se conservan tal como se encontraron.

Los nombres originales se preservan para permitir rastrear cada decisión. La integración utiliza tokens semánticos propios (sección 10); estos archivos preservan la extracción original y no se importan globalmente en la aplicación.

## 3. Color

### Paleta principal extraída

| Rol de referencia                    | Variable           | Valor     |
| ------------------------------------ | ------------------ | --------- |
| Azul principal de Ciencias Jurídicas | `--primary`        | `#2C5595` |
| Azul oscuro de la escala             | `--primary-700`    | `#244785` |
| Azul profundo                        | `--primary-1100`   | `#001347` |
| Azul claro de apoyo                  | `--primary-100`    | `#D2EEFF` |
| Amarillo secundario                  | `--secondary`      | `#F6BD30` |
| Gris terciario                       | `--tertiary`       | `#C6C6C6` |
| Fondo claro                          | `--background-100` | `#FAFAFA` |
| Blanco                               | `--neutral`        | `#FFFFFF` |
| Texto más oscuro                     | `--neutral-100`    | `#1D2125` |
| Texto de títulos                     | `--neutral-200`    | `#22272B` |
| Texto secundario                     | `--neutral-400`    | `#454F59` |
| Texto de apoyo                       | `--neutral-500`    | `#596773` |
| Gris de borde                        | `--neutral-900`    | `#C7D1DB` |
| Texto sobre botón azul observado     | `--neutral-1000`   | `#EEEFEF` |
| Éxito definido                       | `--success`        | `#28A368` |
| Advertencia definida                 | `--warning`        | `#F2BF2E` |
| Error definido                       | `--danger`         | `#FF1200` |

Las diez escalas completas son `primary`, `secondary`, `tertiary`, `background`, `neutral`, `neutral-variant`, `neutral-variant-blue`, `success`, `warning` y `danger`, con niveles de 100 a 1100. `--info` es un valor adicional heredado (`#2E5AAC`), sin una escala equivalente en la extracción.

En el tema activo, `--background` vale `#1E1E1E`, aunque las superficies claras observadas utilizan otros tokens. No debe asignarse automáticamente ese alias al fondo de nuestra aplicación. La escala `neutral` avanza de oscuro a claro; otras escalas siguen el sentido opuesto. No asumir equivalencia con la numeración de Tailwind.

### Transparencias observadas

El botón «Recibe más información» usa texto azul principal, fondo `rgba(44, 85, 149, 0.1)` y borde `rgba(44, 85, 149, 0.2)`. Estas transparencias dependen de la superficie sobre la que se dibujan; no equivalen a un único hexadecimal en todos los contextos.

Los colores de WhatsApp, redes sociales y herramientas de accesibilidad se documentan por separado. No se proponen como colores de categorías del catálogo.

### Mapeo semántico propuesto para el proyecto

| Token futuro            | Valor propuesto          | Aplicación                                                           |
| ----------------------- | ------------------------ | -------------------------------------------------------------------- |
| `brand`                 | `#2C5595`                | Acciones principales, enlaces y acentos                              |
| `brand-hover`           | `#244785`                | Hover propuesto; no verificado en la referencia                      |
| `brand-soft`            | `rgba(44, 85, 149, 0.1)` | Acciones secundarias y superficies suaves                            |
| `surface-page`          | `#FAFAFA`                | Fondo general                                                        |
| `surface-card`          | `#FFFFFF`                | Tarjetas y formulario                                                |
| `text-primary`          | `#22272B`                | Títulos y contenido principal                                        |
| `text-secondary`        | `#454F59`                | Descripciones                                                        |
| `text-muted`            | `#596773`                | Metadatos y ayuda                                                    |
| `border-subtle`         | `#C7D1DB`                | Separación de superficies; no asumir que basta para delimitar campos |
| `accent`                | `#F6BD30`                | Acentos puntuales, sin convertirlo en el color dominante             |
| `feedback-success-text` | `#186E3C`                | Candidato para texto de éxito                                        |
| `feedback-error-text`   | `#C30506`                | Candidato para texto de error                                        |
| `feedback-warning-text` | `#62340F`                | Candidato para texto de advertencia                                  |

Los colores de estado saturados no deben trasladarse automáticamente a texto pequeño. Antes de aplicar cualquier pareja texto/fondo, comprobar contraste sobre su superficie real. Los candidatos oscuros anteriores pertenecen a las escalas extraídas; su asignación semántica es una propuesta.

## 4. Tipografía

Familia extraída y observada: **Raleway**, con respaldo `sans-serif`.

| Token original                | Valor extraído | Equivalencia a raíz de 16 px |
| ----------------------------- | -------------- | ---------------------------- |
| `--font-size-principal-title` | `2.25rem`      | 36 px                        |
| `--font-size-title`           | `1.75rem`      | 28 px                        |
| `--font-size-subtitle`        | `1.375rem`     | 22 px                        |
| `--font-size-caption`         | `1.125rem`     | 18 px                        |
| `--font-size-heading`         | `1rem`         | 16 px                        |
| `--font-size-paragraph`       | `0.875rem`     | 14 px                        |
| `--font-size-small`           | `0.6875rem`    | 11 px                        |
| `--font-size-xs`              | `0.5625rem`    | 9 px                         |

También se declaran pesos 100, 300, 400, 500 y 700; interlineado base 1.5 y de títulos 1.2. En escritorio, las partes visibles del título principal se resolvieron a 36 px y peso 700, aunque el contenedor `h1` tenía un tamaño diferente. El tamaño declarado del contenedor no siempre refleja el texto final.

**Adaptación propuesta:** usar 400, 500 y 700; texto de lectura y campos de formulario a 16 px; texto auxiliar entre 12 y 14 px. Reservar 28–36 px para títulos principales según el espacio disponible. No trasladar los tamaños de 9 y 11 px a información esencial. Se incorporó mediante `@fontsource-variable/raleway` (licencia SIL OFL), empaquetada con la aplicación y con `Segoe UI`/`system-ui` como respaldo mientras carga.

## 5. Espaciado, anchura y superficies

### Medidas extraídas

| Escala                                        | Valores declarados                                                    |
| --------------------------------------------- | --------------------------------------------------------------------- |
| Espaciado, de `3xs` a `4xl`                   | `0.125`, `0.25`, `0.5`, `0.75`, `1`, `1.5`, `2.375`, `3`, `4`, `5rem` |
| Equivalencia con raíz de 16 px                | 2, 4, 8, 12, 16, 24, 38, 48, 64, 80 px                                |
| Radios `xs`, `sm`, `md`, base, `lg`, `xl`     | 2, 4, 8, 14, 16, 20 px equivalentes                                   |
| Radio de botones principales observado        | 12 px                                                                 |
| Anchuras máximas `sm`, `md`, `lg`, `xl`, base | 36, 48, 62, 75, 87.5 rem                                              |

Las anchuras máximas son tokens de contenedor, no breakpoints confirmados. Las sombras declaradas usan el neutro oscuro con opacidades entre 10 % y 20 %; sus fórmulas completas están en el JSON de fundamentos.

**Adaptación propuesta:** conservar por ahora los breakpoints responsive de la aplicación. Usar una anchura máxima de 75 rem, márgenes móviles de 20–24 px, separación entre secciones de 48–64 px y espacios entre componentes de 16–24 px. Botones con radio de 12 px; tarjetas de 16 px; fotografía principal de 20 px. Estas asignaciones se revisarán en la composición real.

## 6. Componentes y composición

| Elemento         | Observado en la referencia                                                 | Propuesta para la aplicación                                                                  |
| ---------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Cabecera         | Blanca, persistente, sombra tenue, logo horizontal y dos acciones          | Cabecera clara con navegación breve y acceso al registro; comprobar si necesita persistencia  |
| Portada          | Texto a la izquierda, fotografía grande a la derecha; título azul y oscuro | Portada clara de dos columnas en escritorio, apilada en móvil                                 |
| Botón principal  | Azul sólido, texto claro, esquinas redondeadas                             | Usarlo para la acción principal de cada bloque                                                |
| Botón secundario | Azul tenue o contorno azul                                                 | Usarlo para explorar y otras acciones secundarias                                             |
| Tarjetas         | Bordes finos, etiquetas, listas y controles de carrusel                    | Mantener cuadrícula filtrable con categoría, nombre, descripción y acción                     |
| Iconos           | Trazos lineales, algunos dentro de círculos azules o claros                | Una familia coherente; iconos decorativos ocultos a lectores de pantalla                      |
| Formulario       | Modal con fotografía lateral, campos subrayados y scroll interno           | Mantener el formulario corto integrado en la página y labels visibles                         |
| Secciones        | Alternancia de fondos claros y bloques azules                              | Reservar fondos azules para bloques puntuales; catálogo y formulario sobre superficies claras |
| Fotografía       | Campus y vida universitaria                                                | Seleccionar recursos pertinentes, con origen y condiciones de uso documentados                |

El logo horizontal azul se descargó de `https://www.javeriana.edu.co/recursosdb/d/info-prg/logo-jave-h-blue` (PNG 872 × 340, fondo transparente) y se guarda en `src/assets/logo-javeriana.png`, reducido a 492 × 192 px (3× la altura de escritorio) y a paleta de 32 colores. Se aloja en el proyecto en lugar de enlazarlo porque el servidor lo sirve con `Cache-Control: no-store` y la ruta puede cambiar. No se recrea el escudo; la presentación en modo oscuro aplica un filtro blanco al PNG, sin modificar el archivo (sección 11). La fotografía de portada y su procedencia se documentan en [assets.md](assets.md).

## 7. Estados e interacción

Las declaraciones de referencia incluyen transición de 0.3 s, desplazamiento vertical de botones en hover de -2 px y efecto de onda de 0.6 s. Su presencia en CSS no confirma que todos los componentes los utilicen.

**Propuesta:** transiciones discretas de color y sombra; evitar movimiento innecesario. Respetar la preferencia de movimiento reducido. Conservar foco visible, labels, ayudas y errores asociados. No depender solo del color para comunicar selección, error o éxito.

La adaptación debe mantener estos estados ya funcionales: catálogo cargando, error con reintento, catálogo vacío, búsqueda sin resultados, filtros activos, selección de programa, campos inválidos, registro guardado, duplicado y fallo de almacenamiento.

## 8. Responsive y accesibilidad

En la referencia móvil se observaron menú compacto, contenido apilado y dos acciones fijas en la parte inferior. También se observaron superposiciones del control flotante de accesibilidad con el título y el área de cierre del modal.

Para nuestro proyecto se propone mantener las acciones en el flujo normal hasta comprobar que una barra persistente aporta valor. Cualquier elemento fijo deberá reservar espacio y no tapar contenido, foco ni controles.

Criterios de aceptación propuestos para el rediseño:

- Revisar anchuras de 320, 390, 768 y 1280 px, sin desplazamiento horizontal involuntario.
- Mantener orden de lectura y tabulación, enlace para saltar al contenido y foco visible.
- Comprobar zoom al 200 %, ajuste de texto y uso del formulario con teclado.
- Adoptar como objetivo de proyecto contraste de 4.5:1 para texto normal y 3:1 para texto grande y límites/indicadores esenciales de controles. No se ha realizado una auditoría formal del portal.
- Mantener áreas táctiles cómodas, con objetivo propio de 44 × 44 px para acciones principales.
- Usar mensajes textuales junto al color, y no anunciar animaciones ni cambios decorativos.
- Conservar recorte adecuado de fotografías, dimensiones reservadas y texto alternativo según su función.

## 9. Integración actual

| Responsabilidad                                               | Archivo                                                                                                                                                     |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tokens claros/oscuros, tipografía, foco y movimiento reducido | [index.css](../../src/styles/index.css)                                                                                                                     |
| Cabecera, logo, navegación y footer                           | [AppLayout.tsx](../../src/shared/components/AppLayout.tsx)                                                                                                  |
| Portada y fotografía del campus                               | [App.tsx](../../src/app/App.tsx)                                                                                                                            |
| Tarjetas, filtros y carga de más programas                    | [ProgramCatalog.tsx](../../src/features/programs/components/ProgramCatalog.tsx) y [ProgramCard.tsx](../../src/features/programs/components/ProgramCard.tsx) |
| Formulario, errores, éxito y contador                         | [LeadSection.tsx](../../src/features/leads/components/LeadSection.tsx)                                                                                      |
| Switch sin texto permanente, tooltip y toast                  | [ThemeSwitch.tsx](../../src/shared/components/ThemeSwitch.tsx)                                                                                              |
| Preferencia y sincronización del tema                         | [useTheme.ts](../../src/shared/hooks/useTheme.ts)                                                                                                           |
| Tema previo al primer render                                  | [theme-init.js](../../public/theme-init.js), cargado desde [index.html](../../index.html)                                                                   |

Los recursos gráficos ya están incorporados y documentados en [assets.md](assets.md). Las mejoras pendientes se enumeran en el [README principal](../../README.md#pendientes-de-entrega-y-extras).

## 10. Decisiones implementadas

Los tokens viven en `@theme` de [src/styles/index.css](../../src/styles/index.css) y se usan como utilidades de Tailwind (`bg-brand`, `text-ink-soft`, `rounded-card`…). Los archivos de `reference/` no se importan.

| Token en código                  | Valor                             | Token propuesto en §3               |
| -------------------------------- | --------------------------------- | ----------------------------------- |
| `brand` / `brand-hover`          | `#2C5595` / `#244785`             | `brand` / `brand-hover`             |
| `brand-soft` / `brand-line`      | azul al 10 % / 20 %               | `brand-soft` y borde observado      |
| `on-brand`                       | `#FFFFFF`                         | Sustituye a `#EEEFEF` por contraste |
| `accent`                         | `#F6BD30`                         | `accent`, solo decorativo           |
| `page` / `card`                  | `#FAFAFA` / `#FFFFFF`             | `surface-page` / `surface-card`     |
| `ink` / `ink-soft` / `ink-muted` | `#22272B` / `#454F59` / `#596773` | `text-*`                            |
| `line`                           | `#C7D1DB`                         | `border-subtle`, solo superficies   |
| `field`                          | `#596773`                         | Nuevo: borde de campos (5.8:1)      |
| `success-ink` / `success-soft`   | `#186E3C` / `#D8EDDF`             | `feedback-success-text` + fondo     |
| `danger-ink` / `danger-soft`     | `#C30506` / rojo al 6 %           | `feedback-error-text` + fondo       |

- En el tema claro, el texto sobre azul utiliza blanco opaco; en oscuro, texto oscuro sobre azul claro. Las parejas principales de texto y fondo deben comprobarse sobre el diseño final; no se incluyen colores de fotografías en esta comprobación.
- Radios: controles 12 px (`rounded-control`), tarjetas 16 px (`rounded-card`), fotografía de portada 20 px (`rounded-media`). Anchura máxima 75 rem (`max-w-page`), márgenes móviles de 20 px.
- Clases de componente `btn-primary`, `btn-secondary`, `field`, `label` y `eyebrow`; acciones principales con altura mínima de 44 px.
- Cabecera no persistente adaptada al tema, con switch, enlace a la oferta y acción «Registrarme». Portada de dos columnas en escritorio y apilada en móvil; fotografía del campus junto al texto y los dos niveles (pregrado y posgrado) bajo las acciones. Origen de los recursos en [assets.md](assets.md).
- Transiciones CSS de color/sombra de 0.3 s e indicador del switch de 0.2 s. `prefers-reduced-motion` reduce las transiciones a 0.01 ms. No hay animación global al cambiar de tema ni Framer Motion instalado.
- Logo oficial en la cabecera, 48 px de alto en móvil y 64 px desde `sm`, con `alt` «Pontificia Universidad Javeriana»; el nombre de la aplicación aparece a su lado desde `sm`.
- Formulario integrado con campos subrayados, etiquetas visibles y borde inferior contrastado. Los filtros conservan campos con contorno completo.
- Verificación de la entrega (26 de septiembre de 2026): anchuras de 320, 390, 768 y 1280 px sin desbordamiento horizontal; imágenes y fuente local cargadas; filtros por nombre/categoría, selección desde tarjeta, errores con foco en el primer campo inválido, registro normalizado y persistencia tras recarga comprobados en el navegador. Consola sin errores ni advertencias durante el recorrido.
- Último `npm run check` completado: tipos, lint, formato, 63 tests en 8 archivos y compilación de producción. Pendientes de una revisión específica: zoom al 200 %, recorrido completo con teclado y auditoría formal de accesibilidad.

Los recursos gráficos y la fuente se sirven desde el proyecto; consultar [origen de recursos](assets.md). La paginación, los filtros y las reglas de registro existentes se conservan.

## 11. Modo oscuro

Adaptación propia de la paleta; no es una paleta oficial extraída del portal. Los overrides se aplican con `:root[data-theme='dark']` sobre los mismos tokens del tema claro.

| Token                                  | Valor oscuro                          |
| -------------------------------------- | ------------------------------------- |
| `brand` / `brand-hover` / `brand-deep` | `#9CC5FF` / `#C1DBFF` / `#DCEAFF`     |
| `brand-soft` / `brand-line`            | Azul `#9CC5FF` al 10 % / 35 %         |
| `on-brand`                             | `#101923`                             |
| `accent`                               | `#F6BD30` (conservado del tema claro) |
| `page` / `card`                        | `#101923` / `#192633`                 |
| `ink` / `ink-soft` / `ink-muted`       | `#F1F5F9` / `#D1DCE8` / `#AEBED0`     |
| `line` / `field` / `disabled`          | `#3B4E61` / `#899EB4` / `#75899F`     |
| `success-ink` / `success-soft`         | `#8DE1B0` / `#18382C`                 |
| `danger-ink` / `danger-soft`           | `#FFAAAA` / `#3E252D`                 |

Las acciones usan azul claro con texto oscuro. El logo se presenta blanco con `brightness(0) invert(1)`, conserva la transparencia del PNG y no tiene fondo ni recuadro añadido. En modo claro mantiene su azul original. `color-scheme` adapta los controles nativos y barras de desplazamiento.

La clave `javeriana.theme.v1` es independiente de los leads. Sin una elección válida, o con el antiguo valor `system`, se sigue el sistema. Al accionar el switch se guarda `light` o `dark`, que prevalece sobre el sistema y se sincroniza entre pestañas. No hay selector de tres opciones en la interfaz actual. Si el almacenamiento falla, el cambio funciona en la vista actual, sin garantizar su persistencia. El script inicial evita el destello claro antes de React; el hook mantiene después el tema y la meta de color del navegador.

Contrastes medidos de los tokens oscuros: texto principal/superficie 14.03:1, secundario 11.06:1, auxiliar 8.11:1, texto de botón/fondo 9.99:1, borde de campo/superficie 5.57:1, éxito 8.25:1 y error 7.68:1. Son comprobaciones de estas parejas, no una auditoría completa de accesibilidad.

## 12. Switch, tooltip y toast

### Switch de tema

- Botón binario con iconos decorativos de sol/luna, sin texto visible permanente junto al control.
- `role="switch"`, nombre accesible «Modo oscuro» y `aria-checked` vinculado al tema efectivo, incluido el heredado del sistema.
- Activación con clic, Espacio y Enter; foco visible y altura interactiva mínima de 44 px. Pista de 56 × 28 px e indicador de 20 × 20 px.
- En móvil comparte la fila de navegación con «Registrarme»; la cabecera puede apilarse según el espacio disponible.

### Tooltip

- Ayuda propia, sin `title` nativo duplicado. Aparece por hover o foco y permanece mientras el control tiene foco o el cursor está sobre el control o su ayuda, salvo cierre con Escape.
- Texto dinámico: «Modo claro activo» y «Cambiar a modo oscuro», o el inverso.
- `role="tooltip"`, ID estable mediante `useId` y asociación con `aria-describedby` solo mientras está abierto.
- Escape lo cierra incluso al abrirlo únicamente por hover; salir del conjunto y perder foco también lo cierra.
- Se sitúa bajo el switch; ancho de 224 px limitado al viewport, alineación izquierda en móvil y derecha desde `sm`. Superficie y texto adaptados al tema.

### Toast

- Confirmación tras activar el switch: «Modo claro activado» o «Modo oscuro activado», con icono de confirmación decorativo.
- Duración de 3 segundos. Un nuevo cambio reemplaza el mensaje y reinicia el cierre; no se acumulan avisos.
- Región viva `aria-live="polite"`, `aria-atomic="true"` y mensaje con `role="status"`. No desplaza el foco ni intercepta clics.
- Posición fija inferior derecha, separación inferior de 24 px, márgenes laterales de 16 px en móvil y 24 px desde `sm`.
- Sin toast al cargar ni por sincronización automática del sistema/otra pestaña. El temporizador se limpia al sustituir el aviso o desmontar.

### Verificación actual

Última validación del código: 63 tests aprobados en 8 archivos, tipos, lint, formato y build correctos. Los 18 tests de tema cubren su inicialización, switch, persistencia, errores de almacenamiento, sincronización, tooltip y toast. Se comprobaron visualmente ambos temas, logo blanco, activación con Espacio/Enter, cierre con Escape, persistencia tras recarga, toast y ayudas a 320 px sin desbordamiento.

La guía no da por completados el recorrido íntegro con teclado, el zoom al 200 %, las pruebas con lector de pantalla ni una auditoría exhaustiva entre navegadores. El [README](../../README.md#verificación) reúne cobertura, recorrido manual y pendientes.
