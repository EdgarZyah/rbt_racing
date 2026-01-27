// client/src/components/layouts/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-black text-white pt-20 pb-10 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-black italic tracking-tighter mb-6">RBT_RACING.</h2>
          <p className="text-zinc-500 text-sm max-w-sm leading-relaxed">
            Dedikasi kami adalah menciptakan performa mesin maksimal melalui sistem pembuangan berkualitas tinggi. Dibuat dengan presisi, diuji di lintasan balap.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-6">Support</h4>
          <ul className="text-zinc-400 text-sm space-y-4">
            <li><a href="#" className="hover:text-white transition">Order Status</a></li>
            <li><a href="#" className="hover:text-white transition">Shipping & Delivery</a></li>
            <li><a href="#" className="hover:text-white transition">Warranty</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-6">Follow Us</h4>
          <div className="flex space-x-6 text-zinc-400">
             {/* Icon Sosial Media */}
             <a href="#" className="hover:text-white uppercase text-[10px] tracking-widest font-bold">Instagram</a>
             <a href="#" className="hover:text-white uppercase text-[10px] tracking-widest font-bold">Youtube</a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-zinc-900 text-[10px] text-zinc-600 uppercase tracking-widest text-center">
        © 2026 RBT Racing Engineering. All Rights Reserved.
      </div>
    </footer>
  );
}