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

type StickyAddToCartProps = {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
  options: Record<string, string | undefined>
  updateOptions: (title: string, value: string) => void
  inStock?: boolean
  handleAddToCart: () => void
  isAdding?: boolean
  show: boolean
}

const StickyAddToCart: React.FC<StickyAddToCartProps> = ({
  product,
  variant,
  options,
  updateOptions,
  inStock,
  handleAddToCart,
  isAdding,
  show,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const { state, open, close } = useToggleState()

  useEffect(() => {
    setIsVisible(show)
  }, [show])

  const price = getProductPrice({
    product: product,
    variantId: variant?.id,
  })

  const selectedPrice = price?.variantPrice || price?.cheapestPrice || null

  return (
    <div
      className={clx(
        "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg transition-transform duration-300 z-50",
        {
          "translate-y-0": isVisible,
          "translate-y-full": !isVisible,
        }
      )}
      data-testid="sticky-add-to-cart"
    >
      <div className="content-container">
        <div className="flex items-center justify-between py-4 gap-4">
          {/* Product Info & Price Section */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <div className="text-sm text-ui-fg-muted lg:text-base">
                {product.title}
              </div>
              {selectedPrice ? (
                <div className="flex items-center gap-2">
                  <span className="text-xl font-semibold text-ui-fg-base lg:text-2xl">
                    {selectedPrice.calculated_price}
                  </span>
                  {selectedPrice.price_type === "sale" && (
                    <span className="text-sm line-through text-ui-fg-muted lg:text-base">
                      {selectedPrice.original_price}
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-xl font-semibold text-ui-fg-base lg:text-2xl">
                  Price unavailable
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 lg:gap-3">
            {(product.variants?.length ?? 0) > 1 && (
              <Button
                onClick={open}
                variant="secondary"
                className="min-w-[100px] h-12 lg:min-w-[120px] lg:h-14"
                data-testid="select-options-button"
              >
                <div className="flex items-center justify-between w-full gap-2">
                  <span className="text-sm lg:text-base">
                    {variant ? "Change" : "Select"}
                  </span>
                  <ChevronDown size={16} />
                </div>
              </Button>
            )}
            
            <Button
              onClick={handleAddToCart}
              disabled={!inStock || !variant || isAdding}
              variant="primary"
              className="min-w-[120px] h-12 text-base font-medium lg:min-w-[160px] lg:h-14 lg:text-lg"
              isLoading={isAdding}
              data-testid="sticky-add-to-cart-button"
            >
              {!variant
                ? "Select Option"
                : !inStock
                ? "Out of Stock"
                : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>

      {/* Options Selection Modal */}
      <Transition appear show={state} as={Fragment}>
        <Dialog as="div" className="relative z-[75]" onClose={close}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-700 bg-opacity-75 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed bottom-0 inset-x-0">
            <div className="flex min-h-full h-full items-center justify-center text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-full"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-full"
              >
                <Dialog.Panel
                  className="w-full h-full transform overflow-hidden text-left flex flex-col gap-y-3"
                  data-testid="options-modal"
                >
                  <div className="w-full flex justify-end pr-6">
                    <button
                      onClick={close}
                      className="bg-white w-12 h-12 rounded-full text-ui-fg-base flex justify-center items-center shadow-lg"
                      data-testid="close-modal-button"
                    >
                      <X />
                    </button>
                  </div>
                  <div className="bg-white px-6 py-8 rounded-t-2xl">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-ui-fg-base">
                        Select Options
                      </h3>
                      <p className="text-sm text-ui-fg-muted mt-1">
                        {product.title}
                      </p>
                    </div>
                    
                    {(product.variants?.length ?? 0) > 1 && (
                      <div className="flex flex-col gap-y-6">
                        {(product.options || []).map((option) => {
                          return (
                            <div key={option.id}>
                              <OptionSelect
                                option={option}
                                current={options[option.title ?? ""]}
                                updateOption={updateOptions}
                                title={option.title ?? ""}
                                disabled={!!isAdding}
                              />
                            </div>
                          )
                        })}
                      </div>
                    )}
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

export default StickyAddToCart
