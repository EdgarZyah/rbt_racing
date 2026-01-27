import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ShoppingBag, Loader2, AlertCircle, Plus, Minus } from "lucide-react"; // Import Plus & Minus
import { useCart } from "../context/CartContext";
import { useProduct } from "../hooks/useProduct";
import Notification from "../components/commons/Notification";
import { APP_BASE_URL } from "../api/axios";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { product, loading, getProductBySlug } = useProduct();
  
  const [selectedVariant, setSelectedVariant] = useState(null);
  
  // STATE BARU: Quantity
  const [quantity, setQuantity] = useState(1);

  const [activeImage, setActiveImage] = useState(null);
  const [showNotif, setShowNotif] = useState(false);
  const [errorSelect, setErrorSelect] = useState(""); 

  useEffect(() => { getProductBySlug(id); }, [id, getProductBySlug]);

  useEffect(() => {
    if (product?.imageUrl) setActiveImage(`${APP_BASE_URL}${product.imageUrl}`);
  }, [product]);

  // Reset quantity ke 1 setiap kali varian berubah
  useEffect(() => {
    setQuantity(1);
  }, [selectedVariant]);

  const groupedVariants = useMemo(() => {
    if (!product?.variants) return {};
    return product.variants.reduce((acc, curr) => {
      if (!acc[curr.category]) acc[curr.category] = [];
      acc[curr.category].push(curr);
      return acc;
    }, {});
  }, [product]);

  const currentStock = useMemo(() => {
    if (!product) return 0;
    if (selectedVariant) return selectedVariant.stock;
    return product.stock;
  }, [selectedVariant, product]);

  const handleVariantSelect = (v) => {
    setSelectedVariant(v); 
    setErrorSelect(""); 
    if (v.imageUrl) setActiveImage(`${APP_BASE_URL}${v.imageUrl}`);
  };

  // HANDLER QUANTITY
  const handleQuantityChange = (type) => {
    if (type === 'plus') {
      if (quantity < currentStock) setQuantity(prev => prev + 1);
    } else {
      if (quantity > 1) setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      setErrorSelect("Please select an option to proceed.");
      return;
    }

    const variantData = selectedVariant 
      ? { [selectedVariant.category]: selectedVariant.value } 
      : {};

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: activeImage,
      category: product.Category?.name,
      selectedVariants: variantData, 
      rawVariantId: selectedVariant?.id,
      quantity: quantity // KIRIM JUMLAH KE CART
    });

    setShowNotif(true);
  };

  if (loading || !product) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-zinc-300" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in duration-700">
      <Link to="/product" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black mb-12 transition group">
        <ChevronLeft size={14} className="mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Armory
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        
        {/* --- IMAGE SECTION --- */}
        <div className="space-y-6">
          <div className="aspect-square bg-zinc-50 border border-zinc-100 overflow-hidden relative group">
            <img 
              src={activeImage || (product.imageUrl ? `${APP_BASE_URL}${product.imageUrl}` : "")} 
              className="w-full h-full object-cover transition-all duration-700 scale-100 group-hover:scale-105" 
              alt={product.name}
            />
          </div>
          <div className="grid grid-cols-5 gap-4">
             {product.imageUrl && (
               <div onClick={() => setActiveImage(`${APP_BASE_URL}${product.imageUrl}`)} className={`aspect-square border cursor-pointer transition-all ${activeImage === `${APP_BASE_URL}${product.imageUrl}` ? 'border-black' : 'border-zinc-100'}`}>
                 <img src={`${APP_BASE_URL}${product.imageUrl}`} className="w-full h-full object-cover" />
               </div>
             )}
             {product.gallery?.map((img, idx) => (
                <div key={idx} onClick={() => setActiveImage(`${APP_BASE_URL}${img}`)} className={`aspect-square border cursor-pointer transition-all ${activeImage === `${APP_BASE_URL}${img}` ? 'border-black' : 'border-zinc-100'}`}>
                  <img src={`${APP_BASE_URL}${img}`} className="w-full h-full object-cover" />
                </div>
             ))}
          </div>
        </div>

        {/* --- INFO SECTION --- */}
        <div className="flex flex-col justify-center">
          <h1 className="text-5xl lg:text-6xl font-black italic uppercase mb-2 leading-none tracking-tighter">{product.name}</h1>
          <p className="text-3xl font-black italic tracking-tighter mb-6 text-zinc-900">Rp {product.price?.toLocaleString("id-ID")}</p>
          
          <div className={`text-[10px] font-black uppercase tracking-widest mb-10 inline-block px-4 py-2 border self-start ${currentStock > 0 ? 'border-zinc-200 text-zinc-500 bg-zinc-50' : 'border-red-500 text-red-500 bg-red-50'}`}>
            {currentStock > 0 ? `Stock Available: ${currentStock} Units` : 'Out of Stock'}
          </div>

          <p className="text-xs font-medium text-zinc-500 mb-10 leading-relaxed max-w-md">{product.description}</p>

          {/* VARIANT SELECTOR */}
          <div className="space-x-5 flex flex-wrap mb-8 border-b border-zinc-100 pb-12">
            {Object.entries(groupedVariants).map(([category, values]) => (
              <div key={category} className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300">{category}</h4>
                <div className="flex flex-wrap gap-2">
                  {values.map(v => {
                    const isSelected = selectedVariant?.id === v.id;
                    return (
                      <button 
                        key={v.id} 
                        onClick={() => handleVariantSelect(v)} 
                        className={`px-5 py-3 text-[10px] font-bold border transition-all ${isSelected ? "bg-black text-white border-black" : "bg-white text-black border-zinc-100 hover:border-zinc-300"}`}
                      >
                        {v.value}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* QUANTITY SELECTOR */}
          <div className="flex items-center mb-8">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300 mr-4">Quantity</span>
            <div className="flex items-center border border-zinc-200">
              <button 
                onClick={() => handleQuantityChange('minus')} 
                disabled={quantity <= 1}
                className="p-4 hover:bg-zinc-50 transition border-r border-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-600"
              >
                <Minus size={14}/>
              </button>
              
              <div className="w-16 text-center text-sm font-black">
                {quantity}
              </div>
              
              <button 
                onClick={() => handleQuantityChange('plus')} 
                disabled={quantity >= currentStock}
                className="p-4 hover:bg-zinc-50 transition border-l border-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-600"
              >
                <Plus size={14}/>
              </button>
            </div>
          </div>

          {errorSelect && (
            <div className="flex items-center text-red-500 text-xs font-bold mb-4 animate-pulse">
              <AlertCircle size={14} className="mr-2" /> {errorSelect}
            </div>
          )}

          <button 
            onClick={handleAddToCart} 
            disabled={currentStock <= 0} 
            className="w-full bg-black text-white py-6 flex items-center justify-center space-x-4 hover:bg-zinc-800 transition shadow-xl hover:translate-y-1 disabled:bg-zinc-200 disabled:text-zinc-400 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
          >
            <ShoppingBag size={18} />
            <span className="text-[11px] font-black uppercase tracking-[0.3em]">Acquire Asset</span>
          </button>
        </div>
      </div>
      <Notification show={showNotif} type="success" message={`${product.name} (x${quantity}) added to cart.`} onClose={() => setShowNotif(false)} />
    </div>
  );
}