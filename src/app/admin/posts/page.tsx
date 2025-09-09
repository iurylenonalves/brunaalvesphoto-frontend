"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/client/_components/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { getPosts, deletePost } from "@/lib/api";
import PostEditorForm from "@/client/_components/PostEditorForm";
import Link from "next/link";
import type { PostSummary } from "@/types";

function AdminPostsPageContent() {
  const { token, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = (searchParams.get("locale") as "en" | "pt") || "en";

  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const [isPublishing, setIsPublishing] = useState(false);
  const [publishMessage, setPublishMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !token) {
      router.push("/login");
    } else if (token) {
      setLoading(true);
      getPosts(locale)
        .then(setPosts)
        .catch(() => {
          setPosts([]); // Em caso de erro, define como array vazio
        })
        .finally(() => setLoading(false));
    }
  }, [token, authLoading, router, locale]);

  const handleDelete = async (slug: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      setDeletingSlug(slug);
      setSuccessMessage(null);
      try {
        await deletePost(slug, token!, locale);
        setPosts(posts.filter((p) => p.slug !== slug));
        setSuccessMessage("Post deleted successfully.");
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } catch (deleteError) {
        console.error("Failed to delete post:", deleteError);
        alert("Failed to delete post");
      } finally {
        setDeletingSlug(null);
      }
    }
  };
  
  const handleCreate = async (_formData: FormData): Promise<{ slug: string; title: string; subtitle: string; locale: string; }> => {
    // No-op: form submits internally via JSON endpoints
    return { slug: '', title: '', subtitle: '', locale };
  };

  const handleLocaleChange = (newLocale: "en" | "pt") => {
    router.push(`/admin/posts?locale=${newLocale}`);
  };

  const handlePublishChanges = async () => {
    setIsPublishing(true);
    setPublishMessage("Starting the publication process... Please wait.");

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_VERCEL_DEPLOY_HOOK_URL!, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error("Failed to trigger the deploy hook.");
      }
      
      const result = await response.json();
      console.log("Deploy triggered successfully:", result);
      setPublishMessage("Success! The site is now being updated. It may take a few minutes to be live.");
      
      // Limpa a mensagem após um tempo
      setTimeout(() => setPublishMessage(null), 10000);

    } catch (error) {
      console.error("Error triggering deploy hook:", error);
      setPublishMessage("An error occurred. Please try again or publish manually.");
    } finally {
      setIsPublishing(false);
    }
  };

  if (authLoading || loading) return <p className="text-center mt-8">Loading...</p>;
  if (!token) return null;

  const filteredPosts = posts.filter(
    post =>
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.slug.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const paginatedPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={handlePublishChanges}
            disabled={isPublishing}
            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md cursor-pointer hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isPublishing ? "Publishing..." : "Publish Site Changes"}
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow cursor-pointer transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>

      {publishMessage && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4 text-center">
          {publishMessage}
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
        <PostEditorForm
          initialData={{ relatedSlug: "" }} // Pass an empty relatedSlug for new posts
          onSubmit={handleCreate}
          loading={loading}            
          onSuccess={() => {
            console.log("Post created successfully, form has been reset.");
          }}
        />
      
      {/* Manage Posts Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Manage Posts</h2>        
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-center">
            {successMessage}
          </div>
        )}
        
        {/* Flex container to align search and filters */}
        <div className="flex justify-between items-center gap-4 mb-4">

          {/* Left Side: Search Field (takes available space) */}
          <div className="relative flex-grow">
            <label htmlFor="search-posts" className="sr-only">Search posts</label>
            <input
              id="search-posts"
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by title or slug"
              className="bg-white border border-gray-200 rounded-lg shadow-md p-2 w-full pl-10 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              aria-label="Search posts"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
                <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M20 20l-3-3"/>
              </svg>
            </span>
          </div>

          {/* Right Side: Language Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={() => handleLocaleChange('en')} className={`px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${locale === 'en' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>English</button>
            <button onClick={() => handleLocaleChange('pt')} className={`px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${locale === 'pt' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Português</button>
          </div>
        </div>
      </div>

      <ul className="grid gap-4 mt-4">
        {paginatedPosts.map((post: PostSummary) => (
          <li
            key={post.slug}
            className="flex items-center justify-between bg-white shadow-md rounded-lg px-4 py-3 border border-gray-200"
          >
            {/* Container for Thumbnail, Title and Date */}
            <div className="flex items-center gap-4">
              {(post.thumbnail || post.thumbnailSrc) && (
                <img
                  src={post.thumbnail || post.thumbnailSrc}
                  alt={post.thumbnailAlt || post.title + ' thumbnail'}
                  className="w-14 h-14 object-cover rounded border"
                  style={{ minWidth: 56, minHeight: 56 }}
                />
              )}
              <div>
                <span className="text-base font-semibold text-gray-800">{post.title}</span>
                {post.publishedAt && (
                  <span className="ml-2 text-sm text-gray-500">
                    ({new Date(post.publishedAt).toLocaleDateString()})
                  </span>
                )}
              </div>
            </div>
            {/* Container for the Buttons (with alignment and spacing) */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* VIEW */}
              <Link
                href={post.locale === 'pt' ? `/pt/blog/${post.slug}` : `/en/blog/${post.slug}`}
                target="_blank"
                className="px-3 py-1 text-sm font-semibold bg-green-500 text-white rounded-md shadow-sm cursor-pointer transition hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
              >
                View
              </Link>

              {/* EDIT */}
              <Link
                href={`/admin/posts/edit/${post.slug}?locale=${post.locale}`}
                className="px-3 py-1 text-sm font-semibold bg-yellow-500 text-white rounded-md shadow-sm cursor-pointer transition hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
              >
                Edit
              </Link>

              {/* DELETE */}
              <button
                disabled={deletingSlug === post.slug}
                className="px-3 py-1 text-sm font-semibold bg-red-500 text-white rounded-md shadow-sm cursor-pointer transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={() => handleDelete(post.slug)}
              >
                {deletingSlug === post.slug ? "Deleting..." : "Delete"}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            className="px-3 py-1 rounded bg-gray-200"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="px-2 py-1">{currentPage} / {totalPages}</span>
          <button
            className="px-3 py-1 rounded bg-gray-200"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}

export default function AdminPostsPage() {
  return (
    <Suspense fallback={<div className="text-center mt-8">Loading...</div>}>
      <AdminPostsPageContent />
    </Suspense>
  );
}