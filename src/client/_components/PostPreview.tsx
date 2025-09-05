"use client";

import ReactMarkdown from 'react-markdown';
import { buildImageUrl } from "@/utils/urlUtils";
import type { PostPreviewProps } from "@/types";

export default function PostPreview({ title, subtitle, blocks }: PostPreviewProps) {
  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow border border-gray-200">
      <h3 className="text-xl font-bold mb-4 text-gray-700">Preview</h3>
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-gray-600 mb-4">{subtitle}</p>
      
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
              <img key={idx} src={buildImageUrl(block.src)} alt={block.alt || "Image Preview"} className="mb-2 max-h-48 rounded-lg shadow-sm border" />
            ) : (
              <div key={idx} className="mb-2 p-4 h-24 flex items-center justify-center bg-gray-200 text-gray-500 rounded-lg border border-dashed">
                Awaiting image...
              </div>
            );
          default:              
            return null;
        }
      })}
    </div>
  );
}