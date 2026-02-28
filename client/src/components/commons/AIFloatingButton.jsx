import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Bot } from "lucide-react";

export default function AIFloatingButton() {
  const location = useLocation();

  // Sembunyikan tombol jika user sudah berada di halaman chatbot
  if (location.pathname === "/ai-chatbot") return null;

  return (
    <Link
      to="/ai-chatbot"
      className="fixed bottom-8 right-8 z- group flex items-center bg-black text-white p-4 shadow-2xl border border-zinc-800 hover:bg-zinc-900 transition-all duration-500 hover:-translate-y-1 active:scale-95"
      title="Open RBT AI Assistant"
    >
      {/* Icon */}
      <Bot size={24} className="text-white group-hover:text-zinc-300 transition-colors shrink-0" />
      
      {/* Teks yang muncul saat di-hover */}
      <div className="overflow-hidden max-w-0 group-hover:max-w-[150px] transition-all duration-500 ease-in-out flex items-center">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap pl-4 ml-4 border-l border-zinc-700">
          Ask RBT AI
        </span>
      </div>

      {/* Indikator Titik Hijau Berkedip (Live Status) */}
      <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500 border-2 border-black"></span>
      </span>
    </Link>
  );
}