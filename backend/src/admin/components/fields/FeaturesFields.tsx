// ui
import { Button, Input, Label, Textarea, Text, ProgressAccordion } from "@medusajs/ui";

// react
import { useCallback } from "react";

// types
type FeatureItem = {
  icon?: string;
  title: string;
  description: string;
};

export type FeaturesFormValue = {
  title: string;
  features: FeatureItem[];
};

type Props = {
  value: FeaturesFormValue;
  onChange: (val: FeaturesFormValue) => void;
  validationError?: string | null;
};

export default function FeaturesFields({ value, onChange, validationError }: Props) {
  const update = useCallback((patch: Partial<FeaturesFormValue>) => {
    onChange({ ...value, ...patch });
  }, [value, onChange]);

  const updateItem = useCallback((index: number, patch: Partial<FeatureItem>) => {
    const next = [...(value.features || [])];
    next[index] = { ...next[index], ...patch } as FeatureItem;
    update({ features: next });
  }, [value.features, update]);

  const removeItem = useCallback((index: number) => {
    const next = [...(value.features || [])];
    next.splice(index, 1);
    update({ features: next });
  }, [value.features, update]);

  const addItem = useCallback(() => {
    const next = [...(value.features || []), { title: "", description: "" }];
    update({ features: next });
  }, [value.features, update]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Section Title</Label>
        <Input
          value={value.title || ""}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="Why Choose Us"
        />
      </div>

      <div className="flex justify-between items-center">
        <Label>Features</Label>
        <Button size="small" variant="secondary" onClick={addItem}>
          Thêm feature
        </Button>
      </div>

      <div className="overflow-y-auto space-y-4 max-h-48">
        {value.features && value.features.length > 0 ? (
          <div className="px-1 w-full">
            <ProgressAccordion type="multiple">
              {value.features.map((it, idx) => (
                <ProgressAccordion.Item key={idx} value={`feature-${idx}`}>
                  <ProgressAccordion.Header>
                    {it.title?.trim() ? it.title : `Feature #${idx + 1}`}
                  </ProgressAccordion.Header>
                  <ProgressAccordion.Content>
                    <div className="pb-6 space-y-3">
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={it.title || ""}
                            onChange={(e) => updateItem(idx, { title: e.target.value })}
                            placeholder="Quality"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Icon (optional)</Label>
                          <Input
                            value={it.icon || ""}
                            onChange={(e) => updateItem(idx, { icon: e.target.value })}
                            placeholder="e.g. sparkles"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={it.description || ""}
                          onChange={(e) => updateItem(idx, { description: e.target.value })}
                          placeholder="Top-tier materials and build."
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button size="small" variant="danger" onClick={() => removeItem(idx)}>
                          Xoá
                        </Button>
                      </div>
                    </div>
                  </ProgressAccordion.Content>
                </ProgressAccordion.Item>
              ))}
            </ProgressAccordion>
          </div>
        ) : (
          <Text size="small" className="text-ui-fg-muted">Chưa có feature nào.</Text>
        )}
      </div>

      {validationError && (
        <Text size="small" className="text-red-600">{validationError}</Text>
      )}
    </div>
  );
}


