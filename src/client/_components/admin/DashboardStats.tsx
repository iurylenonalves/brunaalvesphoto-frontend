'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/client/_components/AuthContext';
import { 
    Users, CreditCard, Calendar, TrendingUp, 
    ArrowUpRight, ArrowDownRight, Package, DollarSign, PieChart, Info
} from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface Stats {
    revenue: { total: number; month: number };
    counts: { total: number; pending: number; paid: number };
    methods: { stripe: number; transfer: number };
    types: { deposit: number; full: number };
    sessions: { scheduled: number; unscheduled: number; completed: number };
    topPackages: { name: string; count: number }[];
    salesHistory: { month: string; revenue: number }[];
    topClients: { name: string; email: string; total: number }[];
    stuckPackages: { name: string; price: number }[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function DashboardStats() {
    const { token } = useAuth();
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;

        fetch(`${API_URL}/api/dashboard/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => {
            if (!res.ok) throw new Error('Failed to fetch stats');
            return res.json();
        })
        .then(data => {
            setStats(data);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, [token]);

    const formatCurrency = (val: number) => 
        new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(val);

    if (loading) return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse"></div>)}
        </div>
    );
    
    if (!stats) return null;

    const maxPackageCount = stats.topPackages.length > 0 ? Math.max(...stats.topPackages.map(p => p.count)) : 1;
    const maxRevenue = Math.max(...stats.salesHistory.map(s => s.revenue), 100);
    
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
    const pieData = stats.topPackages.map(p => ({
        name: p.name,
        value: p.count
    }));

    return (
        <div className="space-y-6 mb-8">

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.revenue.total)}</h3>
                        </div>
                        <div className="p-2 bg-green-50 rounded-lg">
                            <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <span className="text-green-600 font-medium flex items-center">
                            <ArrowUpRight className="w-4 h-4 mr-1" />
                            {formatCurrency(stats.revenue.month)}
                        </span>
                        <span className="text-gray-400 ml-2">this month</span>
                    </div>
                </div>

                <Link href="/admin/bookings" className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-shadow hover:shadow-md block">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Active Bookings</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.counts.paid}</h3>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Users className="w-5 h-5 text-blue-600" />
                        </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                        <span className="font-medium text-gray-900">{stats.counts.pending}</span> pending payment
                    </div>
                </Link>

                <Link href="/admin/bookings" className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-shadow hover:shadow-md block">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Scheduled Sessions</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.sessions.scheduled}</h3>
                        </div>
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <Calendar className="w-5 h-5 text-purple-600" />
                        </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                        <span className="font-medium text-orange-600">{stats.sessions.unscheduled}</span> needs scheduling
                    </div>
                </Link>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Sessions Done</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.sessions.completed || 0}</h3>
                        </div>
                        <div className="p-2 bg-indigo-50 rounded-lg">
                            <CreditCard className="w-5 h-5 text-indigo-600" />
                        </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                        All time completed
                    </div>
                </div>
            </div>

            {/* Middle Row: Sales History & Package Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Sales History Bar Chart */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-2">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-gray-500" />
                        Sales History (Last 6 Months)
                    </h3>
                    <div className="flex items-end space-x-4 h-48">
                        {stats.salesHistory.map((item, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                                <div className="text-xs font-bold text-gray-600 mb-2 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 w-full text-center">
                                    {formatCurrency(item.revenue)}
                                </div>
                                <div className="h-full w-full flex items-end justify-center">
                                    <div 
                                        className="w-full bg-blue-100 rounded-t-lg hover:bg-blue-200 transition-colors relative"
                                        style={{ height: `${Math.max((item.revenue / maxRevenue) * 100, 2)}%` }}
                                    >
                                        <div className="absolute w-full bottom-0 bg-blue-500 rounded-t-lg" style={{ height: '4px' }}></div>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500 mt-2">{item.month}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Packages Distribution (Pie Chart) */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                     <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <PieChart className="w-5 h-5 mr-2 text-gray-500" />
                        Package Distribution
                    </h3>
                    <div className="h-48 w-full flex items-center justify-center">
                       {pieData.length > 0 ? (
                           <ResponsiveContainer width="100%" height="100%">
                               <RechartsPie>
                                   <Pie
                                       data={pieData}
                                       cx="50%"
                                       cy="50%"
                                       innerRadius={40}
                                       outerRadius={70}
                                       paddingAngle={5}
                                       dataKey="value"
                                   >
                                       {pieData.map((entry, index) => (
                                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                       ))}
                                   </Pie>
                                   <Tooltip />
                               </RechartsPie>
                           </ResponsiveContainer>
                       ) : (
                           <div className="text-center text-gray-400 text-sm flex flex-col items-center">
                               <Info className="w-8 h-8 mb-2 opacity-50" />
                               No sales data yet
                           </div>
                       )}
                    </div>
                    {/* Compact Legend */}
                    <div className="mt-2 space-y-1">
                        {pieData.slice(0, 3).map((entry, index) => (
                            <div key={index} className="flex items-center text-xs justify-between">
                                <div className="flex items-center truncate max-w-[70%]">
                                    <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                    <span className="text-gray-600 truncate">{entry.name}</span>
                                </div>
                                <span className="font-bold text-gray-800">{entry.value}</span>
                            </div>
                        ))}
                        {pieData.length > 3 && (
                            <div className="text-xs text-center text-gray-400 mt-2">
                                + {pieData.length - 3} others
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Row: Top Clients & Stuck Packages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Top Packages (List View) */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <Package className="w-5 h-5 mr-2 text-gray-500" />
                        Top Performing Packages
                    </h3>
                    <div className="space-y-4">
                        {stats.topPackages.map((pkg, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-gray-700 truncate w-48" title={pkg.name}>{pkg.name}</span>
                                    <span className="text-gray-500">{pkg.count} sales</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div 
                                        className="bg-blue-600 h-2 rounded-full" 
                                        style={{ width: `${(pkg.count / maxPackageCount) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                 
                 {/* Top Clients */}
                 <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Top Clients</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left font-medium text-gray-500">Client</th>
                                    <th className="px-4 py-2 text-right font-medium text-gray-500">Spent</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stats.topClients.map((client, i) => (
                                    <tr key={i}>
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-gray-900">{client.name}</div>
                                            <div className="text-xs text-gray-500">{client.email}</div>
                                        </td>
                                        <td className="px-4 py-3 text-right font-bold text-gray-700">
                                            {formatCurrency(client.total)}
                                        </td>
                                    </tr>
                                ))}
                                {stats.topClients.length === 0 && (
                                    <tr>
                                        <td colSpan={2} className="px-4 py-3 text-center text-gray-500">No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                 </div>
            </div>

            {/* Bottom Row Continued: Stuck Packages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Stuck Packages */}
                 <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold mb-4 text-red-600">Opportunity (No sales 90 days)</h3>
                    <p className="text-sm text-gray-500 mb-4">Consider creating a promotion for these packages.</p>
                    <div className="space-y-3">
                        {stats.stuckPackages.map((pkg, i) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                                <span className="font-medium text-gray-800">{pkg.name}</span>
                                <span className="text-sm font-bold text-gray-600">{formatCurrency(pkg.price)}</span>
                            </div>
                        ))}
                         {stats.stuckPackages.length === 0 && (
                            <div className="text-center text-gray-500 py-4">Great! All packages are selling well.</div>
                        )}
                    </div>
                 </div>
            </div>
        </div>
    );
}

/* Lines 140-190 omitted */
