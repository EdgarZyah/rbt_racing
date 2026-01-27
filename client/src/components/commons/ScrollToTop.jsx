import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Memaksa browser kembali ke posisi paling atas
    window.scrollTo(0, 0);
  }, [pathname]); // Akan dijalankan setiap kali rute (URL) berubah

  return null;
}