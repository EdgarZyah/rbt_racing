import { createContext, useContext, useState, useEffect } from "react";
import instance from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const setAxiosHeader = (token) => {
    if (token) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete instance.defaults.headers.common["Authorization"];
    }
  };

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const userStr = localStorage.getItem("user");
        if (token && userStr) {
          setAxiosHeader(token);
          setUser(JSON.parse(userStr));
        }
      } catch (error) {
        localStorage.clear();
      } finally {
        setLoading(false);
      }
    };
    checkUserLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await instance.post("/auth/login", { email, password });
      const userData = { email: data.email, role: data.role, isVerified: data.isVerified };
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(userData));
      setAxiosHeader(data.access_token);
      setUser(userData);
      return { success: true, role: data.role };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Login gagal" };
    }
  };

  const register = async (username, email, password) => {
    try {
      const { data } = await instance.post("/auth/register", { username, email, password });
      localStorage.setItem("pending_email", email);
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Registrasi gagal" };
    }
  };

  const verifyEmail = async (token) => {
    try {
      const { data } = await instance.post("/auth/verify-email", { token });
      if (data.access_token) {
        const userData = { email: data.email, role: data.role, isVerified: true };
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user", JSON.stringify(userData));
        setAxiosHeader(data.access_token);
        setUser(userData);
        return { success: true, autoLogin: true, role: data.role };
      }
      return { success: true, autoLogin: false };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Verifikasi gagal" };
    }
  };

  const resendVerification = async (email) => {
    try {
      // Prioritaskan email dari parameter, jika tidak ada baru ambil dari localStorage
      const targetEmail = email || localStorage.getItem("pending_email");
      
      if (!targetEmail) throw new Error("Email tidak ditemukan. Harap login ulang.");

      // PENTING: Mengirim sebagai objek { email: ... }
      const { data } = await instance.post("/auth/resend-verification", { 
        email: targetEmail 
      });

      return { success: true, message: data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || "Gagal mengirim ulang email" 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("pending_email");
    setAxiosHeader(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, verifyEmail, resendVerification, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);