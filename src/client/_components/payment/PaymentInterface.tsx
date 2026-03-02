'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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

interface LockedTokenPayload {
  packageId: string;
  paymentType: 'DEPOSIT' | 'FULL' | 'BALANCE';
  paymentMethod: 'CARD' | 'BANK_TRANSFER';
  locale: 'en' | 'pt';
  sessionDate?: string;
  exp?: number;
}

function decodeLockedToken(token: string): LockedTokenPayload | null {
  try {
    const payloadPart = token.split('.')[1];
    if (!payloadPart) return null;

    const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    );

    const payload = JSON.parse(json) as LockedTokenPayload;
    if (!payload.packageId || !payload.paymentType || !payload.paymentMethod || !payload.locale) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export default function PaymentInterface() {
  const searchParams = useSearchParams();
  const { translations, locale } = useTranslations();
  const lockedToken = searchParams.get('token');
  
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [bookingRef, setBookingRef] = useState<string | null>(null);
  const [lockedConfig, setLockedConfig] = useState<LockedTokenPayload | null>(null);

  // Form State
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [paymentType, setPaymentType] = useState<'DEPOSIT' | 'FULL' | 'BALANCE'>('DEPOSIT');
  const [sessionDate, setSessionDate] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false); // Add terms state
  // Customer details for manual transfer
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  
  const isTransferMethod = lockedConfig?.paymentMethod === 'BANK_TRANSFER';
  const [showBankDetails, setShowBankDetails] = useState(false);

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

  // Decode locked token from URL
  useEffect(() => {
    if (!lockedToken) {
      setError(locale === 'pt' ? 'Link de pagamento inválido. Solicite um novo link.' : 'Invalid payment link. Please request a new one.');
      return;
    }

    const decoded = decodeLockedToken(lockedToken);
    if (!decoded) {
      setError(locale === 'pt' ? 'Link de pagamento inválido. Solicite um novo link.' : 'Invalid payment link. Please request a new one.');
      return;
    }

    if (decoded.exp && (decoded.exp * 1000) < Date.now()) {
      setError(locale === 'pt' ? 'Este link de pagamento expirou. Solicite um novo link.' : 'This payment link has expired. Please request a new one.');
      return;
    }

    setLockedConfig(decoded);
    setSelectedPackageId(decoded.packageId);
    setPaymentType(decoded.paymentType);
    setSessionDate(decoded.sessionDate || null);
  }, [lockedToken, locale]);

  const handleCheckout = async () => {
    if (!selectedPackageId) {
      setError(locale === 'pt' ? 'Pacote não encontrado no link.' : 'Package not found in link.');
      return;
    }
    if (!lockedToken || !lockedConfig) {
      setError(locale === 'pt' ? 'Link inválido. Solicite um novo link.' : 'Invalid link. Please request a new one.');
        return;
    }
if (!termsAccepted) {
        setError(translations.termsError || "You must agree to the terms to proceed.");
        return;
    }

    
    setProcessing(true);
    setError(null);

    // If Bank Transfer, save to backend then show details
    if (isTransferMethod) {
        if (!customerName || !customerEmail) {
            setError(locale === 'pt' ? "Por favor preencha seu nome e email." : "Please fill in your name and email.");
            setProcessing(false);
            return;
        }

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
            const { data } = await axios.post(`${apiUrl}/api/checkout/manual`, {
              lockedToken,
                customerName,
              customerEmail,
              termsAccepted: true
            });
            
            setBookingRef(data.reference || data.bookingId);
            setProcessing(false);
            setShowBankDetails(true);
            window.scrollTo(0,0);
        } catch (err: any) {
            console.error("Manual booking failed", err);
            setError(err.response?.data?.error || "Failed to confirm booking. Please try again.");
            setProcessing(false);
        }
        return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      
      // Send only necessary data to backend (price is calculated dynamically on server)
      const payload: any = {
        lockedToken,
        termsAccepted: true // Explicitly send acceptance
      };

      const response = await axios.post(`${apiUrl}/api/checkout/session`, payload, {
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

  if (showBankDetails && selectedPkg) {
      return (
          <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-green-100">
             <div className="text-center mb-6">
                 <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                     <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                 </div>
                 <h1 className="text-2xl font-bold text-gray-900 mb-2">
                     {locale === 'pt' ? 'Reserva Confirmada!' : 'Booking Confirmed!'}
                 </h1>
                 <p className="text-gray-600">
                     {locale === 'pt' 
                        ? `Obrigado por aceitar os termos. Para prosseguir, por favor transfira o valor de ${getDisplayPrice()} usando os detalhes abaixo:` 
                        : `Thank you for accepting the terms. To proceed, please transfer the amount of ${getDisplayPrice()} using the details below:`}
                 </p>
             </div>

             <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-6 space-y-4">
                 <h3 className="font-bold text-gray-800 text-lg border-b pb-2 mb-3">
                    Bank Transfer (Faster Payments / Wise)
                 </h3>
                 
                 <div className="grid grid-cols-1 gap-3 text-sm">
                     <div className="flex justify-between">
                         <span className="text-gray-500">Bank:</span>
                         <span className="font-medium text-gray-900">Monzo</span>
                     </div>
                     <div className="flex justify-between">
                         <span className="text-gray-500">Account Name:</span>
                         <span className="font-medium text-gray-900">BRUNA ALVES</span>
                     </div>
                     <div className="flex justify-between">
                         <span className="text-gray-500">Sort Code:</span>
                         <span className="font-mono bg-white px-2 py-0.5 rounded border border-gray-200">04-00-06</span>
                     </div>
                     <div className="flex justify-between">
                         <span className="text-gray-500">Account Number:</span>
                         <span className="font-mono bg-white px-2 py-0.5 rounded border border-gray-200">28291921</span>
                     </div>
                     <div className="flex justify-between items-center pt-2 border-t mt-2">
                         <span className="text-gray-500">Reference:</span>
                         <span className="font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded">
                             {bookingRef || 'PENDING'}
                         </span>
                     </div>
                 </div>
             </div>

             <div className="text-center text-sm text-gray-500 bg-blue-50 p-4 rounded-lg">
                 <p className="mb-2 font-medium text-blue-800">
                    {locale === 'pt' ? 'Próximo Passo:' : 'Next Step:'}
                 </p>
                 {locale === 'pt' 
                    ? 'Por favor envie o comprovante de pagamento para contact@brunaalvesphoto.com ou via WhatsApp para atualizarmos o status da sua reserva imediatamente.'
                    : 'Please send the proof of payment to contact@brunaalvesphoto.com or via WhatsApp so we can update your booking status immediately.'}
             </div>
          </div>
      );
  }

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
        {/* Locked Package */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
             {translations.selectPackage}
          </label>
          <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800">
            {selectedPkg
              ? `${locale === 'pt' ? (selectedPkg.namePt || selectedPkg.name) : selectedPkg.name}`
              : (locale === 'pt' ? 'Carregando pacote...' : 'Loading package...')}
          </div>
        </div>

        {/* Locked Payment Type */}
        {selectedPackageId && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {locale === 'pt' ? 'Tipo de Pagamento' : 'Payment Type'}
            </label>
            <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800">
              {paymentType === 'DEPOSIT' && translations.deposit}
              {paymentType === 'FULL' && translations.fullValue}
              {paymentType === 'BALANCE' && translations.remainingBalance}
            </div>
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

        {/* Contact Details (Only for Transfer) */}
        {isTransferMethod && selectedPackageId && (
            <div className="space-y-4 mb-6 pt-2 border-t border-gray-100">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {locale === 'pt' ? 'Nome Completo' : 'Full Name'}
                    </label>
                    <input 
                        type="text" 
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none transition-all"
                        placeholder={locale === 'pt' ? 'Seu nome' : 'Your name'}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {locale === 'pt' ? 'Email' : 'Email Address'}
                    </label>
                    <input 
                        type="email" 
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none transition-all"
                        placeholder="you@email.com"
                    />
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
          disabled={!selectedPackageId || !lockedConfig || processing || !termsAccepted}
          className={`w-full py-4 text-white font-bold rounded-lg transition-all ${
            !selectedPackageId || !lockedConfig || processing || !termsAccepted
              ? 'bg-gray-400 cursor-not-allowed'
              : isTransferMethod 
                 ? 'bg-green-600 hover:bg-green-700 hover:shadow-lg' 
                 : 'bg-gray-900 hover:bg-black hover:shadow-lg'
          }`}
        >
          {processing ? (
            <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isTransferMethod ? 'Approving...' : 'Processing to Stripe...'}
            </span>
          ) : (
             isTransferMethod 
               ? (locale === 'pt' ? 'Aceitar e Ver Dados Bancários' : 'Accept & View Bank Details')
               : `${translations.pay} ${getDisplayPrice()}`
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
