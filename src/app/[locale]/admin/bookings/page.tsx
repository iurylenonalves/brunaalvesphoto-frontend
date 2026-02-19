'use client';

import { useAuth } from '@/client/_components/AuthContext';
import { Booking } from '@/types';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';

// Copied from lib/api.ts logic to avoid circular deps or complicated imports if lib/api.ts is messy
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function BookingsPage() {
    const { token, loading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const locale = params?.locale || "en";
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processingId, setProcessingId] = useState<string | null>(null);

    // Filters
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [bookingToConfirm, setBookingToConfirm] = useState<Booking | null>(null);

    useEffect(() => {
        if (!loading && !token) {
            router.push('/login');
        }
    }, [loading, token, router]);

    const loadBookings = async () => {
        if (!token) return;
        setIsLoadingData(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/api/bookings`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch bookings');
            const data = await res.json();
            setBookings(data);
        } catch (err: any) {
            setError(err.message || 'Error loading bookings');
        } finally {
            setIsLoadingData(false);
        }
    };

    useEffect(() => {
        if (token) {
            loadBookings();
        }
    }, [token]);

    const initiateConfirm = (booking: Booking) => {
        setBookingToConfirm(booking);
        setShowConfirmModal(true);
    };

    const handleConfirmPayment = async () => {
        if (!bookingToConfirm) return;
        const { id } = bookingToConfirm;
        
        setShowConfirmModal(false);
        setProcessingId(id);
        
        try {
            const res = await fetch(`${API_URL}/api/bookings/${id}/confirm`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed to confirm booking');
            }

            // Refresh list
            await loadBookings();
        } catch (err: any) {
            setError(err.message || 'Error confirming payment');
        } finally {
            setProcessingId(null);
            setBookingToConfirm(null);
        }
    };

    // Filter Logic
    const filteredBookings = useMemo(() => {
        return bookings.filter(b => {
             // 1. Status Filter
             if (statusFilter !== 'all' && b.status !== statusFilter) return false;
             
             // 2. Search Filter
             if (searchTerm) {
                 const searchLower = searchTerm.toLowerCase();
                 return (
                     (b.customerName || '').toLowerCase().includes(searchLower) ||
                     (b.customerEmail || '').toLowerCase().includes(searchLower) ||
                     (b.stripeSessionId || '').toLowerCase().includes(searchLower) ||
                     b.id.toLowerCase().includes(searchLower)
                 );
             }
             return true;
        });
    }, [bookings, statusFilter, searchTerm]);

    const getDisplayAmount = (booking: Booking) => {
        const paid = Number(booking.amountPaid || 0);
        if (paid > 0) return paid;
        
        // Use package price if pending/manual
        if (booking.package) {
            const total = Number(booking.package.totalPrice || 0);
            const deposit = Number(booking.package.depositPrice || 0);
            const type = (booking.paymentType || '').toUpperCase();
            if (type === 'DEPOSIT') return deposit;
            if (type === 'FULL') return total;
            if (type === 'BALANCE') return total - deposit;
        }
        return 0;
    };

    const formatMoney = (amount: any, currency: string) => 
        new Intl.NumberFormat('en-GB', { style: 'currency', currency: currency }).format(amount);

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    if (loading || (!token && !bookings.length && isLoadingData)) {
        return <div className="p-8 text-center text-gray-500">Loading...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
                        <Link href={`/${locale}/admin`} className="text-sm text-gray-500 hover:underline">← Back to Dashboard</Link>
                </div>
                <button 
                    onClick={loadBookings}
                    className="group flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
                >
                    <svg className={`w-4 h-4 mr-2 ${isLoadingData ? 'animate-spin text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                    Refresh
                </button>
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 shadow-sm">{error}</div>}

            {/* Controls */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    {/* Tabs */}
                    <div className="flex p-1 bg-gray-100 rounded-lg w-full md:w-auto">
                        {(['all', 'pending', 'paid'] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-medium capitalize transition-all ${
                                    statusFilter === status 
                                    ? 'bg-white text-gray-900 shadow-sm' 
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-72">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search client, email..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {isLoadingData && !bookings.length && (
                <div className="text-center py-12">
                   <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full mb-4"></div>
                   <p className="text-gray-500">Loading bookings...</p>
                </div>
            )}

            {/* Empty State */}
            {!isLoadingData && filteredBookings.length === 0 && (
                <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
                    <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search terms.</p>
                </div>
            )}

            {/* Mobile Cards (Visible only on small screens) */}
            <div className="space-y-4 md:hidden">
                {filteredBookings.map((booking) => (
                    <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-semibold text-gray-900">{booking.customerName || 'Unknown'}</h3>
                                    <p className="text-sm text-gray-500">{booking.customerEmail}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-bold rounded-full uppercase tracking-wide ${
                                    booking.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {booking.status}
                                </span>
                            </div>

                            <div className="flex items-center text-sm text-gray-500 mb-2">
                                <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                {formatDate(booking.createdAt)}
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-500 mb-2">
                                <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <span className={booking.sessionDate ? 'text-gray-900 font-medium' : 'text-gray-400 italic'}>
                                    {booking.sessionDate ? formatDate(booking.sessionDate) : 'No date scheduled'}
                                </span>
                            </div>

                            <div className="bg-gray-50 -mx-4 px-4 py-3 mt-3 border-t border-gray-100 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Package</p>
                                    <p className="font-medium text-gray-900 text-sm truncate">{booking.package?.name || 'Custom'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 uppercase">Amount</p>
                                    <p className="font-medium text-gray-900 text-sm">{formatMoney(getDisplayAmount(booking), booking.currency)}</p>
                                </div>
                            </div>

                             {booking.status === 'pending' && (
                                <div className="mt-4 pt-3 border-t border-gray-100">
                                    <button
                                        onClick={() => initiateConfirm(booking)}
                                        disabled={!!processingId}
                                        className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed shadow-sm"
                                    >
                                        {processingId === booking.id ? (
                                            <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin mr-2"></span>
                                        ) : (
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        )}
                                        {processingId === booking.id ? 'Processing...' : 'Confirm Payment'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table (Hidden on small screens) */}
            <div className="hidden md:block bg-white shadow-sm overflow-hidden rounded-xl border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Session Date</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Package</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredBookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(booking.createdAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs mr-3">
                                            {booking.customerName ? booking.customerName.charAt(0).toUpperCase() : '?'}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{booking.customerName || 'Unknown'}</div>
                                            <div className="text-sm text-gray-500">{booking.customerEmail}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">                                    {booking.sessionDate ? formatDate(booking.sessionDate) : <span className="text-gray-400 italic">No date set</span>}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">                                    {booking.package?.name || 'Custom'}
                                    <span className="block text-xs text-gray-400 mt-0.5">{booking.paymentType}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {formatMoney(getDisplayAmount(booking), booking.currency)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        booking.status === 'paid' 
                                            ? 'bg-green-100 text-green-800' 
                                            : booking.status === 'pending' 
                                                ? 'bg-yellow-100 text-yellow-800' 
                                                : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {booking.status === 'paid' && <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>}
                                        {booking.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {booking.status === 'pending' && (
                                        <button
                                            onClick={() => initiateConfirm(booking)}
                                            disabled={!!processingId}
                                            className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-md transition-all shadow-sm disabled:opacity-50"
                                        >
                                            {processingId === booking.id ? 'Processing...' : 'Confirm Payment'}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Confirmation Modal */}
             {showConfirmModal && bookingToConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Payment</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to confirm payment of 
                            <span className="font-semibold text-gray-900 mx-1">
                                {formatMoney(getDisplayAmount(bookingToConfirm), bookingToConfirm.currency)}
                            </span>
                            for {bookingToConfirm.customerName || 'Client'}?
                            <br/><br/>
                            <span className="text-sm text-gray-500">This will mark the booking as paid and send a confirmation email immediately.</span>
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmPayment}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                Confirm Payment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
