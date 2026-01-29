// client/src/components/layouts/CustomerSidebar.jsx
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, UserCircle, LogOut, Home, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ConfirmModal from '../commons/ConfirmModal';
import Notification from '../commons/Notification';
import logo from '../../assets/logo.png'; // IMPORT LOGO

export default function CustomerSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [isOpen, setIsOpen] = useState(false); 

  const handleLogout = () => {
    setIsModalOpen(false);
    logout();
    setShowNotif(true);
    setTimeout(() => navigate('/'), 1500);
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/customer' },
    { icon: ShoppingBag, label: 'My Orders', path: '/customer/orders' },
    { icon: UserCircle, label: 'Profile Settings', path: '/customer/profile' },
  ];

  return (
    <>
      {/* GLOBAL COMPONENTS (Outside Aside) */}
      <ConfirmModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleLogout}
        title="Leave Account"
        message="Ready to park your machine? You can return anytime."
      />
      <Notification show={showNotif} message="Session ended. Ride safe!" onClose={() => setShowNotif(false)} />

      {/* MOBILE TRIGGER - Menyamakan gaya dengan dashboard Anda */}
      <div onClick={() => setIsOpen(!isOpen)} className="lg:hidden min-h-screen bg-secondary border-b border-zinc-100 p-2 sticky top-0 z-[50] flex justify-between items-center">
        <button  className="p-2 bg-secondary text-white rounded-sm">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden transition-opacity" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ASIDE */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-[70] lg:z-auto
        w-72 h-screen bg-white border-r border-zinc-100 p-8
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        <div className="mb-2">
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

        <div className="pt-8 border-t border-zinc-100 space-y-2">
          <Link to="/" className="flex items-center space-x-4 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">
            <Home size={16} />
            <span>Back to home</span>
          </Link>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center space-x-4 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all text-left rounded-sm"
          >
            <LogOut size={16} />
            <span>Logout Account</span>
          </button>
        </div>
      </aside>
    </>
  );
}