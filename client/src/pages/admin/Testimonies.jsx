import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Power, Loader2, Star } from "lucide-react";
import axiosInstance from "../../api/axios";
import Notification from "../../components/commons/Notification";

export default function Testimonies() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [notification, setNotification] = useState(null);
  
  const [formData, setFormData] = useState({
    customerName: "",
    role: "",
    content: "",
    rating: 5,
    isActive: true,
  });

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/testimonials/admin");
      setTestimonials(response.data);
    } catch (error) {
      showNotification("Gagal mengambil data testimoni", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openModal = (testimonial = null) => {
    if (testimonial) {
      setEditingId(testimonial.id);
      setFormData({
        customerName: testimonial.customerName,
        role: testimonial.role || "",
        content: testimonial.content,
        rating: testimonial.rating,
        isActive: testimonial.isActive,
      });
    } else {
      setEditingId(null);
      setFormData({
        customerName: "",
        role: "",
        content: "",
        rating: 5,
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axiosInstance.put(`/testimonials/${editingId}`, formData);
        showNotification("Testimoni berhasil diperbarui");
      } else {
        await axiosInstance.post("/testimonials", formData);
        showNotification("Testimoni berhasil ditambahkan");
      }
      closeModal();
      fetchTestimonials();
    } catch (error) {
      showNotification(error.response?.data?.message || "Terjadi kesalahan", "error");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus testimoni ini?")) {
      try {
        await axiosInstance.delete(`/testimonials/${id}`);
        showNotification("Testimoni berhasil dihapus");
        fetchTestimonials();
      } catch (error) {
        showNotification("Gagal menghapus testimoni", "error");
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await axiosInstance.patch(`/testimonials/${id}/status`);
      showNotification("Status testimoni berhasil diubah");
      fetchTestimonials();
    } catch (error) {
      showNotification("Gagal mengubah status", "error");
    }
  };

  return (
    <div className="p-6">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black italic tracking-tighter uppercase">Testimonies</h1>
          <p className="text-sm text-zinc-500">Kelola ulasan yang tampil di Homepage</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 flex items-center gap-2"
        >
          <Plus size={16} />
          Tambah Testimoni
        </button>
      </div>

      <div className="bg-white border border-zinc-200 overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center text-zinc-400">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : testimonials.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-xs uppercase tracking-wider text-zinc-500 font-bold">
                  <th className="p-4">Customer</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Review</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {testimonials.map((item) => (
                  <tr key={item.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                    <td className="p-4">
                      <p className="font-bold text-black">{item.customerName}</p>
                      <p className="text-xs text-zinc-500">{item.role}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex text-black">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < item.rating ? "currentColor" : "none"} className={i < item.rating ? "text-black" : "text-zinc-300"} />
                        ))}
                      </div>
                    </td>
                    <td className="p-4 max-w-xs truncate" title={item.content}>
                      "{item.content}"
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'}`}>
                        {item.isActive ? 'Aktif' : 'Hidden'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center items-center gap-3">
                        <button onClick={() => handleToggleStatus(item.id)} className="text-zinc-400 hover:text-black transition" title="Toggle Status">
                          <Power size={18} className={item.isActive ? "text-green-600" : ""} />
                        </button>
                        <button onClick={() => openModal(item)} className="text-zinc-400 hover:text-blue-600 transition" title="Edit">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="text-zinc-400 hover:text-red-600 transition" title="Hapus">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center text-zinc-500 text-sm font-bold uppercase tracking-widest">
            Belum ada testimoni.
          </div>
        )}
      </div>

      {/* MODAL FORM */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
              <h3 className="text-lg font-black italic uppercase tracking-tighter">
                {editingId ? "Edit Testimoni" : "Tambah Testimoni"}
              </h3>
              <button onClick={closeModal} className="text-zinc-400 hover:text-black">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Nama Customer</label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-zinc-300 focus:outline-none focus:border-black"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Role/Profesi</label>
                  <input
                    type="text"
                    name="role"
                    placeholder="Contoh: Sportbike User"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-zinc-300 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Rating</label>
                  <select
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-zinc-300 focus:outline-none focus:border-black"
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num} Bintang</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Review</label>
                <textarea
                  name="content"
                  rows="4"
                  required
                  value={formData.content}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-zinc-300 focus:outline-none focus:border-black resize-none"
                ></textarea>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-4 h-4 accent-black"
                />
                <label htmlFor="isActive" className="text-xs font-bold uppercase tracking-widest cursor-pointer select-none">
                  Tampilkan di Homepage
                </label>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-zinc-100 mt-6">
                <button type="button" onClick={closeModal} className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-black">
                  Batal
                </button>
                <button type="submit" className="bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-zinc-800">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}