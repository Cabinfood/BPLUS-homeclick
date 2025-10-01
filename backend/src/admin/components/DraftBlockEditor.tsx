// ui
import {
  Button,
  Input,
  Text,
  Textarea,
  Label,
  Select,
  Switch,
  IconButton,
} from "@medusajs/ui";

// icons
import { ArrowLeft, ArrowRight } from "lucide-react";

// hooks
import { useMemo, useState, useEffect, useCallback } from "react";

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

type Props = {
  draft: DraftBlock;
  index: number;
  totalCount: number;
  onDraftChange: (draft: DraftBlock) => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  onApplyTemplate: () => void;
  onFormatJson: () => void;
  onResetJson: () => void;
  isDraftJsonValid: boolean;
  suggestedTemplates: Record<string, Record<string, unknown>>;
  defaultBlockTypes: Array<{ value: string; label: string }>;
  validationError?: string | null;
};

export default function DraftBlockEditor({
  draft,
  index,
  totalCount,
  onDraftChange,
  onNavigate,
  onApplyTemplate,
  onFormatJson,
  onResetJson,
  isDraftJsonValid,
  suggestedTemplates,
  defaultBlockTypes,
  validationError,
}: Props) {
  // Local state for form fields to prevent focus loss
  const [localTitle, setLocalTitle] = useState(draft.title || "");
  const [localDescription, setLocalDescription] = useState(draft.description || "");

  // Sync local state when draft changes (e.g., when switching between blocks)
  useEffect(() => {
    setLocalTitle(draft.title || "");
    setLocalDescription(draft.description || "");
  }, [draft.id]); // Only depend on draft.id to avoid unnecessary updates

  const updateDraft = useCallback((updates: Partial<DraftBlock>) => {
    onDraftChange({ ...draft, ...updates });
  }, [onDraftChange]); // Remove draft dependency to prevent unnecessary re-creation

  // Memoized validation to prevent unnecessary re-renders
  const fieldValidation = useMemo(() => {
    const result = validateDraftBlock(draft);
    const jsonResult = draft.showAdvanced ? validateJson(draft.jsonText) : { success: true, error: null };
    
    return {
      content: draft.type === 'text' ? result.error : null,
      url: draft.type === 'media' ? result.error : null,
      specs: draft.type === 'specs' ? result.error : null,
      json: draft.showAdvanced ? jsonResult.error : null,
    };
  }, [draft]);

  // Helper function to get field-specific validation error
  const getFieldError = useCallback((field: string): string | null => {
    return fieldValidation[field as keyof typeof fieldValidation] || null;
  }, [fieldValidation]);

  // Memoized helper component for field with validation
  const FieldWithValidation = useCallback(({ 
    label, 
    required = false, 
    field, 
    children 
  }: { 
    label: string; 
    required?: boolean; 
    field: string; 
    children: React.ReactNode; 
  }) => {
    const fieldError = getFieldError(field);
    
    return (
      <div className="space-y-2">
        <Label className={fieldError ? "text-red-600" : ""}>
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </Label>
        {children}
        {fieldError && (
          <Text size="small" className="text-red-600">
            {fieldError}
          </Text>
        )}
      </div>
    );
  }, [getFieldError]);

  const handleTypeChange = useCallback((newType: string) => {
    onDraftChange({ 
      ...draft,
      type: newType,
      // Reset forms when changing type
      textForm: { content: "" },
      mediaForm: { type: "image", url: "", alt: "", caption: "" },
      specsForm: { items: [] },
      heroForm: {
        videoUrl: "",
        imageUrl: "",
        ctaButtons: [],
      },
      bentoGridForm: {
        items: [],
        moreText: "",
        moreHref: "",
      },
      featuresForm: { title: "", features: [] },
      testimonialsForm: { title: "", testimonials: [] },
      jsonText: "{}"
    });
  }, [draft, onDraftChange]);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalTitle(e.target.value);
  }, []);

  const handleTitleBlur = useCallback(() => {
    if (localTitle !== draft.title) {
      onDraftChange({ ...draft, title: localTitle });
    }
  }, [draft, localTitle, onDraftChange]);

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalDescription(e.target.value);
  }, []);

  const handleDescriptionBlur = useCallback(() => {
    if (localDescription !== draft.description) {
      onDraftChange({ ...draft, description: localDescription });
    }
  }, [draft, localDescription, onDraftChange]);

  return (
    <div className="flex flex-col h-full">
      {/* Header with navigation */}
      <div className="flex justify-between items-center p-3 border-b">
        <div className="flex gap-2 items-center">
          <Text weight="plus">
            Block #{index + 1} - {draft.type}
          </Text>
          <Text size="small" className="text-ui-fg-muted">
            ({index + 1} of {totalCount})
          </Text>
        </div>
        <div className="flex gap-1 items-center">
          <IconButton
            size="small"
            variant="transparent"
            onClick={() => onNavigate('prev')}
            disabled={index === 0}
          >
            <ArrowLeft className="size-4" />
          </IconButton>
          <IconButton
            size="small"
            variant="transparent"
            onClick={() => onNavigate('next')}
            disabled={index === totalCount - 1}
          >
            <ArrowRight className="size-4" />
          </IconButton>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto flex-1 p-4 space-y-4">
        {/* Block Type */}
        <div className="space-y-2">
          <Label>Block Type</Label>
          <Select value={draft.type} onValueChange={handleTypeChange}>
            <Select.Trigger>
              <Select.Value placeholder="Chọn loại block" />
            </Select.Trigger>
            <Select.Content>
              {defaultBlockTypes.map((opt) => (
                <Select.Item key={opt.value} value={opt.value}>
                  {opt.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>

        {/* Title and Description for content_block columns */}
        <div className="space-y-4">
          <FieldWithValidation label="Title" field="title">
            <Input
              value={localTitle}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              placeholder="Type title"
            />
          </FieldWithValidation>
          <FieldWithValidation label="Description" field="description">
            <Textarea
              value={localDescription}
              onChange={handleDescriptionChange}
              onBlur={handleDescriptionBlur}
              placeholder="Type description"
            />
          </FieldWithValidation>
        </div>

        {/* Type-specific fields */}
        {draft.type === "text" && (
          <TextFields
            value={draft.textForm}
            onChange={(val) => onDraftChange({ ...draft, textForm: val })}
            validationError={getFieldError('content')}
          />
        )}
        {draft.type === "media" && (
          <MediaFile
            value={draft.mediaForm}
            onChange={(val) => onDraftChange({ ...draft, mediaForm: val })}
            validationError={getFieldError('url')}
          />
        )}
        {draft.type === "specs" && (
          <SpecsFields
            value={draft.specsForm}
            onChange={(val) => onDraftChange({ ...draft, specsForm: val })}
            validationError={getFieldError('specs')}
          />
        )}
        {draft.type === "hero" && (
          <HeroFields
            value={draft.heroForm || { videoUrl: "", imageUrl: "", ctaButtons: [] }}
            onChange={(val) => {
              const next = { ...draft, heroForm: val };
              // Sync JSON to reflect form changes so Advanced view is accurate
              next.jsonText = JSON.stringify(val, null, 2);
              onDraftChange(next);
            }}
          />
        )}
        {draft.type === "bento_grid" && (
          <BentoGridFields
            value={draft.bentoGridForm || { items: [], moreText: "", moreHref: "" }}
            onChange={(val) => {
              const next = { ...draft, bentoGridForm: val };
              // Sync JSON to reflect form changes
              next.jsonText = JSON.stringify(val, null, 2);
              onDraftChange(next);
            }}
          />
        )}
        {draft.type === "features" && (
          <FeaturesFields
            value={draft.featuresForm || { title: "", features: [] }}
            onChange={(val) => {
              const next = { ...draft, featuresForm: val } as DraftBlock;
              next.jsonText = JSON.stringify(val, null, 2);
              onDraftChange(next);
            }}
          />
        )}
        {draft.type === "testimonials" && (
          <TestimonialsFields
            value={draft.testimonialsForm || { title: "", testimonials: [] }}
            onChange={(val) => {
              const next = { ...draft, testimonialsForm: val } as DraftBlock;
              next.jsonText = JSON.stringify(val, null, 2);
              onDraftChange(next);
            }}
          />
        )}

        {/* Advanced mode toggle */}
        <div className="flex gap-2 items-center">
          <Switch
            checked={draft.showAdvanced}
            onCheckedChange={(checked) => {
              const enable = !!checked;
              const next = { ...draft, showAdvanced: enable } as DraftBlock;
              // When enabling Advanced, ensure JSON mirrors current form state
              if (enable) {
                if (next.type === 'text' && next.textForm) {
                  next.jsonText = JSON.stringify(next.textForm, null, 2);
                } else if (next.type === 'media' && next.mediaForm) {
                  next.jsonText = JSON.stringify(next.mediaForm, null, 2);
                } else if (next.type === 'specs' && next.specsForm) {
                  next.jsonText = JSON.stringify(next.specsForm, null, 2);
                } else if (next.type === 'hero' && next.heroForm) {
                  next.jsonText = JSON.stringify(next.heroForm, null, 2);
                } else if (next.type === 'bento_grid' && next.bentoGridForm) {
                  next.jsonText = JSON.stringify(next.bentoGridForm, null, 2);
                } else if (next.type === 'features' && next.featuresForm) {
                  next.jsonText = JSON.stringify(next.featuresForm, null, 2);
                } else if (next.type === 'testimonials' && next.testimonialsForm) {
                  next.jsonText = JSON.stringify(next.testimonialsForm, null, 2);
                }
              }
              onDraftChange(next);
            }}
          />
          <Text size="small">Advanced (JSON)</Text>
        </div>

        {/* Advanced JSON editor */}
        {draft.showAdvanced && (
          <FieldWithValidation label="Block Data (JSON)" field="json">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button size="small" variant="secondary" onClick={onApplyTemplate}>
                    Dùng mẫu
                  </Button>
                  <Button 
                    size="small" 
                    variant="secondary" 
                    onClick={onFormatJson}
                    disabled={!isDraftJsonValid}
                  >
                    Format JSON
                  </Button>
                  <Button size="small" variant="secondary" onClick={onResetJson}>
                    Reset
                  </Button>
                </div>
              </div>
              <textarea
                className={`min-h-[200px] w-full font-mono text-[12px] rounded border px-3 py-2 bg-ui-bg-field ${
                  isDraftJsonValid ? "border-ui-border" : "border-red-500"
                }`}
                value={draft.jsonText}
                onChange={(e) => onDraftChange({ ...draft, jsonText: e.target.value })}
                placeholder={JSON.stringify(suggestedTemplates[draft.type] || {}, null, 2)}
              />
            </div>
          </FieldWithValidation>
        )}
      </div>
    </div>
  );
}
