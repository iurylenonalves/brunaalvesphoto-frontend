"use client";

import DashboardStats from '@/client/_components/admin/DashboardStats';
import { useAuth } from "@/client/_components/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function DashboardPage() {
    const router = useRouter();
    const { token, loading } = useAuth();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        if (!loading && !token) {
            router.push("/login");
        }
    }, [loading, token, router]);

    if (!isClient || loading || !token) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center gap-4">
                <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-xl font-bold text-gray-800">Business Dashboard</h1>
            </header>

            <main className="flex-1 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Performance Metrics</h2>
                        <p className="text-gray-600 mt-2">Overview of revenue, bookings, and customer activity.</p>
                    </div>
                    <DashboardStats />
                </div>
            </main>
        </div>
    );
}
