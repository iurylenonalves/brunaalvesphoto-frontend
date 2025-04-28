"use client";

import { useAuth } from "@/client/_components/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getPosts, deletePost } from "@/lib/api";
import AdminPostForm from "@/client/_components/AdmimPostForm";

export default function AdminPostsPage() {
  const { token, logout } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locale, setLocale] = useState<"en" | "pt">("en");

  useEffect(() => {
    if (!token) router.push("/login");
    else {
      setLoading(true);
      getPosts(locale)
        .then(setPosts)
        .finally(() => setLoading(false));
    }
  }, [token, router, locale]);

  const handleDelete = async (slug: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      await deletePost(slug, token!, locale);
      setPosts(posts.filter((p: any) => p.slug !== slug));
    }
  };

  if (!token) return null;
  if (loading) return <p>Loading...</p>;

  return (
    <main className="container mx-auto p-4">
      <button
        className="bg-red-600 text-white px-4 py-2 rounded mb-4"
        onClick={logout}
      >
        Logout
      </button>
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      <div className="mb-4">
        <label className="mr-2 font-semibold">Language:</label>
        <select
          value={locale}
          onChange={e => setLocale(e.target.value as "en" | "pt")}
          className="border rounded p-1"
        >
          <option value="en">English</option>
          <option value="pt">Portuguese</option>
        </select>
      </div>
      <AdminPostForm onSuccess={() => {}} />

      <h2 className="text-2xl font-bold mt-10 mb-4">Posts</h2>
      <ul>
        {posts.map((post: any) => (
          <li key={post.slug} className="flex items-center justify-between border-b py-2">
            <span>{post.title}</span>
            <div className="flex gap-2">
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded"
                onClick={() => router.push(`/admin/posts/edit/${post.slug}`)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => handleDelete(post.slug)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}