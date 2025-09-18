"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { HttpTypes } from "@medusajs/types"
import { isEqual } from "lodash"

type ProductVariantContextType = {
  selectedVariant: HttpTypes.StoreProductVariant | undefined
  options: Record<string, string | undefined>
  setOptionValue: (title: string, value: string) => void
  setSelectedVariant: (variant: HttpTypes.StoreProductVariant | undefined) => void
}

const ProductVariantContext = createContext<ProductVariantContextType | undefined>(undefined)

const optionsAsKeymap = (variantOptions: any) => {
  return variantOptions?.reduce((acc: Record<string, string | undefined>, varopt: any) => {
    if (varopt.option && varopt.value !== null && varopt.value !== undefined) {
      acc[varopt.option.title] = varopt.value
    }
    return acc
  }, {})
}

type ProductVariantProviderProps = {
  product: HttpTypes.StoreProduct
  children: ReactNode
}

export function ProductVariantProvider({ product, children }: ProductVariantProviderProps) {
  const [selectedVariant, setSelectedVariant] = useState<HttpTypes.StoreProductVariant | undefined>()
  const [options, setOptions] = useState<Record<string, string | undefined>>({})

  // If there is only 1 variant, preselect it
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variant = product.variants[0]
      const variantOptions = optionsAsKeymap(variant.options)
      setOptions(variantOptions ?? {})
      setSelectedVariant(variant)
    }
  }, [product.variants])

  // Update selected variant when options change
  useEffect(() => {
    if (!product.variants || product.variants.length === 0) {
      setSelectedVariant(undefined)
      return
    }

    const variant = product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })

    setSelectedVariant(variant)
  }, [product.variants, options])

  const setOptionValue = (title: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [title]: value,
    }))
  }

  const contextValue: ProductVariantContextType = {
    selectedVariant,
    options,
    setOptionValue,
    setSelectedVariant,
  }

  return (
    <ProductVariantContext.Provider value={contextValue}>
      {children}
    </ProductVariantContext.Provider>
  )
}

export function useProductVariant() {
  const context = useContext(ProductVariantContext)
  if (context === undefined) {
    throw new Error('useProductVariant must be used within a ProductVariantProvider')
  }
  return context
}
