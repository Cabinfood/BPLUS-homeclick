import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import Breadcrumb, { BreadcrumbItem } from "@modules/common/components/breadcrumb"
import ProductRating from "@modules/products/components/product-rating"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  // Build breadcrumb items
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Trang chủ", href: "/" }
  ]

  // Add category if available
  if (product.categories && product.categories.length > 0) {
    const category = product.categories[0]
    breadcrumbItems.push({
      label: category.name,
      href: `/categories/${category.handle}`
    })
  } else if (product.collection) {
    // Fallback to collection if no category
    breadcrumbItems.push({
      label: product.collection.title,
      href: `/collections/${product.collection.handle}`
    })
  }

  // Add current product
  breadcrumbItems.push({
    label: product.title
  })

  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} className="mb-2" />

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

        {/* Product Description */}
        <Text
          className="text-medium text-ui-fg-subtle whitespace-pre-line"
          data-testid="product-description"
        >
          {product.description}
        </Text>
      </div>
    </div>
  )
}

export default ProductInfo
