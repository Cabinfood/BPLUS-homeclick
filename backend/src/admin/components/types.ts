// types for content block components
export type AdminContentBlock = {
  id: string;
  title?: string | null;
  description?: string | null;
  block_type: string;
  block_data: Record<string, unknown>;
  rank?: number | null;
};

export type DraftBlock = {
  id: string;
  type: string;
  title: string;
  description: string;
  showAdvanced: boolean;
  jsonText: string;
  textForm: TextBlockData;
  mediaForm: MediaFileBlockData;
  specsForm: SpecsBlockData;
  // Landing forms (optional for landing block types)
  heroForm?: {
    videoUrl?: string;
    imageUrl?: string;
    ctaButtons: Array<{
      text: string;
      href: string;
      variant?: 'primary' | 'secondary' | 'transparent' | 'danger';
      icon?: string;
    }>;
  };
  bentoGridForm?: {
    items: Array<{
      id: string;
      title: string;
      description?: string;
      imageUrl?: string;
      href?: string;
      size?: 'small' | 'medium' | 'large';
    }>;
    moreText?: string;
    moreHref?: string;
  };
  featuresForm?: FeaturesBlockData;
  testimonialsForm?: TestimonialsBlockData;
};

export type TextBlockData = {
  content: string;
};

export type MediaFileBlockData = {
  type: 'image' | 'video';
  url: string;
  alt?: string;
  caption?: string;
};

export type SpecItem = { 
  key: string; 
  value: string; 
};

export type SpecsBlockData = { 
  items: SpecItem[]; 
};

// Landing: features block data
export type FeaturesBlockData = {
  title: string;
  features: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
};

// Landing: testimonials block data
export type TestimonialsBlockData = {
  title: string;
  testimonials: Array<{
    name: string;
    role: string;
    content: string;
    avatar?: string;
    rating: number;
  }>;
};
