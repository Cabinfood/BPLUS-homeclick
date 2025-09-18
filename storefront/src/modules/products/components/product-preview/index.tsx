import { Text } from "@medusajs/ui"

import { getProductPrice } from "@lib/util/get-product-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import VariantThumbnail from "../variant-thumbnail"
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
        className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 hover:shadow-lg hover:scale-[1.01] transition-all duration-500 hover:-translate-y-[2px] flex flex-col h-full"
      >
        {/* Product Image Container */}
        <div className="flex-1 flex  rounded-xl min-h-[200px]">
          <VariantThumbnail
            product={product}
            size="square"
            isFeatured={isFeatured}
          />
        </div>
        
        {/* Product Info */}
        <div className="space-y-1">
          {/* Product Title */}
          <Text 
            className="text-gray-900 font-medium text-base leading-tight py-4" 
            data-testid="product-title"
          >
            {product.title}
          </Text>
          
          {/* Product Description/Subtitle */}
          {product.subtitle && (
            <Text className="text-gray-600 text-sm">
              {product.subtitle}
            </Text>
          )}
          
          {/* Price */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-x-2">
              {cheapestPrice && (
                <div className="text-black font-regular text-base">
                  <PreviewPrice price={cheapestPrice} />
                </div>
              )}
            </div>
            
            {/* Buy Button */}
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-regular transition-colors duration-200">
              Mua
            </button>
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
