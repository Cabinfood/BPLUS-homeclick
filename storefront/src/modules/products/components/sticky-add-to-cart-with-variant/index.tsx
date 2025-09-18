"use client"

import { Button, clx } from "@medusajs/ui"
import { useEffect, useState, Fragment } from "react"
import { HttpTypes } from "@medusajs/types"
import { getProductPrice } from "@lib/util/get-product-price"
import { Dialog, Transition } from "@headlessui/react"
import useToggleState from "@lib/hooks/use-toggle-state"
import ChevronDown from "@modules/common/icons/chevron-down"
import X from "@modules/common/icons/x"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { useProductVariant } from "../product-variant-provider"

type StickyAddToCartWithVariantProps = {
  product: HttpTypes.StoreProduct
  inStock?: boolean
  handleAddToCart: () => void
  isAdding?: boolean
  show: boolean
}

const StickyAddToCartWithVariant: React.FC<StickyAddToCartWithVariantProps> = ({
  product,
  inStock,
  handleAddToCart,
  isAdding,
  show,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const { state, open, close } = useToggleState()
  
  // Use the shared variant context
  const { selectedVariant, options, setOptionValue } = useProductVariant()

  useEffect(() => {
    setIsVisible(show)
  }, [show])

  const price = getProductPrice({
    product: product,
    variantId: selectedVariant?.id,
  })

  const selectedPrice = price?.variantPrice || price?.cheapestPrice || null

  return (
    <div
      className={clx(
        "fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg transition-transform duration-300 ease-in-out",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Product Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {product.thumbnail && (
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={product.thumbnail}
                  alt={product.title || "Product"}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {product.title}
              </h3>
              {selectedPrice && (
                <p className="text-sm text-gray-600">
                  {selectedPrice.calculated_price}
                </p>
              )}
            </div>
          </div>

          {/* Variant Options Button */}
          {(product.variants?.length ?? 0) > 1 && (
            <Button
              variant="secondary"
              size="small"
              onClick={open}
              className="flex-shrink-0"
            >
              Options
              <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
          )}

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={!inStock || !selectedVariant || isAdding}
            variant="primary"
            size="small"
            isLoading={isAdding}
            className="flex-shrink-0 min-w-[100px]"
          >
            {!selectedVariant
              ? "Select"
              : !inStock
              ? "Out of stock"
              : "Add to cart"}
          </Button>
        </div>
      </div>

      {/* Options Modal */}
      <Transition appear show={state} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={close}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                  <div className="absolute top-0 right-0 pt-4 pr-4">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                      onClick={close}
                    >
                      <span className="sr-only">Close</span>
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900 mb-4"
                      >
                        Select Options
                      </Dialog.Title>
                      
                      <div className="space-y-4">
                        {(product.options || []).map((option) => (
                          <div key={option.id}>
                            <OptionSelect
                              option={option}
                              current={options[option.title ?? ""]}
                              updateOption={setOptionValue}
                              title={option.title ?? ""}
                              disabled={!!isAdding}
                            />
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6">
                        <Button
                          onClick={() => {
                            handleAddToCart()
                            close()
                          }}
                          disabled={!inStock || !selectedVariant || !!isAdding}
                          variant="primary"
                          className="w-full"
                          isLoading={isAdding}
                        >
                          {!selectedVariant
                            ? "Select variant"
                            : !inStock
                            ? "Out of stock"
                            : "Add to cart"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}

export default StickyAddToCartWithVariant
