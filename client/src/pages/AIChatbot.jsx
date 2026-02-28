// client/src/pages/AIChatbot.jsx
import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Trash2, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axios";

const INITIAL_MESSAGE = {
  role: "model",
  parts: [{ text: "Halo Rider! Saya RBT AI. Silakan tanya seputar knalpot RBT." }],
};

export default function AIChatbot() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [remainingQuota, setRemainingQuota] = useState(3);
  const scrollRef = useRef(null);

  // Ambil sisa kuota asli saat komponen dimuat
  useEffect(() => {
    if (user) {
      axiosInstance.get("/chat/quota")
        .then(res => setRemainingQuota(res.data.quota))
        .catch(err => console.error("Gagal ambil kuota:", err));
    }
  }, [user]);

  // PERBAIKAN: Animasi Scroll yang lebih mulus
  useEffect(() => {
    // Menggunakan setTimeout untuk memastikan DOM sudah selesai di-render
    // sebelum memicu animasi scroll.
    const timer = setTimeout(() => {
      if (messages.length > 1 || isLoading) {
        scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }, 100);

    // Cleanup timer mencegah memory leak
    return () => clearTimeout(timer);
  }, [messages, isLoading]); // Tambahkan isLoading agar scroll juga saat "Processing..."

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || remainingQuota <= 0 || input.length > 60) return;

    const userMessage = input.trim();
    setInput("");
    const newMessages = [...messages, { role: "user", parts: [{ text: userMessage }] }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/chat", {
        message: userMessage,
        history: messages.slice(1), 
      });

      setMessages((prev) => [
        ...prev,
        { role: "model", parts: [{ text: response.data.reply }] },
      ]);
      setRemainingQuota(response.data.remainingQuota);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Koneksi terputus. AI offline.";
      setMessages((prev) => [...prev, { role: "model", parts: [{ text: errorMsg }] }]);
      if (error.response?.status === 403) setRemainingQuota(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-32 flex flex-col items-center text-center">
        <Lock size={40} className="text-zinc-300 mb-6" />
        <p className="text-zinc-500 text-sm mb-10 max-w-xs">Identitas diperlukan. Silakan login untuk akses AI.</p>
        <Link to="/login" className="bg-black text-white px-10 py-4 text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition">Login</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 h-[85vh] flex flex-col">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-zinc-100 text-left">
        <div>
          <h1 className="text-3xl font-black italic uppercase flex items-center gap-3 tracking-tighter">
            <Bot size={30} /> RBT AI ASSISTANT
          </h1>
          <p className="text-[10px] font-bold text-zinc-400 uppercase mt-1">
            Live Chat • <span className={remainingQuota === 0 ? "text-red-500" : "text-black"}>{remainingQuota}/3 Kuota</span>
          </p>
        </div>
        <button onClick={() => setMessages([INITIAL_MESSAGE])} className="p-3 text-zinc-400 hover:text-red-500 transition"><Trash2 size={20} /></button>
      </div>

      <div className="flex-1 overflow-y-auto bg-zinc-50 border border-zinc-100 p-6 space-y-6 mb-6 shadow-inner rounded-sm no-scrollbar scroll-smooth">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex gap-4 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div className={`w-9 h-9 flex-shrink-0 flex items-center justify-center border ${msg.role === "user" ? "bg-black text-white" : "bg-white text-black border-zinc-200"}`}>
                {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`px-5 py-4 text-xs leading-relaxed text-left shadow-sm whitespace-pre-wrap ${msg.role === "user" ? "bg-black text-white" : "bg-white text-zinc-800 border border-zinc-100"}`}>
                {msg.parts?.[0]?.text || "Tidak ada pesan"}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-4 animate-pulse">
              <div className="w-9 h-9 bg-zinc-200 border border-zinc-300" />
              <div className="bg-white border border-zinc-100 px-5 py-4 flex items-center">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest italic">Processing...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} className="h-1" />
      </div>

      <form onSubmit={handleSend} className="relative">
        <textarea
          rows="1"
          maxLength={60}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading || remainingQuota === 0}
          placeholder={remainingQuota === 0 ? "Run out of quota. Please come back tomorrow." : "Tanya seputar knalpot (Maks 60 huruf)..."}
          className="w-full border border-zinc-200 py-5 pl-6 pr-24 text-xs focus:outline-none focus:border-black resize-none bg-white transition-all"
        />
        
        <div className="absolute right-16 top-1/2 -translate-y-1/2 text-[9px] font-bold text-zinc-300">
          {input.length}/60
        </div>

        <button
          type="submit"
          disabled={isLoading || !input.trim() || remainingQuota === 0}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-black text-white flex items-center justify-center disabled:opacity-30 active:scale-95 transition"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={18} />}
        </button>
      </form>

      {remainingQuota === 0 && (
        <div className="mt-4 flex items-center justify-center gap-2 text-red-500 animate-pulse">
          <AlertCircle size={14} />
          <p className="text-[10px] font-black uppercase tracking-widest text-left">Your daily chat quota is exceeded, please come back tomorrow.</p>
        </div>
      )}
    </div>
  );
}