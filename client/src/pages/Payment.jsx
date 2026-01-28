import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useOrder } from '../hooks/useOrder';
import { usePayment } from '../hooks/usePayment'; 
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { CheckCircle, Loader2, Copy, ArrowLeft, ShieldCheck, QrCode, Upload, Image as ImageIcon, AlertCircle, Clock, ShieldAlert } from 'lucide-react';
import qrisImage from '../assets/qris.png'; 

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth(); // Ambil status user
  
  const { getOrderById } = useOrder();
  const { confirmPayment, uploading } = usePayment();
  
  const [orderData, setOrderData] = useState(null);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const { orderId } = location.state || {};

  // 1. Proteksi Akses: Cek Verifikasi Email
  useEffect(() => {
    if (user && !user.isVerified) {
      alert("Akses Ditolak. Harap verifikasi akun Anda terlebih dahulu.");
      navigate('/cart');
    }
  }, [user, navigate]);

  // 2. Fetch Order Data
  useEffect(() => {
    if (!orderId) {
      setErrorMsg("No Order ID found in navigation state.");
      return;
    }

    const fetchOrder = async () => {
      try {
        const result = await getOrderById(orderId);
        if (result.success) {
          setOrderData(result.data);
        } else {
          setErrorMsg(result.message || "Failed to load order data.");
        }
      } catch (err) {
        setErrorMsg("Unexpected Error: " + err.message);
      } finally {
        setLoadingFetch(false);
      }
    };

    fetchOrder();
  }, [orderId, getOrderById]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleConfirmPayment = async () => {
    if (!selectedFile) return alert("Please upload your payment proof first!");
    const result = await confirmPayment(orderId, selectedFile);
    if (result.success) {
      alert("Payment successful! Status updated to PAID.");
      navigate('/customer/orders'); 
    } else {
      alert("Upload failed: " + result.message);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert(`Copied: ${text}`);
  };

  if (errorMsg) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center gap-4">
        <AlertCircle size={48} className="text-red-500" />
        <h2 className="text-xl font-bold">Oops! Something went wrong</h2>
        <p className="text-sm font-mono bg-red-50 p-4 rounded text-red-600 border border-red-200">{errorMsg}</p>
        <Link to="/cart" className="bg-black text-white px-6 py-3 text-xs font-black uppercase tracking-widest rounded">Return to Cart</Link>
      </div>
    );
  }

  if (loadingFetch) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center gap-4">
        <Loader2 className="animate-spin text-zinc-300" size={32} />
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Loading Payment Details...</p>
      </div>
    );
  }

  if (!orderData) return null;

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 animate-in fade-in duration-500">
      <div className="mb-8">
        <Link to="/cart" className="text-zinc-400 hover:text-black flex items-center gap-2 mb-4 text-[10px] font-bold uppercase tracking-widest">
          <ArrowLeft size={14}/> Back to Cart
        </Link>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter">Complete Payment</h1>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-2">
              Order ID: <span className="text-black bg-zinc-100 px-2 py-1 rounded">{orderData.id}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
            <Clock size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Waiting for Payment</span>
          </div>
        </div>
      </div>

      <div className="grid gap-8">
        <div className="bg-zinc-50 border border-zinc-200 p-8 text-center rounded-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-200 via-black to-zinc-200"></div>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Total Amount to Pay</p>
          <div className="flex items-center justify-center gap-3 mb-2">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Rp {orderData.totalAmount.toLocaleString('id-ID')}</h2>
            <button onClick={() => copyToClipboard(orderData.totalAmount)} className="p-2 hover:bg-zinc-200 rounded-full transition group">
              <Copy size={18} className="text-zinc-400 group-hover:text-black"/>
            </button>
          </div>
          <p className="text-[10px] text-red-500 font-bold uppercase bg-red-50 inline-block px-3 py-1 rounded-full border border-red-100">Please pay exact amount</p>
        </div>

        <div className="bg-white border border-zinc-200 shadow-xl rounded-xl overflow-hidden">
          <div className="bg-black text-white p-4 text-center">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2"><QrCode size={16}/> Scan QRIS</h3>
          </div>
          <div className="p-8 flex flex-col items-center">
            <div className="p-4 bg-white border-2 border-dashed border-zinc-300 rounded-lg mb-6 relative group">
              <img src={qrisImage} alt="QRIS" className="w-64 h-64 object-contain" />
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">RBT Racing Official</div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-lg">
           <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2"><Upload size={16}/> Upload Payment Proof</h3>
           <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-zinc-300 rounded-lg cursor-pointer hover:bg-white hover:border-black transition-all relative overflow-hidden">
              {previewUrl ? (
                <>
                  <img src={previewUrl} alt="Proof" className="w-full h-full object-contain p-2" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-bold uppercase">Change Image</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <ImageIcon size={32} className="text-zinc-300 mb-2" />
                  <p className="text-[10px] uppercase font-bold text-zinc-400">Click to upload image</p>
                </div>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
           </label>
        </div>

        <div className="space-y-4">
          <button 
            onClick={handleConfirmPayment}
            disabled={uploading || !selectedFile}
            className="w-full bg-black text-white py-5 font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg group"
          >
            {uploading ? <><Loader2 className="animate-spin" size={18}/> Uploading...</> : <><CheckCircle size={18}/> Confirm Payment</>}
          </button>
          <div className="flex items-center justify-center gap-2 text-zinc-400">
            <ShieldCheck size={14}/>
            <span className="text-[10px] font-bold uppercase tracking-widest">Secure Payment Gateway</span>
          </div>
        </div>
      </div>
    </div>
  );
}