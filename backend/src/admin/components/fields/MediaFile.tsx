// ui
import { Button, IconButton, Input, Text, Alert, Select } from "@medusajs/ui"
import { Trash2, Upload, Image, Video } from "lucide-react"
import { useState, memo, useCallback, useEffect } from "react"

export type MediaFileBlockData = {
  type: 'image' | 'video'
  url: string
  alt?: string
  caption?: string
}

type Props = {
  value: MediaFileBlockData
  onChange: (next: MediaFileBlockData) => void
  validationError?: string | null
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

const MediaFile = memo(function MediaFile({ value, onChange, validationError }: Props) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Local state to prevent focus loss
  const [localUrl, setLocalUrl] = useState(value.url || "")
  const [localAlt, setLocalAlt] = useState(value.alt || "")
  const [localCaption, setLocalCaption] = useState(value.caption || "")

  // Sync local state when value changes
  useEffect(() => {
    setLocalUrl(value.url || "")
    setLocalAlt(value.alt || "")
    setLocalCaption(value.caption || "")
  }, [value.url, value.alt, value.caption])

  const handleTypeChange = useCallback((newType: 'image' | 'video') => {
    onChange({ 
      ...value, 
      type: newType,
      // Reset URL when changing type to avoid confusion
      url: '',
      alt: '',
      caption: ''
    })
    // Update local state to reflect the change
    setLocalUrl('')
    setLocalAlt('')
    setLocalCaption('')
    setError(null)
  }, [value, onChange])

  const handleChooseFile = useCallback(() => {
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
          // Only update the URL, preserve other fields
          onChange({ ...value, url: uploadedFileUrl })
          // Update local state to reflect the change
          setLocalUrl(uploadedFileUrl)
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
  }, [value.type])

  const handleClear = useCallback(() => {
    onChange({ ...value, url: "" })
    // Update local state to reflect the change
    setLocalUrl("")
    setError(null)
  }, [value, onChange])

  const handleUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalUrl(e.target.value);
  }, []);

  const handleUrlBlur = useCallback(() => {
    onChange({ 
      type: value.type,
      url: localUrl,
      alt: value.alt || '',
      caption: value.caption || ''
    });
  }, [value.type, value.alt, value.caption, localUrl, onChange]);

  const handleAltChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalAlt(e.target.value);
  }, []);

  const handleAltBlur = useCallback(() => {
    onChange({ 
      type: value.type,
      url: value.url,
      alt: localAlt,
      caption: value.caption || ''
    });
  }, [value.type, value.url, value.caption, localAlt, onChange]);

  const handleCaptionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalCaption(e.target.value);
  }, []);

  const handleCaptionBlur = useCallback(() => {
    onChange({ 
      type: value.type,
      url: value.url,
      alt: value.alt || '',
      caption: localCaption
    });
  }, [value.type, value.url, value.alt, localCaption, onChange]);

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
          <Select.Trigger tabIndex={0}>
            <div className="flex gap-2 items-center">
              <IconComponent size={16} />
              <span>{currentTypeConfig?.label}</span>
            </div>
          </Select.Trigger>
          <Select.Content>
            {MEDIA_TYPES.map((type) => {
              const Icon = type.icon
              return (
                <Select.Item key={type.value} value={type.value}>
                  <div className="flex gap-2 items-center">
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
        <Text size="small" className={validationError ? "text-red-600" : ""}>
          URL <span className="text-red-500">*</span>
        </Text>
        <div className="flex gap-2 items-center">
          <Input
            value={localUrl}
            onChange={handleUrlChange}
            onBlur={handleUrlBlur}
            placeholder={PLACEHOLDERS[value.type]}
            disabled={isUploading}
            tabIndex={1}
            autoComplete="url"
          />
          <Button 
            variant="secondary" 
            onClick={handleChooseFile}
            disabled={isUploading}
            tabIndex={2}
            type="button"
          >
            {isUploading ? "Đang upload..." : UPLOAD_BUTTON_LABELS[value.type]}
          </Button>
          {value.url && !isUploading ? (
            <IconButton 
              size="small" 
              onClick={handleClear}
              tabIndex={3}
              type="button"
            >
              <Trash2 className="text-red-500" size={16} />
            </IconButton>
          ) : null}
        </div>
        {validationError && (
          <Text size="small" className="text-red-600">
            {validationError}
          </Text>
        )}
      </div>

      {/* Alt text - chỉ hiển thị cho image */}
      {value.type === 'image' && (
        <div className="grid gap-1">
          <Text size="small">Alt</Text>
          <Input
            value={localAlt}
            onChange={handleAltChange}
            onBlur={handleAltBlur}
            placeholder="Mô tả hình ảnh"
            tabIndex={4}
            autoComplete="off"
          />
        </div>
      )}

      {/* Caption - hiển thị cho cả image và video */}
      <div className="grid gap-1">
        <Text size="small">Caption</Text>
        <Input
          value={localCaption}
          onChange={handleCaptionChange}
          onBlur={handleCaptionBlur}
          placeholder="Chú thích ngắn"
          tabIndex={value.type === 'image' ? 5 : 4}
          autoComplete="off"
        />
      </div>
    </div>
  )
})

export default MediaFile