import { defineWidgetConfig } from "@medusajs/admin-sdk"
import {
  DetailWidgetProps,
  AdminProductCategory,
} from "@medusajs/framework/types"
import { Container, Heading, Button, Text, IconButton } from "@medusajs/ui"
import { Trash } from "@medusajs/icons"
import { useState, useCallback, useRef } from "react"

const CategoryImageWidget = ({
  data: category,
}: DetailWidgetProps<AdminProductCategory>) => {
  const [imageUrl, setImageUrl] = useState<string>(
    (category?.metadata as any)?.image_url || ""
  )
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [status, setStatus] = useState<"idle" | "uploading" | "saving" | "saved" | "error">(
    "idle"
  )
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Determine current state
  const hasUploadedImage = imageUrl && !previewUrl
  const hasSelectedFile = selectedFile && previewUrl
  const isProcessing = status === "uploading" || status === "saving"
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
      // Create preview URL
      const preview = URL.createObjectURL(file)
      setPreviewUrl(preview)
    }
  }, [])
  
  const handleChooseFile = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleUploadAndSave = useCallback(async () => {
    if (!selectedFile) return

    try {
      setStatus("uploading")
      
      // Upload file using MedusaJS File Module
      const formData = new FormData()
      formData.append('files', selectedFile)
      
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

      setStatus("saving")
      
      // Save the uploaded file URL to category metadata
      const nextMetadata = { 
        ...(category.metadata || {}), 
        image_url: uploadedFileUrl 
      }
      
      const updateResponse = await fetch(`/admin/product-categories/${category.id}`, {
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

      // Update the image URL with the permanent URL and clear preview
      setImageUrl(uploadedFileUrl)
      setSelectedFile(null)
      setPreviewUrl("")
      setStatus("saved")
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
      // Reset status after 2 seconds
      setTimeout(() => setStatus("idle"), 2000)
    } catch (error) {
      console.error("Error uploading and saving image:", error)
      setStatus("error")
      
      // Reset status after 3 seconds
      setTimeout(() => setStatus("idle"), 3000)
    }
  }, [selectedFile, category.id])

  const handleRemoveImage = useCallback(async () => {
    try {
      setStatus("saving")
      
      // Remove image_url from metadata
      const nextMetadata = { ...(category.metadata || {}) }
      delete nextMetadata.image_url
      
      const response = await fetch(`/admin/product-categories/${category.id}`, {
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

      setImageUrl("")
      setSelectedFile(null)
      setPreviewUrl("")
      setStatus("saved")
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
      setTimeout(() => setStatus("idle"), 2000)
    } catch (error) {
      console.error("Error removing image:", error)
      setStatus("error")
      setTimeout(() => setStatus("idle"), 3000)
    }
  }, [category.id])

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Category Image</Heading>
      </div>

      <div className="grid gap-3 px-6 py-4">
        <Text size="small">
          Upload an image for this category. The image will be stored to category metadata.
        </Text>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {/* Show Choose File button when no image is selected/uploaded */}
        {!hasUploadedImage && !hasSelectedFile && (
          <Button
            onClick={handleChooseFile}
            variant="secondary"
            disabled={isProcessing}
          >
            Choose File
          </Button>
        )}
        
        {/* Show Save button when file is selected */}
        {hasSelectedFile && (
          <div className="flex flex-col gap-3">
            <Text size="small" className="text-gray-600">
              Selected: {selectedFile?.name}
            </Text>
            <Button
              onClick={handleUploadAndSave}
              isLoading={isProcessing}
            >
              {status === "uploading" ? "Uploading..." : status === "saving" ? "Saving..." : "Save"}
            </Button>
          </div>
        )}

        {/* Show image preview */}
        {(imageUrl || previewUrl) && (
          <div className="mt-2 relative inline-block">
            <img
              src={previewUrl || imageUrl}
              alt="Category preview"
              className="max-h-40 rounded border"
            />
            {/* Show remove button only for uploaded images, not previews */}
            {hasUploadedImage && (
              <IconButton
                onClick={handleRemoveImage}
                size="small"
                isLoading={status === "saving"}
                className="absolute top-2 left-2"
              >
                <Trash color="red" />
              </IconButton>
            )}
          </div>
        )}

        {/* Status messages */}
        {status === "saved" && (
          <Text size="small" className="text-green-600">
            Image saved successfully!
          </Text>
        )}
        {status === "error" && (
          <Text size="small" className="text-red-600">
            Error uploading or saving image. Please try again.
          </Text>
        )}
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  // Inject on the category details page (second column bottom is a common choice)
  zone: "product_category.details.side.after",
})

export default CategoryImageWidget