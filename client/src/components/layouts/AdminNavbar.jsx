import React from 'react';
import { Bell, Search, Settings } from 'lucide-react';

export default function AdminNavbar() {
  return (
    <nav className="h-20 bg-white border-b border-zinc-100 px-12 flex items-center justify-end top-0">
      {/* Admin Info & Actions */}
      <div className="flex items-center space-x-8">
        <button className="text-zinc-400 hover:text-black relative transition">
          <Bell size={18} strokeWidth={1.5} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-black rounded-full border-2 border-white"></span>
        </button>
        
        <button className="text-zinc-400 hover:text-black transition">
          <Settings size={18} strokeWidth={1.5} />
        </button>

        <div className="h-8 w-px bg-zinc-100"></div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-tighter italic">Master Admin</p>
            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Super User</p>
          </div>
          <div className="w-10 h-10 bg-black flex items-center justify-center">
            <span className="text-white text-xs font-black">AD</span>
          </div>
        </div>
      </div>
    </nav>
  );
}