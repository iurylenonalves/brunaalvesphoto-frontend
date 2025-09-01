"use client";

import PostCard from "./PostCard";
import { buildImageUrl } from "@/utils/urlUtils";
import { useTranslations } from '@/context/TranslationContext';

interface Post {
  id: string;
  title: string;
  subtitle: string;
  thumbnail: string | null; 
  slug: string;
  createdAt: string;
  thumbnailAlt?: string;
  thumbnailWidth?: number;
  thumbnailHeight?: number;
}

interface BlogListProps {
  posts: Post[];
}

export default function BlogList({ posts }: BlogListProps) {
  const { locale } = useTranslations();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <PostCard
          key={post.slug}
          post={{
            slug: post.slug,
            title: post.title,
            subtitle: post.subtitle,
            imageUrl: post.thumbnail ? buildImageUrl(post.thumbnail) : '/images/placeholder.webp',
            thumbnailAlt: post.thumbnailAlt,
            thumbnailWidth: post.thumbnailWidth,
            thumbnailHeight: post.thumbnailHeight,
          }}
          locale={locale}
        />
      ))}
    </div>
  );
}