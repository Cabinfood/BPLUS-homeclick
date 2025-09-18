"use client"

import { useState, useEffect } from "react"
import { HttpTypes } from "@medusajs/types"
import { isEqual } from "lodash"
import VariantImageGallery from "../variant-image-gallery"
import ProductActions from "../product-actions"

type ProductWithVariantImagesProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (variantOptions: any) => {
  return variantOptions?.reduce((acc: Record<string, string | undefined>, varopt: any) => {
    if (varopt.option && varopt.value !== null && varopt.value !== undefined) {
      acc[varopt.option.title] = varopt.value
    }
    return acc
  }, {})
}

export default function ProductWithVariantImages({
  product,
  region,
  disabled
}: ProductWithVariantImagesProps) {
  const [selectedVariant, setSelectedVariant] = useState<HttpTypes.StoreProductVariant | undefined>()
  const [options, setOptions] = useState<Record<string, string | undefined>>({})

  // If there is only 1 variant, preselect it
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variant = product.variants[0]
      const variantOptions = optionsAsKeymap(variant.options)
      setOptions(variantOptions ?? {})
      setSelectedVariant(variant)
    }
  }, [product.variants])

  // Update selected variant when options change
  useEffect(() => {
    if (!product.variants || product.variants.length === 0) {
      setSelectedVariant(undefined)
      return
    }

    const variant = product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })

    setSelectedVariant(variant)
  }, [product.variants, options])

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Image Gallery */}
      <div className="flex-1">
        <VariantImageGallery 
          product={product} 
          selectedVariant={selectedVariant}
        />
      </div>

      {/* Product Actions */}
      <div className="lg:w-80">
        <ProductActions
          product={product}
          region={region}
          disabled={disabled}
        />
      </div>
    </div>
  )
}
