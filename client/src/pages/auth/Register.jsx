// client/src/pages/auth/Register.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false); // TAMBAHKAN STATE INI

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await register(formData.username, formData.email, formData.password);
      
      if (result.success) {
        setIsRegistered(true); 
      } else {
        setError(result.message);
        setIsSubmitting(false); // Kembalikan state jika gagal
      }
    } catch (err) {
      setError("Connection failed");
      setIsSubmitting(false);
    }
  };

  // Tampilan Sukses (Opsional jika ingin langsung pindah halaman)
  if (isRegistered) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-black uppercase italic mb-4">Registration Sent</h1>
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-8">
          Please check your email <span className="text-black">{formData.email}</span> to verify your account.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black italic tracking-tighter uppercase mb-2">Join RBT</h1>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.4em]">Engineered for the Elite</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest p-4 mb-8 text-center border border-red-100">
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
            {isSubmitting ? (
              <><Loader2 className="animate-spin" size={14}/> <span>SYNCING...</span></>
            ) : (
              <><span>CREATE ACCOUNT</span> <ArrowRight size={14} /></>
            )}
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