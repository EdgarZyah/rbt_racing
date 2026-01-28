// client/src/components/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export default function ProductCard({ product }) {
  const [ref, isVisible] = useScrollReveal();
  const [imgError, setImgError] = useState(false);

  return (
    <Link 
      to={`/product/${product.slug}`}
      ref={ref} 
      className={`group block relative transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="aspect-square w-full overflow-hidden bg-zinc-50 flex items-center justify-center border border-zinc-100 relative">
        {!imgError ? (
          <img
            src={`http://localhost:3000${product.imageUrl}`}
            alt={product.name}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover object-center group-hover:scale-110 transition duration-700 ease-in-out"
          />
        ) : (
          <div className="flex items-center justify-center text-center p-4">
            <span className="text-[10px] font-black uppercase tracking-tighter text-zinc-300 italic">
              ERROR LOADING IMAGE
            </span>
          </div>
        )}
        
        {/* Overlay Hover Effect */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
           <div className="w-full bg-white text-black py-3 text-[10px] font-black uppercase tracking-widest shadow-xl text-center italic">
             View Equipment
           </div>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-start px-1">
        <div>
          <h3 className="text-[11px] font-black text-black uppercase tracking-tight italic group-hover:underline underline-offset-4">
            {product.name}
          </h3>
          <p className="mt-1 text-[9px] text-zinc-400 italic font-bold uppercase tracking-widest">
            {product.category || 'Racing Series'}
          </p>
        </div>
        <p className="text-[11px] font-black tracking-tighter italic">
          Rp {product.price?.toLocaleString('id-ID')}
        </p>
      </div>
    </Link>
  );
}