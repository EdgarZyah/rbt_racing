// client/src/pages/admin/Category.jsx
import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Loader2 } from 'lucide-react';
import { useCategory } from '../../hooks/useCategory';
import CategoryModal from '../../components/admin/CategoryModal';
import ConfirmModal from '../../components/commons/ConfirmModal';
import Notification from '../../components/commons/Notification';
import Table from '../../components/commons/Table';

export default function Category() {
  const { categories, loading, getCategories, addCategory, updateCategory, deleteCategory } = useCategory();
  
  // State Management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null); // null = Add, object = Edit
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null });
  const [notif, setNotif] = useState({ show: false, type: 'success', message: '' });

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const handleOpenAdd = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setSelectedCategory(cat);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (name) => {
    let result;
    if (selectedCategory) {
      result = await updateCategory(selectedCategory.id, name);
    } else {
      result = await addCategory(name);
    }

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
      <td className="px-6 py-4 flex space-x-4">
        <button onClick={() => handleOpenEdit(cat)} className="text-zinc-400 hover:text-black transition-colors">
          <Edit size={16} />
        </button>
        <button onClick={() => setConfirmDelete({ isOpen: true, id: cat.id })} className="text-zinc-400 hover:text-red-500 transition-colors">
          <Trash2 size={16} />
        </button>
      </td>
    </tr>
  );

  return (
    <div className="p-10 animate-in fade-in duration-700">
      <div className="flex justify-between items-end mb-16">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase">Categories</h1>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em] mt-2">Manage your categories</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-black text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest flex items-center space-x-3 hover:bg-zinc-800 transition-all shadow-xl"
        >
          <Plus size={14} />
          <span>New Category</span>
        </button>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center"><Loader2 className="animate-spin text-zinc-200" size={32} /></div>
      ) : (
        <div className="bg-white border border-zinc-100 shadow-sm">
          <Table headers={headers} data={categories} renderRow={renderRow} />
        </div>
      )}

      {/* FORM MODAL (ADD/EDIT) */}
      <CategoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedCategory}
        loading={loading}
      />

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal 
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, id: null })}
        onConfirm={async () => {
          await deleteCategory(confirmDelete.id);
          setConfirmDelete({ isOpen: false, id: null });
          setNotif({ show: true, type: 'success', message: 'Category Deleted' });
        }}
        title="Destroy Category"
        message="This will dissolve the connection between this category and all linked products."
      />

      <Notification 
        show={notif.show}
        type={notif.type}
        message={notif.message}
        onClose={() => setNotif({ ...notif, show: false })}
      />
    </div>
  );
}