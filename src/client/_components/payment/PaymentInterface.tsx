'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link'; // Import Link
import axios from 'axios';
import { useTranslations } from '@/context/TranslationContext';

function formatDate(dateStr: string, locale: string): string {
  try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return new Intl.DateTimeFormat(locale === 'pt' ? 'pt-BR' : 'en-GB', {
          dateStyle: 'full',
          timeStyle: dateStr.includes(':') ? 'short' : undefined
      }).format(date);
  } catch (e) {
      return dateStr;
  }
}

interface Package {
  id: string;
  name: string;
  namePt?: string;
  description: string | null;
  descriptionPt?: string | null;
  totalPrice: string;
  depositPrice: string; 
  active: boolean;
}

export default function PaymentInterface() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { translations, locale } = useTranslations();
  
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  // Form State
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [paymentType, setPaymentType] = useState<'DEPOSIT' | 'FULL' | 'BALANCE'>('DEPOSIT');
  const [sessionDate, setSessionDate] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false); // Add terms state
  
  const isBalanceLink = searchParams.get('type')?.toUpperCase() === 'BALANCE';

  // Load Packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const response = await axios.get(`${apiUrl}/api/packages`);
        setPackages(response.data);
      } catch (err) {
        console.error("Failed to load packages", err);
        setError("Failed to load packages.");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Sync with URL Params
  useEffect(() => {
    if (!loading && packages.length > 0) {
      const pkgParam = searchParams.get('pkg');
      const typeParam = searchParams.get('type');
      const dateParam = searchParams.get('date');
      const timeParam = searchParams.get('time');

      if (pkgParam) {
        // Try to find by ID
        const foundById = packages.find(p => p.id === pkgParam);
        if (foundById) {
            setSelectedPackageId(foundById.id);
        } else {
            // Try to find by Name (slug-ish)
            const foundByName = packages.find(p => p.name.toLowerCase().replace(/\s+/g, '-') === pkgParam.toLowerCase());
            if (foundByName) setSelectedPackageId(foundByName.id);
        }
      }

      if (typeParam) {
        const t = typeParam.toUpperCase();
        if (['DEPOSIT', 'FULL', 'BALANCE'].includes(t)) {
          setPaymentType(t as any);
        }
      }

      if (dateParam) {
          if (timeParam) {
              setSessionDate(`${dateParam} ${timeParam}`);
          } else {
              setSessionDate(dateParam);
          }
      }
    }
  }, [loading, packages, searchParams]);

  const handleCheckout = async () => {
    if (!selectedPackageId) {
        setError("Please select a package.");
        return;
    }
if (!termsAccepted) {
        setError(translations.termsError || "You must agree to the terms to proceed.");
        return;
    }

    
    setProcessing(true);
    setError(null);

    try {
      const selectedPkg = packages.find(p => p.id === selectedPackageId);
      if (!selectedPkg) throw new Error("Package not found");

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      
      // Send only necessary data to backend (price is calculated dynamically on server)
      const response = await axios.post(`${apiUrl}/api/checkout/session`, {
        packageId: selectedPackageId,
        paymentType: paymentType,
        locale: locale,
        sessionDate: sessionDate, // Pass session date if available
        termsAccepted: true // Explicitly send acceptance
      }, {
        headers: {
          'Idempotency-Key': crypto.randomUUID() // Prevent double-charge on network retries
        }
      });

      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error("No checkout URL returned");
      }

    } catch (err: any) {
      console.error("Checkout validation failed", err);
      setError(err.response?.data?.error || err.message || "Checkout failed. Please try again.");
      setProcessing(false);
    }
  };

  const selectedPkg = packages.find(p => p.id === selectedPackageId);

  // Helper to calculate price display
  const getDisplayPrice = () => {
    if (!selectedPkg) return '';
    const total = parseFloat(selectedPkg.totalPrice);
    const deposit = parseFloat(selectedPkg.depositPrice);

    if (paymentType === 'DEPOSIT') return `£${deposit}`;
    if (paymentType === 'FULL') return `£${total}`;
    if (paymentType === 'BALANCE') return `£${total - deposit}`;
    return '';
  };

  if (loading) return <div className="p-8 text-center"><div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent rounded-full" role="status" aria-label="loading"></div></div>;

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-2xl font-raleway font-bold text-gray-800 mb-6 text-center">
        {translations.paymentTitle}
      </h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Package Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
             {translations.selectPackage}
          </label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none transition-all"
            value={selectedPackageId}
            onChange={(e) => setSelectedPackageId(e.target.value)}
          >
            <option value="" disabled>-- {translations.selectPackage || 'Select'} --</option>
            {packages.map(pkg => (
              <option key={pkg.id} value={pkg.id}>
                {locale === 'pt' ? (pkg.namePt || pkg.name) : pkg.name} (£{pkg.totalPrice})
              </option>
            ))}
          </select>
        </div>

        {/* Payment Type Selection */}
        {selectedPackageId && (
            <div className={`grid gap-3 ${sessionDate ? 'grid-cols-2' : isBalanceLink ? 'grid-cols-1' : 'grid-cols-3'}`}>
                {!isBalanceLink && (
                <button
                    onClick={() => setPaymentType('DEPOSIT')}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                        paymentType === 'DEPOSIT' 
                        ? 'bg-gray-900 text-white border-gray-900' 
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                    }`}
                >
                    {translations.deposit}
                    <span className="block text-xs opacity-75 mt-1">{translations.depositDesc}</span>
                </button>
                )}
                
                {(isBalanceLink || !sessionDate) && (
                <button
                    onClick={() => setPaymentType('BALANCE')}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                        paymentType === 'BALANCE' 
                        ? 'bg-gray-900 text-white border-gray-900' 
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                    }`}
                >
                    {translations.remainingBalance}
                    <span className="block text-xs opacity-75 mt-1">{translations.remainingBalanceDesc}</span>
                </button>
                )}

                {!isBalanceLink && (
                <button
                    onClick={() => setPaymentType('FULL')}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                        paymentType === 'FULL' 
                        ? 'bg-gray-900 text-white border-gray-900' 
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                    }`}
                >
                    {translations.fullValue}
                    <span className="block text-xs opacity-75 mt-1">{translations.fullValueDesc}</span>
                </button>
                )}
            </div>
        )}

        {/* Summary Card */}
        {selectedPkg && (
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 font-medium">
                        {locale === 'pt' ? (selectedPkg.namePt || selectedPkg.name) : selectedPkg.name}
                    </span>
                    <span className="font-bold text-gray-800">{getDisplayPrice()}</span>
                </div>

                {sessionDate && (
                    <div className="mb-2 text-sm text-blue-600 font-semibold flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {formatDate(sessionDate, locale)}
                    </div>
                )}

                <div className="text-sm text-gray-500">
                    {paymentType === 'DEPOSIT' && (
                        <>
                            {translations.summaryDepositStart}
                            (£{parseFloat(selectedPkg.totalPrice) - parseFloat(selectedPkg.depositPrice)})
                            {translations.summaryDepositEnd}
                        </>
                    )}
                    {paymentType === 'BALANCE' && translations.summaryBalance}
                    {paymentType === 'FULL' && translations.summaryFull}
                </div>
            </div>
        )}

        <div className="mb-6 flex items-start gap-2">
            <input 
                type="checkbox" 
                id="terms" 
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
                {translations.termsLabel} <Link href={`/${locale}/terms`} target="_blank" className="underline text-gray-900 hover:text-black">Terms & Conditions</Link>.
            </label>
        </div>

        <button
          onClick={handleCheckout}
          disabled={!selectedPackageId || processing || !termsAccepted}
          className={`w-full py-4 text-white font-bold rounded-lg transition-all ${
            !selectedPackageId || processing || !termsAccepted
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gray-900 hover:bg-black hover:shadow-lg'
          }`}
        >
          {processing ? (
            <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing to Stripe...
            </span>
          ) : (
             `${translations.pay} ${getDisplayPrice()}`
          )}
        </button>
        
        {translations.installmentNotice && (
            <p className="text-xs text-center text-gray-500 mt-3 font-medium">
                {translations.installmentNotice}
            </p>
        )}

        <p className="text-xs text-center text-gray-400 mt-4">
            {translations.securedByStripe}
        </p>
      </div>
    </div>
  );
}
