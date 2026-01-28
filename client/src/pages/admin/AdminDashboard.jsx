import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/layouts/AdminSidebar';
import AdminNavbar from '../../components/layouts/AdminNavbar';

export default function AdminDashboard() {
  // State untuk mengontrol buka/tutup sidebar di mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-white font-sans text-black selection:bg-black selection:text-white">
      {/* Sidebar - Menerima state dan fungsi penutup */}
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Area Konten Utama */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar - Menerima fungsi pembuka */}
        <AdminNavbar onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Content Render Area */}
        <main className="flex-1 bg-white">
          <div className="p-2 ">
            <Outlet />
          </div>
        </main>
        
        {/* Simple Admin Footer */}
        <footer className="px-6 md:px-12 py-6 border-t border-zinc-100 bg-zinc-50/30">
          <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-400 text-center">
            RBT_RACING Control Panel ©{new Date().getFullYear()} All Rights Reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}