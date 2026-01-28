import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Layers, UserCircle, LogOut, Home, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ConfirmModal from '../commons/ConfirmModal'; 
import Notification from '../commons/Notification';
import { useState } from 'react';

export default function AdminSidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  const handleLogout = () => {
    setIsModalOpen(false);
    logout();
    setShowNotif(true);
    setTimeout(() => navigate('/login'), 1500);
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/admin" },
    { icon: Package, label: "Products", path: "/admin/products" },
    { icon: Layers, label: "Categories", path: "/admin/categories" },
    { icon: UserCircle, label: "Profile", path: "/admin/profile" },
    { icon: Home, label: "Shop Address", path: "/admin/shop-address" },
    { icon: Users, label: "User Management", path: "/admin/users" },
    { icon: ShoppingCart, label: "Orders", path: "/admin/orders" },
  ];

  return (
    <>
      {/* 1. OVERLAY (Global) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 2. CONFIRM MODAL (Global - diletakkan di luar aside agar z-index tidak terganggu) */}
      <ConfirmModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleLogout}
        title="Log Out Confirmation"
        message="Are you sure you want to end your administrative session?"
      />

      {/* 3. NOTIFICATION (Global) */}
      <Notification show={showNotif} message="Session terminated." onClose={() => setShowNotif(false)} />

      {/* 4. SIDEBAR ASIDE */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-zinc-100 p-8 z-[70]
        w-72 flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between mb-12">
          <Link to="/" className="text-xl font-black italic tracking-tighter">RBT_ADMIN</Link>
          <button 
            onClick={() => setIsOpen(false)} 
            className="lg:hidden p-2 hover:bg-zinc-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-grow space-y-1.5 overflow-y-auto no-scrollbar pr-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.label} 
                to={item.path} 
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-4 px-4 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 rounded-sm ${
                  isActive 
                    ? 'bg-black text-white shadow-xl translate-x-1' 
                    : 'text-zinc-400 hover:text-black hover:bg-zinc-50'
                }`}
              >
                <item.icon size={16} strokeWidth={isActive ? 2.5 : 1.5} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-8 border-t border-zinc-100">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group w-full flex items-center space-x-4 px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all rounded-sm active:scale-95"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}