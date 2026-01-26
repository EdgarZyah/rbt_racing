import { Link } from 'react-router-dom';
import { ShoppingBag, User, Menu } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-primary text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold tracking-wider font-mono">
            KNALPOT.CO
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="hover:text-accent transition">Home</Link>
            <Link to="/shop" className="hover:text-accent transition">Produk</Link>
            <Link to="/about" className="hover:text-accent transition">Tentang</Link>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-6">
            <Link to="/cart" className="relative hover:text-accent transition">
              <ShoppingBag size={24} />
              <span className="absolute -top-2 -right-2 bg-white text-primary text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>
            <Link to="/login" className="hover:text-accent transition">
              <User size={24} />
            </Link>
            <button className="md:hidden">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}