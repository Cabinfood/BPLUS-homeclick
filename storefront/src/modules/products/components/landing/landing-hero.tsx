"use client"

import React, { useState, useEffect } from "react"
import { ChevronUp } from "lucide-react"
import { Button } from "@medusajs/ui"
import { Skeleton } from "@modules/common/components/skeleton"
import Image from "next/image"

import { LandingHeroProps } from "./types"
import { processCTAs, handleCTAClick } from "./utils"

export default function LandingHero({
  title,
  description,
  videoUrl,
  imageUrl,
  ctaButtons = [],
  ctaText = "Explore Now", // Deprecated
  ctaHref = "#products", // Deprecated
  isLoading = false
}: LandingHeroProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  // Auto-play video when component mounts
  useEffect(() => {
    if (videoUrl && !isLoading) {
      setIsVideoLoaded(true)
    }
  }, [videoUrl, isLoading])

  // Handle image load
  useEffect(() => {
    if (imageUrl && !isLoading) {
      setIsImageLoaded(true)
    }
  }, [imageUrl, isLoading])

  // Process CTA buttons - support both new and deprecated props
  const processedCTAs = React.useMemo(() => {
    return processCTAs(ctaButtons, ctaText, ctaHref)
  }, [ctaButtons, ctaText, ctaHref])

  if (isLoading) {
    return (
      <section className="overflow-hidden relative w-full h-screen">
        {/* Background Skeleton */}
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        
        {/* Content Skeleton */}
        <div className="flex relative z-10 justify-center items-center h-full">
          <div className="px-4 space-y-6 max-w-4xl text-center">
            <Skeleton className="mx-auto w-3/4 h-16" />
            <Skeleton className="mx-auto w-1/2 h-6" />
            <div className="flex flex-col gap-4 justify-center items-center sm:flex-row">
              <Skeleton className="w-48 h-12" />
              <Skeleton className="w-48 h-12" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="overflow-hidden relative w-full h-screen">
      {/* Background Video/Image */}
      <div className="absolute inset-0">
        {videoUrl && isVideoLoaded ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="object-cover w-full h-full"
            onLoadedData={() => setIsVideoLoaded(true)}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : imageUrl && isImageLoaded ? (
          <Image
            src={imageUrl}
            alt={title || "Hero background"}
            fill
            className="object-cover w-full h-full"
            onLoad={() => setIsImageLoaded(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="flex relative z-10 justify-center items-start pt-20 h-full">
        <div className="px-4 space-y-8 max-w-4xl text-center">
          {/* Title */}
          {title ? (
            <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
              {title}
            </h1>
          ) : (
            <Skeleton className="mx-auto w-3/4 h-16 bg-white/20" />
          )}

          {/* Description */}
          {description ? (
            <p className="mx-auto max-w-2xl text-xl leading-relaxed md:text-lg text-white/90">
              {description}
            </p>
          ) : (
            <Skeleton className="mx-auto w-1/2 h-6 bg-white/20" />
          )}

          {/* CTA Buttons */}
          {processedCTAs.length > 0 ? (
            <div className="pt-4">
              <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center ${
                processedCTAs.length > 2 ? 'flex-wrap' : ''
              }`}>
                {processedCTAs.map((cta, index) => (
                  <Button
                    key={index}
                    size="large"
                    variant={cta.variant || "secondary"}
                    onClick={() => handleCTAClick(cta.href)}
                    className="min-w-[200px] transition-all duration-300 hover:scale-105"
                  >
                    {cta.icon && <span className="mr-2">{cta.icon}</span>}
                    {cta.text}
                    {!cta.icon && <ChevronUp className="ml-2 w-5 h-5 rotate-45" />}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <Skeleton className="mx-auto w-48 h-12 bg-white/20" />
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 transform -translate-x-1/2">
        <div className="flex flex-col items-center space-y-2 text-white/70">
          <span className="text-sm">Scroll to explore</span>
          <ChevronUp className="w-6 h-6 animate-bounce" />
        </div>
      </div>
    </section>
  )
}
