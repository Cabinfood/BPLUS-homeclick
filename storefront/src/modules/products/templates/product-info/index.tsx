import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import ProductRating from "@modules/products/components/product-rating"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">

        {/* Product Title */}
        <Heading
          level="h2"
          className="text-3xl leading-10 text-ui-fg-base"
          data-testid="product-title"
        >
          {product.title}
        </Heading>

        {/* Rating and Share */}
        <ProductRating 
          rating={5} 
          reviewCount={product.metadata?.reviewCount as number || 0}
        />

        {/* Product Subtitle */}
        <Text
          className="text-medium text-ui-fg-subtle whitespace-pre-line"
          data-testid="product-subtitle"
        >
          {product.subtitle}
        </Text>
      </div>
    </div>
  )
}

export default ProductInfo
