# Recursos visuales

Estado documentado al 26 de septiembre de 2026. Recursos usados por la interfaz; no constituye un manual oficial de marca.

## Fotografía

- Archivo: `src/assets/campus-javeriana.jpg`.
- Origen: [fotografía del campus](https://www.javeriana.edu.co/recursosdb/d/info-prg/img_7769-1-), usada en el formulario de la [página de Derecho](https://www.javeriana.edu.co/carrera-derecho).
- JPEG original de 400 × 650 px; recorte de presentación mediante `object-fit: cover`, sin alterar el archivo.
- Recurso institucional usado como referencia en esta demostración. No se ha identificado una licencia abierta de redistribución; no se atribuye una licencia libre al archivo.

## Logo

- Archivo local: `src/assets/logo-javeriana.png`, PNG transparente de 492 × 192 px, derivado del recurso horizontal de 872 × 340 px y reducido a paleta de 32 colores.
- Referencia visual: [logo horizontal institucional](https://www.javeriana.edu.co/recursosdb/d/info-prg/logo-jave-h-blue).
- Se conserva su proporción y texto alternativo «Pontificia Universidad Javeriana»; altura de 48 px en móvil y 64 px desde `sm`. El sitio mantiene su identificación como demostración no oficial.

- En tema claro se presenta en azul. En tema oscuro `.brand-logo` aplica `filter: brightness(0) invert(1)` para mostrar trazos blancos sobre transparencia, sin base blanca, sombra ni recuadro añadido. El filtro no modifica el PNG.

## Tipografía

- Raleway Variable mediante `@fontsource-variable/raleway`, instalada localmente.
- Licencia SIL Open Font License 1.1, incluida por el paquete en `node_modules/@fontsource-variable/raleway/LICENSE`.
- Vite empaqueta la fuente: el navegador no depende de Google Fonts ni de peticiones a servicios de fuentes externos.
- Respaldo: Segoe UI, system-ui, sans-serif. La hoja suministrada por el paquete utiliza `font-display: swap`.

## Iconos de interacción

- Sol y luna del switch y confirmación del toast: SVG inline en `src/shared/components/ThemeSwitch.tsx`, trazos con `currentColor` para adaptarse al tema.
- Son decorativos y no reciben foco; el nombre accesible del switch y los mensajes textuales comunican su función.
- No se incorporó una biblioteca de iconos, imágenes adicionales ni dependencias para el switch, el tooltip o el toast.

## Uso y mantenimiento

Logo y fotografía se importan desde los componentes y Vite los incluye en el build. La fuente se empaqueta localmente; estos recursos no dependen de solicitudes al portal universitario o Google Fonts al cargar la aplicación.

Las paletas y fundamentos de `reference/` conservan la extracción de la página de Derecho; no son estilos activos. La presentación actual se mantiene en `src/styles/index.css` y se documenta en la [guía de diseño](README.md).
