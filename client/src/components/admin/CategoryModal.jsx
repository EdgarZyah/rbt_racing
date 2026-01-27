// client/src/components/admin/CategoryModal.jsx
import { X, Save, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CategoryModal({ isOpen, onClose, onSubmit, initialData, loading }) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
    } else {
      setName('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(name);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute right-6 top-6 text-zinc-300 hover:text-black transition-colors">
          <X size={20} />
        </button>

        <div className="mb-8">
          <h3 className="text-3xl font-black italic tracking-tighter uppercase mb-2">
            {initialData ? 'Edit Category' : 'New Classification'}
          </h3>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            {initialData ? 'Modify existing equipment tier' : 'Establish a new racing tier'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-300">Category Identity</label>
            <input 
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="E.G. PERFORMANCE SPORT"
              className="w-full bg-zinc-50 border border-zinc-100 py-5 px-6 text-[11px] font-bold tracking-widest uppercase focus:bg-white focus:border-black outline-none transition-all duration-300"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-5 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center space-x-3 hover:bg-zinc-800 transition-all disabled:opacity-50"
          >
            {initialData ? <Save size={14} /> : <Plus size={14} />}
            <span>{loading ? 'PROCESSING...' : initialData ? 'UPDATE CATEGORY' : 'ESTABLISH CATEGORY'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}