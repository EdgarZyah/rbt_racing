import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';
import Notification from '../../components/commons/Notification';
import { MapPin, ArrowRight, User, Mail, Loader2 } from 'lucide-react';

export default function CustomerProfile() {
  const { getProfile, updateProfile, loading } = useUser();
  const [formData, setFormData] = useState({ username: '', email: '' });
  const [notif, setNotif] = useState({ show: false, message: '', type: 'success' });
  const [isLoaded, setIsLoaded] = useState(false); // State untuk mencegah flickering

  useEffect(() => {
    let isMounted = true; // Flag untuk mencegah update state jika component unmount

    const fetchProfile = async () => {
      const data = await getProfile();
      if (isMounted && data) {
        setFormData({ 
          username: data.username || '', 
          email: data.email || '' 
        });
        setIsLoaded(true);
      }
    };

    fetchProfile();

    return () => { isMounted = false; };
  }, [getProfile]); // Aman karena getProfile sekarang stabil (useCallback)

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProfile(formData);
    
    if (result.success) {
      setNotif({ show: true, message: 'Identity updated successfully', type: 'success' });
    } else {
      setNotif({ show: true, message: result.message || 'Update failed', type: 'error' });
    }
  };

  // Tampilkan loading state awal jika perlu
  if (loading && !isLoaded) {
    return <div className="min-h-screen flex justify-center items-center"><Loader2 className="animate-spin text-zinc-300"/></div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Profile Settings</h1>
      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-10">Manage your personal identity</p>
      
      {/* Form Update Profile */}
      <form onSubmit={handleSubmit} className="space-y-8 bg-white border border-zinc-100 p-8 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">
              <User size={12}/> Username
            </label>
            <input 
              type="text" 
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full bg-zinc-50 border border-zinc-200 p-4 text-xs font-bold outline-none focus:border-black focus:bg-white transition-colors uppercase"
              placeholder="YOUR USERNAME"
            />
          </div>
          
          <div>
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">
              <Mail size={12}/> Email Address
            </label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-zinc-50 border border-zinc-200 p-4 text-xs font-bold outline-none focus:border-black focus:bg-white transition-colors"
              placeholder="your@email.com"
              disabled // Email biasanya tidak boleh diganti sembarangan
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-black text-white py-4 font-black uppercase tracking-widest text-[10px] hover:bg-zinc-800 transition shadow-lg hover:translate-y-0.5 disabled:opacity-70 flex justify-center"
        >
          {loading ? <Loader2 className="animate-spin" size={14}/> : 'Update Identity'}
        </button>
      </form>

      {/* Shortcut ke Address Book */}
      <div className="mt-12 border-t border-zinc-100 pt-8">
        <div className="flex items-center justify-between bg-zinc-50 border border-zinc-200 p-6 group hover:border-black transition-colors cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="bg-white p-3 border border-zinc-200">
              <MapPin size={20} className="text-zinc-400 group-hover:text-black transition-colors"/>
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-tight">Address Book</h3>
              <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">Manage Shipping Destinations</p>
            </div>
          </div>
          <Link to="/customer/address" className="bg-white border border-zinc-200 p-3 hover:bg-black hover:text-white transition-all">
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <Notification show={notif.show} {...notif} onClose={() => setNotif({...notif, show: false})} />
    </div>
  );
}