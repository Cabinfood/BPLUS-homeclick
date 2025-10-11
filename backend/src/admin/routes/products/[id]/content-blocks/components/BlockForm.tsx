import { Input, Label, Select, Switch, Text, Textarea } from "@medusajs/ui";
import { MediaFile, TextFields, SpecsFields } from "../../../../../components/fields";
import { BlockFormData } from "../types";
import { BLOCK_TYPES, SUGGESTED_TEMPLATES } from "../constants";

type BlockFormProps = {
  formData: BlockFormData;
  onChange: (data: Partial<BlockFormData>) => void;
};

export const BlockForm = ({
  formData,
  onChange,
}: BlockFormProps) => {
  const handleTypeChange = (newType: string) => {
    onChange({
      block_type: newType,
      textForm: { content: "" },
      mediaForm: { type: "image" as const, url: "", thumbnail_url: "", alt: "", caption: "" },
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
    </div>
  );
};
