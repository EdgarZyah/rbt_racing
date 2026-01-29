// client/src/components/layouts/Navbar.jsx
import { Link } from 'react-router-dom';
import { ShoppingBag, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

// Import Logo dari folder assets
import logo from '../../assets/logo.png';

export default function Navbar() {
  const { user } = useAuth();
  const { cartItems } = useCart();
  
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="bg-white border-b border-zinc-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo Section */}
          <Link to="/#" className="flex items-center">
            <img 
              src={logo} 
              alt="RBT RACING LOGO" 
              className="h-20 w-auto object-contain" // Tinggi disesuaikan (12 = 3rem/48px)
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-10 text-[11px] font-black uppercase tracking-[0.2em]">
            <Link to="/product" className="hover:text-zinc-400 transition">Shop</Link>
            <Link to="/about" className="hover:text-zinc-400 transition">About</Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-6">
            
            {/* Dinamis: Dashboard vs Login */}
            {user ? (
              <Link 
                to={user.role === 'ADMIN' ? '/admin' : '/customer'} 
                className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest hover:text-zinc-400 transition"
              >
                <User size={20} strokeWidth={1.5} />
                <span className="hidden sm:inline">Account</span>
              </Link>
            ) : (
              <Link to="/login" className="hover:text-zinc-400 transition">
                <User size={20} strokeWidth={1.5} />
              </Link>
            )}
            
            {/* Cart Button */}
            <Link to="/cart" className="relative group hover:text-zinc-400 transition">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}