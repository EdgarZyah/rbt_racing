// client/src/pages/customer/CustomerProfile.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';
import Notification from '../../components/commons/Notification';
import { MapPin, ArrowRight, User, Mail, Loader2 } from 'lucide-react';

export default function CustomerProfile() {
  const { getProfile, updateProfile, loading } = useUser();
  const [formData, setFormData] = useState({ username: '', email: '' });
  const [notif, setNotif] = useState({ show: false, message: '', type: 'success' });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      const data = await getProfile();
      if (isMounted && data) {
        setFormData({ username: data.username || '', email: data.email || '' });
        setIsLoaded(true);
      }
    };
    fetchProfile();
    return () => { isMounted = false; };
  }, [getProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProfile(formData);
    if (result.success) {
      setNotif({ show: true, message: 'Identity updated successfully', type: 'success' });
    } else {
      setNotif({ show: true, message: result.message || 'Update failed', type: 'error' });
    }
  };

  // Loader Animasi Tetap Dipertahankan
  if (loading && !isLoaded) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <Loader2 className="animate-spin text-zinc-300" size={32} />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <div className="mb-8 lg:mb-10">
        <h1 className="text-2xl lg:text-3xl font-black italic uppercase tracking-tighter leading-none text-left">Profile Settings</h1>
        <p className="text-[9px] lg:text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2 text-left">Manage your personal identity</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8 bg-white border border-zinc-100 p-6 lg:p-8 shadow-sm text-left">
        {/* Menggunakan grid agar responsif: 1 kolom di mobile, 2 kolom di desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-8 text-left">
          
          {/* Kolom Username */}
          <div className="w-full">
            <label className="flex items-center gap-2 text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">
              <User size={12}/> Username
            </label>
            <input 
              type="text" 
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full bg-zinc-50 border border-zinc-200 p-3 lg:p-4 text-xs font-bold outline-none focus:border-black focus:bg-white transition-all uppercase"
              placeholder="YOUR USERNAME"
            />
          </div>

          {/* Kolom Email Address */}
          <div className="w-full">
            <label className="flex items-center gap-2 text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">
              <Mail size={12}/> Email Address
            </label>
            <input 
              type="email" 
              value={formData.email}
              className="w-full bg-zinc-100 border border-zinc-200 p-3 lg:p-4 text-xs font-bold text-zinc-400 outline-none cursor-not-allowed"
              placeholder="your@email.com"
              disabled
            />
          </div>

        </div>

        {/* Button Update tetap di bawah grid */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full lg:w-fit lg:px-10 bg-black text-white py-4 font-black uppercase tracking-widest text-[10px] hover:bg-zinc-800 transition shadow-xl active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" size={14}/> : 'Update Identity'}
        </button>
      </form>

      <div className="mt-10 lg:mt-12 border-t border-zinc-100 pt-8">
        <Link to="/customer/address" className="flex items-center justify-between bg-zinc-50 border border-zinc-200 p-4 lg:p-6 group hover:border-black transition-all">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="bg-white p-3 border border-zinc-200 shrink-0 text-left">
              <MapPin size={20} className="text-zinc-400 group-hover:text-black transition-colors"/>
            </div>
            <div className="text-left">
              <h3 className="text-xs lg:text-sm font-black uppercase tracking-tight">Address Book</h3>
              <p className="text-[9px] lg:text-[10px] text-zinc-400 uppercase font-bold tracking-widest">Manage Shipping Destinations</p>
            </div>
          </div>
          <div className="bg-white border border-zinc-200 p-2 lg:p-3 group-hover:bg-black group-hover:text-white transition-all">
            <ArrowRight size={16} />
          </div>
        </Link>
      </div>

      <Notification show={notif.show} {...notif} onClose={() => setNotif({...notif, show: false})} />
    </div>
  );
}