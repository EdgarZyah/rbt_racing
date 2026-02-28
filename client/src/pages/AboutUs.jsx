// client/src/pages/AboutUs.jsx
import React, { useState } from "react";
import { Send, Mail, Phone, Loader2 } from "lucide-react";
import thumbnail3 from "../assets/thumbnail-3.png";
import thumbnail4 from "../assets/thumbnail-4.png";

export default function AboutUs() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    const subject = encodeURIComponent(`RBT Inquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    );

    window.location.href = `mailto:mailesholemgt@gmail.com?subject=${subject}&body=${body}`;

    setTimeout(() => setIsSubmitting(false), 1000);
  };

  return (
    <div className="mx-auto">
      
      {/* ================= SECTION 1 ================= */}
      <section className="bg-black text-white px-6 lg:px-20 py-24 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        
        <div className="text-left">
          <h1 className="text-5xl lg:text-7xl font-black italic uppercase tracking-tighter leading-none mb-8">
            BUILT FOR <br /> THOSE WHO DEMAND MORE.
          </h1>

          <p className="text-zinc-400 text-sm leading-relaxed max-w-lg">
            RBT_RACING was born from performance obsession. 
            We design components for riders who refuse compromise
            where every gram reduced and every resonance tuned 
            translates into real-world advantage.
          </p>
        </div>

        <div className="aspect-video bg-zinc-900 relative overflow-hidden shadow-2xl">
          <img
            src={thumbnail4}
            alt="RBT Racing"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 border-[20px] border-white/5 pointer-events-none"></div>
        </div>
      </section>

      {/* ================= SECTION 2 ================= */}
      <section className="px-6 lg:px-20 py-24  grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        
        <div className="aspect-video bg-zinc-100 relative overflow-hidden shadow-xl order-2 lg:order-1">
          <img
            src={thumbnail3}
            alt="RBT Engineering"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="text-left order-1 lg:order-2">
          <h2 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter leading-none mb-8">
            Performance
          </h2>

          <p className="text-zinc-600 text-sm leading-relaxed mb-6">
            We do not design parts to look aggressive. 
            We design them to function aggressively.
          </p>

          <p className="text-zinc-600 text-sm leading-relaxed">
            From material selection to acoustic mapping and weight distribution, 
            each RBT product undergoes calculated refinement. 
            The result is mechanical harmony 
            less restriction, cleaner response, sharper output.
          </p>
        </div>
      </section>
    </div>
  );
}