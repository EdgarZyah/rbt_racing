import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, ArrowRight, MailCheck } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false); // State baru untuk alur tampilan
  
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await register(formData.username, formData.email, formData.password);
    
    if (result.success) {
      setIsRegistered(true); // Ubah tampilan ke instruksi cek email
    } else {
      setError(result.message);
      setIsSubmitting(false);
    }
  };

  // Tampilan Instruksi Cek Email setelah sukses Register
  if (isRegistered) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center animate-in fade-in zoom-in duration-700">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center border border-zinc-100">
              <MailCheck size={32} className="text-black" />
            </div>
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-4">Check Your Inbox</h1>
          <p className="text-[11px] font-medium leading-relaxed text-zinc-500 uppercase tracking-widest mb-10">
            We have sent a verification link to <span className="text-black font-bold">{formData.email}</span>. <br /> 
            Please click the link to activate your RBT_RACING account.
          </p>
          <Link to="/login" className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-black transition-colors">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black italic tracking-tighter uppercase mb-2">Join RBT</h1>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.4em]">Engineered for the Elite</p>
        </div>

        {error && (
          <div className="bg-black text-white text-[10px] font-bold uppercase tracking-widest p-4 mb-8 text-center italic">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black transition-colors" size={16} />
              <input 
                type="text" 
                required
                placeholder="FULL NAME" 
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full bg-zinc-50 border border-zinc-100 py-4 pl-12 pr-4 text-[10px] font-bold tracking-widest uppercase focus:bg-white focus:border-black outline-none transition-all duration-300"
              />
            </div>

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black transition-colors" size={16} />
              <input 
                type="email" 
                required
                placeholder="EMAIL ADDRESS" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-zinc-50 border border-zinc-100 py-4 pl-12 pr-4 text-[10px] font-bold tracking-widest uppercase focus:bg-white focus:border-black outline-none transition-all duration-300"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black transition-colors" size={16} />
              <input 
                type="password" 
                required
                placeholder="PASSWORD" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-zinc-50 border border-zinc-100 py-4 pl-12 pr-4 text-[10px] font-bold tracking-widest uppercase focus:bg-white focus:border-black outline-none transition-all duration-300"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-black text-white py-5 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center space-x-3 hover:bg-zinc-800 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <span>{isSubmitting ? 'CREATING...' : 'ESTABLISH ACCOUNT'}</span>
            {!isSubmitting && <ArrowRight size={14} />}
          </button>
        </form>

        <div className="mt-12 text-center">
          <Link to="/login" className="text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
}