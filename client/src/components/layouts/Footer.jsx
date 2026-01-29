// client/src/components/layouts/Footer.jsx
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-20 pb-10 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
        
        {/* Brand Section */}
        <div className="md:col-span-2">
          <Link to="/" className="inline-block mb-6">
            <img 
              src={logo} 
              alt="RBT RACING LOGO" 
              className="h-24 w-auto"
            />
          </Link>
          <p className="text-zinc-500 text-xs md:text-sm max-w-sm leading-relaxed uppercase tracking-tight">
            Our dedication is to forge maximum engine performance through high-quality exhaust systems. Engineered with precision, tested on the race track.
          </p>
        </div>

        {/* Navigation Section (Sama dengan Navbar) */}
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-zinc-300">Navigation</h4>
          <ul className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest space-y-4">
            <li><Link to="/product" className="hover:text-white transition">Shop</Link></li>
            <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
          </ul>
        </div>

        {/* Follow Section */}
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-zinc-300">Follow Us</h4>
          <div className="flex flex-col space-y-4 text-zinc-500">
             <a href="#" className="hover:text-white uppercase text-[10px] tracking-widest font-bold transition">Instagram</a>
             <a href="#" className="hover:text-white uppercase text-[10px] tracking-widest font-bold transition">Youtube</a>
             <a href="#" className="hover:text-white uppercase text-[10px] tracking-widest font-bold transition">TikTok</a>
          </div>
        </div>

      </div>

      {/* Copyright Bottom */}
      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[9px] text-zinc-600 uppercase tracking-[0.2em]">
          {new Date().getFullYear()} RBT Racing Engineering. All Rights Reserved.
        </p>
        <div className="flex space-x-6 text-[9px] text-zinc-600 uppercase tracking-widest font-bold">
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
        </div>
      </div>
    </footer>
  );
}