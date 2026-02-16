"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/client/_components/AuthContext";
import { FileText, CreditCard, Image as ImageIcon, ExternalLink, LogOut, CalendarCheck } from 'lucide-react';
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const { token, loading, logout } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!loading && !token) {
      router.push("/login"); // Fixed: was redirection loop if check failed differently, but logic seems sound
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

  const cards = [
    {
      title: "Posts & Blog",
      description: "Manage your blog posts and articles. Create, edit, or delete content.",
      icon: <FileText className="w-8 h-8 text-blue-600" />,
      href: "/admin/posts",
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200"
    },
    {
      title: "Packages & Payments",
      description: "Manage service packages, prices, and generate payment links for clients.",
      icon: <CreditCard className="w-8 h-8 text-green-600" />,
      href: "/admin/packages",
      color: "bg-green-50 hover:bg-green-100 border-green-200"
    },
    {
      title: "Bookings",
      description: "View and manage client bookings and confirm manual payments.",
      icon: <CalendarCheck className="w-8 h-8 text-purple-600" />,
      href: "/admin/bookings",
      color: "bg-purple-50 hover:bg-purple-100 border-purple-200"
    },
    {
      title: "Portfolio",
      description: "Manage portfolio images. (Coming Soon)",
      icon: <ImageIcon className="w-8 h-8 text-gray-400" />,
      href: "#",
      color: "bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Bruna Alves Admin</h1>
        <div className="flex items-center gap-4">
          <a href="/" target="_blank" className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
            <ExternalLink size={16} /> View Site
          </a>
          <button 
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-gray-600 mt-2">Welcome back! Select a module to manage.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, index) => (
              <Link 
                key={index} 
                href={card.href}
                className={`block p-6 rounded-xl border transition-all duration-200 shadow-sm hover:shadow-md ${card.color}`}
                onClick={(e) => card.href === '#' && e.preventDefault()}
              >
                <div className="mb-4 bg-white w-14 h-14 rounded-full flex items-center justify-center shadow-sm">
                  {card.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-600">{card.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
