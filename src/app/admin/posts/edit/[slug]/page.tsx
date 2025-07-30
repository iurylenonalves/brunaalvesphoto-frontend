"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { getPostBySlug, updatePost } from "@/lib/api";
import { useAuth } from "@/client/_components/AuthContext";
import PostEditorForm from "@/client/_components/PostEditorForm";
import Link from "next/link";

interface Block {
  type: "text" | "image";
  content?: string;
  file?: File;
  alt?: string;
  src?: string;
}

function EditPostPageContent() {
  const { slug } = useParams() as { slug: string };
  const { token, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get locale from query string or default to "en"
  const [locale, setLocale] = useState<"en" | "pt">((searchParams.get("locale") as "en" | "pt") || "en");
  
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [publishedAt, setPublishedAt] = useState("");
  const [relatedSlug, setRelatedSlug] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  // Load post data
  useEffect(() => {
    if (!token) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("redirectAfterLogin", window.location.pathname + window.location.search);
      }
      router.push("/login");
      return;
    }
    
    setLoading(true);
    setSaveSuccess(false);
    setError(null);
    
    getPostBySlug(slug, locale)
      .then(post => {
        console.log("📝 [EditPostPage] Loaded post data:", post);
        setTitle(post.title);
        setSubtitle(post.subtitle);
        setLocale((post.locale as "en" | "pt") || "en");
        setPublishedAt(post.publishedAt || "");
        setThumbnail(post.thumbnail || "");
        setBlocks(
          (post.blocks || []).map((block: Block) =>
            block.type === "image"
              ? { ...block, file: undefined }
              : block
          ) as Block[]
        );
        setRelatedSlug(post.relatedSlug || "");
      })
      .catch((err) => {
        console.error("Error fetching post:", err);
        setError("Failed to load post. It may have been deleted or you don't have permission to view it.");
        setTitle("Post not found");
        setSubtitle("");
        setLocale(locale);
        setBlocks([]);
      })
      .finally(() => setLoading(false));
  }, [slug, token, locale, router]);

  // Function to switch language
  const handleLocaleChange = (newLocale: "en" | "pt") => {
    router.push(`/admin/posts/edit/${slug}?locale=${newLocale}`);
  };

  // Function to update the post
  const handleUpdate = async (formData: FormData) => {
    setSaving(true);
    setError(null);
    setSaveSuccess(false);
    
    try {
      const updatedPost = await updatePost(slug, formData, token!);
      setSaveSuccess(true);
      
      // Wait a bit to show the success message before redirecting
      setTimeout(() => {
        router.push(`/admin/posts?locale=${locale}`);
      }, 1500);
      
      return updatedPost;
      
    } catch (err) {
      console.error("Error updating post:", err);
      setError("Failed to update post. Please try again.");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
    </div>
  );

  return (
    <main className="container mx-auto p-4">
      {/* Header with navigation and action buttons */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Link 
            href="/admin/posts"
            className="px-3 py-1 bg-gray-200 rounded-lg shadow text-gray-700 hover:bg-gray-300 transition-colors"
          >
            ← Back to posts
          </Link>
          <h1 className="text-3xl font-bold">Edit Post</h1>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Language selection */}
          <button 
            onClick={() => handleLocaleChange('en')} 
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${locale === 'en' ? 'bg-yellow-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            English
          </button>
          <button 
            onClick={() => handleLocaleChange('pt')} 
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${locale === 'pt' ? 'bg-yellow-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Português
          </button>
          
          {/* Logout button */}
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow cursor-pointer transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Feedback messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {saveSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Post updated successfully! Redirecting...
        </div>
      )}
      
      {/* Edit form */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <PostEditorForm
          initialData={{ title, subtitle, locale, blocks, publishedAt, relatedSlug, thumbnail }}
          onSubmit={handleUpdate}
          loading={saving}
          onSuccess={() => {}}
        />
      </div>
    </main>
  );
}

export default function EditPostPage() {
  return (
    <Suspense fallback={<div className="text-center mt-8">Loading...</div>}>
      <EditPostPageContent />
    </Suspense>
  );
}