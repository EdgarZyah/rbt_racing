// client/src/pages/admin/ProductList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Loader2, Package, Star, Layers, Box, AlertTriangle, ChevronRight } from 'lucide-react';
import { useProduct } from '../../hooks/useProduct';
import Table from '../../components/commons/Table';
import ConfirmModal from '../../components/commons/ConfirmModal';
import Notification from '../../components/commons/Notification';
import { APP_BASE_URL } from '../../api/axios';

const IMG_BASE_URL = APP_BASE_URL;

export default function ProductList() {
  const { products, loading, error, getProducts, deleteProduct } = useProduct();
  const [modal, setModal] = useState({ isOpen: false, id: null });
  const [notif, setNotif] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => { getProducts(); }, [getProducts]);

  const handleConfirmDelete = async () => {
    const res = await deleteProduct(modal.id);
    if (res.success) setNotif({ show: true, message: 'Asset Removed', type: 'success' });
    else setNotif({ show: true, message: 'Delete Failed', type: 'error' });
    setModal({ isOpen: false, id: null });
  };

  const headers = ["Asset", "Category", "Price", "Stock", "State", "Actions"];

  const renderRow = (product) => (
    <tr key={product.id} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition group">
      <td className="px-6 py-5">
        <div className="flex items-center space-x-4 text-left">
          <div className="w-12 h-12 bg-zinc-100 border border-zinc-200 overflow-hidden shrink-0 rounded-sm">
             {product.imageUrl ? <img src={`${IMG_BASE_URL}${product.imageUrl}`} className="w-full h-full object-cover" /> : <Box size={16} className="m-auto text-zinc-300"/>}
          </div>
          <div className="min-w-0">
            <p className="font-black text-[11px] uppercase italic leading-none truncate">{product.name}</p>
            <p className="text-[8px] font-bold text-zinc-400 uppercase mt-1 tracking-tight">{product.variants?.length || 0} Variants Configured</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-5 text-left"><span className="bg-zinc-100 text-zinc-500 px-2 py-1 text-[9px] font-black uppercase tracking-widest">{product.Category?.name || 'GENERIC'}</span></td>
      <td className="px-6 py-5 text-[11px] font-black italic text-left text-zinc-900">Rp {product.price?.toLocaleString('id-ID')}</td>
      <td className="px-6 py-5">
        <div className="flex flex-col w-20">
           <span className={`text-[9px] font-black mb-1 ${product.stock < 10 ? 'text-red-600' : 'text-zinc-500'}`}>{product.stock} Units</span>
           <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
             <div className={`h-full ${product.stock < 10 ? 'bg-red-500' : 'bg-black'}`} style={{ width: `${Math.min((product.stock/50)*100, 100)}%` }} />
           </div>
        </div>
      </td>
      <td className="px-6 py-5">{product.featured ? <Star size={14} fill="black" /> : <Star size={14} className="text-zinc-200" />}</td>
      <td className="px-6 py-5 text-left">
        <div className="flex space-x-4">
          <Link to={`/admin/product/edit/${product.id}`} className="text-zinc-300 hover:text-black transition"><Edit size={16}/></Link>
          <button onClick={() => setModal({ isOpen: true, id: product.id })} className="text-zinc-300 hover:text-red-600 transition"><Trash2 size={16}/></button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-6 border-b border-zinc-100 pb-8">
        <div className="text-left">
          <h1 className="text-3xl md:text-4xl font-black italic uppercase leading-none tracking-tighter">Product List</h1>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em] mt-2">Manage Your Product List</p>
        </div>
        <Link to="/admin/product/add" className="w-full sm:w-auto bg-black text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-3 shadow-xl hover:bg-zinc-800 transition active:scale-95">
          <Plus size={14} /> <span>Add New Product</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center text-zinc-300 gap-3">
          <Loader2 className="animate-spin" size={32} />
          <span className="text-[9px] font-black uppercase tracking-widest">Scanning Database...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop Table */}
          <div className="hidden lg:block bg-white border border-zinc-100 overflow-x-auto">
            <Table headers={headers} data={products} renderRow={renderRow} />
          </div>

          {/* Mobile Asset Cards */}
          <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map(product => (
              <div key={product.id} className="bg-white border border-zinc-100 p-4 shadow-sm flex flex-col gap-4 text-left">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-zinc-50 border border-zinc-100 shrink-0 overflow-hidden">
                    <img src={`${IMG_BASE_URL}${product.imageUrl}`} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                       <span className="text-[8px] font-black uppercase bg-zinc-100 px-2 py-0.5">{product.Category?.name || 'GENERIC'}</span>
                       {product.featured && <Star size={12} fill="black" />}
                    </div>
                    <h3 className="font-black text-xs uppercase italic mt-1 truncate">{product.name}</h3>
                    <p className="text-sm font-black italic tracking-tighter mt-1 text-black">Rp {product.price?.toLocaleString('id-ID')}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-bold text-zinc-400 uppercase">Stock Level</span>
                    <span className={`text-[10px] font-black ${product.stock < 10 ? 'text-red-600' : 'text-black'}`}>{product.stock} Units</span>
                  </div>
                  <div className="flex gap-3">
                    <Link to={`/admin/product/edit/${product.id}`} className="p-2 border border-zinc-100 hover:bg-black hover:text-white transition"><Edit size={14}/></Link>
                    <button onClick={() => setModal({ isOpen: true, id: product.id })} className="p-2 border border-zinc-100 hover:bg-red-600 hover:text-white transition"><Trash2 size={14}/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!loading && products.length === 0 && (
            <div className="py-24 text-center border-2 border-dashed border-zinc-100">
               <Package size={48} className="mx-auto text-zinc-100 mb-4" />
               <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">No assets found in global cache.</p>
            </div>
          )}
        </div>
      )}
      
      <ConfirmModal isOpen={modal.isOpen} onClose={() => setModal({ isOpen: false, id: null })} onConfirm={handleConfirmDelete} title="TERMINATE ASSET" message="Are you sure? This will permanently delete the asset from the manifest." />
      <Notification {...notif} onClose={() => setNotif({ ...notif, show: false })} />
    </div>
  );
}