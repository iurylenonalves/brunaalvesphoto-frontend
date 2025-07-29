"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/client/_components/AuthContext";
import ReactMarkdown from 'react-markdown';

interface Block {
  type: "text" | "image";
  content?: string;
  src?: string;
  alt?: string;
  file?: File;
}

interface InitialData {
  title?: string;
  subtitle?: string;
  locale?: "en" | "pt";
  blocks?: Block[];
  publishedAt?: string;
  relatedSlug?: string;
  thumbnail?: string;
}

interface PostEditorFormProps {
  initialData?: InitialData;
  onSubmit: (formData: FormData) => Promise<{ slug: string; title: string; subtitle: string; locale: string; }>;
  loading: boolean;
  onSuccess: () => void; 
}

export default function PostEditorForm({
  initialData,
  onSubmit,
  loading: loadingProp,
  onSuccess,
}: PostEditorFormProps) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [locale, setLocale] = useState<"en" | "pt">(initialData?.locale || "en");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [publishedAt, setPublishedAt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const [thumbnailSrc, setThumbnailSrc] = useState<string | null>(null);
  const [relatedSlug, setRelatedSlug] = useState(initialData?.relatedSlug || "");
  const [availableSlugs, setAvailableSlugs] = useState<string[]>([]);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setSubtitle(initialData.subtitle || "");
      setLocale(initialData.locale || "en");
      setBlocks(initialData.blocks || []);
      setThumbnailSrc(initialData.thumbnail || null);
      setPublishedAt(initialData.publishedAt ? new Date(initialData.publishedAt).toISOString().substring(0, 10) : "");
      setRelatedSlug(initialData.relatedSlug || "");
    }
  }, [initialData]);

  useEffect(() => {
    // Busca os slugs do outro idioma para o campo relatedSlug
    const fetchSlugs = async () => {
      const targetLocale = locale === "en" ? "pt" : "en";
      console.log("Buscando slugs do idioma:", targetLocale);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts?locale=${targetLocale}`);
      const posts = await res.json();
      setAvailableSlugs(posts.map((p: { slug: string }) => p.slug));
    };
    fetchSlugs();
  }, [locale]);

   const handleBlockChange = (index: number, field: string, value: string | File | undefined) => {
    const newBlocks = [...blocks];
    if (field === "file" && value instanceof File) {
      newBlocks[index] = { ...newBlocks[index], file: value, src: 'image-placeholder' };
    } else if (typeof value === "string") {
      newBlocks[index] = { ...newBlocks[index], [field]: value };
    }
    setBlocks(newBlocks);
  };

  const handleThumbnailSelection = (block: Block, index: number) => {
    // Cria um identificador único para a imagem clicada.
    // Usa 'new-image-' + index para arquivos novos, ou o src para imagens existentes.
    const uniqueId = block.file ? `new-image-${index}` : block.src;

    // Se o ID único for válido e já for o thumbnail atual, desmarca (seta para null).
    if (uniqueId && thumbnailSrc === uniqueId) {
      setThumbnailSrc(null);
    } else {
      // Caso contrário, define o novo thumbnail.
      setThumbnailSrc(uniqueId || null);
    }
  };

  const addTextBlock = () => setBlocks([...blocks, { type: "text", content: "" }]);
  const addImageBlock = () => setBlocks([...blocks, { type: "image", src: "", alt: "", file: undefined }]);
  const removeBlock = (index: number) => setBlocks(blocks.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!token) throw new Error("You must be logged in.");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("locale", locale);
      formData.append("publishedAt", publishedAt);

       // Adiciona o caminho da thumbnail escolhida ao FormData
      if (thumbnailSrc) {
        formData.append("thumbnailSrc", thumbnailSrc);
      }

      if (relatedSlug) {
        formData.append("relatedSlug", relatedSlug);
      }

      const imageBlocks = blocks.filter(b => b.type === 'image' && b.file);
      if (imageBlocks.length === 0 && !initialData) {
        throw new Error("At least one image is required for a new post.");
      }
      imageBlocks.forEach(block => formData.append('images', block.file!));

      const contentBlocks = blocks.map(block => {
        if (block.type === "text") return { type: "text", content: block.content || "" };
        if (block.type === "image") { 
          const src = block.file ? 'image-placeholder' : block.src;
          return { type: "image", src: src, alt: block.alt || "" };
        }
        return null;
      }).filter(Boolean);
      formData.append("blocks", JSON.stringify(contentBlocks));

      await onSubmit(formData);
      onSuccess();

      if (!initialData) {
        setTitle("");
        setSubtitle("");
        setLocale("en");
        setBlocks([]);
        setPublishedAt("");
        setThumbnailSrc(null);
        setRelatedSlug("");
      }

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to submit post.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block font-semibold mb-1 text-gray-700">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
          required
        />
      </div>

      {/* Subtitle */}
      <div>
        <label htmlFor="subtitle" className="block font-semibold mb-1 text-gray-700">Subtitle</label>
        <input
          id="subtitle"
          type="text"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="Subtitle"
          className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
          required
        />
      </div>

      {/* Language */}
      <div>
        <label htmlFor="language" className="block font-semibold mb-1 text-gray-700">Language</label>
        <select
          id="language"
          value={locale}
          onChange={(e) => setLocale(e.target.value as "en" | "pt")}
          className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
        >
          <option value="en">English</option>
          <option value="pt">Português</option>
        </select>
      </div>

      {/* Date */}
      <div>
        <label htmlFor="publishedAt" className="block font-semibold mb-1 text-gray-700">Date</label>
        <input
          id="publishedAt"
          type="date"
          value={publishedAt}
          onChange={(e) => setPublishedAt(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
          required
        />
      </div>

      {/* Related Slug */}
      <div>
        <label htmlFor="relatedSlug" className="block font-semibold mb-1 text-gray-700">
          Related Slug (slug of the equivalent post in the other language)
        </label>
        <select
          id="relatedSlug"
          value={relatedSlug}
          onChange={(e) => setRelatedSlug(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
        >
            <option value="">Select related slug</option>
          {availableSlugs.map(slug => (
            <option key={slug} value={slug}>{slug}</option>
          ))}
        </select>
      </div>

      {/* Blocks */}
      <div className="space-y-4">
        {blocks.map((block, index) =>
          block.type === "text" ? (
            <div key={index} className="relative">
              <textarea
                value={block.content}
                onChange={(e) => handleBlockChange(index, "content", e.target.value)}
                placeholder={`Text block #${index + 1}`}
                className="w-full p-2 pr-10 border border-gray-300 rounded-lg shadow-sm h-32 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
                required
              />
              <button
                type="button"
                className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 bg-red-500 text-white rounded-full shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                onClick={() => removeBlock(index)}
                aria-label="Remove block"
              >
                <span className="sr-only">Remove block</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>
          ) : (
            <div key={index} className="space-y-2 p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center justify-between">
                <label className="block">
                  <span className="bg-gray-200 px-3 py-2 rounded-lg shadow-sm cursor-pointer hover:bg-gray-300 transition inline-block text-sm font-medium text-gray-700">
                    Choose Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleBlockChange(index, "file", e.target.files?.[0])}
                      className="hidden"
                      required={!initialData}
                    />
                  </span>
                </label>
                <button
                  type="button"
                  className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-lg shadow-sm cursor-pointer transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                  onClick={() => removeBlock(index)}
                  title="Remove block"
                >
                  Remove
                </button>
              </div>
              <input
                type="text"
                value={block.alt || ''}
                onChange={(e) => handleBlockChange(index, "alt", e.target.value)}
                placeholder="Image description (alt text)"
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
                required
              />
              {(block.file || block.src) && (
                <div className="mt-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={block.file 
                      ? URL.createObjectURL(block.file) 
                      : block.src && block.src.startsWith('http') 
                        ? block.src 
                        : `${process.env.NEXT_PUBLIC_API_URL}/${block.src}`
                    }
                    alt={block.alt || "Preview"}
                    className="max-h-40 rounded-lg border"
                  />
                  {/* BOTÃO PARA DEFINIR THUMBNAIL */}
                  <button
                    type="button"
                    onClick={() => handleThumbnailSelection(block, index)}
                    className={`mt-2 px-3 py-1 text-xs font-semibold rounded-full transition border-2 ${
                      (block.file && thumbnailSrc === `new-image-${index}`) || (block.src && thumbnailSrc === block.src)
                        ? 'bg-yellow-400 border-yellow-500 text-white'
                        : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100'
                    }`}
                    title="Set as thumbnail"
                  >
                    ★ {
                      (block.file && thumbnailSrc === `new-image-${index}`) || (block.src && thumbnailSrc === block.src)
                        ? 'Thumbnail' 
                        : 'Set as Thumbnail'
                    }
                  </button>
                </div>
              )}
            </div>
          )
        )}
      </div>

      {/* Add block buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={addTextBlock}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow cursor-pointer transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          + Text
        </button>
        <button
          type="button"
          onClick={addImageBlock}
          className="px-4 py-2 bg-green-500 text-white rounded-lg shadow cursor-pointer transition hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
        >
          + Image
        </button>
      </div>

      {/* Error */}
      {error && <div className="text-red-600 bg-red-100 p-3 rounded-lg">{error}</div>}

      {/* Preview */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow border border-gray-200">
        <h3 className="text-xl font-bold mb-4 text-gray-700">Preview</h3>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-gray-600 mb-4">{subtitle}</p>
        {blocks.map((block, idx) =>
          block.type === "text" ? (
            <div key={idx} className="prose mb-2">
              <ReactMarkdown>{block.content ?? ""}</ReactMarkdown>
            </div>
          ) : block.file ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={idx}
              src={URL.createObjectURL(block.file)}
              alt={block.alt || "Preview"}
              className="mb-2 max-h-48 rounded"
            />
          ) : block.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={idx}
              src={block.src.startsWith('http') ? block.src : `${process.env.NEXT_PUBLIC_API_URL}/${block.src}`}
              alt={block.alt || "Preview"}
              className="mb-2 max-h-48 rounded"
            />
          ) : null
        )}
      </div>

      {/* Save/Update button */}
      <button
        type="submit"
        className="w-full mt-6 px-6 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow cursor-pointer transition hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
        disabled={loading || loadingProp}
      >
        {loading || loadingProp ? "Saving..." : initialData ? "Update Post" : "Save Post"}
      </button>
    </form>
  );
}