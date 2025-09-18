"use client"

import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Image from "next/image"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "@medusajs/icons"
import { useProductVariant } from "../product-variant-provider"

type VariantImage = {
  url: string
}

type VariantImageGalleryProps = {
  product: HttpTypes.StoreProduct
}

type TabType = "photos" | "video" | "3d"

// Custom SVG icons
const PlayIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z"/>
  </svg>
)

const BoxIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
  </svg>
)

const VariantImageGallery = ({ product }: VariantImageGalleryProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("photos")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [currentImages, setCurrentImages] = useState<HttpTypes.StoreProductImage[]>([])
  
  // Get selected variant from context
  const { selectedVariant } = useProductVariant()

  // Update images when selected variant changes
  useEffect(() => {
    let imagesToShow: HttpTypes.StoreProductImage[] = []

    if (selectedVariant?.metadata) {
      const variantImages = selectedVariant.metadata.images as VariantImage[] | undefined
      const variantThumbnail = selectedVariant.metadata.thumbnail as string | undefined

      // Add variant thumbnail first if available
      if (variantThumbnail) {
        imagesToShow.push({
          id: `variant-thumbnail-${selectedVariant.id}`,
          url: variantThumbnail,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          deleted_at: null,
          metadata: null,
          rank: 0
        })
      }

      // Add variant images
      if (variantImages && variantImages.length > 0) {
        variantImages.forEach((img, index) => {
          imagesToShow.push({
            id: `variant-image-${selectedVariant.id}-${index}`,
            url: img.url,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            deleted_at: null,
            metadata: null,
            rank: index + 1
          })
        })
      }
    }

    // If no variant images, fall back to product images
    if (imagesToShow.length === 0 && product.images) {
      imagesToShow = product.images
    }

    // If still no images and product has thumbnail, use that
    if (imagesToShow.length === 0 && product.thumbnail) {
      imagesToShow.push({
        id: `product-thumbnail-${product.id}`,
        url: product.thumbnail,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null,
        metadata: null,
        rank: 0
      })
    }

    setCurrentImages(imagesToShow)
    setCurrentImageIndex(0) // Reset to first image when variant changes
  }, [selectedVariant, product])

  const tabs = [
    { id: "photos" as TabType, label: "Photos", icon: null },
    { id: "video" as TabType, label: "Intro", icon: <PlayIcon className="w-4 h-4" /> },
    { id: "3d" as TabType, label: "3D", icon: <BoxIcon className="w-4 h-4" /> },
  ]

  const handlePrevious = () => {
    if (activeTab === "photos" && currentImages.length > 0) {
      setCurrentImageIndex((prev) => (prev === 0 ? currentImages.length - 1 : prev - 1))
    }
  }

  const handleNext = () => {
    if (activeTab === "photos" && currentImages.length > 0) {
      setCurrentImageIndex((prev) => (prev === currentImages.length - 1 ? 0 : prev + 1))
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case "photos":
        if (currentImages.length === 0) {
          return (
            <div className="flex items-center justify-center h-full text-ui-fg-muted">
              No images available
            </div>
          )
        }
        return (
          <div className="relative w-full h-full">
            <Image
              src={currentImages[currentImageIndex]?.url || ""}
              alt={`Product image ${currentImageIndex + 1}`}
              fill
              className="object-cover rounded-lg"
              priority={currentImageIndex <= 2}
              sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
            />
          </div>
        )
      case "video":
        return (
          <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
            <div className="text-center">
              <PlayIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-ui-fg-muted">Video content coming soon</p>
            </div>
          </div>
        )
      case "3d":
        return (
          <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
            <div className="text-center">
              <BoxIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-ui-fg-muted">3D view coming soon</p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col w-full">
      {/* Main carousel container */}
      <div className="relative aspect-[4/3] w-full mb-6">
        <Container className="relative w-full h-full overflow-hidden bg-ui-bg-subtle">
          {renderContent()}
          
          {/* Navigation arrows - only show for photos */}
          {activeTab === "photos" && currentImages.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all duration-200 z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all duration-200 z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </>
          )}
        </Container>
      </div>

      {/* Thumbnail navigation - only show for photos */}
      {activeTab === "photos" && currentImages.length > 1 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {currentImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setCurrentImageIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === currentImageIndex
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Image
                src={image.url || ""}
                alt={`Thumbnail ${index + 1}`}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Tab navigation */}
      <div className="flex justify-center">
        <div className="flex bg-black/80 rounded-full p-1 backdrop-blur-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-white text-black shadow-sm"
                  : "text-white hover:text-gray-200"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default VariantImageGallery
