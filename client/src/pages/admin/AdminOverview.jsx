// client/src/pages/admin/AdminOverview.jsx
import React, { useEffect } from 'react';
import { ShoppingCart, Package, Users, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';

export default function AdminOverview() {
  const { stats, loading, getStats } = useDashboard();

  useEffect(() => {
    getStats();
  }, [getStats]);

  if (loading || !stats) {
    return (
      <div className="p-10 flex justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin text-zinc-300" size={40} />
      </div>
    );
  }

  const statCards = [
    { label: "Total Revenue", value: `Rp ${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "text-zinc-900" },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, color: "text-zinc-900" },
    { label: "Inventory Size", value: stats.totalProducts, icon: Package, color: "text-zinc-900" },
    { label: "Active Riders", value: stats.totalCustomers, icon: Users, color: "text-zinc-900" },
  ];

  return (
    <div className="p-10 animate-in fade-in duration-700">
      <div className="mb-12">
        <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Overview</h1>
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em] mt-3">RBT Racing Performance Analytics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-20">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white border border-zinc-100 p-8 shadow-sm group hover:border-black transition-all">
            <card.icon className="text-zinc-200 mb-6 group-hover:text-black transition-colors" size={24} />
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">{card.label}</p>
            <p className={`text-2xl font-black italic tracking-tighter ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}