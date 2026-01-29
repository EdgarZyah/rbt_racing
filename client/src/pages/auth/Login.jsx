// client/src/pages/auth/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      // Redirect berdasarkan role
      navigate(result.role === "ADMIN" ? "/admin" : "/");
    } else {
      setError(result.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black italic tracking-tighter uppercase mb-2">
            Welcome Back
          </h1>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.4em]">
            Log in to Your RBT Account
          </p>
        </div>

        {error && (
          <div className="bg-black text-white text-[10px] font-bold uppercase tracking-widest p-4 mb-8 text-center italic">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black transition-colors"
                size={16}
              />
              <input
                type="email"
                required
                placeholder="EMAIL ADDRESS"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full bg-zinc-50 border border-zinc-100 py-4 pl-12 pr-4 text-[10px] font-bold tracking-widest uppercase focus:bg-white focus:border-black outline-none transition-all duration-300"
              />
            </div>

            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black transition-colors"
                size={16}
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="PASSWORD"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full bg-zinc-50 border border-zinc-100 py-4 pl-12 pr-12 text-[10px] font-bold tracking-widest uppercase focus:bg-white focus:border-black outline-none transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-black transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-5 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center space-x-3 hover:bg-zinc-800 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <span>{isSubmitting ? "Authenticating..." : "Login"}</span>
            {!isSubmitting && <ArrowRight size={14} />}
          </button>
        </form>

        <div className="mt-12 text-center space-y-4">
          <Link
            to="/forgot-password"
            className="block text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors"
          >
            Forgot Password?
          </Link>
          <Link
            to="/register"
            className="block text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors"
          >
            Create New Account
          </Link>
        </div>
      </div>
    </div>
  );
}
