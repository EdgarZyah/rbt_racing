import { Outlet } from 'react-router-dom';
import Navbar from '../components/layouts/Navbar';
import Footer from '../components/layouts/Footer';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Outlet adalah tempat halaman-halaman dirender */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}