"use client"

import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Image from "next/image"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "@medusajs/icons"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
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

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("photos")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const tabs = [
    { id: "photos" as TabType, label: "Photos", icon: null },
    { id: "video" as TabType, label: "Intro", icon: <PlayIcon className="w-4 h-4" /> },
    { id: "3d" as TabType, label: "3D", icon: <BoxIcon className="w-4 h-4" /> },
  ]

  const handlePrevious = () => {
    if (activeTab === "photos" && images.length > 0) {
      setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }
  }

  const handleNext = () => {
    if (activeTab === "photos" && images.length > 0) {
      setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case "photos":
        if (images.length === 0) {
          return (
            <div className="flex justify-center items-center h-full text-ui-fg-muted">
              No images available
            </div>
          )
        }
        return (
          <div className="relative w-full h-full">
            <Image
              src={images[currentImageIndex]?.url || ""}
              alt={`Product image ${currentImageIndex + 1}`}
              fill
              className="object-cover rounded-lg"
              priority={currentImageIndex === 0}
              quality={60}
              sizes="(max-width: 576px) 100vw, (max-width: 768px) 80vw, (max-width: 992px) 60vw, 50vw"
            />
          </div>
        )
      case "video":
        return (
          <div className="flex justify-center items-center h-full bg-gray-100 rounded-lg">
            <div className="text-center">
              <PlayIcon className="mx-auto mb-4 w-16 h-16 text-gray-400" />
              <p className="text-ui-fg-muted">Video content coming soon</p>
            </div>
          </div>
        )
      case "3d":
        return (
          <div className="flex justify-center items-center h-full bg-gray-100 rounded-lg">
            <div className="text-center">
              <BoxIcon className="mx-auto mb-4 w-16 h-16 text-gray-400" />
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
        <Container className="overflow-hidden relative w-full h-full bg-ui-bg-subtle">
          {renderContent()}
          
          {/* Navigation arrows - only show for photos */}
          {activeTab === "photos" && images.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="flex absolute left-4 top-1/2 z-10 justify-center items-center w-10 h-10 rounded-full shadow-md transition-all duration-200 -translate-y-1/2 bg-white/80 hover:bg-white"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={handleNext}
                className="flex absolute right-4 top-1/2 z-10 justify-center items-center w-10 h-10 rounded-full shadow-md transition-all duration-200 -translate-y-1/2 bg-white/80 hover:bg-white"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </>
          )}
        </Container>
      </div>

      {/* Thumbnail navigation - only show for photos */}
      {activeTab === "photos" && images.length > 1 && (
        <div className="flex overflow-x-auto gap-2 pb-2 mb-6">
          {images.map((image, index) => (
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
                quality={40}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}

      {/* Tab navigation */}
      <div className="flex justify-center">
        <div className="flex p-1 rounded-full backdrop-blur-sm bg-black/80">
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

export default ImageGallery
