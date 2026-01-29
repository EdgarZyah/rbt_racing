// rbt_racing/client/src/pages/auth/ResetPassword.jsx
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, ArrowRight, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const { resetPassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg("Password doesn't match.");
      return;
    }

    setStatus('loading');
    const res = await resetPassword(token, password);
    
    if (res.success) {
      setStatus('success');
      setTimeout(() => navigate('/login'), 3000);
    } else {
      setStatus('error');
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white">
      <div className="max-w-md w-full border border-zinc-100 p-10 bg-white shadow-2xl animate-in fade-in zoom-in duration-500">
        
        {status === 'success' ? (
          <div className="text-center py-6">
            <CheckCircle size={64} className="mx-auto text-black mb-6" />
            <h1 className="text-2xl font-black italic uppercase mb-2 tracking-tighter">Password Updated</h1>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed">
              Account password successfully updated. <br /> Redirecting you to the login page...
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-black italic uppercase tracking-tighter">New Password</h1>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">Create your new secure credentials</p>
            </div>

            {status === 'error' && (
              <div className="bg-red-50 border border-red-100 p-4 mb-6 flex items-center gap-3">
                <AlertTriangle size={16} className="text-red-600" />
                <p className="text-[9px] font-black uppercase text-red-600 tracking-widest">{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black transition-colors" size={16} />
                  <input 
                    type="password" required placeholder="NEW PASSWORD" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-100 py-4 pl-12 pr-4 text-[10px] font-bold tracking-widest uppercase focus:border-black outline-none transition-all"
                  />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black transition-colors" size={16} />
                  <input 
                    type="password" required placeholder="CONFIRM NEW PASSWORD" value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-100 py-4 pl-12 pr-4 text-[10px] font-bold tracking-widest uppercase focus:border-black outline-none transition-all"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="w-full bg-black text-white py-5 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all active:scale-95 disabled:opacity-50"
              >
                {status === 'loading' ? <Loader2 className="animate-spin" size={14} /> : "REDEFINE PASSWORD"} 
                <ArrowRight size={14} />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}