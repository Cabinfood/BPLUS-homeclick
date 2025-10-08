import { Text } from "@medusajs/ui"

import { getProductPrice } from "@lib/util/get-product-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import VariantThumbnail from "../variant-thumbnail"
import VariantColorSelector from "../variant-color-selector"
import PreviewPrice from "./price"
import { HttpTypes } from "@medusajs/types"

export default function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  // Product already has pricing data from the list API call
  // No need for additional API call here
  const { cheapestPrice } = getProductPrice({
    product,
  })

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div 
        data-testid="product-wrapper" 
        className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-[2px] flex flex-col h-full"
      >
        {/* Product Image Container */}
        <div className="flex-1 flex overflow-hidden rounded-xl min-h-[200px]">
          <VariantThumbnail
            product={product}
            size="square"
            isFeatured={isFeatured}
          />
        </div>
        
        {/* Product Info */}
        <div className="mt-4 space-y-2">
          {/* Variant Color Selector */}
          <VariantColorSelector product={product} maxVisible={4} />
          
          {/* Product Title */}
          <Text 
            className="text-gray-900 font-medium text-base leading-snug line-clamp-2" 
            data-testid="product-title"
          >
            {product.title}
          </Text>
          
          {/* Price with Discount Badge */}
          {cheapestPrice && (
            <PreviewPrice price={cheapestPrice} />
          )}
        </div>
      </div>
    </LocalizedClientLink>
  )
}
