// CORE DATA STRUCTURES 
/**
 * Represents a single content block within a post's body.
 * Used by the editor and the final post page.
 */
export interface Block {
  type: "text" | "image";
  content?: string;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  file?: File; // Only used transiently in the client-side editor
}

/**
 * Represents the full data of a single, detailed post.
 * This is the main object returned for the `[slug]/page.tsx`.
 */
export interface PostFull {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  locale: string;
  publishedAt?: string;
  relatedSlug?: string;
  thumbnail?: string;
  thumbnailAlt?: string;
  blocks?: Block[];
}

/**
 * Represents a summarized version of a post, used for all lists and cards.
 * This is the object returned by `getPosts` and for recommended posts.
 */
export interface PostSummary {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  locale: string;
  publishedAt?: string;
  thumbnail?: string | null;
  thumbnailSrc?: string; // Legacy or alternative field from admin page
  thumbnailAlt?: string;
  thumbnailWidth?: number;
  thumbnailHeight?: number;
  createdAt?: string;
}

// ========================================================================
// API & PAGE PAYLOADS (Estruturas de Dados para API e Páginas)


/**
 * Represents a simplified post object for navigation links (Previous/Next).
 */
export interface NavPost {
  slug: string;
  title: string;
}

/**
 * Defines the complete data payload for the blog post page (`[slug]/page.tsx`).
 */
export interface PostPageData {
  post: PostFull;
  navigation: {
    previous: NavPost | null;
    next: NavPost | null;
  };
  recommended: PostSummary[];
}

/**
 * Defines the shape of the JSON payload sent to the backend API when creating/updating a post.
 */
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

/**
 * Defines the shape of the data returned by the image upload endpoint.
 */
export interface ProcessedImageResult {
  imageUrl: string;
  thumbnailUrl: string;
  width: number;
  height: number;
}

// COMPONENT PROPS
/**
 * Props for the `PostEditorForm` component, defining the initial data it can receive.
 */
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

/**
 * Props for the `BlogList` component.
 */
export interface BlogListProps {
  posts: PostSummary[];
}

/**
 * Props for the `RecommendedPosts` component.
 */
export interface RecommendedPostsProps {
  posts: PostSummary[];
  locale: string;
}

/**
 * Represents the data specifically required by the `PostCard` component.
 */
export interface PostCardData {
  slug: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  thumbnailAlt?: string;
  thumbnailWidth?: number;
  thumbnailHeight?: number;
}

/**
 * Props for the `PostCard` component.
 */
export interface PostCardProps {
  post: PostCardData;
  locale: string;
  priority?: boolean;
}

/**
 * Props for the `PostNavigation` component.
 */
export interface PostNavigationProps {
  previousPost: NavPost | null;
  nextPost: NavPost | null;
  locale: string;
}

/**
 * Props for the `BlockEditor` component.
 */
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

/**
 * Props for the `PostPreview` component.
 */
export interface PostPreviewProps {
  title: string;
  subtitle: string;
  blocks: Block[];
}

/**
 * Props for the `PostMetadataInputs` component.
 */
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