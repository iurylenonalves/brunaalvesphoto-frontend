import Link from "next/link";
import Image from "next/image";
import type { PostCardProps } from "@/types";

export default function PostCard({ post, locale, priority = false, sizes }: PostCardProps) {
  const postUrl = locale === "pt" ? `/pt/blog/${post.slug}` : `/en/blog/${post.slug}`;
  const imageSizes = sizes || "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl">
      <Link href={postUrl} aria-label={`Read more about ${post.title}`}>
        <div className="relative w-full h-72 overflow-hidden">
          <Image 
            src={post.imageUrl}
            alt={post.thumbnailAlt || post.title}
            width={post.thumbnailWidth || 500}
            height={post.thumbnailHeight || 400}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading={priority ? 'eager' : 'lazy'}
            priority={priority}
            fetchPriority={priority ? 'high' : 'auto'}
            sizes={imageSizes}
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <h2 className="text-xl font-semibold">
          <Link href={postUrl} className="hover:text-yellow-600 transition-colors duration-300">
            {post.title}
          </Link>
        </h2>
        <p className="mt-2 text-gray-600">{post.subtitle}</p>
      </div>
    </div>
  );
}