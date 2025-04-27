import Link from "next/link";

interface PostCardProps {
  post: {
    slug: string;
    title: string;
    subtitle: string;
    imageUrl: string;
  };
  locale: string;
}

export default function PostCard({ post, locale }: PostCardProps) {
  return (
    <div className="rounded-lg shadow hover:shadow-lg transition overflow-hidden">
      <img src={post.imageUrl} alt={post.title} className="w-full h-72 object-cover rounded-t-lg" />
      <div className="p-4">
        <h3 className="text-xl font-semibold">{post.title}</h3>
        <p className="text-gray-600">{post.subtitle}</p>
        <Link
          href={locale === "pt" ? `/pt/blog/${post.slug}` : `/blog/${post.slug}`}
          className="inline-block mt-4 text-blue-600 hover:underline"
        >
          {post.title}
        </Link>
      </div>
    </div>
  );
}