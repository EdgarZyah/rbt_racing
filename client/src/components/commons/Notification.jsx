// client/src/components/commons/Notification.jsx
import { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Notification({ show, type = 'success', message, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const isSuccess = type === 'success';

  return (
    <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-[110] animate-in slide-in-from-bottom-10 duration-500">
      <div className={`flex items-center space-x-4 p-5 pr-12 shadow-2xl border ${
        isSuccess ? 'bg-black text-white border-black' : 'bg-white text-black border-zinc-100'
      }`}>
        <div className={isSuccess ? 'text-zinc-400' : 'text-black'}>
          {isSuccess ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
        </div>
        
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            {isSuccess ? 'Success' : 'System Error'}
          </span>
          <span className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 ${
            isSuccess ? 'text-zinc-400' : 'text-zinc-500'
          }`}>
            {message}
          </span>
        </div>

        <button onClick={onClose} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}