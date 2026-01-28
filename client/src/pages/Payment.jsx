import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useOrder } from '../hooks/useOrder';
import { usePayment } from '../hooks/usePayment'; 
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Loader2, Copy, ArrowLeft, ShieldCheck, QrCode, Upload, Image as ImageIcon, AlertCircle, Clock } from 'lucide-react';
import ConfirmModal from '../components/commons/ConfirmModal';
import qrisImage from '../assets/qris.png'; 

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { getOrderById } = useOrder();
  const { confirmPayment, uploading } = usePayment();
  
  const [orderData, setOrderData] = useState(null);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // State untuk Modal & Countdown
  const [timeLeft, setTimeLeft] = useState("");
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: "", message: "", type: "info" });

  const { orderId } = location.state || {};

  // 1. Proteksi Akses
  useEffect(() => {
    if (user && !user.isVerified) {
      navigate('/customer');
    }
  }, [user, navigate]);

  // 2. Logika Countdown Timer
  const calculateTimeLeft = useCallback((createdAt) => {
    const expirationTime = new Date(createdAt).getTime() + (24 * 60 * 60 * 1000); // +24 Jam
    const now = new Date().getTime();
    const difference = expirationTime - now;

    if (difference <= 0) return "EXPIRED";

    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    if (!orderData) return;

    const timer = setInterval(() => {
      const time = calculateTimeLeft(orderData.createdAt);
      setTimeLeft(time);
      if (time === "EXPIRED") {
        clearInterval(timer);
        setModalConfig({
          isOpen: true,
          title: "Session Expired",
          message: "Waktu pembayaran telah habis. Pesanan ini akan dibatalkan otomatis.",
          type: "error"
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [orderData, calculateTimeLeft]);

  // 3. Fetch Order Data
  useEffect(() => {
    if (!orderId) {
      setErrorMsg("No Order ID found. Silakan kembali ke riwayat pesanan.");
      return;
    }

    const fetchOrder = async () => {
      try {
        const result = await getOrderById(orderId);
        if (result.success) {
          setOrderData(result.data);
        } else {
          setErrorMsg(result.message);
        }
      } catch (err) {
        setErrorMsg("Gagal memuat data pembayaran.");
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
    if (!selectedFile) {
      setModalConfig({
        isOpen: true,
        title: "Missing Proof",
        message: "Harap unggah bukti pembayaran terlebih dahulu sebelum konfirmasi.",
        type: "info"
      });
      return;
    }

    const result = await confirmPayment(orderId, selectedFile);
    if (result.success) {
      setModalConfig({
        isOpen: true,
        title: "Payment Transmitted",
        message: "Bukti pembayaran berhasil dikirim. Admin akan segera melakukan verifikasi.",
        type: "success"
      });
    } else {
      setModalConfig({
        isOpen: true,
        title: "Upload Failed",
        message: result.message,
        type: "error"
      });
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Notification kecil bisa ditambahkan di sini jika perlu
  };

  if (loadingFetch) return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <Loader2 className="animate-spin text-zinc-300 mb-4" size={40} />
      <p className="text-[10px] font-black uppercase tracking-[0.3em]">Initializing Secure Payment...</p>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 lg:py-16 overflow-x-hidden">
      
      {/* HEADER SECTION */}
      <div className="mb-10">
        <Link to="/customer/orders" className="text-zinc-400 hover:text-black flex items-center gap-2 mb-6 text-[10px] font-black uppercase tracking-widest transition-colors">
          <ArrowLeft size={14}/> Back to Orders
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="text-left">
            <h1 className="text-3xl lg:text-4xl font-black italic uppercase tracking-tighter leading-none">Checkout</h1>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mt-3">
              REF: <span className="text-black">{orderData?.id}</span>
            </p>
          </div>
          
          {/* COUNTDOWN BOX */}
          <div className={`flex items-center gap-3 px-4 py-2 border rounded-sm shadow-sm ${timeLeft === "EXPIRED" ? 'bg-red-50 border-red-200 text-red-600' : 'bg-zinc-50 border-zinc-100 text-black'}`}>
            <Clock size={16} className={timeLeft !== "EXPIRED" ? "animate-pulse" : ""} />
            <div className="text-left">
              <p className="text-[8px] font-black uppercase tracking-widest leading-none mb-1">Time Remaining</p>
              <p className="text-sm font-black font-mono leading-none tracking-tighter">{timeLeft || "--:--:--"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* TOTAL AMOUNT BOX */}
        <div className="bg-zinc-50 border border-zinc-200 p-8 text-center relative">
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">Total Payable Amount</p>
          <div className="flex items-center justify-center gap-4">
            <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter">Rp {orderData?.totalAmount.toLocaleString('id-ID')}</h2>
            <button onClick={() => copyToClipboard(orderData?.totalAmount)} className="p-2 hover:bg-zinc-200 transition-all active:scale-90">
              <Copy size={20} className="text-zinc-400 hover:text-black"/>
            </button>
          </div>
        </div>

        {/* QRIS SECTION */}
        <div className="border border-zinc-100 shadow-2xl rounded-sm overflow-hidden bg-white">
          <div className="bg-black text-white p-4 text-center">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2">
              <QrCode size={14}/> Integrated QRIS Payment
            </h3>
          </div>
          <div className="p-8 flex flex-col items-center bg-white">
            <div className="p-4 border-2 border-dashed border-zinc-100 rounded-sm mb-6 bg-white shadow-inner">
              <img src={qrisImage} alt="QRIS" className="w-64 h-64 md:w-80 md:h-80 object-contain" />
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 italic">Official Merchant: RBT Racing Team</p>
          </div>
        </div>

        {/* UPLOAD SECTION */}
        <div className="bg-zinc-50 border border-zinc-200 p-6">
           <h3 className="text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-2">
             <Upload size={14}/> Transmission Proof
           </h3>
           <label className="flex flex-col items-center justify-center w-full min-h-[200px] border-2 border-dashed border-zinc-300 bg-white cursor-pointer hover:border-black transition-all relative">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full max-h-[300px] object-contain p-4" />
              ) : (
                <div className="text-center">
                  <ImageIcon size={32} className="text-zinc-200 mx-auto mb-3" />
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Attach Payment Screenshot</p>
                </div>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
           </label>
        </div>

        {/* ACTION BUTTON */}
        <div className="pt-4">
          <button 
            onClick={handleConfirmPayment}
            disabled={uploading || !selectedFile || timeLeft === "EXPIRED"}
            className="w-full bg-black text-white py-6 font-black uppercase tracking-[0.3em] text-[11px] hover:bg-zinc-800 transition-all disabled:opacity-30 flex items-center justify-center gap-4 shadow-xl active:scale-[0.99]"
          >
            {uploading ? (
              <><Loader2 className="animate-spin" size={16}/> Syncing Data...</>
            ) : (
              <><CheckCircle size={16}/> Finalize Transaction</>
            )}
          </button>
        </div>
      </div>

      {/* MODAL UNTUK ALERT */}
      <ConfirmModal 
        isOpen={modalConfig.isOpen}
        onClose={() => {
          setModalConfig({ ...modalConfig, isOpen: false });
          if (modalConfig.type === "success" || modalConfig.type === "error" && timeLeft === "EXPIRED") {
            navigate('/customer/orders');
          }
        }}
        onConfirm={() => {
          setModalConfig({ ...modalConfig, isOpen: false });
          if (modalConfig.type === "success" || modalConfig.type === "error" && timeLeft === "EXPIRED") {
            navigate('/customer/orders');
          }
        }}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText="Acknowledged"
        showCancel={false}
      />
    </div>
  );
}