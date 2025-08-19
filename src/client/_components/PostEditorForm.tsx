"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/client/_components/AuthContext";
import ReactMarkdown from 'react-markdown';
import imageCompression from 'browser-image-compression';
import { cleanImageUrl, buildImageUrl } from "@/utils/urlUtils";
import { createPostJson, updatePostJson, type PostJsonPayload, uploadImage, ProcessedImageResult } from "@/lib/api";

interface Block {
  type: "text" | "image";
  content?: string;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface InitialData {
  slug?: string;
  title?: string;
  subtitle?: string;
  locale?: "en" | "pt";
  blocks?: Block[];
  publishedAt?: string;
  relatedSlug?: string;
  thumbnail?: string;
  thumbnailAlt?: string;
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
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { token } = useAuth();
  const [thumbnailSrc, setThumbnailSrc] = useState<string | null>(null);
  const [thumbnailAlt, setThumbnailAlt] = useState("");
  const [relatedSlug, setRelatedSlug] = useState(initialData?.relatedSlug || "");
  const [availableSlugs, setAvailableSlugs] = useState<string[]>([]);
  const [compressingImages, setCompressingImages] = useState<{[key: number]: boolean}>({});
  const [uploadingImages, setUploadingImages] = useState<{[key: number]: boolean}>({});

  useEffect(() => {
    if (initialData) {
      if (process.env.NODE_ENV === 'development') {
        console.log("🔍 [PostEditorForm] Loading initialData:", initialData);
        console.log("🔍 [PostEditorForm] initialData.blocks:", initialData.blocks);
      }
      setTitle(initialData.title || "");
      setSubtitle(initialData.subtitle || "");
      setLocale(initialData.locale || "en");
      setBlocks(initialData.blocks || []);
      
      const cleanedThumbnail = cleanImageUrl(initialData.thumbnail);
      if (process.env.NODE_ENV === 'development') {
        console.log("🖼️ [PostEditorForm] Original thumbnail:", initialData.thumbnail);
        console.log("🧹 [PostEditorForm] Cleaned thumbnail:", cleanedThumbnail);
      }
      setThumbnailSrc(cleanedThumbnail);
      setThumbnailAlt(initialData.thumbnailAlt || "");
      
      setPublishedAt(initialData.publishedAt ? new Date(initialData.publishedAt).toISOString().substring(0, 10) : "");
      setRelatedSlug(initialData.relatedSlug || "");
    }
  }, [initialData]);

  useEffect(() => {
    // Fetch available slugs for the "related post" dropdown
    const fetchSlugs = async () => {
      const targetLocale = locale === "en" ? "pt" : "en";
      if (process.env.NODE_ENV === 'development') {
        console.log("Buscando slugs do idioma:", targetLocale);
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts?locale=${targetLocale}`);
      const posts = await res.json();
      setAvailableSlugs(posts.map((p: { slug: string }) => p.slug));
    };
      fetchSlugs();
  }, [locale]);


    // Handlers 
  const handleBlockChange = async (index: number, field: string, value: string | File | undefined) => {
    if (field === "file" && value instanceof File && token) {
      // User experience check for oversized files before upload
      if (value.size > 50 * 1024 * 1024) {
        setError("Image file is too large. Please select a file smaller than 50MB.");
        return;
      }
       
      try {
        setCompressingImages(prev => ({ ...prev, [index]: true }));

        const options = {
          maxSizeMB: 15,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          fileType: 'image/webp',
          quality: 0.8
        };

        // Step 1: Compress the image in the browser for a faster upload
        const compressedFile = await imageCompression(value, options);
        const optimizedFile = new File([compressedFile], `${value.name.split('.')[0]}.webp`, { type: 'image/webp' });
        
        setCompressingImages(prev => ({ ...prev, [index]: false }));
        setUploadingImages(prev => ({ ...prev, [index]: true }));
        
        // Step 2: Upload the pre-compressed image to the backend for final processing
        const result: ProcessedImageResult = await uploadImage(optimizedFile, token);

        // Step 3: Update the block with the final URL and dimensions from the backend        
        const updatedBlocks = [...blocks];
        updatedBlocks[index] = {
          ...updatedBlocks[index],
          src: result.imageUrl,
          width: result.width,
          height: result.height,
        };
        setBlocks(updatedBlocks);
        setError(null);

      } catch (error) {
          console.error('Error uploading or compressing image:', error);
          setError("Failed to compress image. Please try a different image or reduce its size.");        
      } finally {        
        setCompressingImages(prev => ({ ...prev, [index]: false }));
        setUploadingImages(prev => ({ ...prev, [index]: false }));
      }
    } else if (typeof value === "string") {
      // Handle changes to text fields like `alt` or `content`
      const newBlocks = [...blocks];
      newBlocks[index] = { ...newBlocks[index], [field]: value };
      setBlocks(newBlocks);
    }
  };

  // Handle thumbnail selection
  const handleThumbnailSelection = (block: Block) => {
    if (!block.src) return; 
    const isCurrentThumbnail = thumbnailSrc && cleanImageUrl(thumbnailSrc) === cleanImageUrl(block.src);

    if (isCurrentThumbnail) {
      setThumbnailSrc(null);
    } else {
      setThumbnailSrc(block.src);
    }
  };

  const addTextBlock = () => setBlocks([...blocks, { type: "text", content: "" }]);
  const addImageBlock = () => setBlocks([...blocks, { type: "image", src: "", alt: "" }]);
  const removeBlock = (index: number) => setBlocks(blocks.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!token) throw new Error("You must be logged in.");

      // Validation: Ensure all images have been uploaded before saving
      if (blocks.some(b => b.type === 'image' && !b.src)) {
        throw new Error("Please wait for all images to finish uploading before saving.");
      }

      // Step 1: Build the final JSON payload from the current state
      const payload: PostJsonPayload = {
        title,
        subtitle,
        locale,
        publishedAt: publishedAt || undefined,
        relatedSlug: relatedSlug || undefined,
        thumbnailSrc: thumbnailSrc || undefined,
        thumbnailAlt: thumbnailAlt || undefined,
        blocks: blocks.map(b => ({
          // Ensure a clean object is sent to the API
          type: b.type,
          content: b.content || '',
          src: b.src || '',
          alt: b.alt || '',
          width: b.width || 0,
          height: b.height || 0,
        }))
      };

      // Step 2: Send the payload to the appropriate API endpoint
      if (initialData && initialData.slug) {
        await updatePostJson(initialData.slug, payload, token);
      } else {
        await createPostJson(payload, token);
      }

      onSuccess();
      setSuccess(true);
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth' });
      }

      // Reset form if it was a new post creation
      if (!initialData) {
        setTitle("");
        setSubtitle("");
        setLocale("en");
        setBlocks([]);
        setPublishedAt("");
        setThumbnailSrc(null);
        setRelatedSlug("");
      }
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to submit post.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-2 text-center">
          Post saved successfully!
        </div>
      )}
      
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

       {/* Thumbnail Alt Text */}
      <div>
        <label htmlFor="thumbnailAlt" className="block font-semibold mb-1 text-gray-700">
          Thumbnail Description (for SEO & Accessibility)
        </label>
        <input
          id="thumbnailAlt"
          type="text"
          value={thumbnailAlt}
          onChange={(e) => setThumbnailAlt(e.target.value)}
          placeholder="e.g., Couple smiling in front of the London Eye"
          className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
        />
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
                  <span className={`px-3 py-2 rounded-lg shadow-sm cursor-pointer transition inline-block text-sm font-medium ${
                    compressingImages[index] || uploadingImages[index]
                      ? 'bg-yellow-200 text-yellow-800' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}>
                    {compressingImages[index] ? 'Compressing...' : uploadingImages[index] ? 'Uploading...' : 'Choose Image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleBlockChange(index, "file", e.target.files?.[0])}
                      className="hidden"
                      disabled={compressingImages[index] || uploadingImages[index]}
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
              {(block.src) && (
                <div className="mt-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={buildImageUrl(block.src)}
                    alt={block.alt || "Preview"}
                    className="max-h-40 rounded-lg border"
                  />

                  {/* BUTTON TO SET THUMBNAIL */}
                  <button
                    type="button"
                    onClick={() => handleThumbnailSelection(block)}
                    className={`mt-2 px-3 py-1 text-xs font-semibold rounded-full transition border-2 ${
                      thumbnailSrc && cleanImageUrl(thumbnailSrc) === cleanImageUrl(block.src)
                        ? 'bg-yellow-400 border-yellow-500 text-white'
                        : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100'
                    }`}
                    title="Set as thumbnail"
                  >
                    ★ {
                      thumbnailSrc && cleanImageUrl(thumbnailSrc) === cleanImageUrl(block.src)
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
        
        {/* Loop over blocks to render the preview */}
        {blocks.map((block, idx) => {          
          switch (block.type) {
            case "text":
              return (
                <div key={idx} className="prose mb-2">
                  <ReactMarkdown>{block.content ?? ""}</ReactMarkdown>
                </div>
              );
            case "image":              
              return block.src ? (
                <img
                  key={idx}
                  src={buildImageUrl(block.src)}
                  alt={block.alt || "Image Preview"}
                  className="mb-2 max-h-48 rounded-lg shadow-sm border"
                />
              ) : (
                <div key={idx} className="mb-2 p-4 h-24 flex items-center justify-center bg-gray-200 text-gray-500 rounded-lg border border-dashed">
                  Waiting for image...
                </div>
              );
            default:              
              return null;
          }
        })}
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