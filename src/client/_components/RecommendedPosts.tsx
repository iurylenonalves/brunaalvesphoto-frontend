'use client'

import PostCard from './PostCard';
import { useTranslations } from '@/context/TranslationContext'
import type { PostSummary, RecommendedPostsProps } from "@/types";

export default function RecommendedPosts({ posts, locale }: RecommendedPostsProps) {
  const { translations } = useTranslations();
  const recommendedSizes = "(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw";

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
        {translations.recommendedPostsTitle}
        {/* You Might Also Like */}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post: PostSummary) => (
          <PostCard
            key={post.slug}
            post={{
              slug: post.slug,
              title: post.title,
              subtitle: post.subtitle || '',
              imageUrl: post.thumbnail || '',
              thumbnailAlt: post.thumbnailAlt,
              thumbnailWidth: post.thumbnailWidth,
              thumbnailHeight: post.thumbnailHeight,
            }}
            locale={locale}
            sizes={recommendedSizes}
          />
        ))}
      </div>
    </section>
  );
}