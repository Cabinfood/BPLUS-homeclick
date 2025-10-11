import { defineRouteConfig } from "@medusajs/admin-sdk";
import { DocumentText } from "@medusajs/icons";
import {
  Container,
  Heading,
  Button,
  Text,
  Drawer,
  Input,
  Textarea,
  Label,
  Select,
  Switch,
  IconButton,
  toast,
  Badge,
} from "@medusajs/ui";
import { Plus, Trash, GripVertical, Pencil } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Import form fields
import MediaFile from "../../../../components/fields/MediaFile";
import TextFields from "../../../../components/fields/TextFields";
import SpecsFields from "../../../../components/fields/SpecsFields";

type ContentBlock = {
  id: string;
  title: string | null;
  description: string | null;
  block_type: string;
  block_data: any;
  rank: number;
  product_id: string;
};

type BlockFormData = {
  block_type: string;
  title: string;
  description: string;
  block_data: any;
  showAdvanced: boolean;
  jsonText: string;
  // Form data for specific types
  textForm: { content: string };
  mediaForm: { type: string; url: string; alt: string; caption: string };
  specsForm: { items: Array<{ key: string; value: string }> };
};

const BLOCK_TYPES = [
  { value: "media", label: "Media" },
  { value: "text", label: "Text" },
  { value: "specs", label: "Specs" },
];

const SUGGESTED_TEMPLATES: Record<string, any> = {
  media: {
    type: "image",
    url: "https://example.com/image.jpg",
    alt: "Mô tả media",
    caption: "Chú thích ngắn",
  },
  text: {
    content: "Nội dung văn bản của bạn",
  },
  specs: {
    items: [
      { key: "Kích thước", value: "200x100x50mm" },
      { key: "Chất liệu", value: "Gỗ sồi" },
    ],
  },
};

// Sortable Block Item Component
const SortableBlockItem = ({
  block,
  onEdit,
  onDelete,
  isDeleting,
}: {
  block: ContentBlock;
  onEdit: (block: ContentBlock) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border rounded-lg p-4 bg-white flex items-center gap-4 hover:shadow-md transition-shadow"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-2"
      >
        <GripVertical className="text-gray-400 size-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Badge size="xsmall">{block.block_type}</Badge>
          <Text size="small" className="text-gray-500">
            #{block.rank}
          </Text>
        </div>
        {block.title ? (
          <div className="font-medium truncate">{block.title}</div>
        ) : (
          <div className="text-gray-400 italic">Untitled {block.block_type}</div>
        )}
        {block.description && (
          <div className="text-sm text-gray-500 line-clamp-1 mt-1">
            {block.description}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button size="small" variant="secondary" onClick={() => onEdit(block)}>
          <Pencil className="size-4" />
          Edit
        </Button>
        <IconButton
          size="small"
          variant="transparent"
          onClick={() => onDelete(block.id)}
          disabled={isDeleting}
        >
          <Trash className="text-red-500 size-4" />
        </IconButton>
      </div>
    </div>
  );
};

// Block Form Component
const BlockForm = ({
  formData,
  onChange,
  onSave,
  isSaving,
}: {
  formData: BlockFormData;
  onChange: (data: Partial<BlockFormData>) => void;
  onSave: () => void;
  isSaving: boolean;
}) => {
  const handleTypeChange = (newType: string) => {
    onChange({
      block_type: newType,
      textForm: { content: "" },
      mediaForm: { type: "image", url: "", alt: "", caption: "" },
      specsForm: { items: [] },
      jsonText: "{}",
    });
  };

  return (
    <div className="space-y-4">
      {/* Block Type */}
      <div className="space-y-2">
        <Label>Loại Block</Label>
        <Select value={formData.block_type} onValueChange={handleTypeChange}>
          <Select.Trigger>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            {BLOCK_TYPES.map((type) => (
              <Select.Item key={type.value} value={type.value}>
                {type.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label>Tiêu đề (tùy chọn)</Label>
        <Input
          value={formData.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Nhập tiêu đề"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label>Mô tả (tùy chọn)</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Nhập mô tả"
          rows={2}
        />
      </div>

      {/* Type-specific fields */}
      {formData.block_type === "text" && (
        <TextFields
          value={formData.textForm}
          onChange={(val) => onChange({ textForm: val })}
        />
      )}
      {formData.block_type === "media" && (
        <MediaFile
          value={formData.mediaForm}
          onChange={(val) => onChange({ mediaForm: val })}
        />
      )}
      {formData.block_type === "specs" && (
        <SpecsFields
          value={formData.specsForm}
          onChange={(val) => onChange({ specsForm: val })}
        />
      )}

      {/* Advanced JSON mode */}
      <div className="pt-4 border-t">
        <div className="flex items-center gap-2 mb-4">
          <Switch
            checked={formData.showAdvanced}
            onCheckedChange={(checked) => {
              let jsonData: any = {};
              switch (formData.block_type) {
                case "text":
                  jsonData = formData.textForm;
                  break;
                case "media":
                  jsonData = formData.mediaForm;
                  break;
                case "specs":
                  jsonData = formData.specsForm;
                  break;
              }
              onChange({
                showAdvanced: checked,
                jsonText: checked ? JSON.stringify(jsonData, null, 2) : formData.jsonText,
              });
            }}
          />
          <Text size="small">Chế độ nâng cao (JSON)</Text>
        </div>

        {formData.showAdvanced && (
          <div className="space-y-2">
            <Label>Block Data (JSON)</Label>
            <textarea
              className="w-full min-h-[200px] font-mono text-xs rounded border p-3 bg-ui-bg-field"
              value={formData.jsonText}
              onChange={(e) => onChange({ jsonText: e.target.value })}
              placeholder={JSON.stringify(
                SUGGESTED_TEMPLATES[formData.block_type] || {},
                null,
                2
              )}
            />
          </div>
        )}
      </div>

      <div className="pt-4 border-t">
        <Button onClick={onSave} disabled={isSaving} className="w-full">
          {isSaving ? "Đang lưu..." : "Lưu Block"}
        </Button>
      </div>
    </div>
  );
};

// Main Content Blocks Page
const ContentBlocksPage = () => {
  // Get product ID from URL path
  const productId = window.location.pathname.split("/").filter(Boolean)[2];

  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
  const [formData, setFormData] = useState<BlockFormData>({
    block_type: "media",
    title: "",
    description: "",
    block_data: {},
    showAdvanced: false,
    jsonText: "{}",
    textForm: { content: "" },
    mediaForm: { type: "image", url: "", alt: "", caption: "" },
    specsForm: { items: [] },
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch blocks
  const fetchBlocks = useCallback(async () => {
    if (!productId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/admin/content-block?product_id=${productId}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch blocks");
      const json = await res.json();
      const list = json?.data || [];
      const sorted = [...list].sort((a, b) => (a.rank || 0) - (b.rank || 0));
      setBlocks(sorted);
    } catch (error) {
      console.error("Error fetching blocks:", error);
      toast.error("Không thể tải content blocks");
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchBlocks();
  }, [fetchBlocks]);

  // Drag and drop reorder
  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = blocks.findIndex((b) => b.id === active.id);
        const newIndex = blocks.findIndex((b) => b.id === over.id);
        const reordered = arrayMove(blocks, oldIndex, newIndex);

        setBlocks(reordered);

        setIsSaving(true);
        try {
          const payload = reordered.map((b, idx) => ({ id: b.id, rank: idx }));
          const res = await fetch("/admin/content-block/reorder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ blocks: payload }),
          });
          if (!res.ok) throw new Error("Reorder failed");
          toast.success("Đã thay đổi vị trí blocks");
        } catch (error) {
          console.error("Error reordering:", error);
          toast.error("Không thể thay đổi vị trí");
          fetchBlocks();
        } finally {
          setIsSaving(false);
        }
      }
    },
    [blocks, fetchBlocks]
  );

  // Open drawer for create
  const handleCreate = useCallback(() => {
    setEditingBlock(null);
    setFormData({
      block_type: "media",
      title: "",
      description: "",
      block_data: {},
      showAdvanced: false,
      jsonText: "{}",
      textForm: { content: "" },
      mediaForm: { type: "image", url: "", alt: "", caption: "" },
      specsForm: { items: [] },
    });
    setDrawerOpen(true);
  }, []);

  // Open drawer for edit
  const handleEdit = useCallback((block: ContentBlock) => {
    setEditingBlock(block);
    
    // Convert block data to form data
    let textForm = { content: "" };
    let mediaForm = { type: "image", url: "", alt: "", caption: "" };
    let specsForm = { items: [] };
    
    if (block.block_type === "text") {
      textForm = { content: block.block_data.content || "" };
    } else if (block.block_type === "media") {
      mediaForm = {
        type: block.block_data.type || "image",
        url: block.block_data.url || "",
        alt: block.block_data.alt || "",
        caption: block.block_data.caption || "",
      };
    } else if (block.block_type === "specs") {
      specsForm = { items: block.block_data.items || [] };
    }

    setFormData({
      block_type: block.block_type,
      title: block.title || "",
      description: block.description || "",
      block_data: block.block_data,
      showAdvanced: false,
      jsonText: JSON.stringify(block.block_data, null, 2),
      textForm,
      mediaForm,
      specsForm,
    });
    setDrawerOpen(true);
  }, []);

  // Save block (create or update)
  const handleSave = useCallback(async () => {
    if (!productId) return;

    // Build block data from form
    let blockData: any = {};
    if (formData.showAdvanced) {
      try {
        blockData = JSON.parse(formData.jsonText);
      } catch {
        toast.error("JSON không hợp lệ");
        return;
      }
    } else {
      switch (formData.block_type) {
        case "text":
          blockData = formData.textForm;
          break;
        case "media":
          blockData = formData.mediaForm;
          break;
        case "specs":
          blockData = formData.specsForm;
          break;
      }
    }

    setIsSaving(true);
    try {
      if (editingBlock) {
        // Update existing block
        const res = await fetch(`/admin/content-block/${editingBlock.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            title: formData.title || null,
            description: formData.description || null,
            block_type: formData.block_type,
            block_data: blockData,
          }),
        });
        if (!res.ok) throw new Error("Update failed");
        toast.success("Đã cập nhật block");
      } else {
        // Create new block
        const maxRank = blocks.length > 0
          ? Math.max(...blocks.map((b) => b.rank || 0))
          : -1;
        const res = await fetch("/admin/content-block", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            blocks: [
              {
                block_type: formData.block_type,
                block_data: blockData,
                product_id: productId,
                rank: maxRank + 1,
                title: formData.title || null,
                description: formData.description || null,
              },
            ],
          }),
        });
        if (!res.ok) throw new Error("Create failed");
        toast.success("Đã tạo block mới");
      }
      setDrawerOpen(false);
      fetchBlocks();
    } catch (error) {
      console.error("Error saving block:", error);
      toast.error("Không thể lưu block");
    } finally {
      setIsSaving(false);
    }
  }, [formData, editingBlock, productId, blocks, fetchBlocks]);

  // Delete block
  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Bạn có chắc muốn xóa block này?")) return;

      setIsDeleting(true);
      try {
        const res = await fetch(`/admin/content-block/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Delete failed");
        toast.success("Đã xóa block");
        fetchBlocks();
      } catch (error) {
        console.error("Error deleting block:", error);
        toast.error("Không thể xóa block");
      } finally {
        setIsDeleting(false);
      }
    },
    [fetchBlocks]
  );

  return (
    <div className="flex flex-col gap-y-4">
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <Heading level="h1">Content Blocks</Heading>
            <Text className="text-ui-fg-subtle mt-1">
              Quản lý nội dung blocks của sản phẩm
            </Text>
          </div>
          <Button onClick={handleCreate} disabled={isLoading || isSaving}>
            <Plus className="size-4" />
            Tạo Block Mới
          </Button>
        </div>
      </Container>

      <Container className="p-6">
        {isLoading ? (
          <Text>Đang tải...</Text>
        ) : blocks.length === 0 ? (
          <div className="text-center py-12">
            <Text className="text-gray-500 mb-4">
              Chưa có block nào cho sản phẩm này
            </Text>
            <Button onClick={handleCreate}>
              <Plus className="size-4" />
              Tạo Block Đầu Tiên
            </Button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={blocks.map((b) => b.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {blocks.map((block) => (
                  <SortableBlockItem
                    key={block.id}
                    block={block}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isDeleting={isDeleting}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </Container>

      {/* Drawer for Create/Edit */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>
              {editingBlock ? "Chỉnh sửa Block" : "Tạo Block Mới"}
            </Drawer.Title>
          </Drawer.Header>
          <Drawer.Body className="p-6">
            <BlockForm
              formData={formData}
              onChange={(updates) =>
                setFormData((prev) => ({ ...prev, ...updates }))
              }
              onSave={handleSave}
              isSaving={isSaving}
            />
          </Drawer.Body>
        </Drawer.Content>
      </Drawer>
    </div>
  );
};

export const config = defineRouteConfig({
  label: "Content Blocks",
  icon: DocumentText,
});

export default ContentBlocksPage;
