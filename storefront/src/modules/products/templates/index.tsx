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
        className="flex relative flex-col gap-6 py-6 content-container lg:flex-row lg:items-start"
        data-testid="product-container"
      >
        {/* Left Column - Image Gallery (sticky) */}
        <div className="relative order-1 lg:order-1 lg:sticky lg:top-24 w-full lg:w-[60%] lg:max-h-[calc(100vh-6rem)] lg:overflow-auto">
          <VariantImageGallery product={product} />
        </div>

        {/* Right Column - Product Info, Tabs, and Actions */}
        <div className="flex flex-col gap-y-6 order-2 lg:order-2 w-full lg:w-[40%] lg:max-w-[480px]">
          <ProductInfo product={product} />
          <ProductTabs product={product} />

          {/* Desktop Product Actions */}
          <div className="hidden flex-col gap-y-6 lg:flex">
            <ProductOnboardingCta />
            <ProductActionsWithVariant
              product={product}
              region={region}
            />
          </div>

          {/* Mobile Product Actions - sticky bottom cart still applies globally */}
          <div className="lg:hidden">
            <ProductActionsWithVariant
              product={product}
              region={region}
            />
          </div>
        </div>
      </div>

      {/* Add bottom padding to prevent content from being hidden behind sticky cart */}
      <div className="h-20"></div>

      <div
        className="my-16 content-container small:my-32"
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
