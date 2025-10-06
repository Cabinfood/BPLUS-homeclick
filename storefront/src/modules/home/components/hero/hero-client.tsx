"use client"

import { useState, useEffect } from "react"
import { Heading } from "@medusajs/ui"
import { ArrowUpRightMini } from "@medusajs/icons"
import { HeroSlide } from "@lib/data/hero-slide"
import Link from "next/link"

type HeroClientProps = {
  slides: HeroSlide[]
}

const HeroClient = ({ slides }: HeroClientProps) => {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Fallback to empty array if no slides
  const displaySlides = slides.length > 0 ? slides : []

  // Auto-slide functionality
  useEffect(() => {
    if (displaySlides.length === 0) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % displaySlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [displaySlides.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  // Show nothing if no slides
  if (displaySlides.length === 0) {
    return null
  }

  const currentSlideData = displaySlides[currentSlide]

  return (
    <div className="w-full py-8 px-4">
      <div className="content-container mx-auto">
        <div className="relative h-[75vh] w-full overflow-hidden rounded-3xl shadow-2xl">
          {/* Slides */}
          <div className="relative h-full w-full">
            {displaySlides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-3xl"
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-40 rounded-3xl" />
                </div>
              </div>
            ))}
          </div>

          {/* Text and Navigation Dots - Right Side */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex items-center">
            {/* Text Content */}
            <div className="text-right text-white mr-6">
              <Heading
                level="h1"
                className="text-2xl md:text-3xl font-bold mb-2 text-white"
              >
                {currentSlideData.title}
              </Heading>
              {currentSlideData.description && (
                <p className="text-sm md:text-base mb-4 text-white opacity-90">
                  {currentSlideData.description}
                </p>
              )}
              {currentSlideData.link && currentSlideData.cta_text && (
                <Link
                  href={currentSlideData.link}
                  className="group inline-flex items-center text-white text-sm font-medium hover:underline transition-all duration-200"
                >
                  <span>{currentSlideData.cta_text}</span>
                  <ArrowUpRightMini
                    className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  />
                </Link>
              )}
            </div>

            {/* Vertical Navigation Dots */}
            <div className="flex flex-col space-y-4">
              {displaySlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentSlide
                      ? 'bg-white'
                      : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroClient
