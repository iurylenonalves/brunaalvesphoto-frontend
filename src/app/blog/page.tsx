import Header from "@/client/_components/Header";
import Footer from "@/client/_components/Footer";
import PostCard from "@/client/_components/PostCard";

interface Post {
  id: string;
  title: string;
  subtitle: string;
  thumbnail: string;
  slug: string;
  createdAt: string;
}

export default function BlogPage() {
  const posts: Post[] = [
    {
      id: "1",
      title: "Bride Portrait",
      subtitle: "By Bruna Alves",
      thumbnail: "/images/posts/studio09-thumbnail.webp",
      slug: "english-post-1",
      createdAt: "2024-06-01"
    },
    {
      id: "2",
      title: "English Post 2",
      subtitle: "Subtitle EN 2",
      thumbnail: "/images/posts/work06-thumbnail.webp",
      slug: "english-post-2",
      createdAt: "2024-06-02"
    },
    {
      id: "3",
      title: "English Post 3",
      subtitle: "Subtitle EN 3",
      thumbnail: "/images/posts/tour03-thumbnail.webp",
      slug: "english-post-3",
      createdAt: "2024-06-03"
    }
  ];

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
      }}
      >
        <h1 
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-12 text-center">Blog</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20">
          {posts.map((post: Post) => (
            <PostCard
              key={post.slug}
              post={{
                slug: post.slug,
                title: post.title,
                subtitle: post.subtitle,
                imageUrl: post.thumbnail
              }}
              locale="en"
            />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}