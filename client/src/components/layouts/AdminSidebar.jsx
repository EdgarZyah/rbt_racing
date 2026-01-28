// client/src/components/layouts/AdminSidebar.jsx
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Layers, UserCircle, LogOut, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; //
import ConfirmModal from '../commons/ConfirmModal'; 
import Notification from '../commons/Notification';

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth(); //
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  const handleLogout = () => {
    logout(); //
    setShowNotif(true);
    setTimeout(() => navigate('/login'), 1500); // Redirect ke login
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
    <aside className="w-64 border-r border-zinc-100 bg-white h-screen sticky top-0 flex flex-col p-8">
      {/* Brand & Nav sama seperti sebelumnya... */}
      <div className="mb-12">
        <Link to="/" className="text-xl font-black italic tracking-tighter">RBT_ADMIN</Link>
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

      <div className="pt-8 border-t border-zinc-100">
        <button 
          onClick={() => setIsModalOpen(true)} // Tampilkan peringatan
          className="w-full flex items-center space-x-4 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>

      <ConfirmModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleLogout}
        title="Log Out Confirmation"
        message="Are you sure you want to end your administrative session?"
      />
      <Notification show={showNotif} message="Logged out successfully." onClose={() => setShowNotif(false)} />
    </aside>
  );
}