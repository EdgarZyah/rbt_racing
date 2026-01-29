import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Zap,
  ShieldCheck,
  Trophy,
  Star,
  Loader2,
  Volume2,
} from "lucide-react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useProduct } from "../hooks/useProduct";
import { APP_BASE_URL } from "../api/axios";
import Aluminium from "../assets/thumbnail-1.png";
import Carbon from "../assets/thumbnail-2.png";

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

  // Fetch data produk saat component dimount
  useEffect(() => {
    getProducts();
  }, [getProducts]);

  // Ambil 4 produk yang ditandai sebagai 'featured'
  const featuredProducts = useMemo(
    () => products.filter((p) => p.featured).slice(0, 4),
    [products],
  );

  // Data Testimoni
  const testimonials = [
    {
      text: "Sound RBT Carbon Pro bener-bener gahar dan dapet boost tenaga signifikan!",
      author: "Alex 'Shadow' Rider",
      role: "Sportbike User",
    },
    {
      text: "Finish quality-nya juara. Gak kalah sama brand knalpot Eropa!",
      author: "Budi 'Piston'",
      role: "Racing Enthusiast",
    },
    {
      text: "Pemasangan PNP di Matic saya, tarikan jadi lebih enteng di putaran atas.",
      author: "Sultan Matic",
      role: "Daily Rider",
    },
    {
      text: "Desain carbon-nya asli, bikin motor kelihatan lebih premium.",
      author: "Rider X",
      role: "Custom Builder",
    },
  ];

  // Duplikasi data untuk loop carousel yang smooth
  const doubledTestimonials = [...testimonials, ...testimonials];

  return (
    <div className="overflow-hidden bg-white">
      {/* 1. HERO SECTION - Langsung Muncul */}
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

      {/* 2. CORE VALUES - Slide from Left */}
      <RevealSection animationClass="fade-in slide-in-from-left-20">
        <section className="py-24 border-b border-zinc-100 bg-zinc-50/50">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              {
                icon: Zap,
                title: "Max Power",
                desc: "Optimized exhaust flow for peak gains.",
              },
              {
                icon: ShieldCheck,
                title: "Premium Material",
                desc: "Aluminium & Carbon Fiber.",
              },
              {
                icon: Volume2,
                title: "Signature Sound",
                desc: "Deep, aggressive racing tone.",
              },
              {
                icon: Trophy,
                title: "Track Proven",
                desc: "Tested under extreme conditions.",
              },
            ].map((feature, i) => (
              <div key={i} className="text-center space-y-4">
                <div className="flex justify-center">
                  <feature.icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-[11px] font-black uppercase tracking-widest">
                  {feature.title}
                </h3>
                <p className="text-[11px] text-zinc-400 uppercase leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* 3. ARSENAL - Slide from Right */}
      <RevealSection animationClass="fade-in slide-in-from-right-20">
        <section className="py-32 max-w-7xl mx-auto px-6">
          <div className="mb-20 text-center">
            <h2 className="text-4xl font-black italic tracking-tighter uppercase">
              The Arsenal
            </h2>
            <div className="w-20 h-1 bg-black mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <Link
              to="/product?category=Aluminium"
              className="group relative h-[600px] overflow-hidden bg-zinc-100 border border-zinc-200"
            >
              <div className="absolute inset-0 bg-zinc-200 group-hover:scale-105 transition-transform duration-1000">
                <img src={Aluminium} className="p-8 w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-colors duration-500"></div>
              <div className="absolute bottom-12 left-12 text-white">
                <h3 className="text-4xl font-black italic uppercase tracking-tighter">
                  Stainless Steel Series
                </h3>
              </div>
            </Link>
            <Link
              to="/product?category=Carbon"
              className="group relative h-[600px] overflow-hidden bg-zinc-900 border border-zinc-800"
            >
              <div className="absolute inset-0 bg-zinc-800 group-hover:scale-105 transition-transform duration-1000">
                <img src={Carbon} className="p-8 w-full h-full object-cover" />
              </div>

              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/60 transition-colors duration-500"></div>
              <div className="absolute bottom-12 left-12 text-white">
                <h3 className="text-4xl font-black italic uppercase tracking-tighter">
                  Carbon Series
                </h3>
              </div>
            </Link>
          </div>
        </section>
      </RevealSection>

      {/* 4. FEATURED SECTION */}
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
                    {/* Tampilkan gambar produk asli jika ada */}
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

      {/* 5. TESTIMONIALS CAROUSEL - Smooth Infinite Scroll */}
      <RevealSection animationClass="fade-in duration-1000">
        <section className="py-32 overflow-hidden bg-white border-b border-zinc-100">
          <div className="mb-16 text-center px-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-4">
              The Rider Voices
            </h2>
            <h3 className="text-3xl font-black italic tracking-tighter uppercase">
              Trusted by the Community
            </h3>
          </div>

          <div className="relative flex">
            {/* Animasi berjalan di sini */}
            <div className="animate-infinite-scroll">
              {doubledTestimonials.map((item, index) => (
                <div
                  key={index}
                  className="w-[350px] md:w-[450px] mx-6 flex-shrink-0 bg-zinc-50 p-10 border border-zinc-100"
                >
                  <div className="flex text-black mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-lg font-light italic leading-snug tracking-tight mb-8">
                    "{item.text}"
                  </p>
                  <div className="border-t border-zinc-200 pt-6">
                    <p className="text-xs font-black uppercase tracking-widest italic">
                      {item.author}
                    </p>
                    <p className="text-[9px] text-zinc-400 uppercase tracking-widest mt-1">
                      {item.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>
    </div>
  );
}
