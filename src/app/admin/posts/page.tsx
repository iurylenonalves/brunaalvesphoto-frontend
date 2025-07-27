"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/client/_components/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { getPosts, deletePost, createPost } from "@/lib/api";
import PostEditorForm from "@/client/_components/PostEditorForm";
import Link from "next/link";

export default function AdminPostsPage() {
  const { token, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = (searchParams.get("locale") as "en" | "pt") || "en";

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  useEffect(() => {
    if (!authLoading && !token) {
      router.push("/login");
    } else if (token) {
      setLoading(true);
      getPosts(locale)
        .then(setPosts)
        .catch(err => {
          console.error("Failed to fetch posts:", err);
          setPosts([]); // Em caso de erro, define como array vazio
        })
        .finally(() => setLoading(false));
    }
  }, [token, authLoading, router, locale]);

  const handleDelete = async (slug: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      setDeletingSlug(slug);
      try {
        await deletePost(slug, token!, locale);
        setPosts(posts.filter((p) => p.slug !== slug));
      } catch (error) {
        alert("Failed to delete post");
      } finally {
        setDeletingSlug(null);
      }
    }
  };
  
  const handleCreate = async (formData: FormData) => {    
    const newPost = await createPost(formData, token!);    
    setPosts(prev => [newPost, ...prev]);
  };

  const handleLocaleChange = (newLocale: "en" | "pt") => {
    router.push(`/admin/posts?locale=${newLocale}`);
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
        <h1 className="text-3xl font-bold">Create New Post</h1>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-lg shadow cursor-pointer transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      {/* <div className="bg-white p-4 rounded-lg shadow border border-gray-200 mb-6 flex items-center gap-4">
        <label className="block font-semibold text-gray-700" htmlFor="language">
          Language:
        </label>
        <select
          id="language"
          value={locale}
          onChange={e => setLocale(e.target.value as "en" | "pt")}
          className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition w-40"
        >
          <option value="en">English</option>
          <option value="pt">Portuguese</option>
        </select>
      </div> */}

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
        {paginatedPosts.map((post: any) => (
          <li
            key={post.slug}
            className="flex items-center justify-between bg-white shadow-md rounded-lg px-4 py-3 border border-gray-200"
          >
            {/* Container for Title and Date */}
            <div>
              <span className="text-base font-semibold text-gray-800">{post.title}</span>
              {post.publishedAt && (
                <span className="ml-2 text-sm text-gray-500">
                  ({new Date(post.publishedAt).toLocaleDateString()})
                </span>
              )}
            </div>
      
            {/* Container for the Buttons (with alignment and spacing) */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* VIEW */}
              <Link
                href={post.locale === 'pt' ? `/pt/blog/${post.slug}` : `/blog/${post.slug}`}
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