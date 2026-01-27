// client/src/components/commons/ConfirmModal.jsx
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-sm p-8 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <button onClick={onClose} className="absolute right-4 top-4 text-zinc-300 hover:text-black transition-colors">
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-zinc-50 flex items-center justify-center mb-6">
            <AlertTriangle className="text-black" size={32} />
          </div>
          
          <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-2">
            {title || 'Are you sure?'}
          </h3>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed mb-8">
            {message || 'This action cannot be undone and will affect your database records.'}
          </p>

          <div className="grid grid-cols-2 gap-4 w-full">
            <button 
              onClick={onClose}
              className="py-4 border border-zinc-100 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              className="py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}