"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/client/_components/AuthContext";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { Plus, Edit, Trash2, Link as LinkIcon, X, Globe, CheckCircle, AlertCircle, AlertTriangle, Search } from "lucide-react";
import Link from "next/link";

type Package = {
  id: string;
  name: string;
  namePt?: string;
  description: string;
  descriptionPt?: string;
  totalPrice: string;
  depositPrice: string;
  active: boolean;
};

export default function PackagesAdminPage() {
  const { token, loading } = useAuth();
  const router = useRouter();
  const params = useParams(); // Add useParams
  const locale = params?.locale || "en";
  const [packages, setPackages] = useState<Package[]>([]);
  const [fetching, setFetching] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Delete Confirmation State
  const [packageToDelete, setPackageToDelete] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPackage, setCurrentPackage] = useState<Partial<Package>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [errorModel, setErrorModel] = useState<string | null>(null);

  // Booking Link Generator State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [selectedBookingPackage, setSelectedBookingPackage] = useState<Package | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  // Add state for booking method
  const [bookingMethod, setBookingMethod] = useState<'card' | 'transfer'>('card');
    const [bookingPaymentType, setBookingPaymentType] = useState<'DEPOSIT' | 'FULL' | 'BALANCE'>('DEPOSIT');

  useEffect(() => {
    if (!loading && !token) {
      router.push("/login");
      return;
    }
    fetchPackages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, token]);

  const fetchPackages = async () => {
    try {
      if (!token) return;
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const res = await axios.get(`${baseUrl}/api/packages/admin/all`, {
          headers: { Authorization: `Bearer ${token}` }
      });
      setPackages(res.data);
    } catch (error) {
      console.error("Failed to fetch packages", error);
    } finally {
      setFetching(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenBooking = (pkg: Package, method: 'card' | 'transfer' = 'card') => {
    setSelectedBookingPackage(pkg);
    setBookingDate(new Date().toISOString().split('T')[0]);
    setBookingTime("10:00");
    setBookingMethod(method);
        setBookingPaymentType('DEPOSIT');
    setGeneratedLink(null);
    setIsBookingModalOpen(true);
  };

    const requestLockedLink = async (
        packageId: string,
        localeCode: 'en' | 'pt',
        paymentType: 'DEPOSIT' | 'FULL' | 'BALANCE',
        paymentMethod: 'CARD' | 'BANK_TRANSFER',
        sessionDate?: string
    ) => {
        if (!token) {
            showToast('Authentication required', 'error');
            return null;
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const payload: Record<string, string> = {
            packageId,
            locale: localeCode,
            paymentType,
            paymentMethod,
        };

        if (sessionDate) {
            payload.sessionDate = sessionDate;
        }

        const { data } = await axios.post(
            `${baseUrl}/api/checkout/link`,
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        return data.url as string;
    };

    const generateLink = async (localeCode: 'en' | 'pt') => {
        if (!selectedBookingPackage || !bookingDate) return;

        try {
            const sessionDate = bookingTime ? `${bookingDate} ${bookingTime}` : bookingDate;
            const link = await requestLockedLink(
                selectedBookingPackage.id,
                localeCode,
                bookingPaymentType,
                bookingMethod === 'transfer' ? 'BANK_TRANSFER' : 'CARD',
                sessionDate
            );

            if (!link) {
                return;
            }

            navigator.clipboard.writeText(link);
            showToast(`Locked link (${localeCode.toUpperCase()}) copied!`, "success");
            setGeneratedLink(link);
        } catch (error) {
            console.error('Failed to generate locked link', error);
            showToast('Failed to generate payment link', 'error');
        }
    };

  const confirmDelete = async () => {
    if (!packageToDelete) return;
    
    try {
      if (!token) return;
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/packages/${packageToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Remove from list immediately
      setPackages(packages.filter(p => p.id !== packageToDelete));
      showToast("Package deleted successfully!", "success");
    } catch (error) {
      console.error("Failed to delete", error);
      // Wait, if it was soft deleted, we might want to refresh to see if it's still there (as inactive) 
      // OR just trust it's effectively "gone" from the active workflow.
      // But if the backend did soft-delete, it will come back on refresh.
      // Ideally, the backend should return 200 OK even if soft deleted.
      showToast("Failed to delete package", "error");
    } finally {
        setPackageToDelete(null);
    }
  };

  const handleDelete = (id: string) => {
      setPackageToDelete(id);
  };

  const handleEdit = (pkg: Package) => {
    setCurrentPackage(pkg);
    setIsModalOpen(true);
    setErrorModel(null);
  };

  const handleCreate = () => {
    setCurrentPackage({
      name: "",
      namePt: "",
      description: "",
      descriptionPt: "",
      totalPrice: "0",
      depositPrice: "0",
      active: true
    });
    setIsModalOpen(true);
    setErrorModel(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorModel(null);

    try {
        const url = currentPackage.id 
            ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/packages/${currentPackage.id}`
            : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/packages`;
        
        const method = currentPackage.id ? 'put' : 'post';
        
        const payload = { ...currentPackage };
        // Ensure numbers are numbers or strings valid for Decimal
        
        await axios[method](url, payload, {
            headers: { Authorization: `Bearer ${token}` }
        });

        setIsModalOpen(false);
        fetchPackages();
        showToast(`Package ${currentPackage.id ? 'updated' : 'created'} successfully!`, 'success');

    } catch (err) {
        console.error("Save failed", err);
        setErrorModel("Failed to save package. Check correct values.");
        showToast("Failed to save package", "error");
    } finally {
        setIsSaving(false);
    }
  };

    const copyPaymentLink = async (pkgId: string, localeCode: 'en' | 'pt', paymentType: 'DEPOSIT' | 'FULL' | 'BALANCE') => {
            try {
                const link = await requestLockedLink(pkgId, localeCode, paymentType, 'CARD');
                if (!link) return;
                navigator.clipboard.writeText(link);
                showToast(`Card ${paymentType} link (${localeCode.toUpperCase()}) copied!`, "success");
            } catch (error) {
                console.error('Failed to copy card payment link', error);
                showToast('Failed to generate payment link', 'error');
            }
  };

    const copyTransferLink = async (pkgId: string, localeCode: 'en' | 'pt', paymentType: 'DEPOSIT' | 'FULL' | 'BALANCE') => {
            try {
                const link = await requestLockedLink(pkgId, localeCode, paymentType, 'BANK_TRANSFER');
                if (!link) return;
                navigator.clipboard.writeText(link);
                showToast(`Transfer ${paymentType} link (${localeCode.toUpperCase()}) copied!`, "success");
            } catch (error) {
                console.error('Failed to copy transfer link', error);
                showToast('Failed to generate payment link', 'error');
            }
  };

  const filteredPackages = packages.filter(pkg => 
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (pkg.namePt && pkg.namePt.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow border-b px-6 py-4 flex flex-col md:flex-row justify-between items-center sticky top-0 z-10 gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Packages Management</h1>
            <Link href={`/${locale}/admin`} className="text-sm text-gray-500 hover:underline">← Back to Dashboard</Link>
        </div>

        <div className="flex w-full md:w-auto gap-3">
            <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search packages..." 
                    className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button 
                onClick={handleCreate}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap"
            >
                <Plus size={18} /> <span className="hidden sm:inline">New Package</span>
            </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {loading || fetching ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 h-75 animate-pulse flex flex-col">
                        <div className="flex justify-between mb-6">
                            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                        </div>
                        <div className="space-y-3 mb-auto">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                        </div>
                        <div className="h-10 bg-gray-200 rounded w-full mt-6"></div>
                    </div>
                ))}
            </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map(pkg => (
            <div key={pkg.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${pkg.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {pkg.active ? 'Active' : 'Inactive'}
                    </span>
                </div>
                {pkg.namePt && (
                    <p className="text-sm text-gray-500 mb-3 italic flex items-center gap-1">
                        <Globe size={12}/> {pkg.namePt}
                    </p>
                )}
                
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Price:</span>
                        <span className="font-semibold">£{pkg.totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Deposit:</span>
                        <span className="font-semibold text-green-600">£{pkg.depositPrice}</span>
                    </div>
                </div>

                <div className="text-sm text-gray-600 line-clamp-3 mb-4 bg-gray-50 p-2 rounded">
                    {pkg.description || "No description"}
                </div>
              </div>

              <div className="bg-gray-50 px-5 py-3 border-t">
                
                {/* CARD PAYMENT Column */}
                <div className="mb-4">
                     <div className="flex items-center gap-1 mb-2 font-bold text-gray-700 text-xs uppercase tracking-wide border-b border-gray-200 pb-1">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        Card & Stripe
                    </div>
                    {/* Standard Links */}
                    <div className="flex gap-2 mb-2">
                        <button 
                            onClick={() => copyPaymentLink(pkg.id, 'en', 'DEPOSIT')}
                            className="flex-1 flex justify-center items-center gap-1.5 text-xs font-medium text-gray-700 bg-white py-1.5 rounded border border-gray-200 hover:bg-gray-50 shadow-sm"
                            title="Copy Deposit Link (English)"
                        >
                            🇬🇧 Deposit
                        </button>
                        <button 
                            onClick={() => copyPaymentLink(pkg.id, 'pt', 'DEPOSIT')}
                            className="flex-1 flex justify-center items-center gap-1.5 text-xs font-medium text-gray-700 bg-white py-1.5 rounded border border-gray-200 hover:bg-gray-50 shadow-sm"
                            title="Copy Deposit Link (Portuguese)"
                        >
                            🇧🇷 Deposit
                        </button>
                    </div>

                    {/* Balance Links */}
                    <div className="flex gap-2 mb-2">
                        <button 
                            onClick={() => copyPaymentLink(pkg.id, 'en', 'FULL')}
                            className="flex-1 flex justify-center items-center gap-1.5 text-xs text-gray-600 bg-white py-1.5 rounded border border-gray-200 hover:bg-gray-50 shadow-sm"
                            title="Copy Full Link (English)"
                        >
                            🇬🇧 Full
                        </button>
                        <button 
                            onClick={() => copyPaymentLink(pkg.id, 'pt', 'FULL')}
                            className="flex-1 flex justify-center items-center gap-1.5 text-xs text-gray-600 bg-white py-1.5 rounded border border-gray-200 hover:bg-gray-50 shadow-sm"
                            title="Copy Full Link (Portuguese)"
                        >
                            🇧🇷 Full
                        </button>
                    </div>

                    <div className="flex gap-2 mb-2">
                        <button 
                            onClick={() => copyPaymentLink(pkg.id, 'en', 'BALANCE')}
                            className="flex-1 flex justify-center items-center gap-1.5 text-xs text-gray-600 bg-white py-1.5 rounded border border-gray-200 hover:bg-gray-50 shadow-sm"
                            title="Copy Balance Link (English)"
                        >
                            🇬🇧 Balance
                        </button>
                        <button 
                            onClick={() => copyPaymentLink(pkg.id, 'pt', 'BALANCE')}
                            className="flex-1 flex justify-center items-center gap-1.5 text-xs text-gray-600 bg-white py-1.5 rounded border border-gray-200 hover:bg-gray-50 shadow-sm"
                            title="Copy Balance Link (Portuguese)"
                        >
                            🇧🇷 Balance
                        </button>
                    </div>
                     <button
                        onClick={() => handleOpenBooking(pkg)}
                        className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 font-medium rounded border border-blue-200 hover:bg-blue-100 transition-colors text-xs"
                        title="Generate Timed Link"
                    >
                        <LinkIcon size={14} />
                        Create Timed Payment Link (Card)
                    </button>
                </div>

                {/* BANK TRANSFER Column */}
                 <div className="mb-2">
                     <div className="flex items-center gap-1 mb-2 font-bold text-gray-700 text-xs uppercase tracking-wide border-b border-gray-200 pb-1">
                        <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                        Bank Transfer
                    </div>
                    {/* Standard Links */}
                    <div className="flex gap-2 mb-2">
                        <button 
                            onClick={() => copyTransferLink(pkg.id, 'en', 'DEPOSIT')}
                            className="flex-1 flex justify-center items-center gap-1.5 text-xs font-medium text-gray-700 bg-white py-1.5 rounded border border-gray-200 hover:bg-gray-50 shadow-sm"
                            title="Copy Transfer Deposit Link (English)"
                        >
                            🇬🇧 Deposit
                        </button>
                        <button 
                            onClick={() => copyTransferLink(pkg.id, 'pt', 'DEPOSIT')}
                            className="flex-1 flex justify-center items-center gap-1.5 text-xs font-medium text-gray-700 bg-white py-1.5 rounded border border-gray-200 hover:bg-gray-50 shadow-sm"
                            title="Copy Transfer Deposit Link (Portuguese)"
                        >
                            🇧🇷 Deposit
                        </button>
                    </div>

                    {/* Balance Links */}
                    <div className="flex gap-2 mb-2">
                        <button 
                            onClick={() => copyTransferLink(pkg.id, 'en', 'FULL')}
                            className="flex-1 flex justify-center items-center gap-1.5 text-xs text-gray-600 bg-white py-1.5 rounded border border-gray-200 hover:bg-gray-50 shadow-sm"
                            title="Copy Transfer Full Link (English)"
                        >
                            🇬🇧 Full
                        </button>
                        <button 
                             onClick={() => copyTransferLink(pkg.id, 'pt', 'FULL')}
                            className="flex-1 flex justify-center items-center gap-1.5 text-xs text-gray-600 bg-white py-1.5 rounded border border-gray-200 hover:bg-gray-50 shadow-sm"
                            title="Copy Transfer Full Link (Portuguese)"
                        >
                            🇧🇷 Full
                        </button>
                    </div>

                    <div className="flex gap-2 mb-2">
                        <button 
                            onClick={() => copyTransferLink(pkg.id, 'en', 'BALANCE')}
                            className="flex-1 flex justify-center items-center gap-1.5 text-xs text-gray-600 bg-white py-1.5 rounded border border-gray-200 hover:bg-gray-50 shadow-sm"
                            title="Copy Transfer Balance (English)"
                        >
                            🇬🇧 Balance
                        </button>
                        <button 
                             onClick={() => copyTransferLink(pkg.id, 'pt', 'BALANCE')}
                            className="flex-1 flex justify-center items-center gap-1.5 text-xs text-gray-600 bg-white py-1.5 rounded border border-gray-200 hover:bg-gray-50 shadow-sm"
                            title="Copy Transfer Balance (Portuguese)"
                        >
                            🇧🇷 Balance
                        </button>
                    </div>
                     <button
                        onClick={() => handleOpenBooking(pkg, 'transfer')}
                        className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-700 font-medium rounded border border-orange-200 hover:bg-orange-100 transition-colors text-xs"
                        title="Generate Timed Link (Transfer)"
                    >
                        <LinkIcon size={14} />
                        Create Timed Payment Link (Transfer)
                    </button>
                </div>
                
                <div className="flex justify-end gap-2 border-t pt-2 border-gray-200">
                    <button 
                        onClick={() => handleEdit(pkg)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors"
                        title="Edit"
                    >
                        <Edit size={14} /> Edit
                    </button>
                    <button 
                        onClick={() => handleDelete(pkg.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={14} /> Delete
                    </button>
                </div>
              </div>
            </div>
          ))}

          {filteredPackages.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
                <p>No packages found. {searchTerm ? "Try a different search." : "Create one to get started."}</p>
            </div>
          )}
        </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto scale-100 animate-in zoom-in-95 duration-200">
                <form onSubmit={handleSave}>

                    <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                        <h2 className="text-xl font-bold">{currentPackage.id ? 'Edit Package' : 'New Package'}</h2>
                        <button type="button" onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-full"><X size={20}/></button>
                    </div>
                    
                    <div className="p-6 space-y-4">
                        {errorModel && <div className="bg-red-50 text-red-600 p-3 rounded text-sm">{errorModel}</div>}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name (English)</label>
                                <input 
                                    className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                                    value={currentPackage.name || ''}
                                    onChange={e => setCurrentPackage({...currentPackage, name: e.target.value})}
                                    required
                                    placeholder="e.g. Wedding Gold"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name (Portuguese)</label>
                                <input 
                                    className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                                    value={currentPackage.namePt || ''}
                                    onChange={e => setCurrentPackage({...currentPackage, namePt: e.target.value})}
                                    placeholder="e.g. Casamento Ouro"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price (£)</label>
                                <input 
                                    type="number" step="0.01"
                                    className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                                    value={currentPackage.totalPrice || ''}
                                    onChange={e => setCurrentPackage({...currentPackage, totalPrice: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Deposit (£)</label>
                                <input 
                                    type="number" step="0.01"
                                    className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                                    value={currentPackage.depositPrice || ''}
                                    onChange={e => setCurrentPackage({...currentPackage, depositPrice: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
                            <textarea 
                                className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-24" 
                                value={currentPackage.description || ''}
                                onChange={e => setCurrentPackage({...currentPackage, description: e.target.value})}
                                placeholder="Package details..."
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Portuguese)</label>
                            <textarea 
                                className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-24" 
                                value={currentPackage.descriptionPt || ''}
                                onChange={e => setCurrentPackage({...currentPackage, descriptionPt: e.target.value})}
                                placeholder="Detalhes do pacote..."
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input 
                                type="checkbox" 
                                id="active"
                                checked={currentPackage.active ?? true}
                                onChange={e => setCurrentPackage({...currentPackage, active: e.target.checked})}
                                className="w-4 h-4 text-blue-600 rounded"
                            />
                            <label htmlFor="active" className="text-sm font-medium text-gray-700">Active (Visible to clients)</label>
                        </div>
                    </div>

                    <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                        <button 
                            type="button" 
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isSaving}
                            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center gap-2 disabled:opacity-70"
                        >
                            {isSaving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>}
                            {isSaving ? 'Saving...' : 'Save Package'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {packageToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl w-full max-w-md shadow-2xl p-6 scale-100 animate-in zoom-in-95 duration-200">
                <div className="flex items-center gap-4 text-red-600 mb-4">
                    <div className="bg-red-100 p-3 rounded-full">
                        <AlertTriangle size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Confirm Deletion</h3>
                </div>
                
                <p className="text-gray-600 mb-6">
                    Are you sure you want to delete this package? This action cannot be undone and the package will stop appearing on the site.
                </p>

                <div className="flex justify-end gap-3">
                    <button 
                        onClick={() => setPackageToDelete(null)}
                        className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={confirmDelete}
                        className="px-4 py-2 bg-red-600 text-white font-medium hover:bg-red-700 rounded-lg shadow-sm transition-colors"
                    >
                        Delete Package
                    </button>
                </div>
            </div>
          </div>
      )}

      {/* Booking Link Generator Modal */}
      {isBookingModalOpen && selectedBookingPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl p-6 scale-100 animate-in zoom-in-95 duration-200 relative">
                <button 
                    onClick={() => setIsBookingModalOpen(false)} 
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                >
                    <X size={20}/>
                </button>

                <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                     <div className={`p-3 rounded-full ${bookingMethod === 'transfer' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                        {bookingMethod === 'transfer' ? <CheckCircle size={24} /> : <LinkIcon size={24} />}
                     </div>
                     <div>
                        <h3 className="text-xl font-bold text-gray-900">Generate {bookingMethod === 'transfer' ? 'Transfer' : 'Payment'} Link</h3>
                        <p className="text-sm text-gray-500">Create a time-locked booking link for your client</p>
                     </div>
                </div>

                <div className="space-y-5">
                    <div className={`p-4 rounded-lg border ${bookingMethod === 'transfer' ? 'bg-orange-50 border-orange-100' : 'bg-blue-50 border-blue-100'}`}>
                        <div className="flex justify-between items-start mb-1">
                            <span className={`text-xs font-bold uppercase tracking-wide ${bookingMethod === 'transfer' ? 'text-orange-600' : 'text-blue-600'}`}>
                                package
                            </span>
                            <span className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded ${bookingMethod === 'transfer' ? 'bg-white text-orange-600' : 'bg-white text-blue-600'}`}>
                                {bookingMethod === 'transfer' ? 'Bank Transfer' : 'Card Payment'}
                            </span>
                        </div>
                        <p className="text-lg font-bold text-gray-900">{selectedBookingPackage.name}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Session Date</label>
                            <input 
                                type="date" 
                                value={bookingDate}
                                onChange={(e) => {
                                    setBookingDate(e.target.value);
                                    setGeneratedLink(null);
                                }}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Session Time</label>
                            <input 
                                type="time" 
                                value={bookingTime}
                                onChange={(e) => {
                                    setBookingTime(e.target.value);
                                    setGeneratedLink(null);
                                }}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment Type</label>
                        <select
                            value={bookingPaymentType}
                            onChange={(e) => {
                                setBookingPaymentType(e.target.value as 'DEPOSIT' | 'FULL' | 'BALANCE');
                                setGeneratedLink(null);
                            }}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        >
                            <option value="DEPOSIT">Deposit</option>
                            <option value="FULL">Full</option>
                            <option value="BALANCE">Balance</option>
                        </select>
                    </div>

                    {generatedLink && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                             <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Link Generated:</p>
                             <div className="flex items-center gap-2 bg-white p-2 rounded border border-gray-200">
                                <code className="flex-1 text-xs text-gray-600 font-mono break-all line-clamp-2">
                                    {generatedLink}
                                </code>
                                <CheckCircle size={16} className="text-green-500 shrink-0" />
                             </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-6 mt-2">
                    <button 
                        onClick={() => generateLink('en')}
                        className={`group relative flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-white shadow-sm transition-all active:scale-[0.98] ${
                            !bookingDate 
                            ? 'bg-gray-300 cursor-not-allowed' 
                            : bookingMethod === 'transfer' 
                                ? 'bg-orange-600 hover:bg-orange-700 hover:shadow-orange-200' 
                                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200'
                        }`}
                        disabled={!bookingDate}
                    >
                        <span>Copy English 🇬🇧</span>
                    </button>
                    <button 
                        onClick={() => generateLink('pt')}
                         className={`group relative flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-white shadow-sm transition-all active:scale-[0.98] ${
                            !bookingDate 
                            ? 'bg-gray-300 cursor-not-allowed' 
                            : bookingMethod === 'transfer' 
                                ? 'bg-green-600 hover:bg-green-700 hover:shadow-green-200' 
                                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200'
                        }`}
                        disabled={!bookingDate}
                    >
                        <span>Copy Portuguese 🇧🇷</span>
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
          <div className={`fixed bottom-8 right-8 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 text-white animate-in slide-in-from-bottom-5 duration-300 ${toast.type === 'success' ? 'bg-green-700' : 'bg-red-600'}`}>
              {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <span className="font-medium">{toast.message}</span>
              <button onClick={() => setToast(null)} className="ml-2 hover:opacity-80"><X size={16} /></button>
          </div>
      )}
    </div>
  );
}
