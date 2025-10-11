import type { MediaFileBlockData, TextBlockData, SpecsBlockData } from "../../../../components/fields";

export type ContentBlock = {
  id: string;
  title: string | null;
  description: string | null;
  block_type: string;
  block_data: any;
  rank: number;
  product_id: string;
};

export type BlockFormData = {
  block_type: string;
  title: string;
  description: string;
  block_data: any;
  showAdvanced: boolean;
  jsonText: string;
  // Form data for specific types
  textForm: TextBlockData;
  mediaForm: MediaFileBlockData;
  specsForm: SpecsBlockData;
};
