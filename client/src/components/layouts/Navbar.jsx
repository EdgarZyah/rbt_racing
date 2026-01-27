// client/src/components/layouts/Navbar.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Search, X, LogOut } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext'; //

export default function Navbar() {
  const { user } = useAuth(); //
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/product?search=${query}`);
      setIsSearchOpen(false);
      setQuery('');
    }
  };

  return (
    <nav className="bg-white border-b border-zinc-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="text-xl font-extrabold tracking-tighter italic">RBT_RACING</Link>

          <div className="hidden md:flex space-x-10 text-[11px] font-bold uppercase tracking-[0.2em]">
            <Link to="/product" className="hover:text-zinc-400 transition">Shop</Link>
            <Link to="/about" className="hover:text-zinc-400 transition">About</Link>
          </div>

          <div className="flex items-center space-x-6">
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="hover:text-zinc-400 transition">
              <Search size={20} strokeWidth={1.5} />
            </button>
            
            {/* Dinamis: Dashboard vs Login */}
            {user ? (
              <Link 
                to={user.role === 'ADMIN' ? '/admin' : '/customer'} 
                className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest"
              >
                <User size={20} strokeWidth={1.5} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            ) : (
              <Link to="/login" className="hover:text-zinc-400 transition">
                <User size={20} strokeWidth={1.5} />
              </Link>
            )}
            
            <Link to="/cart" className="relative group">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full animate-in zoom-in">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
      {/* Search Overlay tetap sama... */}
    </nav>
  );
}