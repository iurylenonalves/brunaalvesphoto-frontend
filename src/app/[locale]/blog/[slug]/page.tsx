import { getPostBySlug, getPosts } from "@/lib/api";
import Header from "@/client/_components/Header";
import Footer from "@/client/_components/Footer";
import { notFound } from "next/navigation";
import ReactMarkdown from 'react-markdown';
import type { Metadata } from "next";


type Props = {
  params: Promise<{ slug: string; locale: string }>;
};


// A função agora precisa gerar params para ambos os idiomas
export async function generateStaticParams(): Promise<{ slug: string; locale: string }[]> {
  const postsEn = await getPosts("en");
  const postsPt = await getPosts("pt");

  const paramsEn = postsEn.map((post: any) => ({ slug: post.slug, locale: 'en' }));
  const paramsPt = postsPt.map((post: any) => ({ slug: post.slug, locale: 'pt' }));

  return [...paramsEn, ...paramsPt];
}


// BOA PRÁTICA: Se você precisar de metadados dinâmicos, a função seria assim:
 export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = await getPostBySlug(slug, locale);
  return {
    title: post?.title,
    description: post?.subtitle,
  };
}


export default async function BlogPostPage({ params }: Props) {
  // Use o locale dos params para buscar o post correto
  const { slug, locale } = await params;
  const post = await getPostBySlug(slug, locale);

  if (!post) {
    notFound();
  }

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
          {post.blocks && post.blocks.map((block: any, idx: number) =>
            block.type === "text" ? (
              <ReactMarkdown key={idx}>
                {block.content ?? ""}
              </ReactMarkdown>
            ) : (
              <img
                key={idx}                
                src={`${process.env.NEXT_PUBLIC_API_URL}/${block.src}`}
                alt={block.alt}
                className="w-full h-auto rounded my-8"
              />
            )
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}