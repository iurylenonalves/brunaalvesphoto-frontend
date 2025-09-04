"use client";

import { buildImageUrl } from "@/utils/urlUtils";
import type { BlockEditorProps } from "@/types";

export default function BlockEditor({
  block,
  index,
  onBlockChange,
  onRemoveBlock,
  onThumbnailSelection,
  isThumbnail,
  isCompressing,
  isUploading,
}: BlockEditorProps) {  
  
  if (block.type === "text") {
    return (
      <div className="relative">
        <textarea
          value={block.content}
          onChange={(e) => onBlockChange(index, "content", e.target.value)}
          placeholder={`Text block #${index + 1}`}
          className="w-full p-2 pr-10 border border-gray-300 rounded-lg shadow-sm h-32 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
          required
        />
        <button
          type="button"
          className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 bg-red-500 text-white rounded-full shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          onClick={() => onRemoveBlock(index)}
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
    );
  }

  if (block.type === "image") {
    return (
      <div className="space-y-2 p-4 border rounded-lg bg-gray-50">
        <div className="flex items-center justify-between">
          <label className="block">
            <span className={`px-3 py-2 rounded-lg shadow-sm transition inline-block text-sm font-medium ${
              isCompressing || isUploading 
              ? 'bg-yellow-200 text-yellow-800 animate-pulse cursor-not-allowed' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer'
              }`}
            >
              {isCompressing ? 'Compressing...' : isUploading ? 'Uploading...' : 'Choose Image'}
              <input 
                type="file"
                accept="image/*"
                onChange={(e) => onBlockChange(index, "file", e.target.files?.[0])}
                className="hidden"
                disabled={isCompressing || isUploading}
              />
            </span>
          </label>
          <button
            type="button"
            className="flex items-center justify-center w-7 h-7 bg-red-500 text-white rounded-full shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            onClick={() => onRemoveBlock(index)}
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
          <input 
            type="text" 
            value={block.alt || ''}
            onChange={(e) => onBlockChange(index, "alt", e.target.value)}
            placeholder="Image description (alt text)"
            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
            required
          />
          {block.src && (
            <div className="mt-2">
              <img src={buildImageUrl(block.src)} alt={block.alt || "Preview"} className="max-h-40 rounded-lg border" />
              <button
                type="button"
                onClick={() => onThumbnailSelection(block)}
                className={`mt-2 px-3 py-1 text-xs font-semibold rounded-full transition border-2 cursor-pointer ${isThumbnail ? 'bg-yellow-400 border-yellow-500 text-white' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100'}`}
                title="Set as thumbnail"
              >
                ★ {isThumbnail ? 'Thumbnail' : 'Set as Thumbnail'}
              </button>
            </div>
          )}
      </div>
    );
  }
  
  return null;
}