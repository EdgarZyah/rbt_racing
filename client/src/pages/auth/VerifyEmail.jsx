import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2, AlertTriangle, CheckCircle, ChevronRight, Mail, MailCheck } from 'lucide-react';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const { user, verifyEmail, resendVerification } = useAuth();
  
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [isResent, setIsResent] = useState(false); // State untuk tampilan sukses resend
  
  const hasCalled = useRef(false);

  useEffect(() => {
    if (hasCalled.current) return;
    
    const doVerify = async () => {
      if (token) {
        hasCalled.current = true;
        const res = await verifyEmail(token);
        if (res.success) {
          setStatus('success');
        } else {
          setStatus('error');
          setMessage(res.message);
        }
      } else {
        setStatus('error');
        setMessage("Token tidak ditemukan.");
      }
    };
    doVerify();
  }, [token, verifyEmail]);

  const handleResend = async () => {
    const targetEmail = user?.email || localStorage.getItem("pending_email");
    
    if (!targetEmail) {
      alert("Email tidak ditemukan. Silakan registrasi ulang.");
      return;
    }

    setIsResending(true);
    const res = await resendVerification(targetEmail);
    
    if (res.success) {
      setIsResent(true); // Ubah tampilan menjadi informasi email terkirim
    } else {
      alert(res.message);
    }
    setIsResending(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white">
      <div className="max-w-md w-full text-center border border-zinc-100 p-10 bg-white shadow-2xl animate-in fade-in zoom-in duration-500">
        
        {/* 1. STATE: LOADING */}
        {status === 'loading' && (
          <div className="py-10">
            <Loader2 className="animate-spin mx-auto mb-4 text-zinc-300" size={40} />
            <h1 className="text-xl font-black italic uppercase tracking-tighter">Verifying Engine...</h1>
          </div>
        )}

        {/* 2. STATE: SUCCESS (Verifikasi Berhasil) */}
        {status === 'success' && (
          <div className="py-6">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center">
                <CheckCircle size={32} className="text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Verify Success</h1>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-8">Identity confirmed. Welcome to RBT_RACING.</p>
            <button 
              onClick={() => navigate('/customer')}
              className="w-full bg-black text-white py-5 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all active:scale-95 shadow-xl"
            >
              Lanjutkan ke Dashboard <ChevronRight size={14} />
            </button>
          </div>
        )}
        
        {/* 3. STATE: ERROR (Tampilan Gagal) */}
        {status === 'error' && (
          <div className="animate-in slide-in-from-top-4">
            
            {/* JIKA RESEND BERHASIL: Tampilkan Info Email Baru Terkirim */}
            {isResent ? (
              <div className="py-4 animate-in zoom-in duration-500">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center border border-zinc-100">
                    <MailCheck size={32} className="text-black" />
                  </div>
                </div>
                <h1 className="text-2xl font-black italic uppercase tracking-tighter mb-4">Link Transmitted</h1>
                <p className="text-[11px] font-medium leading-relaxed text-zinc-500 uppercase tracking-widest mb-10">
                  Link verifikasi baru telah dikirim ke email Anda. <br />
                  Silakan periksa kotak masuk atau folder spam.
                </p>
                <Link to="/login" className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-black transition-colors">
                  Back to Login
                </Link>
              </div>
            ) : (
              /* TAMPILAN AWAL ERROR (Sebelum Resend) */
              <>
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center border border-red-100">
                    <AlertTriangle className="text-red-500" size={32} />
                  </div>
                </div>
                <h1 className="text-2xl font-black italic uppercase mb-2 text-red-600">Verification Failed</h1>
                <p className="text-[10px] text-zinc-400 uppercase mb-8">{message}</p>
                
                <div className="bg-zinc-50 p-8 border border-dashed border-zinc-200 rounded-sm">
                  <Mail className="mx-auto mb-4 text-zinc-300" size={24} />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 leading-relaxed">
                    Verification link expired? <br /> (10-minute security window)
                  </p>
                  <button 
                    onClick={handleResend}
                    disabled={isResending}
                    className="w-full bg-black text-white py-4 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all disabled:opacity-50 active:scale-95"
                  >
                    {isResending ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin" size={12} /> TRANSMITTING...
                      </span>
                    ) : 'KIRIM ULANG LINK BARU'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}