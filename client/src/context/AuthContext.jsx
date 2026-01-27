// client/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import instance from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const email = localStorage.getItem("user_email");
        const role = localStorage.getItem("user_role");

        if (token) {
          // Set header default untuk request berikutnya
          instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setUser({ email, role, token });
        }
      } catch (error) {
        console.error("Auth check failed", error);
        localStorage.clear();
      } finally {
        setLoading(false);
      }
    };
    checkUserLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      // Menyesuaikan dengan route backend /api/v1/auth/login
      const { data } = await instance.post("/auth/login", { email, password });
      
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user_email", data.email);
      localStorage.setItem("user_role", data.role);
      
      instance.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
      
      setUser({
        email: data.email,
        role: data.role,
        token: data.access_token
      });
      
      return { success: true, role: data.role };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login Failed"
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      // Menyesuaikan dengan route backend /api/v1/auth/register
      await instance.post("/auth/register", { username, email, password });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration Failed"
      };
    }
  };

  const logout = () => {
    localStorage.clear();
    delete instance.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);