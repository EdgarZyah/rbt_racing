// client/src/components/auth/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, requiredRole, guestOnly = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Tampilkan loading state agar tidak terjadi redirect instan saat refresh
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">
          Verifying Credentials...
        </div>
      </div>
    );
  }

  // LOGIKA 1: Jika halaman khusus Guest (Login/Register)
  if (guestOnly && user) {
    // Jika user sudah login mencoba masuk login/register, arahkan ke dashboard sesuai role
    return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/customer'} replace />;
  }

  // LOGIKA 2: Jika halaman diproteksi tapi user belum login
  if (!guestOnly && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // LOGIKA 3: Jika halaman butuh role spesifik (Admin/Customer)
  if (requiredRole && user.role !== requiredRole) {
    // Jika role tidak cocok, kembalikan ke home atau halaman yang sesuai
    return <Navigate to="/" replace />;
  }

  return children;
}