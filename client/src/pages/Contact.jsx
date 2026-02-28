// client/src/pages/AboutUs.jsx
import React, { useState } from "react";
import { Send, Mail, Phone, Loader2 } from "lucide-react";
import thumbnail from "../assets/thumbnail-3.png";

export default function AboutUs() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    // Constructing Mailto Link
    const subject = encodeURIComponent(`RBT Inquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    );

    // Redirect to default mail client
    window.location.href = `mailto:rbt-racing@gmail.com?subject=${subject}&body=${body}`;

    setTimeout(() => setIsSubmitting(false), 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-20">
      {/* Contact Section */}
      <section className="bg-zinc-50 border border-zinc-100 p-8 md:p-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleContactSubmit}
              className="grid grid-cols-1 gap-6 text-left"
            >
              <div className="md:col-span-2 space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                  Your Name
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="FULL NAME"
                  className="w-full bg-white border border-zinc-200 p-4 text-[10px] font-bold tracking-widest uppercase focus:outline-none focus:border-black transition shadow-sm"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="EMAIL@DOMAIN.COM"
                  className="w-full bg-white border border-zinc-200 p-4 text-[10px] font-bold tracking-widest uppercase focus:outline-none focus:border-black transition shadow-sm"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                  Message
                </label>
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
                    <span>Send Message</span>
                    <Send
                      size={14}
                      className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                    />
                  </>
                )}
              </button>
            </form>
          </div>
          <div className="lg:col-span-1 text-left">
            <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-6">
              Contact Us
            </h2>
            <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-10 leading-loose">
              Have questions about compatibility or wholesale? Our team is ready
              to assist.
            </p>

            <div className="space-y-6">
              <div className="flex items-center space-x-4 group cursor-pointer">
                <div className="p-3 bg-white border border-zinc-200 group-hover:border-black transition-colors">
                  <Mail
                    size={16}
                    className="text-zinc-400 group-hover:text-black"
                  />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                  info@RBTRacing.site
                </span>
              </div>

              <div className="flex items-center space-x-4 group cursor-pointer">
                <div className="p-3 bg-white border border-zinc-200 group-hover:border-black transition-colors">
                  <Phone
                    size={16}
                    className="text-zinc-400 group-hover:text-black"
                  />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                  +62 812 3456 789
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
