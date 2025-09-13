"use client"

import { useState, useEffect } from "react"
import { Heading } from "@medusajs/ui"
import { ArrowUpRightMini } from "@medusajs/icons"

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Hero slides data
  const slides = [
    {
      id: 1,
      title: "Bulge Chair",
      description: "A comfy icon for modern living",
      image: "https://framerusercontent.com/images/iP2hGeIy4wXxwMkaGu1ENyBAyA.jpg",
      cta: "Discover Bulge"
    },
    {
      id: 2,
      title: "Premium Sofa",
      description: "Handcrafted comfort meets elegant design",
      image: "https://framerusercontent.com/images/VDP9zXi2g5ccoo20Yd1jkm75SM.jpg",
      cta: "Explore Collection"
    },
    {
      id: 3,
      title: "Modern Table",
      description: "Minimalist design for contemporary spaces",
      image: "https://framerusercontent.com/images/SYCrJOiCVzKJAYtRQjYhkndBhc.jpg",
      cta: "View Details"
    }
  ]

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <div className="w-full py-8 px-4">
      <div className="content-container mx-auto">
        <div className="relative h-[75vh] w-full overflow-hidden rounded-3xl shadow-2xl">
          {/* Slides */}
          <div className="relative h-full w-full">
            {slides.map((slide, index) => (
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
                {slides[currentSlide].title}
              </Heading>
              <p className="text-sm md:text-base mb-4 text-white opacity-90">
                {slides[currentSlide].description}
              </p>
              <button className="group inline-flex items-center text-white text-sm font-medium hover:underline transition-all duration-200">
                <span>{slides[currentSlide].cta}</span>
                <ArrowUpRightMini 
                  className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
                />
              </button>
            </div>
            
            {/* Vertical Navigation Dots */}
            <div className="flex flex-col space-y-4">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentSlide
                      ? 'bg-white'
                      : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
