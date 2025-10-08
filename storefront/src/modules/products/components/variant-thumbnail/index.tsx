"use client"

import { useState, useEffect, useRef } from "react"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { clx } from "@medusajs/ui"

type VariantImage = {
  url: string
}

type VariantThumbnailProps = {
  product: HttpTypes.StoreProduct
  size?: "small" | "medium" | "large" | "square"
  isFeatured?: boolean
  className?: string
}

export default function VariantThumbnail({
  product,
  size = "square",
  isFeatured,
  className
}: VariantThumbnailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  
  // Get all available images from variants and product
  const getAllImages = () => {
    const images: string[] = []
    
    // Add product thumbnail if available
    if (product.thumbnail) {
      images.push(product.thumbnail)
    }
    
    // Add product images
    if (product.images) {
      product.images.forEach(img => {
        if (img.url && !images.includes(img.url)) {
          images.push(img.url)
        }
      })
    }
    
    // Add variant images
    if (product.variants) {
      product.variants.forEach(variant => {
        if (variant.metadata?.thumbnail) {
          const thumbnail = variant.metadata.thumbnail as string
          if (!images.includes(thumbnail)) {
            images.push(thumbnail)
          }
        }
        
        if (variant.metadata?.images) {
          const variantImages = variant.metadata.images as VariantImage[]
          variantImages.forEach(img => {
            if (img.url && !images.includes(img.url)) {
              images.push(img.url)
            }
          })
        }
      })
    }
    
    return images
  }

  const allImages = getAllImages()
  const currentImage = allImages[currentImageIndex] || product.thumbnail

  // Auto-cycle images when hovering
  useEffect(() => {
    if (isHovering && allImages.length > 1) {
      intervalRef.current = setInterval(() => {
        setIsImageLoaded(false)
        setTimeout(() => {
          setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
          setIsImageLoaded(true)
        }, 150) // Short delay for fade out
      }, 1500) // Change image every 1.5 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isHovering, allImages.length])

  const handleMouseEnter = () => {
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    // Reset to first image with fade effect
    setIsImageLoaded(false)
    setTimeout(() => {
      setCurrentImageIndex(0)
      setIsImageLoaded(true)
    }, 150)
  }

  const handleDotHover = (index: number) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setIsImageLoaded(false)
    setTimeout(() => {
      setCurrentImageIndex(index)
      setIsImageLoaded(true)
    }, 150)
  }

  const sizeClasses = {
    small: "aspect-[29/34]",
    medium: "aspect-[29/34]",
    large: "aspect-[29/34]",
    square: "aspect-square",
  }

  return (
    <div 
      className={clx(
        "relative w-full overflow-hidden bg-ui-bg-subtle",
        sizeClasses[size],
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {currentImage ? (
        <Image
          src={currentImage}
          alt={product.title || "Product image"}
          fill
          className={clx(
            "absolute inset-0 object-cover object-center transition-opacity duration-300",
            isImageLoaded ? "opacity-100" : "opacity-0"
          )}
          sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
          style={{
            objectFit: "cover",
          }}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-100">
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <svg
              className="h-16 w-16 text-gray-300"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
            </svg>
          </div>
        </div>
      )}
      
      {/* Image indicator dots */}
      {allImages.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
          {allImages.map((_, index) => (
            <button
              key={index}
              type="button"
              className={clx(
                "w-1.5 h-1.5 rounded-full transition-all cursor-pointer hover:scale-125",
                index === currentImageIndex 
                  ? "bg-white" 
                  : "bg-white/50 hover:bg-white/75"
              )}
              onMouseEnter={() => handleDotHover(index)}
              aria-label={`View image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
