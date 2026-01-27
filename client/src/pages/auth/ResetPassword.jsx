import React from 'react';
import { Lock, ArrowRight } from 'lucide-react';

export default function ResetPassword() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 animate-in fade-in duration-700">
      <div className="max-w-md w-full border border-zinc-100 p-10 bg-white">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-black italic tracking-tighter uppercase">New Password</h1>
          <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mt-2">Set your new elite access key</p>
        </div>
        
        <form className="space-y-5">
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={16} />
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-zinc-50 border border-zinc-200 py-4 pl-12 pr-4 text-xs focus:outline-none focus:border-black transition-all" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={16} />
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-zinc-50 border border-zinc-200 py-4 pl-12 pr-4 text-xs focus:outline-none focus:border-black transition-all" 
              />
            </div>
          </div>

          <button className="w-full bg-black text-white py-5 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center group hover:bg-zinc-800 transition mt-4">
            <span>Update Password</span>
            <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
}