"use client"

import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Image from "next/image"
import { useState, useEffect, Suspense, lazy } from "react"
import { ChevronLeft, ChevronRight } from "@medusajs/icons"
import { ImageIcon, Youtube, Rotate3d } from "lucide-react"
import { useProductVariant } from "../product-variant-provider"
import { VariantImage } from "types/global"

// Lazy load 3D viewer to reduce initial bundle size and memory
const Model3dViewer = lazy(() => import("./model-3d-viewer"))

type VariantImageGalleryProps = {
  product: HttpTypes.StoreProduct
}

type TabType = "photos" | "video" | "3d"

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
    { id: "photos" as TabType, label: "Photos", icon: <ImageIcon className="w-4 h-4" /> },
    { id: "video" as TabType, label: "Video", icon: <Youtube className="w-4 h-4" /> },
    { id: "3d" as TabType, label: "3D Viewer", icon: <Rotate3d className="w-4 h-4" /> },
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
            <div className="flex justify-center items-center h-full text-ui-fg-muted">
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
          <div className="flex justify-center items-center h-full bg-gray-100 rounded-lg">
            <div className="text-center">
              <Youtube className="mx-auto mb-4 w-16 h-16 text-gray-400" />
              <p className="text-ui-fg-muted">Video content coming soon</p>
            </div>
          </div>
        )
      case "3d":
        const modelUrl = product?.metadata?.model_url as string | undefined
        
        // Only render 3D viewer when tab is active to save memory
        return (
          <Suspense fallback={
            <div className="flex justify-center items-center h-full">
              <div className="text-center">
                <div className="mx-auto mb-2 w-8 h-8 rounded-full border-2 border-gray-300 animate-spin border-t-transparent" />
                <p className="text-sm text-gray-600">Loading 3D viewer...</p>
              </div>
            </div>
          }>
            <Model3dViewer 
              modelUrl={modelUrl}
              className="h-full"
              fallbackMessage="No 3D model available for this variant"
            />
          </Suspense>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col w-full">
      {/* Main carousel container */}
      <div className="relative aspect-[4/3] w-full mb-6">
        <Container className="overflow-hidden relative p-0 w-full h-full bg-ui-bg-subtle group">
          {renderContent()}
          
          {/* Navigation arrows - only show for photos */}
          {activeTab === "photos" && currentImages.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="flex absolute left-4 top-1/2 z-10 justify-center items-center w-10 h-10 rounded-full shadow-md transition-all duration-200 -translate-y-1/2 bg-white/80 hover:bg-white"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4 text-gray-700" />
              </button>
              <button
                onClick={handleNext}
                className="flex absolute right-4 top-1/2 z-10 justify-center items-center w-10 h-10 rounded-full shadow-md transition-all duration-200 -translate-y-1/2 bg-white/80 hover:bg-white"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4 text-gray-700" />
              </button>
            </>
          )}

          {/* Thumbnail navigation inside main carousel container */}
          {activeTab === "photos" && currentImages.length > 1 && (
            <div className="absolute bottom-2 left-1/2 z-10 -translate-x-1/2 pointer-events-none">
              <div className="flex overflow-x-auto gap-2 justify-center items-center p-2 w-auto max-w-full transition-all duration-300 ease-out pointer-events-auto group-hover:w-full">
                {currentImages.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-12 h-12 lg:w-4 lg:h-4 rounded-lg overflow-hidden border transition-all duration-300 ease-out ${
                      index === currentImageIndex
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-white/50 hover:border-white/80 opacity-80"
                    } group-hover:w-12 group-hover:h-12`}
                    aria-label={`Go to image ${index + 1}`}
                  >
                    <Image
                      src={image.url || ""}
                      alt={`Thumbnail ${index + 1}`}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full transition-transform duration-300 ease-out group-hover:scale-100"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </Container>
      </div>

      {/* Tab navigation */}
      <div className="flex justify-center">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-gray-900 text-white shadow-md"
                  : "bg-transparent text-gray-700 hover:text-gray-900"
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
