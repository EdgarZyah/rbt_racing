// client/src/components/layouts/AdminSidebar.jsx
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Layers, UserCircle, LogOut, Home, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ConfirmModal from '../commons/ConfirmModal'; 
import Notification from '../commons/Notification';
import logo from '../../assets/logo.png'; // IMPORT LOGO

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
    { icon: UserCircle, label: "Profile", path: "/admin/profile" },
    { icon: Home, label: "Shop Address", path: "/admin/shop-address" },
    { icon: Package, label: "Products", path: "/admin/products" },
    { icon: Layers, label: "Categories", path: "/admin/categories" },
    { icon: Users, label: "User Management", path: "/admin/users" },
    { icon: ShoppingCart, label: "Orders List", path: "/admin/orders" },
  ];

  return (
    <>
      {/* GLOBAL COMPONENTS (Di luar aside agar tampil di tengah layar) */}
      <ConfirmModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleLogout}
        title="Security Exit"
        message="Are you sure you want to end your administrative session?"
      />
      <Notification show={showNotif} message="Session terminated." onClose={() => setShowNotif(false)} />

      {/* OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR ASIDE */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-zinc-100 p-8 z-[70]
        w-72 flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between mb-2">
          {/* Logo Section */}
          <Link to="/" className="flex items-center w-full">
            <img src={logo} alt="RBT RACING" className="h-30 w-auto m-auto object-contain" />
          </Link>
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