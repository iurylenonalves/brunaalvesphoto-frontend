import { getPostBySlug } from "@/lib/api";
import Header from "@/client/_components/Header";
import Footer from "@/client/_components/Footer";

interface BlogPostPageProps {
  params: { slug: string };
}

const posts = [
  {
    slug: "retrato-de-noiva",
    title: "Retrato de Noiva",
    subtitle: "Por Bruna Alves",
    blocks: [
      { type: "text", content: "<p>Primeiro texto do post...</p>" },
      { type: "image", src: "/images/posts/studio09-large.webp", alt: "Bride Portrait" },
      { type: "text", content: "<p>Segundo texto do post...</p>" },
      { type: "image", src: "/images/posts/studio10-large.webp", alt: "Another photo" },
      { type: "text", content: "<p>Terceiro texto do post...</p>" },
      { type: "image", src: "/images/posts/studio11-large.webp", alt: "Last photo" },
      { type: "text", content: "<p>Texto final do post...</p>" }
    ]
  },
  {
    slug: "post-exemplo-02",
    title: "Post Exemplo 02",
    subtitle: "Subtítulo do post 2",
    imageUrl: "/images/posts/exemplo.jpg",
    content: "<p>Conteúdo do post exemplo 02.</p>"
  },
  {
    slug: "post-exemplo-03",
    title: "Post Exemplo 03",
    subtitle: "Subtítulo do post 3",
    imageUrl: "/images/posts/exemplo.jpg",
    content: "<p>Conteúdo do post exemplo 03.</p>"
  }
];

// Geração estática dos slugs em português
export function generateStaticParams() {
  return posts.map(post => ({ slug: post.slug }));
}

export default async function BlogPostPage(props: BlogPostPageProps) {
  const params = await props.params;
  const post = posts.find(p => p.slug === params.slug);

  if (!post) return <div>Post não encontrado</div>;

  return (
    <>
      <Header />
      <main className="mx-auto px-4 sm:px-8 md:px-16 lg:px-24 pb-16"
      style={{
        paddingTop: "150px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f9fafb",
      }}>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-center">{post.title}</h1>
        <h2 className="text-lg sm:text-xl text-gray-600 mb-6 text-center">{post.subtitle}</h2>
        <article className="prose max-w-none mx-auto">
         {post.blocks
            ? post.blocks.map((block, idx) =>
                block.type === "text" ? (
                  <div key={idx} dangerouslySetInnerHTML={{ __html: block.content ?? "" }} />
                ) : (
                  <img
                    key={idx}
                    src={block.src}
                    alt={block.alt}
                    className="w-full h-auto rounded my-8"
                  />
                )
              )
            : (
              <>
                {post.content && (
                  <div dangerouslySetInnerHTML={{ __html: post.content ?? ""}} />
                )}
                {post.imageUrl && (
                 <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-auto rounded my-8"
                  />
                )}
              </>
            )
          }
        </article>
      </main>
      <Footer />
    </>
  );
}