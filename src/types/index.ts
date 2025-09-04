export interface Block {
  type: "text" | "image";
  content?: string;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;  
}

export interface PostEditorData {
  slug?: string;
  title?: string;
  subtitle?: string;
  locale?: "en" | "pt";
  blocks?: Block[];
  publishedAt?: string;
  relatedSlug?: string;
  thumbnail?: string;
  thumbnailAlt?: string;
}

export interface PostJsonPayload {
  title: string;
  subtitle: string;
  locale: 'en' | 'pt';
  publishedAt?: string;
  relatedSlug?: string;
  thumbnailSrc?: string;
  thumbnailAlt?: string;
  blocks: Block[];
}

export interface ProcessedImageResult {
  imageUrl: string;
  thumbnailUrl: string;
  width: number;
  height: number;
}

export interface BlockEditorProps {
  block: Block;
  index: number;
  onBlockChange: (index: number, field: string, value: string | File | undefined) => void;
  onRemoveBlock: (index: number) => void;
  onThumbnailSelection: (block: Block) => void;
  isThumbnail: boolean;
  isCompressing: boolean;
  isUploading: boolean;
}

export interface PostPreviewProps {
  title: string;
  subtitle: string;
  blocks: Block[];
}

export interface PostMetadataInputsProps {
  title: string;
  onTitleChange: (value: string) => void;
  subtitle: string;
  onSubtitleChange: (value: string) => void;
  locale: 'en' | 'pt';
  onLocaleChange: (value: 'en' | 'pt') => void;
  publishedAt: string;
  onPublishedAtChange: (value: string) => void;
  relatedSlug: string;
  onRelatedSlugChange: (value: string) => void;
  availableSlugs: string[];
  thumbnailAlt: string;
  onThumbnailAltChange: (value: string) => void;
}

export interface PostSummary {
  id?: string;
  slug: string;
  title: string;
  subtitle: string;
  thumbnail: string | null;
  createdAt?: string;
  thumbnailAlt?: string;
  thumbnailWidth?: number;
  thumbnailHeight?: number;
}

export interface PostCardData {
  slug: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  thumbnailAlt?: string;
  thumbnailWidth?: number;
  thumbnailHeight?: number;
}

export interface PostCardProps {
  post: PostCardData;
  locale: string;
}

export interface BlogListProps {
  posts: PostSummary[];
}

export interface RecommendedPostsProps {
  posts: PostSummary[];
  locale: string;
}

export interface NavPost {
  slug: string;
  title: string;
}

export interface PostNavigationProps {
  previousPost: NavPost | null;
  nextPost: NavPost | null;
  locale: string;
}

