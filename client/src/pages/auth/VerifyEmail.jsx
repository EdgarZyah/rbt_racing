import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MailCheck, XCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { verifyEmail } = useAuth();

  const [status, setStatus] = useState('verifying'); // verifying, success, error, instruction
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Jika tidak ada token, berarti ini halaman instruksi setelah register
    if (!token) {
      setStatus('instruction');
      return;
    }

    // Jika ada token, lakukan verifikasi
    const executeVerify = async () => {
      const result = await verifyEmail(token);
      if (result.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setMessage(result.message);
      }
    };

    executeVerify();
  }, [token, verifyEmail]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 animate-in fade-in duration-700">
      <div className="max-w-md w-full border border-zinc-100 p-10 bg-white text-center shadow-2xl shadow-zinc-100">
        
        {/* KONDISI 1: INSTRUKSI SETELAH REGISTER */}
        {status === 'instruction' && (
          <>
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center border border-zinc-100">
                <MailCheck size={32} className="text-black" strokeWidth={1.5} />
              </div>
            </div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase mb-4">Check Your Inbox</h1>
            <p className="text-[11px] font-medium leading-relaxed text-zinc-500 uppercase tracking-wider mb-10">
              We have sent a verification link to your email. <br /> 
              Please click the link to activate your RBT_RACING account.
            </p>
          </>
        )}

        {/* KONDISI 2: SEDANG MEMVERIFIKASI */}
        {status === 'verifying' && (
          <>
            <div className="flex justify-center mb-8">
              <Loader2 size={48} className="animate-spin text-zinc-300" />
            </div>
            <h1 className="text-2xl font-black italic tracking-tighter uppercase mb-2">Verifying...</h1>
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Please wait a moment</p>
          </>
        )}

        {/* KONDISI 3: SUKSES */}
        {status === 'success' && (
          <>
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center">
                <MailCheck size={32} className="text-white" strokeWidth={1.5} />
              </div>
            </div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase mb-4">Verified!</h1>
            <p className="text-[11px] text-zinc-500 uppercase tracking-wider mb-8">
              Your engine is ready. You can now access your dashboard.
            </p>
            <Link to="/login" className="block w-full bg-black text-white py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition">
              Login Now
            </Link>
          </>
        )}

        {/* KONDISI 4: ERROR */}
        {status === 'error' && (
          <>
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center border border-red-100">
                <XCircle size={32} className="text-red-500" strokeWidth={1.5} />
              </div>
            </div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase mb-4 text-red-500">Verification Failed</h1>
            <p className="text-[11px] text-zinc-500 uppercase tracking-wider mb-8">
              {message || "The link is invalid or has expired."}
            </p>
            <Link to="/login" className="block w-full border border-zinc-200 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-50 transition">
              Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}