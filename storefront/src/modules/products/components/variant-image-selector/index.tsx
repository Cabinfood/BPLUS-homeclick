"use client"

import { useState, useEffect } from "react"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { clx } from "@medusajs/ui"

type VariantImage = {
  url: string
}

type VariantImageSelectorProps = {
  product: HttpTypes.StoreProduct
  selectedVariant?: HttpTypes.StoreProductVariant
  onVariantSelect?: (variant: HttpTypes.StoreProductVariant) => void
  className?: string
}

export default function VariantImageSelector({
  product,
  selectedVariant,
  onVariantSelect,
  className
}: VariantImageSelectorProps) {
  const [currentImages, setCurrentImages] = useState<string[]>([])
  const [currentThumbnail, setCurrentThumbnail] = useState<string | null>(null)

  // Update images when selected variant changes
  useEffect(() => {
    if (selectedVariant?.metadata) {
      const variantImages = selectedVariant.metadata.images as VariantImage[] | undefined
      const variantThumbnail = selectedVariant.metadata.thumbnail as string | undefined

      if (variantImages && variantImages.length > 0) {
        setCurrentImages(variantImages.map(img => img.url))
      } else if (product.images) {
        setCurrentImages(product.images.map(img => img.url))
      }

      if (variantThumbnail) {
        setCurrentThumbnail(variantThumbnail)
      } else {
        setCurrentThumbnail(product.thumbnail)
      }
    } else {
      // Fallback to product images
      if (product.images) {
        setCurrentImages(product.images.map(img => img.url))
      }
      setCurrentThumbnail(product.thumbnail)
    }
  }, [selectedVariant, product])

  // Get variants that have variant images
  const variantsWithImages = product.variants?.filter(variant => 
    variant.metadata?.images || variant.metadata?.thumbnail
  ) || []

  if (variantsWithImages.length === 0) {
    return null
  }

  return (
    <div className={clx("space-y-4", className)}>
      {/* Current Image Display */}
      <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
        {currentThumbnail ? (
          <Image
            src={currentThumbnail}
            alt={product.title || "Product image"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image available
          </div>
        )}
      </div>

      {/* Additional Images */}
      {currentImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {currentImages.map((imageUrl, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-16 h-16 relative overflow-hidden rounded-md bg-gray-100 cursor-pointer hover:opacity-75 transition-opacity"
              onClick={() => setCurrentThumbnail(imageUrl)}
            >
              <Image
                src={imageUrl}
                alt={`${product.title} image ${index + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          ))}
        </div>
      )}

      {/* Variant Selector */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-900">Variants</h4>
        <div className="flex flex-wrap gap-2">
          {variantsWithImages.map((variant) => {
            const variantThumbnail = variant.metadata?.thumbnail as string | undefined
            const isSelected = selectedVariant?.id === variant.id

            return (
              <button
                key={variant.id}
                onClick={() => onVariantSelect?.(variant)}
                className={clx(
                  "relative w-12 h-12 rounded-md overflow-hidden border-2 transition-all",
                  isSelected 
                    ? "border-blue-500 ring-2 ring-blue-200" 
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                {variantThumbnail ? (
                  <Image
                    src={variantThumbnail}
                    alt={variant.title || "Variant"}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                    {variant.title?.charAt(0) || "V"}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
