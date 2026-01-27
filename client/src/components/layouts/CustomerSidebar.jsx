// client/src/components/layouts/CustomerSidebar.jsx
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, UserCircle, LogOut, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; //
import ConfirmModal from '../commons/ConfirmModal';
import Notification from '../commons/Notification';

export default function CustomerSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth(); //
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  const handleLogout = () => {
    logout(); //
    setShowNotif(true);
    setTimeout(() => navigate('/'), 1500); // Redirect ke Home
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/customer' },
    { icon: ShoppingBag, label: 'My Orders', path: '/customer/orders' },
    { icon: UserCircle, label: 'Profile Settings', path: '/customer/profile' },
  ];

  return (
    <aside className="w-64 border-r border-zinc-100 bg-white h-screen sticky top-0 flex flex-col p-8">
      {/* Navigasi tetap sama... */}
      <div className="mb-12">
        <Link to="/" className="text-xl font-black italic tracking-tighter">RBT_USER</Link>
      </div>

      <nav className="flex-grow space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.label} to={item.path} className={`flex items-center space-x-4 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${isActive ? 'bg-black text-white shadow-lg' : 'text-zinc-400 hover:text-black hover:bg-zinc-50'}`}>
              <item.icon size={16} strokeWidth={isActive ? 2.5 : 1.5} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-8 border-t border-zinc-100 space-y-2">
        <Link to="/" className="flex items-center space-x-4 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black">
          <Home size={16} />
          <span>Back to Shop</span>
        </Link>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center space-x-4 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>

      <ConfirmModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleLogout}
        title="Leave Account"
        message="Ready to park your machine? You can return anytime."
      />
      <Notification show={showNotif} message="Session ended. Ride safe!" onClose={() => setShowNotif(false)} />
    </aside>
  );
}