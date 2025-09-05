"use client";

import Link from 'next/link';
import { useTranslations } from '@/context/TranslationContext'

export default function EmptyState() {
  const { translations, locale } = useTranslations();

  const contactHref = locale === 'pt' ? '/pt/contact' : '/en/contact';

  return (
    <div className="text-center py-20 px-6 bg-white rounded-lg shadow-md">     
      <h2 className="text-2xl font-semibold text-gray-800">{translations.emptyStateTitle}</h2>
      <p className="mt-4 text-gray-600 max-w-2xl mx-auto">{translations.emptyStateMessage}</p>
      <div className="mt-8">
        <Link 
          href={contactHref} 
          className="inline-block bg-yellow-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-yellow-600 transition-colors"
        >
          {translations.emptyStateCtaText}
        </Link>
      </div>
    </div>
  );
}