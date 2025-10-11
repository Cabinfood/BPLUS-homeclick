import type { BlockFormData } from "./types";

export const BLOCK_TYPES = [
  { value: "media", label: "Media" },
  { value: "text", label: "Text" },
  { value: "specs", label: "Specs" },
];

export const SUGGESTED_TEMPLATES: Record<string, any> = {
  media: {
    type: "image",
    url: "https://example.com/image.jpg",
    thumbnail_url: "https://example.com/thumb.jpg", // For videos
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

export const DEFAULT_FORM_DATA: BlockFormData = {
  block_type: "media",
  title: "",
  description: "",
  block_data: {},
  showAdvanced: false,
  jsonText: "{}",
  textForm: { content: "" },
  mediaForm: { type: "image" as const, url: "", thumbnail_url: "", alt: "", caption: "" },
  specsForm: { items: [] },
};
