// rbt_racing/client/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import instance from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const setAxiosHeader = (token) => {
    if (token)
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    else delete instance.defaults.headers.common["Authorization"];
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      setAxiosHeader(token);
      setUser(JSON.parse(userStr));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await instance.post("/auth/login", { email, password });
      const userData = {
        email: data.email,
        role: data.role,
        isVerified: data.isVerified,
      };
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(userData));
      setAxiosHeader(data.access_token);
      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login gagal",
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      // PERBAIKAN: Gunakan 'instance' bukan 'api'
      const { data } = await instance.post('/auth/register', { username, email, password });
      return { success: true, data };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || "Registration failed" 
      };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const { data } = await instance.post("/auth/forgot-password", { email });
      return { success: true, message: data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Gagal mengirim link",
      };
    }
  };

  const resetPassword = async (token, password) => {
    try {
      const { data } = await instance.post("/auth/reset-password", {
        token,
        password,
      });
      return { success: true, message: data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Gagal mereset password",
      };
    }
  };

  const verifyEmail = async (token) => {
    try {
      const { data } = await instance.post("/auth/verify-email", { token });
      if (data.access_token) {
        const userData = {
          email: data.email,
          role: data.role,
          isVerified: true,
        };
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user", JSON.stringify(userData));
        setAxiosHeader(data.access_token);
        setUser(userData);
        return { success: true, autoLogin: true };
      }
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
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
    localStorage.clear();
    setAxiosHeader(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        verifyEmail,
        resendVerification,
        forgotPassword,
        resetPassword,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


