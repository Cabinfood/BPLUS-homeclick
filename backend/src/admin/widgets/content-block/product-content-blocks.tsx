// framework
import { defineWidgetConfig } from "@medusajs/admin-sdk";
import type {
  DetailWidgetProps,
  AdminProduct,
} from "@medusajs/framework/types";

// ui
import {
  Button,
  Container,
  Heading,
} from "@medusajs/ui";

// local components
import BlockList from "../../components/BlockList";
import CreateBlockModal from "../../components/CreateBlockModal";

// types
import type { AdminContentBlock, DraftBlock, TextBlockData, MediaFileBlockData, SpecsBlockData } from "../../components/types";

// react
import { useCallback, useEffect, useState } from "react";


const DEFAULT_BLOCK_TYPES = [
  // { value: "text", label: "Text" },
  { value: "media", label: "Media" },
  // { value: "specs", label: "Specs" },
];

// simple suggested samples (mẫu gợi ý) theo block type
const SUGGESTED_TEMPLATES: Record<string, Record<string, unknown>> = {
  // text: {
  //   title: "Mô tả",
  //   content: "Nội dung mô tả sản phẩm",
  // },
  media: {
    type: "image",
    url: "https://example.com/image.jpg",
    alt: "Mô tả media",
    caption: "Chú thích ngắn",
  },
  // specs: {
  //   items: [
  //     { key: "Kích thước", value: "200x100x50mm" },
  //     { key: "Chất liệu", value: "Gỗ sồi" },
  //   ],
  // },
};

const jsonOrEmpty = (value: string): Record<string, unknown> | null => {
  try {
    const parsed = JSON.parse(value);
    return typeof parsed === "object" && parsed !== null ? parsed : null;
  } catch {
    return null;
  }
};

const ProductContentBlocksWidget = ({
  data: product,
}: DetailWidgetProps<AdminProduct>) => {
  const productId = product?.id || "";

  const [blocks, setBlocks] = useState<AdminContentBlock[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const makeEmptyDraft = (id: string): DraftBlock => ({
    id,
    type: DEFAULT_BLOCK_TYPES[0].value,
    title: "",
    description: "",
    showAdvanced: false,
    jsonText: "{}",
    textForm: { content: "" },
    mediaForm: { type: "image", url: "", alt: "", caption: "" },
    specsForm: { items: [] },
  });
  const [drafts, setDrafts] = useState<DraftBlock[]>([]);


  const isDraftJsonValid = (d: DraftBlock) => !!jsonOrEmpty(d.jsonText);

  const applyTemplate = useCallback((idx: number) => {
    setDrafts((prev) => {
      const next = [...prev];
      const d = next[idx];
      const sample = SUGGESTED_TEMPLATES[d.type] || {};
      d.jsonText = JSON.stringify(sample, null, 2);
      if (d.type === "text") d.textForm = { content: (sample as any).content || "" } as TextBlockData;
      if (d.type === "media") d.mediaForm = sample as MediaFileBlockData;
      if (d.type === "specs") d.specsForm = sample as SpecsBlockData;
      return next;
    });
  }, []);

  const formatJson = useCallback((idx: number) => {
    setDrafts((prev) => {
      const next = [...prev];
      const d = next[idx];
      const parsed = jsonOrEmpty(d.jsonText);
      if (parsed) d.jsonText = JSON.stringify(parsed, null, 2);
      return next;
    });
  }, []);

  const resetJson = useCallback((idx: number) => {
    setDrafts((prev) => {
      const next = [...prev];
      const d = next[idx];
      d.jsonText = "{}";
      if (d.type === "text") d.textForm = { content: "" };
      if (d.type === "media") d.mediaForm = { type: "image", url: "", alt: "", caption: "" };
      if (d.type === "specs") d.specsForm = { items: [] };
      return next;
    });
  }, []);

  // Đồng bộ field -> JSON cho drafts khi không bật Advanced
  useEffect(() => {
    setDrafts((prev) =>
      prev.map((d) => {
        if (!d.showAdvanced) {
          let obj: any = {}
          if (d.type === "text") obj = d.textForm
          if (d.type === "media") obj = d.mediaForm
          if (d.type === "specs") obj = d.specsForm
          return { ...d, jsonText: JSON.stringify(obj, null, 2) }
        }
        return d
      })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    drafts.map(d => d.type).join(','),
    drafts.map(d => d.showAdvanced).join(','),
    JSON.stringify(drafts.map(d => d.textForm)),
    JSON.stringify(drafts.map(d => d.mediaForm)),
    JSON.stringify(drafts.map(d => d.specsForm))
  ])

  const fetchBlocks = useCallback(async () => {
    if (!productId) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`/admin/content-block?product_id=${productId}`, {
        credentials: "include",
      });
      if (res.status === 404 || res.status === 204) {
        setBlocks([]);
        return;
      }
      if (!res.ok) {
        // cố gắng lấy message từ body nếu có
        let msg = "";
        try {
          const errJson = await res.json();
          msg = errJson?.message || "";
        } catch {}
        throw new Error(
          msg || "Không thể tải Content Blocks. Vui lòng thử lại."
        );
      }
      const json = await res.json();
      const list: AdminContentBlock[] = json?.data || [];
      const sorted = [...list].sort(
        (a, b) => (a.rank || 0) - (b.rank || 0)
      );
      setBlocks(sorted);
    } catch (e: any) {
      setError(e?.message || "Failed to load content blocks");
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchBlocks();
  }, [fetchBlocks]);

  const handleCreate = useCallback(async () => {
    const blocksPayload: any[] = [];
    // Calculate the starting rank for new blocks
    const maxExistingRank = blocks.length > 0 ? Math.max(...blocks.map(block => block.rank || 0)) : -1;
    const startingRank = maxExistingRank + 1;

    for (let idx = 0; idx < drafts.length; idx++) {
      const d = drafts[idx];
      if (d.type === "text") {
        if (!d.textForm.content || d.textForm.content.trim().length === 0) {
          setError(`Content là bắt buộc cho block Text #${idx + 1}`);
          return;
        }
      }
      if (d.type === "media") {
        if (!d.mediaForm.url || !/^https?:\/\//i.test(d.mediaForm.url)) {
          setError(`URL hợp lệ (http/https) là bắt buộc cho block Media #${idx + 1}`);
          return;
        }
      }
      if (d.type === "specs") {
        const items = d.specsForm.items || [];
        const hasBad = items.some((i) => !i.key || !i.value);
        if (hasBad) {
          setError(`Mỗi item trong Specs cần đủ key và value (#${idx + 1})`);
          return;
        }
      }
      const blockData = d.showAdvanced ? jsonOrEmpty(d.jsonText) : JSON.parse(d.jsonText);
      if (!blockData) {
        setError(`blockData không hợp lệ (JSON) ở block #${idx + 1}`);
        return;
      }
      blocksPayload.push({
        block_type: d.type,
        block_data: blockData,
        product_id: productId,
        rank: startingRank + idx, // Use calculated rank instead of idx
        title: d.title || null,
        description: d.description || null
      });
    }

    setIsSaving(true);
    setError("");
    try {
      const res = await fetch(`/admin/content-block`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ blocks: blocksPayload }),
      });
      if (!res.ok) throw new Error(`Create failed: ${res.status}`);

      const json = await res.json();
      const newBlocks: AdminContentBlock[] = json?.data || [];

      // Optimistic update: append new blocks to existing blocks instead of re-fetching
      setBlocks((prev) => {
        const combined = [...prev, ...newBlocks];
        return combined.sort((a, b) => (a.rank || 0) - (b.rank || 0));
      });

      setIsCreateOpen(false);
      setDrafts([]);
    } catch (e: any) {
      setError(e?.message || "Failed to create blocks");
    } finally {
      setIsSaving(false);
    }
  }, [drafts, productId, blocks]);

  const handleDelete = useCallback(
    async (id: string) => {
      setIsSaving(true);
      setError("");
      try {
        const res = await fetch(`/admin/content-block/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (!res.ok) throw new Error(`Delete failed: ${res.status}`);

        // Optimistic update: remove block from state instead of re-fetching
        setBlocks((prev) => prev.filter((b) => b.id !== id));
      } catch (e: any) {
        setError(e?.message || "Failed to delete block");
        // Refetch on error to restore correct state
        await fetchBlocks();
      } finally {
        setIsSaving(false);
      }
    },
    [fetchBlocks]
  );

  const handleReorder = useCallback(async (next: AdminContentBlock[]) => {
    setIsSaving(true);
    setError("");
    try {
      const payload = next.map((b, idx) => ({ id: b.id, rank: idx }));
      const res = await fetch(`/admin/content-block/reorder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ blocks: payload }),
      });
      if (!res.ok) throw new Error(`Reorder failed: ${res.status}`);
      setBlocks(next);
    } catch (e: any) {
      setError(e?.message || "Failed to reorder blocks");
    } finally {
      setIsSaving(false);
    }
  }, []);

  const handleUpdate = useCallback(async (id: string, updates: Partial<AdminContentBlock>) => {
    setIsSaving(true);
    setError("");
    try {
      const res = await fetch(`/admin/content-block/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error(`Update failed: ${res.status}`);

      const json = await res.json();
      const updatedBlock: AdminContentBlock = json?.data;

      // Optimistic update: update block in state instead of re-fetching
      if (updatedBlock) {
        setBlocks((prev) =>
          prev.map((b) => (b.id === id ? updatedBlock : b))
        );
      }
    } catch (e: any) {
      setError(e?.message || "Failed to update block");
      // Refetch on error to restore correct state
      await fetchBlocks();
    } finally {
      setIsSaving(false);
    }
  }, [fetchBlocks]);

  const move = useCallback(
    (index: number, dir: -1 | 1) => {
      setBlocks((prev) => {
        const next = [...prev];
        const target = index + dir;
        if (target < 0 || target >= next.length) return prev;
        const tmp = next[index];
        next[index] = next[target];
        next[target] = tmp;
        // optimistic reorder
        handleReorder(next);
        return next;
      });
    },
    [handleReorder]
  );

  const isBusy = isLoading || isSaving;

  const handleAddDraft = useCallback(() => {
    const id = (globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`);
    const newDraft = makeEmptyDraft(id);
    setDrafts((prev) => [...prev, newDraft]);
  }, []);

  const handleDraftsChange = useCallback((newDrafts: DraftBlock[]) => {
    setDrafts(newDrafts);
  }, []);

  return (
    <Container className="p-0 divide-y">
      <div className="flex justify-between items-center px-6 py-4">
        <Heading level="h2">Content Blocks</Heading>
        <div className="flex gap-2 items-center">
          <Button
            variant="secondary"
            onClick={() => setIsCreateOpen(true)}
            disabled={!productId || isBusy}
          >
            Thêm block
          </Button>
        </div>
      </div>

      <BlockList<AdminContentBlock>
        blocks={blocks}
        isLoading={isLoading}
        error={error}
        isBusy={isBusy}
        onDelete={handleDelete}
        onReorder={handleReorder}
        onAddBlock={() => setIsCreateOpen(true)}
        showHeader={false}
        emptyMessage="Chưa có block nào."
        className=""
      />

      <CreateBlockModal
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        drafts={drafts}
        onDraftsChange={handleDraftsChange}
        onApplyTemplate={applyTemplate}
        onFormatJson={formatJson}
        onResetJson={resetJson}
        onAddDraft={handleAddDraft}
        onCreate={handleCreate}
        isDraftJsonValid={isDraftJsonValid}
        suggestedTemplates={SUGGESTED_TEMPLATES}
        defaultBlockTypes={DEFAULT_BLOCK_TYPES}
        isSaving={isSaving}
        productId={productId}
        existingBlocks={blocks}
        onDeleteExisting={handleDelete}
        onReorderExisting={handleReorder}
        onUpdateExisting={handleUpdate}
      />
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "product.details.side.after",
});

export default ProductContentBlocksWidget;
