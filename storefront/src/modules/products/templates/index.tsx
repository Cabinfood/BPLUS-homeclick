import React, { Suspense } from "react"

import VariantImageGallery from "@modules/products/components/variant-image-gallery"
import ProductActionsWithVariant from "@modules/products/components/product-actions-with-variant"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { ProductVariantProvider } from "@modules/products/components/product-variant-provider"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <ProductVariantProvider product={product}>
      <div
        className="content-container flex flex-col lg:flex-row lg:items-start py-6 relative gap-6"
        data-testid="product-container"
      >
        {/* Left Column - Product Info (Desktop) / Top Section (Mobile) */}
        <div className="flex flex-col lg:sticky lg:top-48 lg:py-0 lg:max-w-[350px] w-full gap-y-6 order-2 lg:order-1">
          <ProductInfo product={product} />
          <ProductTabs product={product} />
        </div>

        {/* Center Column - Image Gallery */}
        <div className="flex-1 relative order-1 lg:order-2">
          <VariantImageGallery product={product} />
        </div>

        {/* Right Column - Product Actions (Desktop only) */}
        <div className="hidden lg:flex flex-col lg:sticky lg:top-48 lg:py-0 lg:max-w-[350px] w-full gap-y-6 order-3">
          <ProductOnboardingCta />
          <ProductActionsWithVariant
            product={product}
            region={region}
          />
        </div>

        {/* Mobile Product Actions - Now handled by sticky bottom cart on all devices */}
        <div className="lg:hidden order-4">
          <ProductActionsWithVariant
            product={product}
            region={region}
          />
        </div>
      </div>

      {/* Add bottom padding to prevent content from being hidden behind sticky cart */}
      <div className="h-20"></div>

      <div
        className="content-container my-16 small:my-32"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </ProductVariantProvider>
  )
}

export default ProductTemplate
