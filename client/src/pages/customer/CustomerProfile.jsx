import React, { useState, useEffect } from 'react';
import { useUser } from '../../hooks/useUser';
import Notification from '../../components/commons/Notification';

export default function CustomerProfile() {
  const { getProfile, updateProfile } = useUser();
  const [formData, setFormData] = useState({ username: '', email: '' });
  const [notif, setNotif] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    getProfile().then(data => {
      setFormData({ username: data.username, email: data.email });
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProfile(formData);
    if (result.success) {
      setNotif({ show: true, message: 'Identity updated successfully', type: 'success' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-8">Profile Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Username</label>
          <input 
            type="text" 
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            className="w-full bg-zinc-50 border border-zinc-100 p-4 text-xs font-bold outline-none focus:border-black uppercase"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Email Address</label>
          <input 
            type="email" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full bg-zinc-50 border border-zinc-100 p-4 text-xs font-bold outline-none focus:border-black"
          />
        </div>
        <button type="submit" className="w-full bg-black text-white py-4 font-black uppercase tracking-widest text-[10px] hover:bg-zinc-800 transition">
          Update Profile
        </button>
      </form>
      <Notification show={notif.show} {...notif} onClose={() => setNotif({...notif, show: false})} />
    </div>
  );
}