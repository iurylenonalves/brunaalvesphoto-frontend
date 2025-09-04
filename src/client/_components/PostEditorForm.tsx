"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/client/_components/AuthContext";
import imageCompression from 'browser-image-compression';
import { cleanImageUrl } from "@/utils/urlUtils";
import { createPostJson, updatePostJson, uploadImage } from "@/lib/api";
import { Block, PostEditorData, PostJsonPayload, ProcessedImageResult } from "@/types";

import PostMetadataInputs from "./PostMetadataInputs";
import BlockEditor from "./BlockEditor";
import PostPreview from "./PostPreview";

interface PostEditorFormProps {
  initialData?: PostEditorData;
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
      
      <PostMetadataInputs
        title={title} onTitleChange={setTitle}
        subtitle={subtitle} onSubtitleChange={setSubtitle}
        locale={locale} onLocaleChange={setLocale}
        publishedAt={publishedAt} onPublishedAtChange={setPublishedAt}
        relatedSlug={relatedSlug} onRelatedSlugChange={setRelatedSlug}
        availableSlugs={availableSlugs}
        thumbnailAlt={thumbnailAlt} onThumbnailAltChange={setThumbnailAlt}
      />

      {/* Blocks */}
      <div className="space-y-4">
        {blocks.map((block, index) => (
          <BlockEditor
            key={index}
            block={block}
            index={index}
            onBlockChange={handleBlockChange}
            onRemoveBlock={removeBlock}
            onThumbnailSelection={handleThumbnailSelection}
            
            // A lógica de comparação é feita aqui e o resultado (booleano) é passado como prop
            isThumbnail={thumbnailSrc ? cleanImageUrl(thumbnailSrc) === cleanImageUrl(block.src) : false}
            
            isCompressing={compressingImages[index] || false}
            isUploading={uploadingImages[index] || false}
          />
        ))}
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
      <PostPreview title={title} subtitle={subtitle} blocks={blocks} />

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