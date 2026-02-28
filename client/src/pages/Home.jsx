import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Loader2 } from "lucide-react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useProduct } from "../hooks/useProduct";
import axiosInstance, { APP_BASE_URL } from "../api/axios";

// Komponen Wrapper untuk animasi scroll
const RevealSection = ({ children, animationClass }) => {
  const [ref, isVisible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${
        isVisible
          ? `opacity-100 animate-in fill-mode-both ${animationClass}`
          : "opacity-0"
      }`}
    >
      {children}
    </div>
  );
};

export default function Home() {
  const { products, getProducts, loading } = useProduct();
  const [testimonials, setTestimonials] = useState([]);
  const [loadingTestimonies, setLoadingTestimonies] = useState(true);

  // Fetch data produk dan testimoni saat component dimount
  useEffect(() => {
    getProducts();
    
    // Fetch Testimoni
    const fetchTestimonials = async () => {
      try {
        const response = await axiosInstance.get("/testimonials");
        setTestimonials(response.data);
      } catch (error) {
        console.error("Gagal mengambil data testimoni:", error);
      } finally {
        setLoadingTestimonies(false);
      }
    };

    fetchTestimonials();
  }, [getProducts]);

  // Ambil 4 produk yang ditandai sebagai 'featured'
  const featuredProducts = useMemo(
    () => products.filter((p) => p.featured).slice(0, 4),
    [products]
  );

  // LOGIKA BARU: Cek apakah butuh di-scroll (misal jika testimoni >= 4)
  const MIN_ITEMS_FOR_SCROLL = 4; 
  const isScrollable = testimonials.length >= MIN_ITEMS_FOR_SCROLL;
  
  // Jika butuh scroll, gandakan array agar animasinya smooth. Jika tidak, tampilkan apa adanya.
  const displayTestimonials = isScrollable 
    ? [...testimonials, ...testimonials, ...testimonials] 
    : testimonials;

  return (
    <div className="overflow-hidden bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden border-b border-zinc-100 animate-in fade-in zoom-in-95 duration-1000">
        <div className="text-center z-10 px-6 max-w-5xl">
          <span className="text-[10px] uppercase tracking-[0.6em] text-zinc-400 mb-8 block font-black animate-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
            Performance Excellence
          </span>
          <h1 className="text-7xl md:text-[10rem] font-black mb-10 tracking-tighter italic leading-[0.8] animate-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-both">
            UNLEASH <br /> THE BEAST.
          </h1>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700 fill-mode-both">
            <Link
              to="/product"
              className="bg-black text-white px-14 py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all duration-300 flex items-center group"
            >
              Collections
              <ArrowRight
                size={14}
                className="ml-3 group-hover:translate-x-2 transition-transform"
              />
            </Link>
            <Link
              to="/about"
              className="border border-zinc-200 text-black px-14 py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-zinc-50 transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
          <span className="text-[10rem] sm:text-[20rem] md:text-[30rem] lg:text-[40rem] font-black italic">RBT</span>
        </div>
      </section>

      {/* 2. FEATURED SECTION */}
      <section className="py-32 bg-zinc-50 border-y border-zinc-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-3xl font-black italic tracking-tighter uppercase">
                Featured
              </h2>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">
                Most wanted by the community
              </p>
            </div>
            <Link
              to="/product"
              className="text-[10px] font-black uppercase tracking-widest border-b-2 border-black pb-1"
            >
              View All
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20 text-zinc-300">
              <Loader2 className="animate-spin" size={32} />
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="group bg-white border border-zinc-200 p-6 transition-all hover:shadow-2xl"
                >
                  <div className="aspect-square bg-zinc-100 mb-6 overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={`${APP_BASE_URL}${product.imageUrl}`}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-200 group-hover:scale-110 transition-transform duration-700"></div>
                    )}
                  </div>
                  <h4 className="text-[11px] font-black uppercase tracking-tight italic line-clamp-1">
                    {product.name}
                  </h4>
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-xs font-black italic">
                      Rp {product.price?.toLocaleString("id-ID")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-zinc-300 text-xs font-black uppercase tracking-widest">
              No featured items deployed
            </div>
          )}
        </div>
      </section>      

      {/* 3. TESTIMONIALS CAROUSEL */}
      <RevealSection animationClass="fade-in duration-1000">
        <section className="py-32 overflow-hidden bg-white border-b border-zinc-100">
          <div className="mb-16 text-center px-6">
            <h3 className="text-3xl font-black italic tracking-tighter uppercase">
              Our testimonials
            </h3>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">
              Hear it from our satisfied customers
            </p>
           </div>

          {loadingTestimonies ? (
             <div className="flex justify-center py-10 text-zinc-300">
               <Loader2 className="animate-spin" size={32} />
             </div>
          ) : testimonials.length > 0 ? (
            <div className="relative w-full overflow-hidden">
              {/* Jika isScrollable true, pakaikan class animasi. Jika false, jadikan flex biasa dan tengahkan */}
              <div 
                className={`flex ${isScrollable ? "animate-infinite-scroll w-max" : "justify-center flex-wrap gap-y-6 w-full"}`}
              >
                {displayTestimonials.map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="w-[350px] md:w-[450px] mx-6 flex-shrink-0 bg-zinc-50 p-10 border border-zinc-100"
                  >
                    <div className="flex text-black mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill={i < item.rating ? "currentColor" : "none"} className={i < item.rating ? "text-black" : "text-zinc-300"} />
                      ))}
                    </div>
                    <p className="text-lg font-light italic leading-snug tracking-tight mb-8">
                      "{item.content}"
                    </p>
                    <div className="border-t border-zinc-200 pt-6">
                      <p className="text-xs font-black uppercase tracking-widest italic">
                        {item.customerName}
                      </p>
                      <p className="text-[9px] text-zinc-400 uppercase tracking-widest mt-1">
                        {item.role || "Customer"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
             <div className="text-center py-10 text-zinc-300 text-xs font-black uppercase tracking-widest">
                Belum ada testimoni.
             </div>
          )}
        </section>
      </RevealSection>
    </div>
  );
}