import { getPostBySlug, getPosts } from "@/lib/api";
import Header from "@/client/_components/Header";
import PostNavigation from "@/client/_components/PostNavigation";
import RecommendedPosts from "@/client/_components/RecommendedPosts";
import Footer from "@/client/_components/Footer";
import { notFound } from "next/navigation";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Metadata } from "next";
import Image from "next/image";
import type { Block, PostPageData } from "@/types";

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

// Generates static paths for all posts in all locales
export async function generateStaticParams(): Promise<{ slug: string; locale: string }[]> {
  const postsEn = await getPosts("en");
  const postsPt = await getPosts("pt");

  const paramsEn = postsEn.map((post: { slug: string }) => ({ slug: post.slug, locale: 'en' }));
  const paramsPt = postsPt.map((post: { slug: string }) => ({ slug: post.slug, locale: 'pt' }));

  return [...paramsEn, ...paramsPt];
}


 // Generates dynamic metadata for each post page
 export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const data: PostPageData | null = await getPostBySlug(slug, locale);

  return {
    title: data?.post?.title,
    description: data?.post?.subtitle,
  };
}

export default async function BlogPostPage({ params }: Props) {
  // Use the locale from params to fetch the correct post
  const { slug, locale } = await params;
  const data: PostPageData | null = await getPostBySlug(slug, locale);

  if (!data || !data.post) {
    notFound();
  }

  const { post, navigation, recommended } = data;

  const firstImageIndex = post.blocks?.findIndex((block: Block) => block.type === "image") ?? -1;

  return (
    <>
      <Header postSlug={post.slug} relatedSlug={post.relatedSlug} />
      <main
        className="mx-auto px-4 sm:px-8 md:px-12 lg:px-16 pb-16 max-w-5xl"
        style={{
          paddingTop: "150px",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f9fafb",
        }}
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-center">
          {post.title}
        </h1>
        <h2 className="text-lg sm:text-xl text-gray-600 text-center mb-1">
          {post.subtitle}
        </h2>
        {post.publishedAt && (
          <div className="text-sm text-gray-500 text-center mb-4">
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              year: 'numeric', month: 'long', day: 'numeric'
            })}
          </div>
        )}
        <article className="prose lg:prose-lg mx-auto w-full">
          {post.blocks && post.blocks.map((block: Block, idx: number) => {
            // Usamos um switch para uma renderização mais limpa e escalável
            switch (block.type) {
              case "text":
                return (
                  <ReactMarkdown key={idx} remarkPlugins={[remarkGfm]}>
                    {block.content ?? ""}
                  </ReactMarkdown>
                );

              case "image":
                return (
                  block.src && (                    
                    <div 
                      key={idx}
                      className={idx === firstImageIndex ? 'aos-disabled' : ''}
                    >
                      <Image
                        src={block.src.startsWith('http') 
                          ? block.src 
                          : `${process.env.NEXT_PUBLIC_API_URL}/${block.src}`
                        }
                        alt={block.alt || post.title}
                        width={block.width || 800}
                        height={block.height || 450}
                        className="w-full max-w-2xl mx-auto h-auto rounded my-8"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 768px"
                        priority={idx === firstImageIndex}
                        fetchPriority={idx === firstImageIndex ? 'high' : 'auto'}
                      />
                    </div>
                  )
                );
              
              default:
                return null;
            }
          })}
        </article>
        <div className="mt-16 pt-16 border-t border-gray-200">
          <PostNavigation 
            previousPost={navigation.previous}
            nextPost={navigation.next}
            locale={locale}
          />          
        </div>
        <div className="mt-16 pt-8 border-t border-gray-200">
          <RecommendedPosts posts={recommended} locale={locale} />
        </div>
      </main>
      <Footer />
    </>
  );
}