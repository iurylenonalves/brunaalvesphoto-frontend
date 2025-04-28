"use client";

import { useState } from "react";
import { createPost } from "@/lib/api";
import { useAuth } from "@/client/_components/AuthContext";

interface Block {
  type: "text" | "image";
  content?: string;
  file?: File | null;
  alt?: string;
}

export default function AdminPostForm({ onSuccess }: { onSuccess: () => void }) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [locale, setLocale] = useState("en");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { token } = useAuth();

  const addTextBlock = () => setBlocks([...blocks, { type: "text", content: "" }]);
  const addImageBlock = () => setBlocks([...blocks, { type: "image", file: null, alt: "" }]);

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!token) {
        setError("You must be logged in to create a post.");
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("locale", locale);

      const serializedBlocks = blocks.map((block, idx) => {
        if (block.type === "text") {
          return { type: "text", content: block.content };
        } else if (block.type === "image" && block.file) {
          formData.append(`image_${idx}`, block.file);
          return { type: "image", src: `image_${idx}`, alt: block.alt || "" };
        }
        return null;
      }).filter(Boolean);

      formData.append("blocks", JSON.stringify(serializedBlocks));

      await createPost(formData, token);

      setTitle("");
      setSubtitle("");
      setLocale("en");
      setBlocks([]);
      onSuccess();
    } catch (err) {
      setError("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
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
        onChange={e => setLocale(e.target.value)}
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
                required
              />
              <input
                type="text"
                value={block.alt}
                onChange={e => handleBlockChange(idx, e.target.value, "alt")}
                placeholder="Alt text"
                className="w-full p-2 border rounded"
              />
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
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Post"}
      </button>
    </form>
  );
}