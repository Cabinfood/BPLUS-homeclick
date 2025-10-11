import { useState, useCallback, useEffect } from "react";
import { toast } from "@medusajs/ui";
import { arrayMove } from "@dnd-kit/sortable";
import { DragEndEvent } from "@dnd-kit/core";
import { ContentBlock, BlockFormData } from "../types";
import { DEFAULT_FORM_DATA } from "../constants";

export const useContentBlocks = (productId: string) => {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
  const [formData, setFormData] = useState<BlockFormData>(DEFAULT_FORM_DATA);
  const [originalFormData, setOriginalFormData] = useState<BlockFormData>(DEFAULT_FORM_DATA);

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
    setFormData(DEFAULT_FORM_DATA);
    setOriginalFormData(DEFAULT_FORM_DATA);
    setDrawerOpen(true);
  }, []);

  // Open drawer for edit
  const handleEdit = useCallback((block: ContentBlock) => {
    setEditingBlock(block);

    // Convert block data to form data
    let textForm = { content: "" };
    let mediaForm: { type: "image" | "video"; url: string; thumbnail_url?: string; alt?: string; caption?: string } = { 
      type: "image", 
      url: "", 
      thumbnail_url: "",
      alt: "", 
      caption: "" 
    };
    let specsForm = { items: [] };

    if (block.block_type === "text") {
      textForm = { content: block.block_data.content || "" };
    } else if (block.block_type === "media") {
      const mediaType: "image" | "video" = block.block_data.type === "video" ? "video" : "image";
      mediaForm = {
        type: mediaType,
        url: block.block_data.url || "",
        thumbnail_url: block.block_data.thumbnail_url,
        alt: block.block_data.alt,
        caption: block.block_data.caption,
      };
    } else if (block.block_type === "specs") {
      specsForm = { items: block.block_data.items || [] };
    }

    const initialFormData = {
      block_type: block.block_type,
      title: block.title || "",
      description: block.description || "",
      block_data: block.block_data,
      showAdvanced: false,
      jsonText: JSON.stringify(block.block_data, null, 2),
      textForm,
      mediaForm,
      specsForm,
    };
    setFormData(initialFormData);
    setOriginalFormData(initialFormData);
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
        
        const responseData = await res.json();
        console.log("Update response:", responseData);
        
        // Update local state immediately with new data
        const updatedBlock = {
          ...editingBlock,
          title: formData.title || null,
          description: formData.description || null,
          block_type: formData.block_type,
          block_data: blockData,
        };
        
        setBlocks(prev => prev.map(b => 
          b.id === editingBlock.id ? updatedBlock : b
        ));
        
        toast.success("Đã cập nhật block");
      } else {
        // Create new block
        const maxRank =
          blocks.length > 0 ? Math.max(...blocks.map((b) => b.rank || 0)) : -1;
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
        
        const responseData = await res.json();
        console.log("Create response:", responseData);
        
        toast.success("Đã tạo block mới");
        
        // Fetch updated blocks for create
        await fetchBlocks();
      }
      
      setDrawerOpen(false);
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

  // Check if form has changes
  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalFormData);

  return {
    blocks,
    isLoading,
    isSaving,
    isDeleting,
    drawerOpen,
    editingBlock,
    formData,
    hasChanges,
    setDrawerOpen,
    setFormData,
    handleCreate,
    handleEdit,
    handleSave,
    handleDelete,
    handleDragEnd,
  };
};
