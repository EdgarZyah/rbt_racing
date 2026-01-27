// client/src/layouts/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layouts/Navbar';
import Footer from '../components/layouts/Footer';

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar tetap di atas */}
      <Navbar />

      {/* Konten Utama dengan transisi halus */}
      <main className="flex-grow">
        {/* Outlet akan merender HomePage, Product, dll */}
        <div className="animate-in fade-in duration-700">
          <Outlet />
        </div>
      </main>

      {/* Footer di bagian paling bawah */}
      <Footer />
    </div>
  );
}