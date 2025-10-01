// Landing component utility functions

import { CTAButton } from "./types"

/**
 * Process CTA buttons - support both new and deprecated props
 */
export const processCTAs = (
  ctaButtons?: CTAButton[],
  ctaText?: string,
  ctaHref?: string
): CTAButton[] => {
  if (ctaButtons && ctaButtons.length > 0) {
    return ctaButtons
  }
  
  // Backward compatibility with deprecated props
  if (ctaText && ctaHref) {
    return [{
      text: ctaText,
      href: ctaHref,
      variant: "primary" as const
    }]
  }
  
  return []
}

/**
 * Handle CTA button click - support both hash links and external URLs
 */
export const handleCTAClick = (href: string) => {
  if (href.startsWith('#')) {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  } else {
    window.location.href = href
  }
}

/**
 * Get default grid size based on index
 */
export const getDefaultGridSize = (index: number): "small" | "medium" | "large" => {
  if (index === 0) return "large"
  if (index === 1) return "medium"
  return "small"
}
