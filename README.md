# AETHER — Premium Audio Storefront

A responsive Next.js e-commerce prototype for the fictional brand **AETHER** — premium over-ear headphones with a clean, conversion-focused storefront.

**Live demo:** [https://aether-premium-audio.vercel.app](https://aether-premium-audio.vercel.app)  
**Source code:** [https://github.com/ajxdevx/AETHER---Premium-Audio](https://github.com/ajxdevx/AETHER---Premium-Audio)

---

## How to run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm start
```

### Optional environment

Production metadata defaults to the Vercel URL. Override for a custom domain:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

---

## Design direction

**Brand:** AETHER — fictional premium audio.  
**Product focus:** AirPods Max–style over-ear headphones in multiple finishes (Midnight, Sky Blue, Green, Pink).

**Visual language:**
- Light, airy layouts with soft brand greens (`#6B9B45` and related mist/soft tones)
- Product photography as the primary visual anchor — full-bleed hero, spotlight lifestyle shots, studio product images
- Expressive sans typography (Plus Jakarta Sans) with a secondary display face for announcements
- Minimal chrome: fewer cards, clearer hierarchy, strong CTAs
- Motion for presence (section reveals, intro, Lenis smooth scroll) rather than decoration

The goal was a polished, conversion-led first impression: brand hero → featured product → trust/social proof → shop CTA, with a clean path into PDP and cart.

---

## What’s included

| Area | Status |
|------|--------|
| Homepage (header, hero, featured products, brand content, CTAs, footer) | Done |
| Product page (gallery, price, rating, qty, add to cart, details, related, loading/error) | Done |
| Shop listing + filters | Done (beyond brief) |
| Cart drawer with quantity and totals | Done |
| Cart page + mock checkout | Done (beyond brief) |
| Responsive desktop / mobile | Done |
| DummyJSON API + TanStack Query | Done |
| Cart persistence (`localStorage`) | Done |
| Basic accessibility (skip link, focus states, labels, drawer focus trap) | Done |

---

## Important technical decisions

### DummyJSON + local catalog merge

Products are fetched with **GET** requests from [DummyJSON](https://dummyjson.com/docs/products), then merged with a local AETHER catalog so names, prices, and images stay on-brand.

```
UI → TanStack Query → services/products.ts → DummyJSON
                              ↓
                   applyCatalogToProduct()
                              ↓
              constants/products/* (brand content)
```

Listings share **one batch request** via TanStack Query. Product detail reuses cache when possible, with a single-product GET as fallback.

### Cart

Handled client-side with React context + `localStorage` (`aether-cart`). No backend, auth, or real payments.

### Structure

Reusable UI under `components/ui/`, layout in `components/layout/`, domain pieces under `components/home|product|shop|cart|checkout/`. Data access sits in `services/` + `hooks/`, with catalog overrides in `constants/` and `lib/products/`.

---

## Project structure (high level)

| Area | Location |
|------|----------|
| Pages | `app/` |
| Home / product / shop / cart UI | `components/` |
| Product API | `services/products.ts` |
| Catalog merge & display | `lib/products/` |
| Brand catalog & copy | `constants/products/`, `constants/maxProducts.ts` |
| Static assets | `public/marketing/`, `public/products/`, `public/payments/` |
| Query hooks | `hooks/useCatalogProducts.ts`, `hooks/useProducts.ts` |
| Cart | `providers/CartProvider.tsx`, `hooks/useCart.ts`, `store/cart.ts` |

---

## What I prioritised

Within the recommended time window I focused on:

1. **Visual quality** — hero, product photography, brand sections, cohesive colour system  
2. **Core shopping UX** — homepage → shop/PDP → cart drawer → mock checkout  
3. **API + state** — DummyJSON fetch, TanStack Query caching, catalog merge, localStorage cart  
4. **Responsive + interaction polish** — mobile layouts, hover/focus states, loading/error on PDP  

**Built:**
- Conversion-focused homepage with hero, featured products, spotlights, testimonials, newsletter, final CTA
- Product detail with gallery, quantity, add to cart, details tabs, related finishes, loading/error
- Shop with filters/sort, cart drawer + full cart page, mock checkout
- Lenis smooth scrolling, signature intro, wishlist favourites
- Live Vercel deploy

**Intentionally skipped / light-touch:**
- Real payments and authentication
- Full automated test suite and formal a11y audit
- Custom backend API (DummyJSON + merge layer was enough for the brief)

---

## Known limitations

- Checkout is **mock-only** (no payment processing)
- Display catalog is small and brand-curated; DummyJSON fields are overridden after fetch
- “Related products” are other colour finishes of the same model, not DummyJSON-related IDs
- Product details use tabs rather than a classic accordion
- Mobile nav uses scrollable inline links (no separate hamburger drawer in the current build)
- Marketing and product images are AI-generated; some assets benefit from further retouching

---

## What I would improve with more time

- Expand the catalog and wire related products from richer DummyJSON relationships
- Stronger empty/error patterns across shop and search
- Formal accessibility pass (keyboard tour, axe, screen reader spot-checks)
- Unit/integration tests for cart math and catalog merge
- Image optimisation pipeline and consistent art direction across all finishes
- Persist wishlist and polish checkout validation / order confirmation UX

---

## Libraries & tools

| Library | Role |
|---------|------|
| [Next.js](https://nextjs.org/) (App Router) | Framework, routing, image optimisation |
| [React](https://react.dev/) 19 | UI |
| [TypeScript](https://www.typescriptlang.org/) | Types |
| [Tailwind CSS](https://tailwindcss.com/) 4 | Styling |
| [TanStack Query](https://tanstack.com/query) | Server state for DummyJSON |
| [Framer Motion](https://www.framer.com/motion/) | Page/section motion |
| [GSAP](https://gsap.com/) | Intro / signature animation |
| [Lenis](https://github.com/darkroomengineering/lenis) | Smooth scrolling |
| [react-icons](https://react-icons.github.io/react-icons/) | Icons |
| [class-variance-authority](https://cva.style/) + `clsx` / `tailwind-merge` | Component variants |

**External API:** [DummyJSON Products](https://dummyjson.com/docs/products)

**Deploy:** [Vercel](https://vercel.com)

---

## AI usage

AI tools supported parts of this assignment:

- **Google Flow** — generated product and lifestyle marketing images (hero pieces, spotlights, product studio shots). Assets were reviewed, cropped, and integrated by hand.

Architecture choices (DummyJSON + catalog merge, cart persistence, component structure), design direction, and final polish were directed and reviewed by me. All submitted code and copy were checked manually before submission.
