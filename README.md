# Concretos Estampados de Nayarit · Sitio Astro

Landing + catálogo dinámico (Google Sheets CSV) para **Concretos Estampados de Nayarit (Constructora S.A. de C.V.)**, construido con Astro + Tailwind + TypeScript y listo para deploy estático en GitHub Pages.

## Requisitos

- Node.js 18+
- npm 9+

## Instalar dependencias

```bash
npm install
```

## Ejecutar en local

```bash
npm run dev
```

## Configurar catálogo y WhatsApp

Edita `src/components/Catalog/Catalog.tsx`:

- `SHEET_CSV_URL` (obligatorio)
- `WHATSAPP_PHONE` (obligatorio)

Formato esperado del CSV:

```txt
https://docs.google.com/spreadsheets/d/<SHEET_ID>/gviz/tq?tqx=out:csv&sheet=item
```

La pestaña de Google Sheets debe llamarse exactamente `item` y contener estos headers:

```txt
id, category, name, price, description, image_url, available, order_text
```

### Reglas de parsing aplicadas

- `available`: solo `TRUE` (string) se considera disponible.
- `price`: se parsea a número si es posible; si no, se trata como precio a cotizar.
- `order_text`: si viene vacío se usa fallback:
  `Hola, me interesa: {name} ({category}) - ${price}`

## Build de producción

```bash
npm run build
```

Salida estática en `dist/`.

## Deploy en GitHub Pages

Este repo incluye workflow en `.github/workflows/deploy.yml`.

### Pasos

1. Sube el proyecto a GitHub.
2. En GitHub, entra a **Settings → Pages** y selecciona **GitHub Actions** como source.
3. Actualiza en `astro.config.mjs`:
   - `site`: `https://<tu-usuario>.github.io`
   - `base`: `/<tu-repo>`
4. Haz push a `main`.
5. El workflow compilará y publicará automáticamente.

---

## Estructura principal

- `src/layouts/BaseLayout.astro`
- `src/components/Header.astro`
- `src/components/Hero.astro`
- `src/components/Section.astro`
- `src/components/Services.astro`
- `src/components/Gallery.astro`
- `src/components/Catalog/Catalog.astro`
- `src/components/Catalog/Catalog.tsx`
- `src/components/Footer.astro`
- `src/pages/index.astro`

