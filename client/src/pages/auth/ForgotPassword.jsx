// rbt_racing/client/src/pages/auth/ForgotPassword.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, ArrowRight, MailCheck, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await forgotPassword(email);
    if (res.success) setIsSent(true);
    else alert(res.message);
    setIsSubmitting(false);
  };

  if (isSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-white">
        <div className="max-w-md w-full text-center animate-in zoom-in duration-500">
          <MailCheck size={64} className="mx-auto mb-6 text-black" />
          <h1 className="text-3xl font-black italic uppercase mb-4">Email Transmitted</h1>
          <p className="text-[11px] text-zinc-500 uppercase tracking-widest mb-10">
            Reset password link has been sent to <strong>{email}</strong>.
          </p>
          <Link to="/login" className="text-[10px] font-black uppercase tracking-widest border-b-2 border-black pb-1">Back to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white">
      <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">Reset Password</h1>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">Enter your email to Reset Password</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black transition-colors" size={16} />
            <input 
              type="email" required placeholder="EMAIL ADDRESS" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-100 py-4 pl-12 pr-4 text-[10px] font-bold tracking-widest uppercase focus:border-black outline-none transition-all"
            />
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full bg-black text-white py-5 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all">
            {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : "RESET PASSWORD"} <ArrowRight size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}