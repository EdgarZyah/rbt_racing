import React from 'react';
import { ShoppingBag, MapPin, User, ArrowRight, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import Table from '../../components/commons/Table';

export default function CustomerDashboard() {
  const recentOrders = [
    { id: "ORD-1029", date: "2026-01-26", total: 2500000, status: "SHIPPED" },
  ];

  const headers = ["Order ID", "Date", "Total", "Status", "Action"];

  const renderRow = (order) => (
    <tr key={order.id} className="border-b border-zinc-50 hover:bg-zinc-50 transition">
      <td className="px-6 py-4 font-black text-[10px] tracking-tighter">{order.id}</td>
      <td className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase">{order.date}</td>
      <td className="px-6 py-4 text-[10px] font-black italic">Rp {order.total.toLocaleString()}</td>
      <td className="px-6 py-4">
        <span className="text-[9px] font-black uppercase px-2 py-0.5 border border-black bg-black text-white">
          {order.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <Link to={`/customer/orders`} className="text-[10px] font-black uppercase border-b border-black">Detail</Link>
      </td>
    </tr>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in duration-700">
      <div className="mb-12">
        <h1 className="text-4xl font-black italic tracking-tighter uppercase">My Account</h1>
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">Welcome back, Performance Enthusiast</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <Link to="/customer/orders" className="border border-zinc-100 p-8 hover:bg-zinc-50 transition group">
          <ShoppingBag size={24} className="mb-6 text-zinc-300 group-hover:text-black transition" />
          <h3 className="text-xs font-black uppercase tracking-widest mb-1">Orders</h3>
          <p className="text-[10px] text-zinc-400 uppercase">Check your order status</p>
        </Link>
        <Link to="/customer/profile" className="border border-zinc-100 p-8 hover:bg-zinc-50 transition group">
          <User size={24} className="mb-6 text-zinc-300 group-hover:text-black transition" />
          <h3 className="text-xs font-black uppercase tracking-widest mb-1">Profile</h3>
          <p className="text-[10px] text-zinc-400 uppercase">Edit your personal info</p>
        </Link>
        <div className="border border-zinc-100 p-8 bg-black text-white">
          <Package size={24} className="mb-6 text-zinc-500" />
          <h3 className="text-xs font-black uppercase tracking-widest mb-1 text-white">RBT_Points</h3>
          <p className="text-[10px] text-zinc-400 uppercase">You have 1,250 points</p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <h2 className="text-lg font-black italic uppercase tracking-tighter">Recent Orders</h2>
          <Link to="/customer/orders" className="text-[10px] font-black uppercase tracking-widest border-b-2 border-black">View All</Link>
        </div>
        <Table headers={headers} data={recentOrders} renderRow={renderRow} />
      </div>
    </div>
  );
}