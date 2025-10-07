import { defineRouteConfig } from "@medusajs/admin-sdk"
import { SquaresPlusSolid } from "@medusajs/icons"
import {
  Container,
  Heading,
  Button,
  Text,
  Input,
  Textarea,
  Label,
  Switch,
  IconButton,
  toast,
} from "@medusajs/ui"
import { Trash, Plus, EllipsisVertical } from "@medusajs/icons"
import { useState, useCallback, useEffect, useRef } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

type HeroSlide = {
  id: string
  title: string
  description: string | null
  image: string
  link: string | null
  cta_text: string | null
  rank: number
  is_active: boolean
}

type SlideFormData = Omit<HeroSlide, "id" | "rank">

const SortableSlideItem = ({
  slide,
  onEdit,
  onDelete,
  onToggleActive,
  isDeleting,
}: {
  slide: HeroSlide
  onEdit: (slide: HeroSlide) => void
  onDelete: (id: string) => void
  onToggleActive: (id: string, isActive: boolean) => void
  isDeleting: boolean
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: slide.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border rounded-lg p-4 bg-white flex items-center gap-4"
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <EllipsisVertical className="text-gray-400" />
      </div>

      <img
        src={slide.image}
        alt={slide.title}
        className="w-20 h-20 object-cover rounded"
      />

      <div className="flex-1">
        <div className="font-medium">{slide.title}</div>
        {slide.description && (
          <div className="text-sm text-gray-500 line-clamp-1">{slide.description}</div>
        )}
        {slide.cta_text && slide.link && (
          <div className="text-xs text-blue-600 mt-1">
            {slide.cta_text} → {slide.link}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={slide.is_active}
          onCheckedChange={(checked) => onToggleActive(slide.id, checked)}
        />
        <Button
          size="small"
          variant="secondary"
          onClick={() => onEdit(slide)}
        >
          Edit
        </Button>
        <IconButton
          size="small"
          variant="transparent"
          onClick={() => onDelete(slide.id)}
          disabled={isDeleting}
        >
          <Trash className="text-red-500" />
        </IconButton>
      </div>
    </div>
  )
}

const SlideForm = ({
  formData,
  onChange,
  onSave,
  onCancel,
  isSaving,
}: {
  formData: SlideFormData
  onChange: (data: SlideFormData) => void
  onSave: () => void
  onCancel: () => void
  isSaving: boolean
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
    }
  }, [])

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return

    try {
      setIsUploading(true)

      const formDataUpload = new FormData()
      formDataUpload.append('files', selectedFile)

      const uploadResponse = await fetch('/admin/uploads', {
        method: 'POST',
        credentials: 'include',
        body: formDataUpload,
      })

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.status}`)
      }

      const uploadResult = await uploadResponse.json()
      // Response is an array of uploaded files
      const uploadedFileUrl = Array.isArray(uploadResult) ? uploadResult[0]?.url : uploadResult?.url

      if (!uploadedFileUrl) {
        console.error('Upload result:', uploadResult)
        throw new Error('No file URL returned from upload')
      }

      onChange({ ...formData, image: uploadedFileUrl })
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      toast.success("Image uploaded successfully")
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error("Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }, [selectedFile, formData, onChange])

  return (
    <div className="space-y-4 border-t pt-4">
      <div className="space-y-2">
        <Label>Title *</Label>
        <Input
          value={formData.title}
          onChange={(e) => onChange({ ...formData, title: e.target.value })}
          placeholder="Enter slide title"
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={formData.description || ""}
          onChange={(e) => onChange({ ...formData, description: e.target.value })}
          placeholder="Enter slide description"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Image URL *</Label>
        <Input
          value={formData.image}
          onChange={(e) => onChange({ ...formData, image: e.target.value })}
          placeholder="https://example.com/image.jpg"
        />

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            size="small"
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            Choose File
          </Button>
          {selectedFile && (
            <>
              <Text size="small">{selectedFile.name}</Text>
              <Button
                size="small"
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </>
          )}
        </div>

        {formData.image && (
          <img
            src={formData.image}
            alt="Preview"
            className="max-h-40 rounded border mt-2"
          />
        )}
      </div>

      <div className="space-y-2">
        <Label>CTA Button Text</Label>
        <Input
          value={formData.cta_text || ""}
          onChange={(e) => onChange({ ...formData, cta_text: e.target.value })}
          placeholder="Discover More"
        />
      </div>

      <div className="space-y-2">
        <Label>Link</Label>
        <Input
          value={formData.link || ""}
          onChange={(e) => onChange({ ...formData, link: e.target.value })}
          placeholder="/products or https://..."
        />
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={formData.is_active}
          onCheckedChange={(checked) => onChange({ ...formData, is_active: checked })}
        />
        <Label>Active</Label>
      </div>

      <div className="flex gap-2 pt-2">
        <Button onClick={onSave} disabled={isSaving || !formData.title || !formData.image}>
          {isSaving ? "Saving..." : "Save Slide"}
        </Button>
        <Button variant="secondary" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
      </div>
    </div>
  )
}

const HeroSlideManager = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null)
  const [formData, setFormData] = useState<SlideFormData>({
    title: "",
    description: null,
    image: "",
    link: null,
    cta_text: null,
    is_active: true,
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const fetchSlides = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/admin/hero-slide", {
        credentials: "include",
      })
      if (!res.ok) throw new Error("Failed to fetch slides")
      const json = await res.json()
      setSlides(json.data || [])
    } catch (error) {
      console.error("Error fetching slides:", error)
      toast.error("Failed to load hero slides")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSlides()
  }, [fetchSlides])

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = slides.findIndex((s) => s.id === active.id)
      const newIndex = slides.findIndex((s) => s.id === over.id)
      const reordered = arrayMove(slides, oldIndex, newIndex)

      setSlides(reordered)

      setIsSaving(true)
      try {
        const payload = reordered.map((s, idx) => ({ id: s.id, rank: idx }))
        const res = await fetch("/admin/hero-slide/reorder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ slides: payload }),
        })
        if (!res.ok) throw new Error("Reorder failed")
        toast.success("Slides reordered")
      } catch (error) {
        console.error("Error reordering:", error)
        toast.error("Failed to reorder slides")
        fetchSlides()
      } finally {
        setIsSaving(false)
      }
    }
  }, [slides, fetchSlides])

  const handleCreate = useCallback(() => {
    setEditingSlide(null)
    setFormData({
      title: "",
      description: null,
      image: "",
      link: null,
      cta_text: null,
      is_active: true,
    })
    setShowForm(true)
  }, [])

  const handleEdit = useCallback((slide: HeroSlide) => {
    setEditingSlide(slide)
    setFormData({
      title: slide.title,
      description: slide.description,
      image: slide.image,
      link: slide.link,
      cta_text: slide.cta_text,
      is_active: slide.is_active,
    })
    setShowForm(true)
  }, [])

  const handleSave = useCallback(async () => {
    if (!formData.title || !formData.image) {
      toast.error("Title and image are required")
      return
    }

    setIsSaving(true)
    try {
      if (editingSlide) {
        const res = await fetch(`/admin/hero-slide/${editingSlide.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        })
        if (!res.ok) throw new Error("Update failed")
        toast.success("Slide updated")
      } else {
        const res = await fetch("/admin/hero-slide", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        })
        if (!res.ok) throw new Error("Create failed")
        toast.success("Slide created")
      }
      setShowForm(false)
      fetchSlides()
    } catch (error) {
      console.error("Error saving slide:", error)
      toast.error("Failed to save slide")
    } finally {
      setIsSaving(false)
    }
  }, [formData, editingSlide, fetchSlides])

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Are you sure you want to delete this slide?")) return

    setIsDeleting(true)
    try {
      const res = await fetch(`/admin/hero-slide/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!res.ok) throw new Error("Delete failed")
      toast.success("Slide deleted")
      fetchSlides()
    } catch (error) {
      console.error("Error deleting slide:", error)
      toast.error("Failed to delete slide")
    } finally {
      setIsDeleting(false)
    }
  }, [fetchSlides])

  const handleToggleActive = useCallback(async (id: string, isActive: boolean) => {
    setIsSaving(true)
    try {
      const res = await fetch(`/admin/hero-slide/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ is_active: isActive }),
      })
      if (!res.ok) throw new Error("Update failed")
      toast.success(`Slide ${isActive ? "activated" : "deactivated"}`)
      fetchSlides()
    } catch (error) {
      console.error("Error toggling active:", error)
      toast.error("Failed to update slide")
    } finally {
      setIsSaving(false)
    }
  }, [fetchSlides])

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Hero Slides</Heading>
        <Button onClick={handleCreate} disabled={isLoading || isSaving}>
          <Plus />
          Add Slide
        </Button>
      </div>

      <div className="px-6 py-4">
        {isLoading ? (
          <Text>Loading...</Text>
        ) : slides.length === 0 ? (
          <Text className="text-gray-500">No hero slides yet. Create one to get started.</Text>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={slides.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {slides.map((slide) => (
                  <SortableSlideItem
                    key={slide.id}
                    slide={slide}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleActive={handleToggleActive}
                    isDeleting={isDeleting}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {showForm && (
          <SlideForm
            formData={formData}
            onChange={setFormData}
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
            isSaving={isSaving}
          />
        )}
      </div>
    </Container>
  )
}

// CMS Page Component
const CMSPage = () => {
  return (
    <div className="flex flex-col gap-y-4">
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <Heading level="h1">Content Management System</Heading>
            <Text className="text-ui-fg-subtle mt-1">
              Manage your website content, hero slides, banners, and more
            </Text>
          </div>
        </div>
      </Container>

      {/* Hero Slide Manager Section */}
      <HeroSlideManager />

      {/* Future CMS sections can be added here */}
    </div>
  )
}

export const config = defineRouteConfig({
  label: "CMS",
  icon: SquaresPlusSolid,
})

export default CMSPage
