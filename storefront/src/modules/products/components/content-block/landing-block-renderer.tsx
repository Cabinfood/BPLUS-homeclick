"use client"

import React from "react"
import { ContentBlock, HeroBlockData, BentoGridBlockData, FeaturesBlockData, TestimonialsBlockData, CTABlockData } from "../../../../types/content-block"
import LandingHero from "../landing/landing-hero"
import LandingBentoGrid from "../landing/landing-bento-grid"

interface LandingBlockRendererProps {
  block: ContentBlock
  className?: string
}

const LandingBlockRenderer: React.FC<LandingBlockRendererProps> = ({ 
  block, 
  className = "" 
}) => {
  switch (block.block_type) {
    case 'hero':
      const heroData = block.block_data as HeroBlockData
      return (
        <LandingHero
          title={block.title || ""}
          description={block.description || ""}
          videoUrl={heroData.videoUrl}
          imageUrl={heroData.imageUrl}
          ctaButtons={heroData.ctaButtons}
          isLoading={false}
        />
      )

    case 'bento_grid':
      const bentoData = block.block_data as BentoGridBlockData
      return (
        <LandingBentoGrid
          title={block.title || ""}
          description={block.description || ""}
          items={bentoData.items}
          moreText={bentoData.moreText}
          moreHref={bentoData.moreHref}
          isLoading={false}
        />
      )

    case 'features':
      const featuresData = block.block_data as FeaturesBlockData
      return (
        <section className={`px-4 py-20 ${className}`}>
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-gray-900">
                {featuresData.title}
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              { Array.isArray(featuresData.features) && featuresData.features.map((feature, index) => (
                <div key={index} className="text-center">
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )

    case 'testimonials':
      const testimonialsData = block.block_data as TestimonialsBlockData
      return (
        <section className={`px-4 py-20 bg-gray-50 ${className}`}>
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-gray-900">
                {testimonialsData.title}
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {testimonialsData.testimonials.map((testimonial, index) => (
                <div key={index} className="p-6 bg-white rounded-lg shadow-md">
                  <div className="flex items-center mb-4">
                    {testimonial.avatar && (
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="mr-4 w-12 h-12 rounded-full"
                      />
                    )}
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="mb-4 text-gray-700">{testimonial.content}</p>
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )

    case 'cta':
      const ctaData = block.block_data as CTABlockData
      return (
        <section 
          className={`px-4 py-20 text-center ${className}`}
          style={ctaData.backgroundImage ? {
            backgroundImage: `url(${ctaData.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          } : {}}
        >
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-4 text-4xl font-bold text-white">
              {ctaData.title}
            </h2>
            {ctaData.description && (
              <p className="mb-8 text-xl text-white/90">
                {ctaData.description}
              </p>
            )}
            <div className="flex flex-col gap-4 justify-center sm:flex-row">
              {ctaData.buttons.map((button, index) => (
                <a
                  key={index}
                  href={button.href}
                  className={`px-8 py-4 font-semibold rounded-full transition-colors ${
                    button.variant === 'primary' 
                      ? 'bg-white text-black hover:bg-gray-100'
                      : 'bg-transparent border-2 border-white text-white hover:bg-white hover:text-black'
                  }`}
                >
                  {button.icon && <span className="mr-2">{button.icon}</span>}
                  {button.text}
                </a>
              ))}
            </div>
          </div>
        </section>
      )

    default:
      return null
  }
}

export default LandingBlockRenderer
