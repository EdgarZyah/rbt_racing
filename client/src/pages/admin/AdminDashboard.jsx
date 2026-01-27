import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/layouts/AdminSidebar';
import AdminNavbar from '../../components/layouts/AdminNavbar';

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-white font-sans text-black selection:bg-black selection:text-white">
      {/* Navigasi Samping */}
      <AdminSidebar />

      {/* Area Konten Utama */}
      <div className="flex-grow flex flex-col">
        {/* Navigasi Atas */}
        <AdminNavbar />

        {/* Content Render Area */}
        <main className="flex-grow bg-white">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Outlet akan merender halaman anak seperti:
              ProductList, OrderList, UserManagement, dll 
            */}
            <Outlet />
          </div>
        </main>
        
        {/* Simple Admin Footer */}
        <footer className="px-12 py-6 border-t border-zinc-100 bg-zinc-50/30">
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-400 text-center">
            RBT_RACING Control Panel © 2026 • Performance Managed
          </p>
        </footer>
      </div>
    </div>
  );
}