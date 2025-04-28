"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getPostBySlug, updatePost } from "@/lib/api";
import { useAuth } from "@/client/_components/AuthContext";

interface Block {
  type: "text" | "image";
  content?: string;
  file?: File | null;
  alt?: string;
  src?: string;
}

export default function EditPostPage() {
  const { slug } = useParams() as { slug: string };
  const { token } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [locale, setLocale] = useState<"en" | "pt">("en");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carrega o post existente
  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    getPostBySlug(slug, locale)
      .then(post => {
        setTitle(post.title);
        setSubtitle(post.subtitle);
        setLocale(post.locale || "en");
        // Remove src das imagens para edição
        setBlocks(
          (post.blocks || []).map((block: Block) =>
            block.type === "image"
              ? { ...block, file: null }
              : block
          )
        );
      })
      //.catch(() => setError("Failed to load post"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, token, locale]);

  const handleBlockChange = (idx: number, value: any, field: string) => {
    setBlocks(blocks.map((block, i) =>
      i === idx ? { ...block, [field]: value } : block
    ));
  };

  const handleImageChange = (idx: number, file: File | null) => {
    setBlocks(blocks.map((block, i) =>
      i === idx ? { ...block, file } : block
    ));
  };

  const addTextBlock = () => setBlocks([...blocks, { type: "text", content: "" }]);
  const addImageBlock = () => setBlocks([...blocks, { type: "image", file: null, alt: "" }]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (!token) {
        setError("You must be logged in.");
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("locale", locale);

      const serializedBlocks = blocks.map((block, idx) => {
        if (block.type === "text") {
          return { type: "text", content: block.content };
        } else if (block.type === "image") {
          if (block.file) {
            formData.append(`image_${idx}`, block.file);
            return { type: "image", src: `image_${idx}`, alt: block.alt || "" };
          } else if (block.src) {
            // Mantém a imagem antiga se não foi alterada
            return { type: "image", src: block.src, alt: block.alt || "" };
          }
        }
        return null;
      }).filter(Boolean);

      formData.append("blocks", JSON.stringify(serializedBlocks));

      await updatePost(slug, formData, token, locale);

      router.push("/admin/posts");
    } catch (err) {
      setError("Failed to update post.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          value={subtitle}
          onChange={e => setSubtitle(e.target.value)}
          placeholder="Subtitle"
          className="w-full p-2 border rounded"
          required
        />
        <select
          value={locale}
          onChange={e => setLocale(e.target.value as "en" | "pt")}
          className="w-full p-2 border rounded"
        >
          <option value="en">English</option>
          <option value="pt">Português</option>
        </select>

        <div className="space-y-4">
          {blocks.map((block, idx) =>
            block.type === "text" ? (
              <textarea
                key={idx}
                value={block.content}
                onChange={e => handleBlockChange(idx, e.target.value, "content")}
                placeholder={`Text block #${idx + 1}`}
                className="w-full p-2 border rounded h-32"
                required
              />
            ) : (
              <div key={idx} className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => handleImageChange(idx, e.target.files?.[0] || null)}
                  className="w-full p-2"
                />
                <input
                  type="text"
                  value={block.alt}
                  onChange={e => handleBlockChange(idx, e.target.value, "alt")}
                  placeholder="Alt text"
                  className="w-full p-2 border rounded"
                />
                {/* Mostra imagem atual se não foi alterada */}
                {block.src && !block.file && (
                  <img src={block.src} alt={block.alt} className="max-h-32" />
                )}
              </div>
            )
          )}
        </div>

        <div className="flex gap-2">
          <button type="button" onClick={addTextBlock} className="bg-gray-200 px-3 py-1 rounded">
            + Text
          </button>
          <button type="button" onClick={addImageBlock} className="bg-gray-200 px-3 py-1 rounded">
            + Image
          </button>
        </div>

        {error && <div className="text-red-600">{error}</div>}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </main>
  );
}