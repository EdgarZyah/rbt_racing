// client/src/pages/admin/ProductList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Loader2, Package, Star, Layers, Box, AlertTriangle } from 'lucide-react';
import { useProduct } from '../../hooks/useProduct';
import Table from '../../components/commons/Table';
import ConfirmModal from '../../components/commons/ConfirmModal';
import Notification from '../../components/commons/Notification';

// Pastikan ini sesuai port backend Anda
const IMG_BASE_URL = "http://localhost:3000"; 

export default function ProductList() {
  const { products, loading, error, getProducts, deleteProduct } = useProduct();
  const [modal, setModal] = useState({ isOpen: false, id: null });
  const [notif, setNotif] = useState({ show: false, message: '', type: 'success' });

  // Panggil fetch saat komponen di-mount
  useEffect(() => { 
    getProducts(); 
  }, [getProducts]);

  const handleConfirmDelete = async () => {
    const res = await deleteProduct(modal.id);
    if (res.success) {
      setNotif({ show: true, message: 'Asset Removed from Database', type: 'success' });
    } else {
      setNotif({ show: true, message: 'Failed to delete asset', type: 'error' });
    }
    setModal({ isOpen: false, id: null });
  };

  const headers = ["Product Name", "Category", "Price", "Stock Level", "Status", "Actions"];

  // Render baris tabel dengan "Safe Access" agar tidak crash jika data null
  const renderRow = (product) => (
    <tr key={product.id} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors group">
      
      {/* 1. Product Name & Image */}
      <td className="px-6 py-5">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-zinc-100 border border-zinc-100 relative transition-all overflow-hidden shrink-0 rounded-sm">
             {product.imageUrl ? (
               <img 
                 src={`${IMG_BASE_URL}${product.imageUrl}`} 
                 alt={product.name}
                 className="w-full h-full object-cover"
                 onError={(e) => { e.target.src = "https://placehold.co/100?text=No+Img"; }} // Fallback jika gambar rusak
               />
             ) : (
               <div className="w-full h-full flex items-center justify-center text-zinc-300"><Box size={16}/></div>
             )}
          </div>
          <div>
            <p className="font-black text-[11px] uppercase italic leading-none text-zinc-900">{product.name || "Unnamed Product"}</p>
            <div className="flex items-center gap-1 mt-1.5">
               <Layers size={10} className="text-zinc-300" />
               <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wide">
                 {product.variants ? product.variants.length : 0} Variants
               </span>
            </div>
          </div>
        </div>
      </td>

      {/* 2. Category (PENTING: Gunakan ?.name) */}
      <td className="px-6 py-5">
        <span className="bg-zinc-100 text-zinc-500 px-2 py-1 text-[9px] font-black uppercase tracking-wider rounded-sm">
          {product.Category?.name || 'Uncategorized'}
        </span>
      </td>

      {/* 3. Price */}
      <td className="px-6 py-5 text-[11px] font-black italic">
        Rp {product.price ? product.price.toLocaleString('id-ID') : '0'}
      </td>

      {/* 4. Stock */}
      <td className="px-6 py-5">
        <div className="flex flex-col w-24">
           <div className="flex justify-between items-center mb-1">
             <span className={`text-[9px] font-black ${product.stock < 10 ? 'text-red-600' : 'text-zinc-900'}`}>
               {product.stock || 0} Units
             </span>
           </div>
           {/* Visual Bar */}
           <div className="w-full h-1 bg-zinc-100 overflow-hidden rounded-full">
             <div 
               className={`h-full transition-all duration-500 ${product.stock < 10 ? 'bg-red-500' : 'bg-black'}`} 
               style={{ width: `${Math.min(((product.stock || 0) / 50) * 100, 100)}%` }} 
             />
           </div>
        </div>
      </td>

      {/* 5. Status */}
      <td className="px-6 py-5">
         {product.featured ? <Star size={14} fill="black" className="text-black" /> : <Star size={14} className="text-zinc-200" />}
      </td>

      {/* 6. Actions */}
      <td className="px-6 py-5">
        <div className="flex space-x-4">
          <Link to={`/admin/product/edit/${product.id}`} className="text-zinc-300 hover:text-black transition-colors"><Edit size={16}/></Link>
          <button onClick={() => setModal({ isOpen: true, id: product.id })} className="text-zinc-300 hover:text-red-600 transition-colors"><Trash2 size={16}/></button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end mb-12 border-b border-zinc-100 pb-8">
        <div>
          <h1 className="text-4xl font-black italic uppercase leading-none mb-2">Products Management</h1>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em]">Manage Your Products</p>
        </div>
        <Link to="/admin/product/add" className="bg-black text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest flex items-center space-x-2 shadow-lg hover:bg-zinc-800 hover:scale-105 transition-all duration-300">
          <Plus size={14} /> <span>Add New Product</span>
        </Link>
      </div>

      {/* Tampilkan Error Jika Ada */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-100 p-4 flex items-center gap-3 text-red-600">
          <AlertTriangle size={16} />
          <span className="text-xs font-bold uppercase">{error}</span>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center text-zinc-300 space-y-4">
          <Loader2 className="animate-spin" size={32} />
          <span className="text-[10px] font-black uppercase tracking-widest">Fetching Data...</span>
        </div>
      ) : (
        <div className="bg-white border border-zinc-100 shadow-sm">
           <Table headers={headers} data={products} renderRow={renderRow} loading={loading} />
           
           {/* Empty State */}
           {!loading && products.length === 0 && !error && (
             <div className="py-20 text-center">
                <Package size={48} className="mx-auto text-zinc-200 mb-4" />
                <p className="text-xs font-bold text-zinc-400 uppercase">No Assets Deployed</p>
             </div>
           )}
        </div>
      )}
      
      <ConfirmModal 
        isOpen={modal.isOpen} 
        onClose={() => setModal({ isOpen: false, id: null })} 
        onConfirm={handleConfirmDelete} 
        title="DELETE ASSET"
        message="Are you sure? This action will permanently remove the item from the global armory."
      />
      <Notification {...notif} onClose={() => setNotif({ ...notif, show: false })} />
    </div>
  );
}