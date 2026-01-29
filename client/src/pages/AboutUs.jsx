// client/src/pages/AboutUs.jsx
import React, { useState } from 'react';
import { Send, Mail, Phone, Loader2 } from 'lucide-react';
import thumbnail from '../assets/thumbnail-3.png';

export default function AboutUs() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    // Constructing Mailto Link
    const subject = encodeURIComponent(`RBT Inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    
    // Redirect to default mail client
    window.location.href = `mailto:mailesholemgt@gmail.com?subject=${subject}&body=${body}`;
    
    setTimeout(() => setIsSubmitting(false), 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      {/* Profile Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
        <div className="text-left">
          <h1 className="text-6xl font-black italic tracking-tighter uppercase mb-8 leading-none">
            ENGINEERED <br /> FOR THE ELITE.
          </h1>
          <p className="text-zinc-500 text-sm leading-relaxed mb-6 italic">
            RBT_RACING was born from the asphalt. We understand that every decibel of sound and every gram of weight is critical to your machine's performance.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12">
            <div className="border-l-2 border-black pl-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-black">Originality</h3>
              <p className="text-[10px] text-zinc-400 mt-1 uppercase font-bold tracking-tight">100% Genuine RBT Racing Parts.</p>
            </div>
            <div className="border-l-2 border-black pl-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-black">Innovation</h3>
              <p className="text-[10px] text-zinc-400 mt-1 uppercase font-bold tracking-tight">Next-gen material technology.</p>
            </div>
          </div>
        </div>

        <div className="aspect-video bg-zinc-900 flex items-center justify-center relative overflow-hidden shadow-2xl">
           <img src={thumbnail} alt="RBT Thumbnail" className='w-full h-full object-cover' />
           <div className="absolute inset-0 border-[20px] border-white/5 pointer-events-none"></div>
        </div>
      </div>

      {/* Contact Section */}
      <section className="bg-zinc-50 border border-zinc-100 p-8 md:p-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-1 text-left">
            <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-6">Contact Us</h2>
            <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-10 leading-loose">
              Have questions about compatibility or wholesale? Our team is ready to assist.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4 group cursor-pointer">
                <div className="p-3 bg-white border border-zinc-200 group-hover:border-black transition-colors">
                  <Mail size={16} className="text-zinc-400 group-hover:text-black" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">info@RBTRacing.site</span>
              </div>
              
              <div className="flex items-center space-x-4 group cursor-pointer">
                <div className="p-3 bg-white border border-zinc-200 group-hover:border-black transition-colors">
                   <Phone size={16} className="text-zinc-400 group-hover:text-black" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">+62 812 3456 789</span>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2">
            <form onSubmit={handleContactSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Your Identity</label>
                <input 
                  name="name"
                  type="text" 
                  required
                  placeholder="FULL NAME"
                  className="w-full bg-white border border-zinc-200 p-4 text-[10px] font-bold tracking-widest uppercase focus:outline-none focus:border-black transition shadow-sm" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Email Address</label>
                <input 
                  name="email"
                  type="email" 
                  required
                  placeholder="EMAIL@DOMAIN.COM"
                  className="w-full bg-white border border-zinc-200 p-4 text-[10px] font-bold tracking-widest uppercase focus:outline-none focus:border-black transition shadow-sm" 
                />
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Transmission Message</label>
                <textarea 
                  name="message"
                  rows="4" 
                  required
                  placeholder="WHAT IS ON YOUR MIND?"
                  className="w-full bg-white border border-zinc-200 p-4 text-[10px] font-bold tracking-widest uppercase focus:outline-none focus:border-black transition resize-none shadow-sm leading-relaxed"
                ></textarea>
              </div>
              
              <button 
                type="submit"
                disabled={isSubmitting}
                className="md:col-span-2 bg-black text-white py-5 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center group hover:bg-zinc-800 transition shadow-xl active:scale-[0.98] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <>
                    <span>Transmit Message</span>
                    <Send size={14} className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}