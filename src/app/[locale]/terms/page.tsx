import React from 'react';
import Header from '@/client/_components/Header';
import Footer from '@/client/_components/Footer';
import en from '../../locales/en.json';
import pt from '../../locales/pt.json';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const translations = locale === 'pt' ? pt : en;
  return {
    title: translations.termsTitle,
  };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const translations = locale === 'pt' ? pt : en;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="grow container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100 text-gray-800">
            <h1 className="text-3xl md:text-4xl font-raleway font-bold mb-8 text-center text-gray-900 border-b pb-6">
                {translations.termsTitle} <span className="block text-xl md:text-2xl mt-2 font-light text-gray-600">{translations.termsSubtitle}</span>
            </h1>
            
            <section className="mb-8">
            <h2 className="text-xl font-bold mb-3 text-gray-900 flex items-center gap-2">
                <span className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                {translations.termsBookingFeeTitle}
            </h2>
            <div className="pl-10">
                <p className="mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: translations.termsBookingFeeText }} />
                <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600 border-l-4 border-gray-300">
                    <strong>{translations.termsBookingFeeReason}:</strong> {translations.termsBookingFeeReasonText}
                </div>
            </div>
            </section>

            <section className="mb-8">
            <h2 className="text-xl font-bold mb-3 text-gray-900 flex items-center gap-2">
                <span className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                {translations.termsCancellationTitle}
            </h2>
            <div className="pl-10">
                <ul className="space-y-3 list-none">
                    <li className="flex items-start gap-3">
                        <span className="text-green-600 mt-1">✔</span>
                        <span><strong>{translations.termsCancelMore30}:</strong> {translations.termsCancelMore30Text}</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-yellow-600 mt-1">⚠</span>
                        <span><strong>{translations.termsCancel15to30}:</strong> {translations.termsCancel15to30Text}</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-red-600 mt-1">✖</span>
                        <span><strong>{translations.termsCancelLess15}:</strong> {translations.termsCancelLess15Text}</span>
                    </li>
                </ul>
            </div>
            </section>

            <section className="mb-8">
            <h2 className="text-xl font-bold mb-3 text-gray-900 flex items-center gap-2">
                <span className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                {translations.termsRescheduleTitle}
            </h2>
            <div className="pl-10">
                <p className="mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: translations.termsRescheduleText }} />
            </div>
            </section>

            <section className="mb-8">
            <h2 className="text-xl font-bold mb-3 text-gray-900 flex items-center gap-2">
                <span className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                {translations.termsPaymentTitle}
            </h2>
             <div className="pl-10">
                <p className="mb-3 leading-relaxed text-gray-700">
                   {translations.termsPaymentText}
                </p>
                <div className="bg-red-50 text-red-800 p-4 rounded-lg text-sm border-l-4 border-red-300 font-medium">
                    {translations.termsPaymentImportant}
                </div>
             </div>
            </section>

            <section className="mb-8">
            <h2 className="text-xl font-bold mb-3 text-gray-900 flex items-center gap-2">
                <span className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">5</span>
                {translations.termsArtisticTitle}
            </h2>
             <div className="pl-10">
                <p className="mb-3 leading-relaxed text-gray-700">
                   {translations.termsArtisticText}
                </p>
                <p className="mb-3 text-sm text-gray-500 italic">
                   {translations.termsArtisticNote}
                </p>
                <p className="leading-relaxed text-gray-700 font-medium">
                   {translations.termsStorageText}
                </p>
             </div>
            </section>

            <section className="mb-8">
            <h2 className="text-xl font-bold mb-3 text-gray-900 flex items-center gap-2">
                <span className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">6</span>
                {translations.termsCoolingOffTitle}
            </h2>
             <div className="pl-10">
                <p className="mb-4 leading-relaxed text-sm text-gray-600">
                   {translations.termsCoolingOffText}
                </p>
             </div>
            </section>

            <section className="mb-8">
            <h2 className="text-xl font-bold mb-3 text-gray-900 flex items-center gap-2">
                <span className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">7</span>
                {translations.termsLawTitle}
            </h2>
             <div className="pl-10">
                <p className="mb-4 leading-relaxed text-sm text-gray-600">
                   {translations.termsLawText}
                </p>
             </div>
            </section>

             <section className="mb-8">
            <h2 className="text-xl font-bold mb-3 text-gray-900 flex items-center gap-2">
                <span className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">8</span>
                {translations.termsAgreementTitle}
            </h2>
             <div className="pl-10">
                <p className="mb-4 leading-relaxed text-sm text-gray-600">
                   {translations.termsAgreementText}
                </p>
             </div>
            </section>

            <section className="mt-12 pt-8 border-t border-gray-100 text-center">
            <h2 className="text-lg font-bold mb-2 text-gray-900">{translations.termsContactTitle}</h2>
            <p className="text-gray-600">
                {translations.termsContactText}<br/>
                <a href="mailto:contact@brunaalvesphoto.com" className="text-gray-900 font-bold hover:underline mt-1 inline-block">contact@brunaalvesphoto.com</a>
            </p>
            </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
