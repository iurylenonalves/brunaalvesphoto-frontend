'use client';

import { useTranslations } from '@/context/TranslationContext';
import Link from 'next/link';

export default function CheckoutCancelPage() {
  const { translations, locale } = useTranslations();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="bg-red-50 p-4 rounded-full mb-6">
        <svg 
          className="w-16 h-16 text-red-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </div>
      
      <h1 className="text-3xl font-bold mb-4 font-raleway text-gray-900">
        {translations.checkoutCancelTitle}
      </h1>
      
      <p className="text-gray-600 mb-8 max-w-md text-lg">
        {translations.checkoutCancelMessage}
      </p>
      
      <Link 
        href={`/${locale}/payment`} 
        className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-black transition-all shadow-md font-medium"
      >
        {translations.checkoutCancelButton}
      </Link>
    </div>
  );
}
