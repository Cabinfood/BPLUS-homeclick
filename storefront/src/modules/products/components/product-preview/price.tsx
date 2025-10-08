import { Text, clx } from "@medusajs/ui"
import { VariantPrice } from "types/global"

export default function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  // Calculate discount percentage
  const calculateDiscountPercentage = (): number | null => {
    if (price.price_type !== "sale" || !price.original_price || !price.calculated_price) {
      return null
    }

    const originalValue = parseFloat(price.original_price.replace(/[^0-9.-]+/g, ""))
    const currentValue = parseFloat(price.calculated_price.replace(/[^0-9.-]+/g, ""))

    if (originalValue > 0 && currentValue > 0) {
      return Math.round(((originalValue - currentValue) / originalValue) * 100)
    }

    return null
  }

  const discountPercentage = calculateDiscountPercentage()

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Text
        className="text-gray-900 font-semibold text-xl"
        data-testid="price"
      >
        {price.calculated_price}
      </Text>
      
      {price.price_type === "sale" && discountPercentage && (
        <>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white">
            -{discountPercentage}%
          </span>
          <Text
            className="line-through text-gray-400 text-sm"
            data-testid="original-price"
          >
            {price.original_price}
          </Text>
        </>
      )}
    </div>
  )
}
