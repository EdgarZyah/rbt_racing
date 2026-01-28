import React from 'react';
import { Menu } from 'lucide-react';

export default function AdminNavbar({ onMenuClick }) {
  return (
    <nav className="h-20 bg-white border-b border-zinc-100 px-6 md:px-12 flex items-center justify-between lg:justify-end sticky top-0 z-50">
      
      {/* Menu Toggle (Mobile Only) - Hanya muncul di bawah 1024px (lg) */}
      <button 
        onClick={onMenuClick}
        className="lg:hidden p-2.5 bg-black text-white rounded-sm hover:bg-zinc-800 transition shadow-lg active:scale-95"
      >
        <Menu size={20} />
      </button>

      {/* Admin Info & Actions */}
      <div className="flex items-center space-x-4 md:space-x-8">
        <div className="hidden sm:block h-8 w-px bg-zinc-100"></div>

        <div className="flex items-center space-x-3 md:space-x-4 group cursor-pointer">
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-tighter italic group-hover:text-zinc-600 transition-colors">Master Admin</p>
            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none">System Control</p>
          </div>
          
          <div className="relative shrink-0">
            <div className="w-10 h-10 bg-black flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <span className="text-white text-xs font-black uppercase tracking-tighter">AD</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
        </div>
      </div>
    </nav>
  );
}