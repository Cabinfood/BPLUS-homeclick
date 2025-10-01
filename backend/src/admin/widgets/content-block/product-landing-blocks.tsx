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
import type { AdminContentBlock, DraftBlock } from "../../components/types";

// react
import { useCallback, useEffect, useState } from "react";

// Landing block types we support
const LANDING_BLOCK_TYPES = [
  { value: "hero", label: "Hero" },
  { value: "bento_grid", label: "Bento Grid" },
  { value: "features", label: "Features" },
  { value: "testimonials", label: "Testimonials" },
];

// Suggested templates matching @landing-hero.tsx and @landing-bento-grid.tsx
const SUGGESTED_TEMPLATES: Record<string, Record<string, unknown>> = {
  hero: {
    videoUrl: "https://example.com/hero.mp4",
    imageUrl: "https://example.com/hero.jpg",
    ctaButtons: [
      { text: "Explore", href: "#products", variant: "primary" },
      { text: "Learn More", href: "/about", variant: "secondary" },
    ],
  },
  bento_grid: {
    items: [
      {
        id: "featured-1",
        title: "Featured Collection",
        description: "Discover our curated selection",
        imageUrl: "https://example.com/item-1.jpg",
        href: "/collections/featured",
        size: "large",
      },
      {
        id: "new-arrivals",
        title: "New Arrivals",
        description: "Latest additions to our store",
        imageUrl: "https://example.com/item-2.jpg",
        href: "/collections/new",
        size: "medium",
      },
      {
        id: "best-sellers",
        title: "Best Sellers",
        description: "Customer favorites",
        imageUrl: "https://example.com/item-3.jpg",
        href: "/collections/best-sellers",
        size: "small",
      },
    ],
    moreText: "View All Products",
    moreHref: "/store",
  },
  features: {
    title: "Why Choose Us",
    features: [
      { title: "Quality", description: "Top-tier materials and build." },
      { title: "Design", description: "Modern and elegant." },
      { title: "Support", description: "We’re here to help." },
    ],
  },
  testimonials: {
    title: "What Our Customers Say",
    testimonials: [
      { name: "Jane", role: "Designer", content: "Love it!", rating: 5 },
      { name: "John", role: "Architect", content: "Great support.", rating: 4 },
    ],
  },
  cta: {
    title: "Ready to explore?",
    description: "Find the perfect product for your space.",
    buttons: [
      { text: "Shop Now", href: "/store", variant: "primary" },
      { text: "Contact Us", href: "/contact", variant: "secondary" },
    ],
    backgroundImage: "https://example.com/cta-bg.jpg",
  },
};

const jsonOrEmpty = (value: string): Record<string, unknown> | null => {
  try {
    const parsed = JSON.parse(value);
    return typeof parsed === "object" && parsed !== null ? parsed : null;
  } catch {
    return null;
  }
};

const ProductLandingBlocksWidget = ({
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
    // default to hero
    type: LANDING_BLOCK_TYPES[0].value,
    title: "",
    description: "",
    // force advanced mode by default for landing blocks
    showAdvanced: true,
    jsonText: JSON.stringify(SUGGESTED_TEMPLATES[LANDING_BLOCK_TYPES[0].value] || {}, null, 2),
    // unused for landing types, but required by type
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
      d.jsonText = JSON.stringify(SUGGESTED_TEMPLATES[d.type] || {}, null, 2);
      return next;
    });
  }, []);

  // Đồng bộ field -> JSON cho landing types khi không bật Advanced
  useEffect(() => {
    setDrafts((prev) =>
      prev.map((d) => {
        if (!d.showAdvanced) {
          let obj: any = {};
          if (d.type === "hero" && d.heroForm) obj = d.heroForm;
          if (d.type === "bento_grid" && d.bentoGridForm) obj = d.bentoGridForm;
          return { ...d, jsonText: JSON.stringify(obj, null, 2) };
        }
        return d;
      })
    );
  }, [JSON.stringify(drafts.map((d) => ({ t: d.type, a: d.showAdvanced, hf: d.heroForm, bf: d.bentoGridForm })))]);

  const fetchBlocks = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const landingTypes = LANDING_BLOCK_TYPES.map((t) => t.value).join(",");
      const res = await fetch(`/admin/content-block?block_type=${landingTypes}`, {
        credentials: "include",
      });
      if (res.status === 404 || res.status === 204) {
        setBlocks([]);
        return;
      }
      if (!res.ok) {
        let msg = "";
        try {
          const errJson = await res.json();
          msg = errJson?.message || "";
        } catch {}
        throw new Error(msg || "Không thể tải Landing Blocks. Vui lòng thử lại.");
      }
      const json = await res.json();
      const list: AdminContentBlock[] = json?.data || [];
      const sorted = [...list].sort((a, b) => (a.rank || 0) - (b.rank || 0));
      setBlocks(sorted);
    } catch (e: any) {
      setError(e?.message || "Failed to load landing blocks");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlocks();
  }, [fetchBlocks]);

  const handleCreate = useCallback(async () => {
    const blocksPayload: any[] = [];
    // Calculate the starting rank for new blocks
    const maxExistingRank = blocks.length > 0 ? Math.max(...blocks.map((block) => block.rank || 0)) : -1;
    const startingRank = maxExistingRank + 1;

    for (let idx = 0; idx < drafts.length; idx++) {
      const d = drafts[idx];
      const blockData = jsonOrEmpty(d.jsonText);
      if (!blockData) {
        setError(`blockData không hợp lệ (JSON) ở block #${idx + 1}`);
        return;
      }
      blocksPayload.push({
        block_type: d.type,
        block_data: blockData,
        rank: startingRank + idx,
        title: d.title || null,
        description: d.description || null,
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
      setIsCreateOpen(false);
      setDrafts([]);
      await fetchBlocks();
    } catch (e: any) {
      setError(e?.message || "Failed to create landing blocks");
    } finally {
      setIsSaving(false);
    }
  }, [drafts, blocks, fetchBlocks]);

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
        await fetchBlocks();
      } catch (e: any) {
        setError(e?.message || "Failed to delete landing block");
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
      setError(e?.message || "Failed to reorder landing blocks");
    } finally {
      setIsSaving(false);
    }
  }, []);

  const handleUpdate = useCallback(
    async (id: string, updates: Partial<AdminContentBlock>) => {
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
        await fetchBlocks();
      } catch (e: any) {
        setError(e?.message || "Failed to update landing block");
      } finally {
        setIsSaving(false);
      }
    },
    [fetchBlocks]
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
        <Heading level="h2">Landing Blocks (Global)</Heading>
        <div className="flex gap-2 items-center">
          <Button
            variant="secondary"
            onClick={() => setIsCreateOpen(true)}
            disabled={isBusy}
          >
            Thêm landing block
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
        emptyMessage="Chưa có landing block nào."
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
        defaultBlockTypes={LANDING_BLOCK_TYPES}
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
  // Temporarily attach below product details to make it visible in admin; can be moved to a dedicated zone later
  zone: "product.details.side.after",
});

export default ProductLandingBlocksWidget;
