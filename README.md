# Visualizador de Exponentes: Expansión y Compresión

Esta es una aplicación web interactiva diseñada para visualizar mecánicamente el concepto de la potencia (exponentes positivos y negativos) mediante una metáfora geométrica de **escalado**.

## Características

- **Exponentes Positivos ($n^k$):** Representan una **herramienta de expansión**. Una unidad pequeña se clona y expande masivamente hasta ser $n^k$ veces más grande.
- **Exponentes Negativos ($n^{-k}$):** Representan una **herramienta de compresión o partición**. Una unidad grande se fracciona en $n$ partes repetidamente, resultando en un fragmento microscópico.
- **Principio de Cancelación:** Visualiza cómo la multiplicación de un exponente positivo por su inverso negativo colapsa el objeto exactamente de regreso a su estado base original (el 1).

## Tecnologías

- **HTML5 Canvas:** Para el renderizado eficiente de bloques y animaciones fluidas.
- **CSS Moderno:** Diseño responsivo y estético con variables CSS.
- **JavaScript (Vanilla):** Lógica matemática y control de animación sin dependencias externas.

## Cómo usar

1. Descarga el repositorio completo.
2. Abre `docs/index.html` en cualquier navegador web moderno (Chrome, Firefox, Safari, Edge).
3. Ajusta la **Base** y el **Exponente** usando los controles laterales para ver la transformación en tiempo real.

## Publicación en GitHub Pages

Para publicar este proyecto:
1. Sube los archivos a un repositorio de GitHub.
2. Ve a **Settings** > **Pages** en tu repositorio.
3. En la sección **Build and deployment**, asegúrate de que **Source** sea `Deploy from a branch`.
4. Debajo de **Branch**, selecciona tu rama principal (normalmente `main`).
5. En el menú desplegable de carpetas (donde dice `/ (root)`), cámbialo a **`/docs`**.
6. Haz clic en **Save**.
7. ¡Listo! Tu visualizador estará disponible en la URL proporcionada por GitHub (ej. `https://tu-usuario.github.io/nombre-del-repo/`).
