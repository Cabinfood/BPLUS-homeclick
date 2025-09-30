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
  FocusModal,
  Heading,
  IconButton,
  Input,
  Select,
  Text,
  Tooltip,
  Switch,
  ProgressAccordion,
  Alert,
  Badge,
} from "@medusajs/ui";
// local components
import TextFields, { TextBlockData } from "./components/fields/TextFields";
import MediaFile, { MediaFileBlockData } from "./components/fields/MediaFile";
import SpecsFields, { SpecsBlockData } from "./components/fields/SpecsFields";
import { Trash, MoreHorizontal, ArrowUp, ArrowDown, Plus, Trash2, Upload, Image, Video } from "lucide-react";
// react
import { useCallback, useEffect, useMemo, useState } from "react";

type AdminContentBlock = {
  id: string;
  title?: string | null;
  description?: string | null;
  block_type: string;
  block_data: Record<string, unknown>;
  rank?: number | null;
};

const DEFAULT_BLOCK_TYPES = [
  { value: "text", label: "Text" },
  { value: "media", label: "Media" },
  { value: "specs", label: "Specs" },
];

// simple suggested samples (mẫu gợi ý) theo block type
const SUGGESTED_TEMPLATES: Record<string, Record<string, unknown>> = {
  text: {
    title: "Mô tả",
    content: "Nội dung mô tả sản phẩm",
  },
  media: {
    type: "image",
    url: "https://example.com/image.jpg",
    alt: "Mô tả media",
    caption: "Chú thích ngắn",
  },
  specs: {
    items: [
      { key: "Kích thước", value: "200x100x50mm" },
      { key: "Chất liệu", value: "Gỗ sồi" },
    ],
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

const ProductContentBlocksWidget = ({
  data: product,
}: DetailWidgetProps<AdminProduct>) => {
  const productId = product?.id || "";

  const [blocks, setBlocks] = useState<AdminContentBlock[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [newType, setNewType] = useState<string>(DEFAULT_BLOCK_TYPES[0].value);
  const [newDataText, setNewDataText] = useState<string>("{}");
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  type DraftBlock = {
    id: string;
    type: string;
    title: string;
    description: string;
    showAdvanced: boolean;
    jsonText: string;
    textForm: TextBlockData;
    mediaForm: MediaFileBlockData;
    specsForm: SpecsBlockData;
  };
  const makeEmptyDraft = (id: string): DraftBlock => ({
    id,
    type: DEFAULT_BLOCK_TYPES[0].value,
    title: "",
    description: "",
    showAdvanced: false,
    jsonText: "{}",
    textForm: { title: "", content: "" },
    mediaForm: { type: "image", url: "", alt: "", caption: "" },
    specsForm: { items: [] },
  });
  const [drafts, setDrafts] = useState<DraftBlock[]>([]);

  // form states theo type
  const [textForm, setTextForm] = useState<TextBlockData>({ title: "", content: "" });
  const [mediaForm, setMediaForm] = useState<MediaFileBlockData>({ type: "image", url: "", alt: "", caption: "" });
  const [specsForm, setSpecsForm] = useState<SpecsBlockData>({ items: [] });

  const isDraftJsonValid = (d: DraftBlock) => !!jsonOrEmpty(d.jsonText);

  const applyTemplate = useCallback((idx: number) => {
    setDrafts((prev) => {
      const next = [...prev];
      const d = next[idx];
      const sample = SUGGESTED_TEMPLATES[d.type] || {};
      d.jsonText = JSON.stringify(sample, null, 2);
      if (d.type === "text") d.textForm = sample as TextBlockData;
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
      if (d.type === "text") d.textForm = { title: "", content: "" };
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
  }, [JSON.stringify(drafts.map((d) => ({ t: d.type, a: d.showAdvanced, tf: d.textForm, mf: d.mediaForm, sp: d.specsForm })))] )

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
        rank: idx,
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
      setIsCreateOpen(false);
      setDrafts([]);
      await fetchBlocks();
    } catch (e: any) {
      setError(e?.message || "Failed to create blocks");
    } finally {
      setIsSaving(false);
    }
  }, [drafts, productId, fetchBlocks]);

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
        setError(e?.message || "Failed to delete block");
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

      <div className="grid gap-3 px-6 py-4">
        {error && (
          <Text className="text-red-600" size="small">
            {error}
          </Text>
        )}
        {isLoading && <Text size="small">Đang tải...</Text>}

        {!isLoading && blocks.length === 0 && (
          <Text size="small">Chưa có block nào.</Text>
        )}

        {!isLoading && blocks.length > 0 && (
          <div className="flex overflow-hidden flex-col gap-2">
            {blocks.map((b, idx) => (
              <div
                key={b.id}
                className="flex justify-between items-center p-3 rounded border bg-ui-bg-base"
              >
                <div className="flex gap-3 items-center">
                  <div className="flex flex-col">
                    <div className="flex gap-2 items-center">
                      <Badge>{b.block_type}</Badge>
                      {b.rank !== null && b.rank !== undefined && (
                        <Text size="small" className="text-ui-fg-subtle">
                          #{(b.rank ?? 0) + 1}
                        </Text>
                      )}
                    </div>
                    {b.title && (
                      <Text size="small" className="font-medium text-ui-fg-base">
                        {b.title}
                      </Text>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <Button
                    size="small"
                    variant="secondary"
                    onClick={() => move(idx, -1)}
                    disabled={idx === 0 || isBusy}
                  >
                    <ArrowUp className="size-4"/>
                  </Button>
                  <Button
                    size="small"
                    variant="secondary"
                    onClick={() => move(idx, 1)}
                    disabled={idx === blocks.length - 1 || isBusy}
                  >
                    <ArrowDown className="size-4"/>
                  </Button>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(b.id)}
                    disabled={isBusy}
                  >
                    <Trash color="red" className="size-4"/>
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <FocusModal open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <FocusModal.Content>
          <FocusModal.Header>
            <FocusModal.Title>Content Block</FocusModal.Title>
          </FocusModal.Header>
          <FocusModal.Body className="container overflow-y-auto p-4 mx-auto h-full">
            <div className="grid gap-4">
              {/* Draft list */}
              <ProgressAccordion type="multiple">
                {drafts.map((d, idx) => (
                  <ProgressAccordion.Item key={d.id} value={d.id}>
                    <ProgressAccordion.Header>
                      <div className="flex justify-between items-center pr-2 w-full">
                        <Text weight="plus">#{idx + 1} - {d.type}</Text>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation()
                            setDrafts((prev) => prev.filter((x) => x.id !== d.id))
                          }}
                          disabled={drafts.length === 1}
                        >
                          <Trash className="size-4" />
                        </IconButton>
                      </div>
                    </ProgressAccordion.Header>
                    <ProgressAccordion.Content>
                      <div className="grid gap-3 p-3 rounded border">
                        <div className="grid flex-1 gap-2">
                          <Text size="small">Block Type</Text>
                          <Select
                            value={d.type}
                            onValueChange={(v) =>
                              setDrafts((prev) => prev.map((x) => (x.id === d.id ? { ...x, type: v } : x)))
                            }
                          >
                            <Select.Trigger>
                              <Select.Value placeholder="Chọn loại block" />
                            </Select.Trigger>
                            <Select.Content>
                              {DEFAULT_BLOCK_TYPES.map((opt) => (
                                <Select.Item key={opt.value} value={opt.value}>
                                  {opt.label}
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select>
                        </div>

                        {/* Title and Description Fields */}
                        <div className="grid gap-3">
                          <div className="grid gap-2">
                            <Text size="small">Title (tùy chọn)</Text>
                            <Input
                              value={d.title}
                              onChange={(e) =>
                                setDrafts((prev) => prev.map((x) => (x.id === d.id ? { ...x, title: e.target.value } : x)))
                              }
                              placeholder="Nhập tiêu đề block..."
                            />
                          </div>
                          <div className="grid gap-2">
                            <Text size="small">Description (tùy chọn)</Text>
                            <Input
                              value={d.description}
                              onChange={(e) =>
                                setDrafts((prev) => prev.map((x) => (x.id === d.id ? { ...x, description: e.target.value } : x)))
                              }
                              placeholder="Nhập mô tả block..."
                            />
                          </div>
                        </div>

                        {d.type === "text" && (
                          <TextFields
                            value={d.textForm}
                            onChange={(val) =>
                              setDrafts((prev) => prev.map((x) => (x.id === d.id ? { ...x, textForm: val } : x)))
                            }
                          />
                        )}
                        {d.type === "media" && (
                          <MediaFile
                            value={d.mediaForm}
                            onChange={(val) =>
                              setDrafts((prev) => prev.map((x) => (x.id === d.id ? { ...x, mediaForm: val } : x)))
                            }
                          />
                        )}
                        {d.type === "specs" && (
                          <SpecsFields
                            value={d.specsForm}
                            onChange={(val) =>
                              setDrafts((prev) => prev.map((x) => (x.id === d.id ? { ...x, specsForm: val } : x)))
                            }
                          />
                        )}

                        <div className="flex gap-2 items-center">
                          <Switch
                            checked={d.showAdvanced}
                            onCheckedChange={(v) =>
                              setDrafts((prev) => prev.map((x) => (x.id === d.id ? { ...x, showAdvanced: !!v } : x)))
                            }
                          />
                          <Text size="small">Advanced (JSON)</Text>
                        </div>
                        {d.showAdvanced && (
                          <div className="grid gap-2">
                            <div className="flex justify-between items-center">
                              <Text size="small">Block Data (JSON)</Text>
                              <div className="flex gap-2">
                                <Button size="small" variant="secondary" onClick={() => applyTemplate(idx)}>Dùng mẫu</Button>
                                <Button size="small" variant="secondary" onClick={() => formatJson(idx)} disabled={!isDraftJsonValid(d)}>Format JSON</Button>
                                <Button size="small" variant="secondary" onClick={() => resetJson(idx)}>Reset</Button>
                              </div>
                            </div>
                            <textarea
                              className={`min-h-[180px] font-mono text-[12px] rounded border px-3 py-2 bg-ui-bg-field ${
                                isDraftJsonValid(d) ? "border-ui-border" : "border-red-500"
                              }`}
                              value={d.jsonText}
                              onChange={(e) =>
                                setDrafts((prev) => prev.map((x) => (x.id === d.id ? { ...x, jsonText: e.target.value } : x)))
                              }
                              placeholder={JSON.stringify(SUGGESTED_TEMPLATES[d.type] || {}, null, 2)}
                            />
                            {!isDraftJsonValid(d) && (
                              <Text size="small" className="text-red-600">JSON không hợp lệ. Vui lòng kiểm tra định dạng.</Text>
                            )}
                          </div>
                        )}
                      </div>
                    </ProgressAccordion.Content>
                  </ProgressAccordion.Item>
                ))}
              </ProgressAccordion>

              <div className="flex items-center">
                <Button
                  variant="secondary"
                  onClick={() => setDrafts((prev) => {
                    const id = (globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`)
                    return [...prev, { id, type: DEFAULT_BLOCK_TYPES[0].value, title: "", description: "", showAdvanced: false, jsonText: "{}", textForm: { title: "", content: "" }, mediaForm: { type: "image", url: "", alt: "", caption: "" }, specsForm: { items: [] } }]
                  })}
                  className="flex gap-2 items-center"
                >
                  <Plus className="size-4" /> Thêm block
                </Button>
              </div>
            </div>
          </FocusModal.Body>
          <FocusModal.Footer>
            <FocusModal.Close asChild>
              <Button variant="secondary">Đóng</Button>
            </FocusModal.Close>
            <Button
              onClick={handleCreate}
              isLoading={isSaving}
              disabled={isSaving || !productId}
            >
              Tạo block
            </Button>
          </FocusModal.Footer>
        </FocusModal.Content>
      </FocusModal>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "product.details.side.after",
});

export default ProductContentBlocksWidget;
