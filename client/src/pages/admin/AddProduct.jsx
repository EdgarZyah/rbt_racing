import { useNavigate } from 'react-router-dom';
import { useProduct } from '../../hooks/useProduct';
import ProductForm from '../../components/admin/ProductForm';
import { ChevronLeft } from 'lucide-react';
import Notification from '../../components/commons/Notification';
import { useState } from 'react';

export default function AddProduct() {
  const { createProduct, loading } = useProduct();
  const navigate = useNavigate();
  const [notif, setNotif] = useState({ show: false, message: '', type: 'success' });

  const handleSubmit = async (fd) => {
    const res = await createProduct(fd);
    if (res.success) {
      setNotif({ show: true, message: 'New Asset Successfully Deployed', type: 'success' });
      setTimeout(() => navigate('/admin/products'), 1500);
    } else {
      setNotif({ show: true, message: res.message || 'Deployment Failed', type: 'error' });
    }
  };

  return (
    <div className="p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button onClick={() => navigate(-1)} className="flex items-center text-[10px] font-black uppercase text-zinc-400 hover:text-black mb-8 transition gap-2">
        <ChevronLeft size={14} /> Return to List
      </button>
      <h1 className="text-4xl font-black italic uppercase mb-12">Initialize Hardware</h1>
      <ProductForm onSubmit={handleSubmit} isLoading={loading} />
      <Notification {...notif} onClose={() => setNotif({ ...notif, show: false })} />
    </div>
  );
}