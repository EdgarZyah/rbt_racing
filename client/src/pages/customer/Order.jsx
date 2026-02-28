import React, { useState, useEffect } from "react";
import Table from "../../components/commons/Table";
import {
  Eye,
  Loader2,
  CreditCard,
  ChevronRight,
  Calendar,
  X,
  Box,
  MessageSquareText,
  Star,
  Upload,
} from "lucide-react";
import { useOrder } from "../../hooks/useOrder";
import { useNavigate } from "react-router-dom";
import axiosInstance, { APP_BASE_URL } from "../../api/axios";

export default function Order() {
  const navigate = useNavigate();
  const { orders, loading, getUserOrders } = useOrder();
  const [filter, setFilter] = useState("ALL");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [reviewModal, setReviewModal] = useState({ isOpen: false });
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    getUserOrders();
  }, [getUserOrders]);

  const filteredOrders = orders.filter(
    (o) => filter === "ALL" || o.status === filter,
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const getStatusStyle = (status) => {
    switch (status) {
      case "PAID":
        return "bg-black text-white border-black";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "SHIPPED":
        return "bg-blue-600 text-white border-blue-700";
      case "COMPLETED":
      case "DELIVERED":
        return "bg-green-600 text-white border-green-700";
      case "CANCELLED":
        return "bg-red-50 text-red-500 border-red-100";
      default:
        return "bg-zinc-100 text-zinc-400 border-transparent";
    }
  };

  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    const normalizedPath = imagePath.replace(/\\/g, "/");
    if (normalizedPath.startsWith("http") || normalizedPath.startsWith("data:"))
      return normalizedPath;
    const base = APP_BASE_URL.replace(/\/$/, "");
    return `${base}/${normalizedPath.replace(/^\//, "")}`;
  };

  // FIX: handleImageChange diperbaiki untuk menangkap file pertama
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setReviewForm((prev) => ({ ...prev, image: null }));
      setImagePreview(null);
      return;
    }

    // Validasi tipe file
    if (!file.type?.startsWith("image/")) {
      alert("Hanya file gambar yang diperbolehkan");
      e.target.value = "";
      return;
    }

    // Validasi ukuran file (2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      alert("Ukuran file maksimal 2MB");
      e.target.value = "";
      return;
    }

    setReviewForm((prev) => ({ ...prev, image: file }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const submitReview = async () => {
    if (!selectedOrder || !selectedOrder.items) return;

    try {
      setIsSubmittingReview(true);
      const productIds = [
        ...new Set(selectedOrder.items.map((item) => item.ProductId)),
      ].filter((id) => id);

      if (productIds.length === 0) {
        alert("Produk tidak ditemukan.");
        return;
      }

      let successCount = 0;
      let lastErrorMessage = "";

      for (const pid of productIds) {
        try {
          const formData = new FormData();
          formData.append("ProductId", String(pid));
          formData.append("OrderId", String(selectedOrder.id));
          formData.append("rating", String(reviewForm.rating));
          formData.append("comment", reviewForm.comment || "");

          if (reviewForm.image) {
            formData.append("image", reviewForm.image);
          }

          await axiosInstance.post("/reviews", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          successCount++;
        } catch (err) {
          lastErrorMessage =
            err.response?.data?.message || "Gagal mengirim ulasan.";
        }
      }

      if (successCount > 0) {
        alert("Terima kasih! Ulasan Anda berhasil disimpan.");
        setReviewModal({ isOpen: false });
        setReviewForm({ rating: 5, comment: "", image: null });
        setImagePreview(null);
        getUserOrders();
      } else {
        alert(lastErrorMessage);
      }
    } catch (error) {
      alert("Terjadi kesalahan teknis saat mengirim ulasan.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const renderRow = (order) => (
    <tr
      key={order.id}
      className="border-b border-zinc-50 hover:bg-zinc-50 transition text-left"
    >
      <td className="px-6 py-5 font-black text-[11px] tracking-tighter text-zinc-600">
        {order.id}
      </td>
      <td className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase">
        {new Date(order.createdAt).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </td>
      <td className="px-6 py-5 text-xs font-black italic tracking-tighter">
        Rp {order.totalAmount.toLocaleString("id-ID")}
      </td>
      <td className="px-6 py-5">
        <span
          className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest border italic ${getStatusStyle(order.status)}`}
        >
          {order.status}
        </span>
      </td>
      <td className="px-6 py-5">
        <div className="flex gap-2">
          {order.status === "PENDING" && (
            <button
              onClick={() =>
                navigate("/payment", { state: { orderId: order.id } })
              }
              className="flex items-center gap-1 text-[9px] font-black bg-black text-white px-3 py-1 hover:bg-zinc-800 transition uppercase tracking-widest active:scale-95"
            >
              <CreditCard size={10} /> PAY
            </button>
          )}
          <button
            onClick={() => handleOpenDetail(order)}
            className="text-zinc-400 hover:text-black transition p-1 active:scale-90"
          >
            <Eye size={16} />
          </button>
        </div>
      </td>
    </tr>
  );

  if (loading)
    return (
      <div className="p-12 flex justify-center">
        <Loader2 className="animate-spin text-zinc-300" size={32} />
      </div>
    );

  return (
    <div className="w-full mx-auto px-4 sm:px-6 py-8 lg:py-12 overflow-x-hidden text-left">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 text-left">
        <h1 className="text-2xl lg:text-3xl font-black italic uppercase tracking-tighter leading-none">
          My Orders
        </h1>
        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar max-w-full">
          {["ALL", "PENDING", "PAID", "SHIPPED", "CANCELLED"].map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setCurrentPage(1);
              }}
              className={`text-[9px] font-black uppercase px-4 py-2 border transition shrink-0 tracking-widest active:scale-95 ${filter === f ? "bg-black text-white border-black shadow-lg" : "bg-white text-zinc-400 border-zinc-100 hover:border-black"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {orders.length > 0 ? (
        <>
          <div className="hidden lg:block overflow-x-auto border border-zinc-100">
            <Table
              headers={["Order ID", "Date", "Total", "Status", "Actions"]}
              data={currentItems}
              renderRow={renderRow}
            />
          </div>
          <div className="lg:hidden space-y-4">
            {currentItems.map((order) => (
              <div
                key={order.id}
                className="border border-zinc-100 p-5 bg-white space-y-4 shadow-sm text-left"
              >
                <div className="flex justify-between items-start text-left">
                  <div className="text-left">
                    <p className="text-[11px] font-black tracking-tighter text-zinc-800 uppercase">
                      {order.id}
                    </p>
                    <div className="flex items-center gap-1 text-zinc-400 mt-1">
                      <Calendar size={10} />
                      <span className="text-[9px] font-bold uppercase">
                        {new Date(order.createdAt).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest border italic ${getStatusStyle(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between items-end border-t border-zinc-50 pt-4 text-left">
                  <div>
                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                      Grand Total
                    </p>
                    <p className="text-sm font-black italic tracking-tighter">
                      Rp {order.totalAmount.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {order.status === "PENDING" && (
                      <button
                        onClick={() =>
                          navigate("/payment", { state: { orderId: order.id } })
                        }
                        className="bg-black text-white px-4 py-2 text-[9px] font-black uppercase flex items-center gap-2"
                      >
                        PAY <ChevronRight size={12} />
                      </button>
                    )}
                    <button
                      onClick={() => handleOpenDetail(order)}
                      className="border border-zinc-200 p-2 text-zinc-400"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-20 border border-dashed border-zinc-100 text-zinc-300 text-[10px] font-black uppercase tracking-[0.3em]">
          No Transaction history found
        </div>
      )}

      {/* DETAIL MODAL */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative bg-white w-full max-w-2xl max-h-[90vh] flex flex-col animate-in zoom-in duration-300 shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-zinc-100 p-6 flex justify-between items-center z-10 shrink-0">
              <div className="text-left">
                <h2 className="text-xl font-black italic uppercase tracking-tighter leading-none">
                  {selectedOrder.id}
                </h2>
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                  Transaction Manifest
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-zinc-100 transition"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-grow overflow-y-auto p-6 space-y-8 no-scrollbar text-left text-zinc-800">
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-50 pb-2 flex items-center gap-2">
                  <Box size={14} /> Purchased Item
                </h3>
                <div className="space-y-4">
                  {selectedOrder.items?.map((item, idx) => {
                    const snapshot = JSON.parse(item.productSnapshot || "{}");
                    const imageUrl = getImageUrl(snapshot.image);
                    return (
                      <div
                        key={idx}
                        className="flex gap-4 items-start py-4 border-b border-zinc-50 last:border-0 min-w-[300px]"
                      >
                        <div className="w-16 h-16 bg-zinc-50 flex-shrink-0 flex items-center justify-center border border-zinc-100 mt-1 overflow-hidden">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Box className="text-zinc-200" size={24} />
                          )}
                        </div>
                        <div className="flex-grow text-left">
                          <p className="text-[11px] font-black uppercase tracking-tight">
                            {snapshot.name}
                          </p>
                          <p className="text-[9px] font-bold text-zinc-400 uppercase italic">
                            {Object.entries(snapshot.variant || {})
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(" | ")}
                          </p>
                          <p className="text-[10px] font-black mt-1">
                            {item.quantity} x{" "}
                            <span className="text-zinc-400 italic font-medium">
                              Rp {item.priceAtPurchase.toLocaleString("id-ID")}
                            </span>
                          </p>
                          {item.note && (
                            <div className="mt-3 bg-zinc-50 p-2 border-l-2 border-zinc-300">
                              <p className="text-[9px] font-bold uppercase text-zinc-400 flex items-center gap-1 mb-1">
                                <MessageSquareText size={10} /> Note
                              </p>
                              <p className="text-[10px] text-zinc-600 italic">
                                "{item.note}"
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 bg-zinc-50 p-6 border border-zinc-100 shadow-inner text-left">
                <div className="flex items-center gap-2 mb-4 border-b border-zinc-200 pb-2">
                  <span className="text-[10px] font-black uppercase text-zinc-400 text-left">
                    Payment Breakdown
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-bold text-zinc-500 uppercase tracking-tight">
                  <span>Subtotal</span>
                  <span>
                    Rp{" "}
                    {(
                      selectedOrder.totalAmount - selectedOrder.shippingCost
                    ).toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-bold text-zinc-500 uppercase tracking-tight">
                  <div className="flex items-center gap-1">
                    <span>Shipping</span>
                    <span className="text-[9px] bg-zinc-200 px-1 text-zinc-600 rounded">
                      {selectedOrder.shippingService}
                    </span>
                  </div>
                  <span>
                    Rp {selectedOrder.shippingCost?.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="h-px bg-zinc-200 my-2 border-dashed border-t"></div>
                <div className="flex justify-between items-end pt-2">
                  <span className="text-xs font-black uppercase">
                    Grand Total
                  </span>
                  <span className="text-2xl font-black italic text-black">
                    Rp {selectedOrder.totalAmount?.toLocaleString("id-ID")}
                  </span>
                </div>

                {["SHIPPED", "DELIVERED", "COMPLETED"].includes(
                  selectedOrder.status,
                ) && (
                  <div className="pt-6 mt-4 border-t border-zinc-200 flex justify-end">
                    <button
                      onClick={() => {
                        setReviewModal({ isOpen: true });
                        setReviewForm({ rating: 5, comment: "", image: null });
                        setImagePreview(null);
                      }}
                      className="px-6 py-3 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition shadow-md flex items-center gap-2 active:scale-95"
                    >
                      <Star size={14} /> Write Order Review
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL REVIEW */}
      {reviewModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() =>
              !isSubmittingReview && setReviewModal({ isOpen: false })
            }
          ></div>
          <div className="relative bg-white w-full max-w-md p-8 shadow-2xl animate-in zoom-in duration-300 text-left">
            <h3 className="text-lg font-black italic uppercase tracking-tighter mb-2">
              Review Your Order
            </h3>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-6 text-left">
              Share your experience with this transaction
            </p>

            <div className="mb-6">
              <label className="block text-[10px] font-black uppercase mb-3 text-zinc-600 text-left">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() =>
                      setReviewForm((prev) => ({ ...prev, rating: star }))
                    }
                    className="focus:outline-none hover:scale-110 transition-transform"
                  >
                    <Star
                      size={28}
                      fill={star <= reviewForm.rating ? "black" : "none"}
                      className={
                        star <= reviewForm.rating
                          ? "text-black"
                          : "text-zinc-300"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-[10px] font-black uppercase mb-3 text-zinc-600 text-left">
                Upload Photo (Optional)
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center justify-center w-20 h-20 bg-zinc-50 border border-dashed border-zinc-300 cursor-pointer hover:bg-zinc-100 overflow-hidden relative">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Upload size={20} className="text-zinc-400" />
                  )}
                </label>
                <div className="text-[9px] text-zinc-400 uppercase tracking-widest leading-relaxed text-left">
                  Max size: 2MB.
                  <br />
                  JPG, PNG, WEBP.
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-[10px] font-black uppercase mb-3 text-zinc-600 text-left">
                Comment
              </label>
              <textarea
                className="w-full border border-zinc-200 p-4 text-xs focus:outline-none focus:border-black resize-none bg-zinc-50 focus:bg-white text-left text-zinc-800"
                rows="4"
                placeholder="Tell us what you loved about ini..."
                value={reviewForm.comment}
                onChange={(e) =>
                  setReviewForm((prev) => ({
                    ...prev,
                    comment: e.target.value,
                  }))
                }
              ></textarea>
            </div>

            <div className="flex justify-end gap-3 border-t border-zinc-100 pt-4">
              <button
                onClick={() => setReviewModal({ isOpen: false })}
                disabled={isSubmittingReview}
                className="px-6 py-3 text-[10px] font-black uppercase text-zinc-500 hover:text-black transition"
              >
                Cancel
              </button>
              <button
                onClick={submitReview}
                disabled={isSubmittingReview}
                className="px-6 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition flex items-center gap-2 active:scale-95 shadow-lg"
              >
                {isSubmittingReview ? (
                  <>
                    <Loader2 size={12} className="animate-spin" /> Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
