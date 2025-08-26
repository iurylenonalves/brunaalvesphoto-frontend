'use client'

import PostCard from './PostCard';
import { useTranslations } from '@/context/TranslationContext'

interface Post {
  slug: string;
  title: string;
  thumbnail: string;
  thumbnailAlt?: string;
  thumbnailWidth?: number;
  thumbnailHeight?: number;
  subtitle?: string; 
}

interface RecommendedPostsProps {
  posts: Post[];
  locale: string;
}

export default function RecommendedPosts({ posts, locale }: RecommendedPostsProps) {
  const { translations } = useTranslations();

  if (!posts || posts.length === 0) {
    return null; // Não renderiza nada se não houver posts recomendados
  }

  

  return (
    <section className="mt-16">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
        {translations.recommendedPostsTitle}
        {/* You Might Also Like */}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <PostCard
            key={post.slug}
            post={{
              slug: post.slug,
              title: post.title,
              subtitle: post.subtitle || '',
              imageUrl: post.thumbnail,
              thumbnailAlt: post.thumbnailAlt,
              thumbnailWidth: post.thumbnailWidth,
              thumbnailHeight: post.thumbnailHeight,
            }}
            locale={locale}
          />
        ))}
      </div>
    </section>
  );
}