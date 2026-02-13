'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useTranslations } from '@/context/TranslationContext';
import { PAYMENT_CONFIG } from '@/config/paymentConfig';

interface Package {
  id: string;
  name: string;
  namePt?: string; // New translation field
  description: string | null;
  descriptionPt?: string | null; // New translation field
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

  // Load Packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
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
    }
  }, [loading, packages, searchParams]);

  const handleCheckout = async () => {
    if (!selectedPackageId) {
        setError("Please select a package.");
        return;
    }

    setProcessing(true);
    setError(null);

    try {
      const selectedPkg = packages.find(p => p.id === selectedPackageId);
      if (!selectedPkg) throw new Error("Package not found");

      // Determine Price ID
      let priceId = '';

      if (paymentType === 'DEPOSIT') {
        priceId = PAYMENT_CONFIG.DEPOSIT_PRICE_ID;
      } else {
        // Look up in config (Fallback logic since we don't have it in DB yet)
        const slug = selectedPkg.name.toLowerCase().replace(/\s+/g, '-'); // Simple slug generation
        const configPkg = PAYMENT_CONFIG.PACKAGES[slug] || PAYMENT_CONFIG.PACKAGES['default']; // You might want a default fallback

        if (configPkg) {
            priceId = paymentType === 'FULL' ? configPkg.full : configPkg.balance;
        } else {
             console.warn("Pricing configuration not found for package:", slug);
             // fallback for safety (but will fail on Stripe if invalid)
             priceId = 'price_simulated_' + paymentType.toLowerCase(); 
        }
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      
      const response = await axios.post(`${apiUrl}/api/checkout/session`, {
        packageId: selectedPackageId,
        priceId: priceId, // Backend requires this!
        paymentType: paymentType,
        locale: locale
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
            <div className="grid grid-cols-3 gap-3">
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

        <button
          onClick={handleCheckout}
          disabled={!selectedPackageId || processing}
          className={`w-full py-4 text-white font-bold rounded-lg transition-all ${
            !selectedPackageId || processing
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
        
        <p className="text-xs text-center text-gray-400 mt-4">
            {translations.securedByStripe}
        </p>
      </div>
    </div>
  );
}
