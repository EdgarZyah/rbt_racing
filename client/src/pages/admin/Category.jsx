// client/src/pages/admin/Category.jsx
import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Loader2, Tag } from 'lucide-react';
import { useCategory } from '../../hooks/useCategory';
import CategoryModal from '../../components/admin/CategoryModal';
import ConfirmModal from '../../components/commons/ConfirmModal';
import Notification from '../../components/commons/Notification';
import Table from '../../components/commons/Table';

export default function Category() {
  const { categories, loading, getCategories, addCategory, updateCategory, deleteCategory } = useCategory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null });
  const [notif, setNotif] = useState({ show: false, type: 'success', message: '' });

  useEffect(() => { getCategories(); }, [getCategories]);

  const handleFormSubmit = async (name) => {
    const result = selectedCategory ? await updateCategory(selectedCategory.id, name) : await addCategory(name);
    if (result.success) {
      setNotif({ show: true, type: 'success', message: selectedCategory ? 'Data Updated' : 'New Category Established' });
      setIsModalOpen(false);
    } else {
      setNotif({ show: true, type: 'error', message: result.message });
    }
  };

  const headers = ["ID", "Category Name", "Actions"];
  const renderRow = (cat) => (
    <tr key={cat.id} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition">
      <td className="px-6 py-4 text-[10px] font-bold text-zinc-300 tracking-widest">#{cat.id}</td>
      <td className="px-6 py-4 text-xs font-black uppercase italic tracking-tight">{cat.name}</td>
      <td className="px-6 py-4">
        <div className="flex space-x-4">
          <button onClick={() => { setSelectedCategory(cat); setIsModalOpen(true); }} className="text-zinc-400 hover:text-black transition-colors"><Edit size={16} /></button>
          <button onClick={() => setConfirmDelete({ isOpen: true, id: cat.id })} className="text-zinc-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="p-4 md:p-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 md:mb-16 gap-6">
        <div className="text-left">
          <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase leading-none">Categories</h1>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em] mt-2">Manage your Categories</p>
        </div>
        <button 
          onClick={() => { setSelectedCategory(null); setIsModalOpen(true); }}
          className="w-full sm:w-auto bg-black text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-3 hover:bg-zinc-800 transition shadow-xl active:scale-95"
        >
          <Plus size={14} /> <span>New Category</span>
        </button>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center"><Loader2 className="animate-spin text-zinc-200" size={32} /></div>
      ) : (
        <>
          <div className="hidden md:block bg-white border border-zinc-100">
            <Table headers={headers} data={categories} renderRow={renderRow} />
          </div>
          
          {/* Mobile Card List */}
          <div className="md:hidden space-y-3">
            {categories.map(cat => (
              <div key={cat.id} className="bg-white border border-zinc-100 p-4 flex justify-between items-center shadow-sm">
                <div className="text-left">
                  <p className="text-[8px] font-bold text-zinc-300 tracking-widest leading-none mb-1">#{cat.id}</p>
                  <p className="text-[11px] font-black uppercase italic">{cat.name}</p>
                </div>
                <div className="flex gap-4">
                   <button onClick={() => { setSelectedCategory(cat); setIsModalOpen(true); }} className="p-2 text-zinc-400 hover:text-black transition"><Edit size={16}/></button>
                   <button onClick={() => setConfirmDelete({ isOpen: true, id: cat.id })} className="p-2 text-zinc-400 hover:text-red-500 transition"><Trash2 size={16}/></button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <CategoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleFormSubmit} initialData={selectedCategory} loading={loading} />
      <ConfirmModal isOpen={confirmDelete.isOpen} onClose={() => setConfirmDelete({ isOpen: false, id: null })} onConfirm={async () => { await deleteCategory(confirmDelete.id); setConfirmDelete({ isOpen: false, id: null }); setNotif({ show: true, type: 'success', message: 'Category Deleted' }); }} title="Destroy Category" message="This will dissolve the connection between this category and all linked products." />
      <Notification show={notif.show} type={notif.type} message={notif.message} onClose={() => setNotif({ ...notif, show: false })} />
    </div>
  );
}