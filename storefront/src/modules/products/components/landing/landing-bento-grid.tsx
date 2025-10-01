"use client"

import { useState } from "react"
import { ChevronUp } from "lucide-react"
import { Button } from "@medusajs/ui"
import { Skeleton } from "@modules/common/components/skeleton"
import Image from "next/image"

import { LandingBentoGridProps, GRID_SIZES } from "./types"
import type { GridSize } from "./types"
import { handleCTAClick, getDefaultGridSize } from "./utils"

export default function LandingBentoGrid({
  title,
  description,
  items = [],
  moreText = "View More",
  moreHref = "#",
  isLoading = false
}: LandingBentoGridProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  // Typography by grid size
  const TITLE_CLASSES: Record<GridSize, string> = {
    small: "text-lg md:text-xl",
    medium: "text-xl md:text-2xl",
    large: "text-2xl md:text-3xl"
  }
  const DESC_CLASSES: Record<GridSize, string> = {
    small: "text-xs md:text-sm",
    medium: "text-sm md:text-base",
    large: "text-base md:text-lg"
  }

  if (isLoading) {
    return (
      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          {/* Title Skeleton */}
          <div className="mb-16 text-center">
            <Skeleton className="mx-auto mb-4 w-1/3 h-12" />
            <Skeleton className="mx-auto w-1/2 h-6" />
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 h-[600px]">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className={`bg-gray-200 rounded-2xl animate-pulse ${
                  index === 0 ? "md:col-span-2 md:row-span-2" : 
                  index === 1 ? "md:col-span-2" : 
                  "col-span-1"
                }`}
              />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!items || items.length === 0) {
    return (
      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900">
            {title || "Featured Products"}
          </h2>
          <p className="mb-8 text-gray-600">{description || "No items available at the moment."}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="px-4 py-20" id="products">
      <div className="mx-auto max-w-7xl">
        {/* Title */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            {title || "Featured Products"}
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            {description || "Discover our carefully curated collection of premium products"}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[600px]">
          {items.slice(0, 6).map((item, index) => {
            const size = item.size || getDefaultGridSize(index)
            const isHovered = hoveredItem === item.id
            const titleSizeClass = TITLE_CLASSES[size]
            const descSizeClass = DESC_CLASSES[size]

            return (
              <div
                key={item.id}
                className={`group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer ${GRID_SIZES[size]}`}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => {
                  if (item.href) {
                    handleCTAClick(item.href)
                  }
                }}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 transition-colors duration-300 bg-black/20 group-hover:bg-black/30" />
                </div>

                {/* Content */}
                <div className="flex relative z-10 flex-col justify-between p-2 h-full lg:p-6">
                 <div className="flex flex-col gap-2">
                   {/* Title */}
                   <h3 className={`mb-2 font-bold text-white transition-colors duration-300 group-hover:text-white/90 ${titleSizeClass}`}>
                    {item.title}
                  </h3>

                  {/* Description */}
                  {item.description && (
                    <p className={`mb-4 transition-colors duration-300 text-white/80 line-clamp-2 group-hover:text-white/90 ${descSizeClass}`}>
                      {item.description}
                    </p>
                  )}
                 </div>

                  {/* More Button */}
                  <div className="flex justify-end">
                    <Button
                      size="small"
                      variant="transparent"
                      className="text-white transition-all duration-300 hover:text-white hover:bg-white/20"
                    >
                      {moreText}
                      <ChevronUp className="ml-1 w-4 h-4 rotate-45" />
                    </Button>
                  </div>
                </div>

                {/* Hover Effect */}
                {isHovered && (
                  <div className="absolute inset-0 rounded-2xl border-2 transition-all duration-300 border-white/50" />
                )}
              </div>
            )
          })}
        </div>

        {/* View More Button */}
        {items.length > 6 && (
          <div className="mt-12 text-center">
            <Button
              size="large"
              variant="transparent"
              className="px-8 py-4 font-semibold rounded-full transition-all duration-300 hover:scale-105"
              onClick={() => handleCTAClick(moreHref)}
            >
              View All Products
              <ChevronUp className="ml-2 w-5 h-5 rotate-45" />
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
