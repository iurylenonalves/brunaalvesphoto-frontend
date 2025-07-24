import Header from "@/client/_components/Header";
import Footer from "@/client/_components/Footer";
import PostCard from "@/client/_components/PostCard";
import { getPosts } from "@/lib/api";

interface Post {
  id: string;
  title: string;
  subtitle: string;
  thumbnail: string | null;
  slug: string;
  createdAt: string;
}

// const posts: Post[] = [
//   {
//     slug: "retrato-de-noiva",
//     title: "Retrato de Noiva",
//     subtitle: "Por Bruna Alves",
//     thumbnail: "/images/posts/studio09-thumbnail.webp",
//     content: "<p>Conteúdo do post exemplo 01.</p>"
//   },
//   {
//     slug: "post-exemplo-02",
//     title: "Post Exemplo 02",
//     subtitle: "Subtítulo do post 2",
//     thumbnail: "/images/posts/work06-thumbnail.webp",
//     content: "<p>Conteúdo do post exemplo 02.</p>"
//   },
//   {
//     slug: "post-exemplo-03",
//     title: "Post Exemplo 03",
//     subtitle: "Subtítulo do post 3",
//     thumbnail: "/images/posts/tour03-thumbnail.webp",
//     content: "<p>Conteúdo do post exemplo 03.</p>"
//   }
// ];

export default async function BlogPage() {
  const posts: Post[] = await getPosts("pt");

  return (
    <>
      <Header />
      <main className="mx-auto px-8 sm:px-16 md:px-24 lg:px-40 pb-16"
      style={{
        paddingTop: "150px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f9fafb",
      }}
      >
        <h1 
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-12 text-center">Blog</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {posts.map((post: Post) => (
            <PostCard
              key={post.slug}
              post={{
                slug: post.slug,
                title: post.title,
                subtitle: post.subtitle,
                imageUrl: post.thumbnail ? 
                `${process.env.NEXT_PUBLIC_API_URL}/${post.thumbnail}` : 
                '/images/placeholder.png'
              }}
              locale="pt"
            />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}