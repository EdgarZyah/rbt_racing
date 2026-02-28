import { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ShoppingBag,
  Loader2,
  AlertCircle,
  Plus,
  Minus,
  LogIn,
  Star,
  ImageIcon,
  X,
  ChevronRight,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useProduct } from "../hooks/useProduct";
import { useAuth } from "../context/AuthContext";
import Notification from "../components/commons/Notification";
import ConfirmModal from "../components/commons/ConfirmModal";
import axiosInstance, { APP_BASE_URL } from "../api/axios";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const { product, loading, getProductBySlug } = useProduct();
  const { user } = useAuth();

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [activeImage, setActiveImage] = useState(null);
  const [showNotif, setShowNotif] = useState(false);
  const [errorSelect, setErrorSelect] = useState("");

  // State untuk ulasan & pagination
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 4;

  // State untuk Image Zoom
  const [zoomedImage, setZoomedImage] = useState(null);

  const [authModal, setAuthModal] = useState({ show: false, type: "" });

  useEffect(() => {
    getProductBySlug(id);
  }, [id, getProductBySlug]);

  useEffect(() => {
    if (product?.imageUrl) setActiveImage(`${APP_BASE_URL}${product.imageUrl}`);

    if (product?.id) {
      const fetchReviews = async () => {
        try {
          const response = await axiosInstance.get(
            `/reviews/product/${product.id}`,
          );
          setReviews(response.data || []);
        } catch (error) {
          console.error("Gagal mengambil ulasan produk:", error);
        }
      };
      fetchReviews();
    }
  }, [product]);

  // Logic Pagination
  const totalPages = Math.ceil((reviews?.length || 0) / reviewsPerPage);
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const handleVariantSelect = (v) => {
    setSelectedVariant(v);
    setErrorSelect("");
    if (v.imageUrl) setActiveImage(`${APP_BASE_URL}${v.imageUrl}`);
  };

  const currentStock = useMemo(() => {
    if (!product) return 0;
    return selectedVariant ? selectedVariant.stock : product.stock;
  }, [selectedVariant, product]);

  const qtyInCart = useMemo(() => {
    if (!cartItems || !product) return 0;
    const existingItem = cartItems.find((item) => {
      const sameProduct = item.id === product.id;
      const sameVariant = selectedVariant
        ? item.rawVariantId === selectedVariant.id
        : !item.rawVariantId;
      return sameProduct && sameVariant;
    });
    return existingItem ? existingItem.quantity : 0;
  }, [cartItems, product, selectedVariant]);

  const remainingStock = currentStock - qtyInCart;
  const isMaxReached = remainingStock <= 0;

  const handleQuantityChange = (type) => {
    if (type === "plus") {
      if (quantity < remainingStock) setQuantity((prev) => prev + 1);
    } else {
      if (quantity > 1) setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!user) return setAuthModal({ show: true, type: "LOGIN" });
    if (user.role === "ADMIN")
      return setAuthModal({ show: true, type: "ADMIN_RESTRICT" });
    if (product?.variants?.length > 0 && !selectedVariant)
      return setErrorSelect("Please select an option to proceed.");
    if (currentStock <= 0 || quantity > remainingStock) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: activeImage,
      category: product.Category?.name,
      selectedVariants: selectedVariant
        ? { [selectedVariant.category]: selectedVariant.value }
        : {},
      rawVariantId: selectedVariant?.id,
      quantity: quantity,
      stock: currentStock,
      note: note,
    });
    setNote("");
    setShowNotif(true);
  };

  if (loading || !product)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-zinc-300" />
      </div>
    );

  const groupedVariants = product.variants
    ? product.variants.reduce((acc, curr) => {
        if (!acc[curr.category]) acc[curr.category] = [];
        acc[curr.category].push(curr);
        return acc;
      }, {})
    : {};

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <Link
        to="/product"
        className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black mb-12 transition group"
      >
        <ChevronLeft
          size={14}
          className="mr-1 group-hover:-translate-x-1 transition-transform"
        />{" "}
        Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* LEFT COLUMN: IMAGES */}
        <div className="space-y-6 text-left">
          <div
            className="aspect-square bg-zinc-50 border border-zinc-100 overflow-hidden relative group cursor-zoom-in"
            onClick={() => setZoomedImage(activeImage)}
          >
            <img
              src={
                activeImage ||
                (product.imageUrl ? `${APP_BASE_URL}${product.imageUrl}` : "")
              }
              className="w-full h-full object-cover transition-all duration-700 scale-100 group-hover:scale-105"
              alt={product.name}
            />
          </div>
          <div className="grid grid-cols-5 gap-4">
            {product.imageUrl && (
              <div
                onClick={() =>
                  setActiveImage(`${APP_BASE_URL}${product.imageUrl}`)
                }
                className={`aspect-square border cursor-pointer transition-all ${activeImage === `${APP_BASE_URL}${product.imageUrl}` ? "border-black" : "border-zinc-100"}`}
              >
                <img
                  src={`${APP_BASE_URL}${product.imageUrl}`}
                  className="w-full h-full object-cover"
                  alt="thumbnail"
                />
              </div>
            )}
            {product.gallery?.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setActiveImage(`${APP_BASE_URL}${img}`)}
                className={`aspect-square border cursor-pointer transition-all ${activeImage === `${APP_BASE_URL}${img}` ? "border-black" : "border-zinc-100"}`}
              >
                <img
                  src={`${APP_BASE_URL}${img}`}
                  className="w-full h-full object-cover"
                  alt="gallery"
                />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: INFO */}
        <div className="flex flex-col justify-center text-left">
          <h1 className="text-5xl lg:text-6xl font-black italic uppercase mb-2 leading-none tracking-tighter">
            {product.name}
          </h1>
          <p className="text-3xl font-black italic tracking-tighter mb-6 text-zinc-900">
            Rp {product.price?.toLocaleString("id-ID")}
          </p>

          <div
            className={`text-[10px] font-black uppercase tracking-widest mb-10 inline-block px-4 py-2 border self-start ${currentStock > 0 ? "border-zinc-200 text-zinc-500 bg-zinc-50" : "border-red-500 text-red-500 bg-red-50"}`}
          >
            {currentStock > 0
              ? `Stock Available: ${currentStock}`
              : "Out of Stock"}
          </div>

          <p className="text-xs font-medium text-zinc-500 mb-10 leading-relaxed max-w-md">
            {product.description}
          </p>

          {/* VARIANT SELECTOR */}
          <div className="space-x-5 flex flex-wrap mb-8 border-b border-zinc-100 pb-12">
            {Object.entries(groupedVariants).map(([category, values]) => (
              <div key={category} className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300">
                  {category}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {values.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => v.stock > 0 && handleVariantSelect(v)}
                      disabled={v.stock <= 0}
                      className={`px-5 py-3 text-[10px] font-bold border transition-all ${selectedVariant?.id === v.id ? "bg-black text-white border-black" : v.stock <= 0 ? "bg-zinc-50 text-zinc-300 border-zinc-100 cursor-not-allowed line-through" : "bg-white text-black border-zinc-100 hover:border-zinc-300"}`}
                    >
                      {v.value}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* QUANTITY & NOTE */}
          <div className="flex items-center mb-8">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300 mr-4">
              Quantity
            </span>
            <div className="flex items-center border border-zinc-200">
              <button
                onClick={() => handleQuantityChange("minus")}
                disabled={quantity <= 1}
                className="p-4 hover:bg-zinc-50 border-r disabled:opacity-50 text-zinc-600"
              >
                <Minus size={14} />
              </button>
              <div className="w-16 text-center text-sm font-black">
                {quantity}
              </div>
              <button
                onClick={() => handleQuantityChange("plus")}
                disabled={isMaxReached}
                className="p-4 hover:bg-zinc-50 border-l disabled:opacity-50 text-zinc-600"
              >
                <Plus size={14} />
              </button>
            </div>
            {isMaxReached && currentStock > 0 && (
              <span className="ml-4 text-[10px] text-red-500 font-bold uppercase tracking-widest animate-pulse">
                Max Limit Reached
              </span>
            )}
          </div>

          <div className="mb-8 border-b border-zinc-100 pb-8 text-left">
            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-300 mb-3">
              Order Note (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Special instructions..."
              className="w-full border border-zinc-200 p-4 text-xs focus:outline-none focus:border-black resize-none bg-zinc-50 focus:bg-white transition"
              rows="2"
            />
          </div>

          {errorSelect && (
            <div className="flex items-center text-red-500 text-xs font-bold mb-4 animate-pulse text-left">
              <AlertCircle size={14} className="mr-2" /> {errorSelect}
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={currentStock <= 0 || isMaxReached}
            className="w-full bg-black text-white py-6 flex items-center justify-center space-x-4 hover:bg-zinc-800 transition shadow-xl disabled:bg-zinc-100 disabled:text-zinc-400 active:scale-95"
          >
            <ShoppingBag size={18} />
            <span className="text-[11px] font-black uppercase tracking-[0.3em]">
              {currentStock <= 0
                ? "Out of Stock"
                : isMaxReached
                  ? "Max Stock in Cart"
                  : "Add to Cart"}
            </span>
          </button>
        </div>
      </div>

      {/* --- REVIEWS SECTION --- */}
      <div className="mt-24 pt-16 border-t border-zinc-100 text-left">
        <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8">
          Customer Reviews{" "}
          <span className="text-zinc-400 text-lg ml-2">
            ({reviews?.length || 0})
          </span>
        </h2>

        {reviews?.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-8">
              {currentReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-zinc-50 p-8 border border-zinc-100 flex flex-col sm:flex-row gap-6 animate-in fade-in duration-500"
                >
                  <div className="flex-grow order-2 sm:order-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-left">
                        <p className="text-xs font-black uppercase tracking-widest">
                          {review.User?.username || "Guest"}
                        </p>
                        <p className="text-[10px] text-zinc-400 font-bold mt-1 uppercase">
                          {new Date(review.createdAt).toLocaleDateString(
                            "id-ID",
                            { year: "numeric", month: "long", day: "numeric" },
                          )}
                        </p>
                      </div>
                      <div className="flex text-black">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            fill={i < review.rating ? "black" : "none"}
                            className={
                              i < review.rating ? "text-black" : "text-zinc-300"
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-zinc-600 italic leading-relaxed mb-4 text-left">
                      {review.comment
                        ? `"${review.comment}"`
                        : "No comment provided."}
                    </p>
                  </div>

                  {review.imageUrl && (
                    <div
                      className="w-full sm:w-32 h-32 flex-shrink-0 order-1 sm:order-2 cursor-zoom-in group"
                      onClick={() =>
                        setZoomedImage(`${APP_BASE_URL}${review.imageUrl}`)
                      }
                    >
                      <div className="w-full h-full relative overflow-hidden border border-zinc-200 bg-white">
                        <img
                          src={`${APP_BASE_URL}${review.imageUrl}`}
                          alt="Review attachment"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ImageIcon size={20} className="text-white" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-zinc-200 disabled:opacity-30 hover:bg-black hover:text-white transition"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 border border-zinc-200 disabled:opacity-30 hover:bg-black hover:text-white transition"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 bg-zinc-50 border border-dashed border-zinc-200">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              No reviews yet for this product.
            </p>
          </div>
        )}
      </div>

      {/* --- IMAGE ZOOM OVERLAY --- */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300"
          onClick={() => setZoomedImage(null)}
        >
          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setZoomedImage(null);
            }}
            className="absolute top-6 right-6 text-white hover:text-zinc-300 transition-all duration-300 bg-black/40 p-3 rounded-full hover:rotate-90"
          >
            <X size={28} />
          </button>

          {/* Image Container */}
          <div
            className="max-w-5xl max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={zoomedImage}
              alt="Zoomed"
              className="max-w-full max-h-[90vh] object-contain shadow-2xl animate-in zoom-in-95 duration-300"
            />
          </div>
        </div>
      )}
      {/* MODAL AUTH */}
      <ConfirmModal
        isOpen={authModal.show}
        onClose={() => setAuthModal({ show: false, type: "" })}
        onConfirm={() => {
          if (authModal.type === "LOGIN") navigate("/login");
          setAuthModal({ show: false, type: "" });
        }}
        title={
          authModal.type === "LOGIN"
            ? "Authentication Required"
            : "Access Restricted"
        }
        message={
          <div className="flex flex-col items-center py-4 text-zinc-600 text-sm font-medium">
            {authModal.type === "LOGIN" ? (
              <>
                <LogIn size={40} className="text-zinc-400 mb-4" />
                <p>Please login to use cart.</p>
              </>
            ) : (
              <p>Admin accounts cannot perform shopping actions.</p>
            )}
          </div>
        }
        confirmText={authModal.type === "LOGIN" ? "Go to Login" : "Understand"}
        cancelText="Close"
        showConfirm={authModal.type === "LOGIN"}
      />

      <Notification
        show={showNotif}
        type="success"
        message={`${product.name} added to cart.`}
        onClose={() => setShowNotif(false)}
      />
    </div>
  );
}
