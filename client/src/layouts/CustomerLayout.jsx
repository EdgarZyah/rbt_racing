import React from 'react';
import { Outlet } from 'react-router-dom';
import CustomerSidebar from '../components/layouts/CustomerSidebar';

export default function CustomerLayout() {
  return (
    <div className="flex min-h-screen bg-white font-sans text-black">
      <CustomerSidebar />
      <main className="flex-grow p-2 overflow-y-auto">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Outlet />
        </div>
      </main>
    </div>
  );
}