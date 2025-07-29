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
  const postUrl = locale === "pt" ? `/pt/blog/${post.slug}` : `/en/blog/${post.slug}`;

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl">
      <Link href={postUrl} aria-label={`Read more about ${post.title}`}>
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="h-72 w-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-semibold">
          <Link href={postUrl} className="hover:text-yellow-600 transition-colors duration-300">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 text-gray-600">{post.subtitle}</p>
      </div>
    </div>
  );
}