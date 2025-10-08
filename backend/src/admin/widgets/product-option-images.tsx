import { defineWidgetConfig } from "@medusajs/admin-sdk"
import {
  DetailWidgetProps,
  AdminProduct,
} from "@medusajs/framework/types"
import { Container, Heading, Button, Text, IconButton, Label } from "@medusajs/ui"
import { Trash, Photo } from "@medusajs/icons"
import { useState, useCallback, useRef } from "react"

type OptionValue = {
  id: string
  value: string
  option_id: string
  metadata?: Record<string, any> | null
}

type ProductOption = {
  id: string
  title: string
  values?: OptionValue[]
}

const ProductOptionImagesWidget = ({
  data: product,
}: DetailWidgetProps<AdminProduct>) => {
  const [uploadingOptionValueId, setUploadingOptionValueId] = useState<string | null>(null)
  const [status, setStatus] = useState<Record<string, "idle" | "uploading" | "saving" | "saved" | "error">>({})
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  // Get all options with values
  const options = (product.options || []) as ProductOption[]

  const handleFileSelect = useCallback(async (
    event: React.ChangeEvent<HTMLInputElement>,
    optionValue: OptionValue
  ) => {
    const file = event.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return

    try {
      setUploadingOptionValueId(optionValue.id)
      setStatus(prev => ({ ...prev, [optionValue.id]: "uploading" }))

      // Upload file using MedusaJS File Module
      const formData = new FormData()
      formData.append('files', file)

      const uploadResponse = await fetch('/admin/uploads', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.status}`)
      }

      const uploadResult = await uploadResponse.json()
      const uploadedFileUrl = uploadResult.files[0]?.url

      if (!uploadedFileUrl) {
        throw new Error('No file URL returned from upload')
      }

      setStatus(prev => ({ ...prev, [optionValue.id]: "saving" }))

      // Update option value metadata with image URL
      const nextMetadata = {
        ...(optionValue.metadata || {}),
        image: uploadedFileUrl
      }

      const updateResponse = await fetch(`/admin/products/${product.id}/options/${optionValue.option_id}/values/${optionValue.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ metadata: nextMetadata }),
      })

      if (!updateResponse.ok) {
        throw new Error(`Update failed: ${updateResponse.status}`)
      }

      setStatus(prev => ({ ...prev, [optionValue.id]: "saved" }))

      // Reset file input
      if (fileInputRefs.current[optionValue.id]) {
        fileInputRefs.current[optionValue.id]!.value = ''
      }

      // Reload page to show updated image
      setTimeout(() => {
        window.location.reload()
      }, 1000)

    } catch (error) {
      console.error("Error uploading image:", error)
      setStatus(prev => ({ ...prev, [optionValue.id]: "error" }))

      setTimeout(() => {
        setStatus(prev => ({ ...prev, [optionValue.id]: "idle" }))
      }, 3000)
    } finally {
      setUploadingOptionValueId(null)
    }
  }, [product.id])

  const handleRemoveImage = useCallback(async (optionValue: OptionValue) => {
    try {
      setStatus(prev => ({ ...prev, [optionValue.id]: "saving" }))

      // Remove image from metadata
      const nextMetadata = { ...(optionValue.metadata || {}) }
      delete nextMetadata.image

      const response = await fetch(`/admin/products/${product.id}/options/${optionValue.option_id}/values/${optionValue.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ metadata: nextMetadata }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setStatus(prev => ({ ...prev, [optionValue.id]: "saved" }))

      // Reset file input
      if (fileInputRefs.current[optionValue.id]) {
        fileInputRefs.current[optionValue.id]!.value = ''
      }

      // Reload page to show updated state
      setTimeout(() => {
        window.location.reload()
      }, 1000)

    } catch (error) {
      console.error("Error removing image:", error)
      setStatus(prev => ({ ...prev, [optionValue.id]: "error" }))
      setTimeout(() => {
        setStatus(prev => ({ ...prev, [optionValue.id]: "idle" }))
      }, 3000)
    }
  }, [product.id])

  const handleChooseFile = useCallback((optionValueId: string) => {
    fileInputRefs.current[optionValueId]?.click()
  }, [])

  if (options.length === 0) {
    return null
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Option Images</Heading>
      </div>

      <div className="px-6 py-4">
        <Text size="small" className="mb-4 text-gray-600">
          Upload images for product option values. These images will be displayed on the storefront.
        </Text>

        <div className="space-y-6">
          {options.map((option) => (
            <div key={option.id} className="border rounded-lg p-4">
              <Label className="mb-3 block font-semibold">
                {option.title}
              </Label>

              <div className="space-y-3">
                {(option.values || []).map((optionValue) => {
                  const imageUrl = (optionValue.metadata as any)?.image
                  const isProcessing = uploadingOptionValueId === optionValue.id
                  const currentStatus = status[optionValue.id] || "idle"

                  return (
                    <div
                      key={optionValue.id}
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded border"
                    >
                      {/* Option Value Name */}
                      <div className="flex-1">
                        <Text weight="plus">{optionValue.value}</Text>
                      </div>

                      {/* Image Preview */}
                      {imageUrl && (
                        <div className="relative">
                          <img
                            src={imageUrl}
                            alt={optionValue.value}
                            className="h-16 w-16 object-cover rounded border"
                          />
                          <IconButton
                            onClick={() => handleRemoveImage(optionValue)}
                            size="small"
                            disabled={isProcessing}
                            className="absolute -top-2 -right-2 bg-white shadow-md"
                          >
                            <Trash className="text-red-600" />
                          </IconButton>
                        </div>
                      )}

                      {/* Upload Button */}
                      {!imageUrl && (
                        <div className="flex items-center gap-2">
                          <input
                            ref={(el) => {
                              fileInputRefs.current[optionValue.id] = el
                            }}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileSelect(e, optionValue)}
                            className="hidden"
                          />
                          <Button
                            onClick={() => handleChooseFile(optionValue.id)}
                            variant="secondary"
                            size="small"
                            disabled={isProcessing}
                            isLoading={isProcessing}
                          >
                            <Photo className="mr-1" />
                            {currentStatus === "uploading"
                              ? "Uploading..."
                              : currentStatus === "saving"
                              ? "Saving..."
                              : "Upload Image"}
                          </Button>
                        </div>
                      )}

                      {/* Status Messages */}
                      {currentStatus === "saved" && (
                        <Text size="small" className="text-green-600">
                          ✓ Saved
                        </Text>
                      )}
                      {currentStatus === "error" && (
                        <Text size="small" className="text-red-600">
                          Error
                        </Text>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductOptionImagesWidget
