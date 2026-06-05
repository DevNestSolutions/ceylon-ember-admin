import React, { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Lock, User, Flame } from "lucide-react";
import { toast } from "sonner";

export const Login: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please enter both username and password");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/login", { username, password });
      const { token, user } = response.data;
      login(token, user);
      toast.success(`Welcome back, ${user.username}!`);
    } catch (error: any) {
      console.error("Login failed:", error);
      const message = error.response?.data?.error || "Login failed. Please check your credentials.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg-dark px-4 py-12">
      {/* Cinematic Ember Ambient Lights */}
      <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-gradient-to-br from-gold/20 to-ember/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-ember/25 blur-3xl" />

      <div className="z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gold to-ember shadow-[0_0_30px_rgba(212,175,55,0.4)]">
            <Flame className="h-7 w-7 text-bg-dark" />
          </div>
          <h1 className="mt-4 font-serif text-3xl font-light tracking-wide text-white">
            The Ceylon Ember
          </h1>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-gold">
            Administration Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-card rounded-[2rem] p-8 md:p-10">
          <h2 className="mb-6 text-xl font-light text-white">Sign In</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-xs uppercase tracking-widest text-gray-400">
                Username
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <User className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full rounded-2xl border border-white/5 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition-all placeholder:text-gray-600 focus:border-gold/50 focus:bg-white/10"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-xs uppercase tracking-widest text-gray-400">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Lock className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/5 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition-all placeholder:text-gray-600 focus:border-gold/50 focus:bg-white/10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-gold to-ember py-4 text-sm font-semibold text-bg-dark transition-all hover:scale-[1.02] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
            >
              <span className="relative z-10">
                {loading ? "Authenticating..." : "Access Dashboard"}
              </span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
