# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **furniture e-commerce monorepo** built on **MedusaJS 2.0** (version 2.10.2) with a Next.js 14 storefront. The project is configured for deployment on Railway with integrated services including PostgreSQL, Redis, MinIO, and MeiliSearch.

**Key Features:**
- Custom Content Block system for dynamic product pages and landing pages
- 3D model viewer for product visualization (Three.js/React Three Fiber)
- Variant-specific image galleries
- Email notifications via Resend
- Stripe payment integration
- MeiliSearch product search
- MinIO cloud file storage

## Development Commands

### Backend (`cd backend/`)

**Initial Setup:**
```bash
pnpm ib              # Initialize backend: run migrations + seed database
```

**Development:**
```bash
pnpm dev             # Start backend dev server (+ admin dashboard at localhost:9000/app)
pnpm build           # Build backend
pnpm start           # Build + start backend from compiled source
```

**Email Development:**
```bash
pnpm email:dev       # Email template dev server (port 3002)
```

**Database Seeding:**
```bash
pnpm seed            # Run custom seed scripts (furniture data)
```

### Storefront (`cd storefront/`)

**Development:**
```bash
pnpm dev             # Wait for backend + start Next.js dev server
pnpm build           # Wait for backend + build Next.js app
pnpm start           # Start production server
```

**Direct Next.js Commands:**
```bash
npm run build:next   # Build without waiting for backend
npm run lint         # Run ESLint
npm run analyze      # Analyze bundle size (ANALYZE=true)
```

### Testing

**E2E Tests:**
```bash
cd storefront/
npm run test-e2e     # Run Playwright E2E tests
```

## Architecture

### Monorepo Structure

```
BPLUS-homeclick/
├── backend/          # MedusaJS 2.0 backend + admin dashboard
│   ├── src/
│   │   ├── admin/           # Admin dashboard widgets & components
│   │   ├── api/             # Custom API routes (admin/store)
│   │   ├── modules/         # Custom Medusa modules
│   │   ├── subscribers/     # Event subscribers
│   │   └── scripts/         # Seed & utility scripts
│   └── medusa-config.js     # Medusa configuration
│
└── storefront/       # Next.js 14 storefront
    └── src/
        ├── app/             # Next.js App Router pages
        ├── modules/         # Feature modules (products, cart, checkout, etc.)
        └── lib/             # Shared utilities & data fetching
```

### Custom Modules (Backend)

**1. Content Block Module** (`backend/src/modules/content-block/`)
- Custom Medusa module for dynamic content management
- Supports multiple block types: `text`, `media`, `specs`, `hero`, `bento_grid`, `features`, `testimonials`, `cta`
- Products can have multiple content blocks with ranking/ordering
- Used for both product detail pages and standalone landing pages

**Model:**
```typescript
{
  id: string
  title?: string
  description?: string
  block_type: string    // Block type identifier
  block_data: object    // Type-specific data (JSON)
  rank?: number         // Display order
  product_id?: string   // Optional product association
}
```

**API Endpoints:**
- `GET/POST /admin/content-block` - List/create blocks
- `GET/PUT/DELETE /admin/content-block/:id` - CRUD operations
- `POST /admin/content-block/reorder` - Reorder blocks
- `GET /store/content-block` - Public block fetching (query by `product_id` or `block_type`)

**2. MinIO File Storage** (`backend/src/modules/minio-file/`)
- Replaces local file storage with MinIO cloud storage
- Automatically creates `medusa-media` bucket
- Falls back to local storage if MinIO credentials not configured

**3. Email Notifications** (`backend/src/modules/email-notifications/`)
- Resend email integration with React Email templates
- Subscribers: `invite-created.ts`, `order-placed.ts`

### Admin Dashboard Customizations

**Custom Widgets** (`backend/src/admin/widgets/`):
- `product-content-blocks.tsx` - Product content block management (for product pages)
- `product-landing-blocks.tsx` - Landing page content blocks (non-product pages)
- `product-model-upload.tsx` - 3D model upload widget
- `category-image-upload.tsx` - Category image management
- `login-customization.tsx` - Custom login screen

**Content Block Editor Features:**
- Drag-and-drop reordering (using `@dnd-kit`)
- Form-based editing for each block type
- JSON editor for advanced users
- Real-time preview
- Validation using Zod schemas

### Storefront Architecture

**Data Fetching** (`storefront/src/lib/data/`):
- Server-side data fetching utilities
- `products.ts` - Product catalog queries
- `cart.ts` - Cart management
- `content-block.ts` - Content block fetching
- `collections.ts` - Collection queries

**Product Pages:**
- URL pattern: `/[countryCode]/products/[handle]`
- Two templates:
  1. **Standard Product Page** (`templates/index.tsx`) - Regular product with variant images, tabs, content blocks
  2. **Landing Template** (`templates/landing-template.tsx`) - Hero sections, bento grids, features for marketing pages

**3D Model Viewer:**
- Uses `@react-three/fiber` and `@react-three/drei`
- Lazy loaded to reduce initial bundle size
- Proper cleanup/disposal of Three.js resources (see MEMORY_ISSUES_SUMMARY.md)
- Located in `storefront/src/modules/products/components/variant-image-gallery/model-3d-viewer.tsx`

**Content Block Rendering:**
- `storefront/src/modules/products/components/content-block/` - Block renderers
- `render-blocks.tsx` - Main rendering logic
- `landing-block-renderer.tsx` - Landing page blocks (hero, bento, features, testimonials)
- Supports video cleanup and lazy loading (memory optimizations)

### Configuration

**Environment Variables:**

Backend requires:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `COOKIE_SECRET` - Cookie signing secret

Optional backend services:
- `REDIS_URL` - Redis for event bus and workflow engine
- `MINIO_ENDPOINT`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY` - MinIO file storage
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL` - Email notifications
- `STRIPE_API_KEY`, `STRIPE_WEBHOOK_SECRET` - Payment processing
- `MEILISEARCH_HOST`, `MEILISEARCH_ADMIN_KEY` - Product search

Storefront requires:
- `NEXT_PUBLIC_MEDUSA_BACKEND_URL` - Backend URL (defaults to localhost:9000)

**Key Configuration Files:**
- `backend/medusa-config.js` - Medusa module configuration (conditional loading based on env vars)
- `backend/src/lib/constants.ts` - Environment variable parsing and validation
- `storefront/src/lib/constants.tsx` - Storefront constants

## Important Technical Details

### Memory Management

**Critical:** This project had memory issues identified and fixed. See `MEMORY_ISSUES_SUMMARY.md` for full details.

**Key Optimizations:**
1. **3D Model Viewer** - Proper disposal of Three.js resources, lazy loading, no HDR environment maps
2. **Landing Page Videos** - Video element cleanup on unmount, lazy image loading
3. **MeiliSearch** - Reduced indexed fields (6→4), pagination limits, optimized search attributes

**Best Practices When Modifying:**
- Always dispose Three.js geometries, materials, textures in cleanup functions
- Use lazy loading for heavy components (`React.lazy`)
- Implement video/media cleanup in `useEffect` return functions
- Optimize images with Next.js `<Image>` component (quality, sizes)

### API Routes

**Custom API Routes** (`backend/src/api/`):
- Admin routes: `/admin/content-block/*`, `/admin/file-upload`, `/admin/custom`
- Store routes: `/store/content-block`, `/store/custom`
- Key exchange: `/key-exchange` (for secure token exchange)

**Route Structure:**
- `route.ts` files export HTTP method handlers: `GET`, `POST`, `PUT`, `DELETE`
- Use Zod schemas for validation (from `backend/src/lib/schemas/`)
- Resolve services via `req.scope.resolve(MODULE_KEY)`

### Database Migrations

**Location:** `backend/src/modules/content-block/migrations/`

**Running Migrations:**
Migrations run automatically during `pnpm ib` or backend startup. MedusaJS uses MikroORM.

### Styling

- **Backend Admin:** Uses `@medusajs/ui` component library + Tailwind CSS
- **Storefront:** Tailwind CSS with custom components
- Responsive design with mobile-first approach

## Common Workflows

### Adding a New Content Block Type

1. Update `backend/src/admin/components/types.ts` with new block type interfaces
2. Add validation schema in `backend/src/lib/schemas/content-block.ts`
3. Create form fields component in `backend/src/admin/components/fields/`
4. Update `DraftBlockEditor.tsx` to handle new block type
5. Create renderer in `storefront/src/modules/products/components/content-block/`
6. Update `render-blocks.tsx` or `landing-block-renderer.tsx` to use new renderer

### Modifying Product Display

- Product templates: `storefront/src/modules/products/templates/`
- Product components: `storefront/src/modules/products/components/`
- Variant handling: Uses `ProductVariantProvider` context for variant selection
- Image galleries support both standard images and 3D models

### Working with Medusa SDK

Backend uses `@medusajs/framework` and storefront uses `@medusajs/js-sdk@preview`.

**Common Patterns:**
```typescript
// Backend: Resolve services
const productService = req.scope.resolve("product")

// Storefront: Use SDK client
import { sdk } from "@lib/config"
const products = await sdk.store.product.list()
```

## Testing & Deployment

### Pre-deployment Checklist

1. Run backend build: `cd backend && pnpm build`
2. Run storefront build: `cd storefront && npm run build`
3. Test locally with production builds
4. Monitor memory usage (see MEMORY_ISSUES_SUMMARY.md testing section)
5. Check for console errors and warnings
6. Test critical user flows: browsing products, 3D viewer, checkout

### Railway Deployment

This project is pre-configured for Railway deployment. The template includes:
- PostgreSQL database
- Redis instance
- MinIO storage bucket
- MeiliSearch service

**Required Railway Environment Variables:**
Set via Railway dashboard or `.env` files. See README.md for setup instructions.

## Dependencies

**Key Backend Dependencies:**
- `@medusajs/medusa@2.10.2` - Core framework
- `@medusajs/admin-sdk@2.10.2` - Admin dashboard framework
- `@dnd-kit/*` - Drag-and-drop functionality
- `@react-three/fiber`, `@react-three/drei`, `three` - 3D rendering
- `resend@4.0.1`, `@react-email/components` - Email
- `minio@^8.0.3` - File storage client
- `@rokmohar/medusa-plugin-meilisearch@1.2.3` - Search plugin

**Key Storefront Dependencies:**
- `next@^14.0.0` - Framework
- `@medusajs/js-sdk@preview` - Medusa client
- `@react-three/fiber`, `@react-three/drei`, `three` - 3D rendering
- `react-instantsearch-hooks-web` - MeiliSearch UI
- `@stripe/react-stripe-js` - Payment UI

**Package Manager:** `pnpm@9.10.0`

**Node Version:** `22.x`

## Resources

- MedusaJS Docs: https://docs.medusajs.com
- Railway Template: https://railway.app/template/gkU-27
- Step-by-step Guide: https://funkyton.com/medusajs-2-0-is-finally-here/
- Stripe Setup Video: https://youtu.be/dcSOpIzc1Og
- MeiliSearch Setup Video: https://youtu.be/hrXcc5MjApI
