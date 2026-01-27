// client/src/pages/AboutUs.jsx
import React from 'react';
import { Send, Mail, MapPin, Phone } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 animate-in fade-in duration-700">
      {/* Profil Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
        <div>
          <h1 className="text-6xl font-black italic tracking-tighter uppercase mb-8 leading-none">
            ENGINEERED <br /> FOR THE ELITE.
          </h1>
          <p className="text-zinc-500 text-sm leading-relaxed mb-6 italic">
            RBT_RACING lahir dari lintasan balap. Kami memahami bahwa setiap desibel suara dan setiap gram bobot sangat berarti bagi performa motor Anda.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12">
            <div className="border-l-2 border-black pl-6">
              <h3 className="text-xs font-black uppercase tracking-widest">Originality</h3>
              <p className="text-[10px] text-zinc-400 mt-1 uppercase">100% Genuine RBT Racing Parts.</p>
            </div>
            <div className="border-l-2 border-black pl-6">
              <h3 className="text-xs font-black uppercase tracking-widest">Innovation</h3>
              <p className="text-[10px] text-zinc-400 mt-1 uppercase">Next-gen material technology.</p>
            </div>
          </div>
        </div>
        <div className="aspect-video bg-zinc-900 flex items-center justify-center relative overflow-hidden shadow-2xl">
           <span className="text-white font-black italic text-9xl opacity-10">RBT</span>
           <div className="absolute inset-0 border-[20px] border-white/5"></div>
        </div>
      </div>

      {/* Contact Section */}
      <section className="bg-zinc-50 border border-zinc-100 p-8 md:p-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-1">
            <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-6">Contact Us</h2>
            <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-10 leading-loose">
              Have questions about compatibility or wholesale? Our team is ready to assist.
            </p>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Mail size={16} className="text-zinc-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">contact@rbtracing.co</span>
              </div>
              <div className="flex items-center space-x-4">
                <Phone size={16} className="text-zinc-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">+62 812 3456 789</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Your Name</label>
                <input type="text" className="w-full bg-white border border-zinc-200 p-4 text-xs focus:outline-none focus:border-black transition" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Email Address</label>
                <input type="email" className="w-full bg-white border border-zinc-200 p-4 text-xs focus:outline-none focus:border-black transition" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Message</label>
                <textarea rows="4" className="w-full bg-white border border-zinc-200 p-4 text-xs focus:outline-none focus:border-black transition resize-none"></textarea>
              </div>
              <button className="md:col-span-2 bg-black text-white py-5 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center group hover:bg-zinc-800 transition">
                <span>Send Message</span>
                <Send size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}