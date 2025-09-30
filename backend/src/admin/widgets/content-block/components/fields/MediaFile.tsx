// ui
import { Button, IconButton, Input, Text, Alert, Select } from "@medusajs/ui"
import { Trash2, Upload, Image, Video } from "lucide-react"
import { useState } from "react"

export type MediaFileBlockData = {
  type: 'image' | 'video'
  url: string
  alt?: string
  caption?: string
}

type Props = {
  value: MediaFileBlockData
  onChange: (next: MediaFileBlockData) => void
}

const MEDIA_TYPES = [
  { value: 'image', label: 'Image', icon: Image },
  { value: 'video', label: 'Video', icon: Video }
] as const

const ACCEPTED_FILE_TYPES = {
  image: 'image/*',
  video: 'video/*'
} as const

const PLACEHOLDERS = {
  image: 'https://... hoặc chọn ảnh để upload',
  video: 'https://... hoặc chọn video để upload'
} as const

const UPLOAD_BUTTON_LABELS = {
  image: 'Chọn ảnh',
  video: 'Chọn video'
} as const

export default function MediaFile({ value, onChange }: Props) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTypeChange = (newType: 'image' | 'video') => {
    onChange({ 
      ...value, 
      type: newType,
      // Reset URL when changing type to avoid confusion
      url: '',
      alt: '',
      caption: ''
    })
    setError(null)
  }

  const handleChooseFile = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ACCEPTED_FILE_TYPES[value.type]
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return

      setIsUploading(true)
      setError(null)

      try {
        // Validate file type
        const isValidImage = value.type === 'image' && file.type.startsWith('image/')
        const isValidVideo = value.type === 'video' && file.type.startsWith('video/')
        
        if (!isValidImage && !isValidVideo) {
          throw new Error(`File không hợp lệ. Vui lòng chọn ${value.type === 'image' ? 'ảnh' : 'video'}`)
        }

        // Sử dụng FormData với key 'files' như category-image-upload
        const formData = new FormData()
        formData.append('files', file)

        // Sử dụng endpoint MedusaJS File Module như category-image-upload
        const res = await fetch("/admin/uploads", {
          method: "POST",
          credentials: "include",
          body: formData,
        })

        if (!res.ok) {
          const errorText = await res.text()
          throw new Error(`Upload failed (${res.status}): ${errorText}`)
        }

        const json = await res.json()
        // Xử lý response format như category-image-upload
        const uploadedFileUrl = json.files?.[0]?.url
        if (uploadedFileUrl) {
          onChange({ ...value, url: uploadedFileUrl })
        } else {
          throw new Error("No file URL returned from server")
        }
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "Upload failed"
        setError(errorMessage)
        console.error("Upload error:", e)
      } finally {
        setIsUploading(false)
      }
    }
    input.click()
  }

  const handleClear = () => {
    onChange({ ...value, url: "" })
    setError(null)
  }

  const currentTypeConfig = MEDIA_TYPES.find(t => t.value === value.type)
  const IconComponent = currentTypeConfig?.icon || Image

  return (
    <div className="grid gap-3">
      {error && (
        <Alert variant="error">
          <Text size="small">{error}</Text>
        </Alert>
      )}
      
      {/* Type selector */}
      <div className="grid gap-1">
        <Text size="small">Loại Media</Text>
        <Select
          value={value.type}
          onValueChange={handleTypeChange}
          disabled={isUploading}
        >
          <Select.Trigger>
            <div className="flex items-center gap-2">
              <IconComponent size={16} />
              <span>{currentTypeConfig?.label}</span>
            </div>
          </Select.Trigger>
          <Select.Content>
            {MEDIA_TYPES.map((type) => {
              const Icon = type.icon
              return (
                <Select.Item key={type.value} value={type.value}>
                  <div className="flex items-center gap-2">
                    <Icon size={16} />
                    <span>{type.label}</span>
                  </div>
                </Select.Item>
              )
            })}
          </Select.Content>
        </Select>
      </div>
      
      {/* URL input */}
      <div className="grid gap-1">
        <Text size="small">URL</Text>
        <div className="flex gap-2 items-center">
          <Input
            value={value.url ?? ""}
            onChange={(e) => onChange({ ...value, url: e.target.value })}
            placeholder={PLACEHOLDERS[value.type]}
            disabled={isUploading}
          />
          <Button 
            variant="secondary" 
            onClick={handleChooseFile}
            disabled={isUploading}
          >
            {isUploading ? "Đang upload..." : UPLOAD_BUTTON_LABELS[value.type]}
          </Button>
          {value.url && !isUploading ? (
            <IconButton size="small" onClick={handleClear}>
              <Trash2 className="text-red-500" size={16} />
            </IconButton>
          ) : null}
        </div>
      </div>

      {/* Alt text - chỉ hiển thị cho image */}
      {value.type === 'image' && (
        <div className="grid gap-1">
          <Text size="small">Alt</Text>
          <Input
            value={value.alt ?? ""}
            onChange={(e) => onChange({ ...value, alt: e.target.value })}
            placeholder="Mô tả hình ảnh"
          />
        </div>
      )}

      {/* Caption - hiển thị cho cả image và video */}
      <div className="grid gap-1">
        <Text size="small">Caption</Text>
        <Input
          value={value.caption ?? ""}
          onChange={(e) => onChange({ ...value, caption: e.target.value })}
          placeholder="Chú thích ngắn"
        />
      </div>
    </div>
  )
}