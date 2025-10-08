"use client"

import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import { useState } from "react"

type VariantColorSelectorProps = {
  product: HttpTypes.StoreProduct
  maxVisible?: number
}

export default function VariantColorSelector({
  product,
  maxVisible = 4,
}: VariantColorSelectorProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null)

  // Extract unique colors from product options
  const getVariantColors = () => {
    // Find the color option from product options
    const colorOption = product.options?.find(
      (option) =>
        option.title?.toLowerCase() === "color" ||
        option.title?.toLowerCase() === "colour" ||
        option.title?.toLowerCase() === "màu sắc"
    )

    if (!colorOption || !colorOption.values || colorOption.values.length === 0) {
      return []
    }

    // Get unique color values and map them with image metadata
    const colors = colorOption.values
      .slice(0, maxVisible)
      .map((value, index) => ({
        color: value.value || "",
        id: value.id || `color-${index}`,
        value: value.value || "",
        image: (value.metadata as any)?.image || null,
      }))

    return colors
  }

  const colors = getVariantColors()

  if (colors.length === 0) return null

  // Map color names to actual color codes
  const getColorCode = (colorName: string): string => {
    const colorMap: Record<string, string> = {
      black: "#000000",
      white: "#FFFFFF",
      red: "#DC2626",
      blue: "#2563EB",
      green: "#16A34A",
      yellow: "#FACC15",
      orange: "#EA580C",
      purple: "#9333EA",
      pink: "#EC4899",
      gray: "#6B7280",
      grey: "#6B7280",
      brown: "#92400E",
      navy: "#1E3A8A",
      beige: "#D4C5B9",
      cream: "#FFFACD",
    }

    return colorMap[colorName.toLowerCase()] || colorName
  }

  return (
    <div className="flex items-center gap-2">
      {colors.map((colorInfo) => {
        const isSelected = selectedVariantId === colorInfo.id
        const colorCode = getColorCode(colorInfo.value)

        return (
          <button
            key={colorInfo.id}
            type="button"
            onClick={(e) => {
              e.preventDefault()
              setSelectedVariantId(colorInfo.id)
            }}
            className={clx(
              "w-10 h-6 rounded-full border-2 transition-all overflow-hidden",
              isSelected
                ? "border-blue-600 scale-110"
                : "border-gray-300 hover:border-gray-400"
            )}
            style={{
              backgroundColor: colorInfo.image ? "transparent" : colorCode,
            }}
            aria-label={`Select ${colorInfo.value} variant`}
          >
            {colorInfo.image && (
              <img
                src={colorInfo.image}
                alt={colorInfo.value}
                className="w-full h-full object-cover"
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
