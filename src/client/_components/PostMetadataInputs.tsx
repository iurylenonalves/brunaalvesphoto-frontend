"use client";

import type { PostMetadataInputsProps } from "@/types";

export default function PostMetadataInputs({
  title, onTitleChange,
  subtitle, onSubtitleChange,
  locale, onLocaleChange,
  publishedAt, onPublishedAtChange,
  relatedSlug, onRelatedSlugChange,
  availableSlugs,
  thumbnailAlt, onThumbnailAltChange,
}: PostMetadataInputsProps) {
  return (
    <>
      {/* Title */}
      <div>
        <label htmlFor="title" className="block font-semibold mb-1 text-gray-700">Title</label>
        <input id="title" type="text" value={title} onChange={(e) => onTitleChange(e.target.value)} placeholder="Title" className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition" required />
      </div>

      {/* Subtitle */}
      <div>
        <label htmlFor="subtitle" className="block font-semibold mb-1 text-gray-700">Subtitle</label>
        <input id="subtitle" type="text" value={subtitle} onChange={(e) => onSubtitleChange(e.target.value)} placeholder="Subtitle" className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition" required />
      </div>

      {/* Language */}
      <div>
        <label htmlFor="language" className="block font-semibold mb-1 text-gray-700">Language</label>
        <select id="language" value={locale} onChange={(e) => onLocaleChange(e.target.value as 'en' | 'pt')} className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition">
          <option value="en">English</option>
          <option value="pt">Português</option>
        </select>
      </div>

      {/* Date */}
      <div>
        <label htmlFor="publishedAt" className="block font-semibold mb-1 text-gray-700">Date</label>
        <input id="publishedAt" type="date" value={publishedAt} onChange={(e) => onPublishedAtChange(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition" required />
      </div>
     
      {/* Related Slug */}
      <div>
        <label htmlFor="relatedSlug" className="block font-semibold mb-1 text-gray-700">Related Slug</label>
        <select id="relatedSlug" value={relatedSlug} onChange={(e) => onRelatedSlugChange(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition">
          <option value="">Select related slug</option>
          {availableSlugs.map(slug => (<option key={slug} value={slug}>{slug}</option>))}
        </select>
      </div>

      {/* Thumbnail Alt Text */}
      <div>
        <label htmlFor="thumbnailAlt" className="block font-semibold mb-1 text-gray-700">Thumbnail Description (for SEO & Accessibility)</label>
        <input id="thumbnailAlt" type="text" value={thumbnailAlt} onChange={(e) => onThumbnailAltChange(e.target.value)} placeholder="e.g., Couple smiling in front of the London Eye" className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition" />
      </div>
    </>
  );
}