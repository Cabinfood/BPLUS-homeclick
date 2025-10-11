// ui
import {
  Button,
  FocusModal,
  Input,
  Textarea,
  Label,
  Select,
  Switch,
  Text,
} from "@medusajs/ui";

// local components
import TextFields from "./fields/TextFields";
import MediaFile from "./fields/MediaFile";
import SpecsFields from "./fields/SpecsFields";
import HeroFields from "./fields/HeroFields";
import BentoGridFields from "./fields/BentoGridFields";
import FeaturesFields from "./fields/FeaturesFields";
import TestimonialsFields from "./fields/TestimonialsFields";
import { validateDraftBlock, validateJson } from "./validation";

// types
import type { DraftBlock } from "./types";

// react
import { useState, useCallback, useMemo } from "react";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (block: {
    block_type: string;
    block_data: Record<string, unknown>;
    title: string | null;
    description: string | null;
  }) => Promise<void>;
  isSaving: boolean;
  blockTypes: Array<{ value: string; label: string }>;
  suggestedTemplates: Record<string, Record<string, unknown>>;
};

export default function SimpleBlockForm({
  isOpen,
  onOpenChange,
  onSave,
  isSaving,
  blockTypes,
  suggestedTemplates,
}: Props) {
  // Initialize empty draft
  const [draft, setDraft] = useState<DraftBlock>({
    id: "new",
    type: blockTypes[0]?.value || "media",
    title: "",
    description: "",
    showAdvanced: false,
    jsonText: "{}",
    textForm: { content: "" },
    mediaForm: { type: "image", url: "", alt: "", caption: "" },
    specsForm: { items: [] },
    heroForm: { videoUrl: "", imageUrl: "", ctaButtons: [] },
    bentoGridForm: { items: [], moreText: "", moreHref: "" },
    featuresForm: { title: "", features: [] },
    testimonialsForm: { title: "", testimonials: [] },
  });

  // Reset form when modal opens
  const handleOpenChange = useCallback((open: boolean) => {
    if (open) {
      // Reset to default values
      const defaultType = blockTypes[0]?.value || "media";
      setDraft({
        id: "new",
        type: defaultType,
        title: "",
        description: "",
        showAdvanced: false,
        jsonText: "{}",
        textForm: { content: "" },
        mediaForm: { type: "image", url: "", alt: "", caption: "" },
        specsForm: { items: [] },
        heroForm: { videoUrl: "", imageUrl: "", ctaButtons: [] },
        bentoGridForm: { items: [], moreText: "", moreHref: "" },
        featuresForm: { title: "", features: [] },
        testimonialsForm: { title: "", testimonials: [] },
      });
    }
    onOpenChange(open);
  }, [blockTypes, onOpenChange]);

  const updateDraft = useCallback((updates: Partial<DraftBlock>) => {
    setDraft(prev => ({ ...prev, ...updates }));
  }, []);

  // Validation
  const validation = useMemo(() => {
    const result = validateDraftBlock(draft);
    const jsonResult = draft.showAdvanced ? validateJson(draft.jsonText) : { success: true, error: null };
    
    return {
      isValid: result.success && jsonResult.success,
      error: result.error || jsonResult.error,
    };
  }, [draft]);

  const handleTypeChange = useCallback((newType: string) => {
    setDraft(prev => ({
      ...prev,
      type: newType,
      // Reset forms when changing type
      textForm: { content: "" },
      mediaForm: { type: "image", url: "", alt: "", caption: "" },
      specsForm: { items: [] },
      heroForm: { videoUrl: "", imageUrl: "", ctaButtons: [] },
      bentoGridForm: { items: [], moreText: "", moreHref: "" },
      featuresForm: { title: "", features: [] },
      testimonialsForm: { title: "", testimonials: [] },
      jsonText: "{}",
    }));
  }, []);

  const handleApplyTemplate = useCallback(() => {
    const sample = suggestedTemplates[draft.type] || {};
    setDraft(prev => ({
      ...prev,
      jsonText: JSON.stringify(sample, null, 2),
    }));
  }, [draft.type, suggestedTemplates]);

  const handleFormatJson = useCallback(() => {
    try {
      const parsed = JSON.parse(draft.jsonText);
      setDraft(prev => ({
        ...prev,
        jsonText: JSON.stringify(parsed, null, 2),
      }));
    } catch {
      // Ignore invalid JSON
    }
  }, [draft.jsonText]);

  const handleResetJson = useCallback(() => {
    setDraft(prev => ({
      ...prev,
      jsonText: "{}",
    }));
  }, []);

  const handleSave = useCallback(async () => {
    if (!validation.isValid) return;

    // Build block data from form or JSON
    let blockData: Record<string, unknown>;

    if (draft.showAdvanced) {
      try {
        blockData = JSON.parse(draft.jsonText);
      } catch {
        return;
      }
    } else {
      // Use form data based on type
      switch (draft.type) {
        case "text":
          blockData = draft.textForm || { content: "" };
          break;
        case "media":
          blockData = draft.mediaForm || { type: "image", url: "", alt: "", caption: "" };
          break;
        case "specs":
          blockData = draft.specsForm || { items: [] };
          break;
        case "hero":
          blockData = draft.heroForm || { videoUrl: "", imageUrl: "", ctaButtons: [] };
          break;
        case "bento_grid":
          blockData = draft.bentoGridForm || { items: [], moreText: "", moreHref: "" };
          break;
        case "features":
          blockData = draft.featuresForm || { title: "", features: [] };
          break;
        case "testimonials":
          blockData = draft.testimonialsForm || { title: "", testimonials: [] };
          break;
        default:
          blockData = {};
      }
    }

    await onSave({
      block_type: draft.type,
      block_data: blockData,
      title: draft.title || null,
      description: draft.description || null,
    });
  }, [draft, validation.isValid, onSave]);

  return (
    <FocusModal open={isOpen} onOpenChange={handleOpenChange}>
      <FocusModal.Content>
        <FocusModal.Header>
          <FocusModal.Title className="text-xl font-semibold">
            Tạo Block Mới
          </FocusModal.Title>
        </FocusModal.Header>

        <FocusModal.Body className="overflow-y-auto p-6 space-y-4">
          {/* Block Type */}
          <div className="space-y-2">
            <Label>Loại Block</Label>
            <Select value={draft.type} onValueChange={handleTypeChange}>
              <Select.Trigger>
                <Select.Value placeholder="Chọn loại block" />
              </Select.Trigger>
              <Select.Content>
                {blockTypes.map((opt) => (
                  <Select.Item key={opt.value} value={opt.value}>
                    {opt.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label>Tiêu đề (tùy chọn)</Label>
            <Input
              value={draft.title}
              onChange={(e) => updateDraft({ title: e.target.value })}
              placeholder="Nhập tiêu đề"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Mô tả (tùy chọn)</Label>
            <Textarea
              value={draft.description}
              onChange={(e) => updateDraft({ description: e.target.value })}
              placeholder="Nhập mô tả"
              rows={2}
            />
          </div>

          {/* Type-specific fields */}
          {draft.type === "text" && (
            <TextFields
              value={draft.textForm}
              onChange={(val) => updateDraft({ textForm: val })}
            />
          )}
          {draft.type === "media" && (
            <MediaFile
              value={draft.mediaForm}
              onChange={(val) => updateDraft({ mediaForm: val })}
            />
          )}
          {draft.type === "specs" && (
            <SpecsFields
              value={draft.specsForm}
              onChange={(val) => updateDraft({ specsForm: val })}
            />
          )}
          {draft.type === "hero" && (
            <HeroFields
              value={draft.heroForm || { videoUrl: "", imageUrl: "", ctaButtons: [] }}
              onChange={(val) => {
                updateDraft({
                  heroForm: val,
                  jsonText: JSON.stringify(val, null, 2),
                });
              }}
            />
          )}
          {draft.type === "bento_grid" && (
            <BentoGridFields
              value={draft.bentoGridForm || { items: [], moreText: "", moreHref: "" }}
              onChange={(val) => {
                updateDraft({
                  bentoGridForm: val,
                  jsonText: JSON.stringify(val, null, 2),
                });
              }}
            />
          )}
          {draft.type === "features" && (
            <FeaturesFields
              value={draft.featuresForm || { title: "", features: [] }}
              onChange={(val) => {
                updateDraft({
                  featuresForm: val,
                  jsonText: JSON.stringify(val, null, 2),
                });
              }}
            />
          )}
          {draft.type === "testimonials" && (
            <TestimonialsFields
              value={draft.testimonialsForm || { title: "", testimonials: [] }}
              onChange={(val) => {
                updateDraft({
                  testimonialsForm: val,
                  jsonText: JSON.stringify(val, null, 2),
                });
              }}
            />
          )}

          {/* Advanced mode toggle */}
          <div className="pt-4 border-t">
            <div className="flex gap-2 items-center mb-4">
              <Switch
                checked={draft.showAdvanced}
                onCheckedChange={(checked) => {
                  const enable = !!checked;
                  if (enable) {
                    // Sync current form data to JSON
                    let jsonData: any = {};
                    switch (draft.type) {
                      case "text":
                        jsonData = draft.textForm;
                        break;
                      case "media":
                        jsonData = draft.mediaForm;
                        break;
                      case "specs":
                        jsonData = draft.specsForm;
                        break;
                      case "hero":
                        jsonData = draft.heroForm;
                        break;
                      case "bento_grid":
                        jsonData = draft.bentoGridForm;
                        break;
                      case "features":
                        jsonData = draft.featuresForm;
                        break;
                      case "testimonials":
                        jsonData = draft.testimonialsForm;
                        break;
                    }
                    updateDraft({
                      showAdvanced: enable,
                      jsonText: JSON.stringify(jsonData, null, 2),
                    });
                  } else {
                    updateDraft({ showAdvanced: enable });
                  }
                }}
              />
              <Text size="small">Chế độ nâng cao (JSON)</Text>
            </div>

            {/* Advanced JSON editor */}
            {draft.showAdvanced && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button size="small" variant="secondary" onClick={handleApplyTemplate}>
                    Dùng mẫu
                  </Button>
                  <Button size="small" variant="secondary" onClick={handleFormatJson}>
                    Format JSON
                  </Button>
                  <Button size="small" variant="secondary" onClick={handleResetJson}>
                    Reset
                  </Button>
                </div>
                <textarea
                  className="min-h-[200px] w-full font-mono text-[12px] rounded border px-3 py-2 bg-ui-bg-field"
                  value={draft.jsonText}
                  onChange={(e) => updateDraft({ jsonText: e.target.value })}
                  placeholder={JSON.stringify(suggestedTemplates[draft.type] || {}, null, 2)}
                />
              </div>
            )}
          </div>

          {/* Validation Error */}
          {validation.error && (
            <div className="p-3 rounded bg-red-50 border border-red-200">
              <Text size="small" className="text-red-600">
                {validation.error}
              </Text>
            </div>
          )}
        </FocusModal.Body>

        <FocusModal.Footer>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => handleOpenChange(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleSave}
              isLoading={isSaving}
              disabled={isSaving || !validation.isValid}
            >
              Lưu Block
            </Button>
          </div>
        </FocusModal.Footer>
      </FocusModal.Content>
    </FocusModal>
  );
}
