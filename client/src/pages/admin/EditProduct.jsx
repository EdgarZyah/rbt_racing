import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../../hooks/useProduct';
import ProductForm from '../../components/admin/ProductForm';
import { ChevronLeft, Loader2 } from 'lucide-react';
import Notification from '../../components/commons/Notification';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, getProductById, updateProduct, loading } = useProduct();
  const [notif, setNotif] = useState({ show: false, message: '', type: 'success' });

  // Load data saat id berubah
  useEffect(() => { 
    if (id) getProductById(id); 
  }, [id, getProductById]);

  const handleSubmit = async (fd) => {
    const res = await updateProduct(id, fd);
    if (res.success) {
      setNotif({ show: true, message: 'Specifications Updated Successfully', type: 'success' });
      setTimeout(() => navigate('/admin/products'), 1500);
    } else {
      setNotif({ show: true, message: res.message || 'Update Failed', type: 'error' });
    }
  };

  if (!product && loading) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-zinc-300" size={32} />
    </div>
  );

  return (
    <div className="p-10">
      <button onClick={() => navigate(-1)} className="flex items-center text-[10px] font-black uppercase text-zinc-400 hover:text-black mb-8 transition gap-2">
        <ChevronLeft size={14} /> Return to List
      </button>
      <h1 className="text-4xl font-black italic uppercase mb-12">Edit Product</h1>
      
      {product ? (
        <ProductForm initialData={product} onSubmit={handleSubmit} isLoading={loading} />
      ) : (
        <p className="text-red-500 font-bold">Product not found.</p>
      )}
      
      <Notification {...notif} onClose={() => setNotif({ ...notif, show: false })} />
    </div>
  );
}