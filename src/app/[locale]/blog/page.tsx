import Header from "@/client/_components/Header";
import Footer from "@/client/_components/Footer";
import BlogList from "@/client/_components/BlogList";
import EmptyState from "@/client/_components/EmptyState";
import { getPosts } from "@/lib/api";

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

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const posts: Post[] = await getPosts(locale);
  //const posts: Post[] = []; 

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 pb-16"
        style={{
          paddingTop: "150px",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f9fafb",
        }}
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-12 text-center">Blog</h1>
        {posts && posts.length > 0 ? (
          <BlogList posts={posts} />
        ) : (
        <EmptyState />
        )}
      </main>
      <Footer />
    </>
  );
}