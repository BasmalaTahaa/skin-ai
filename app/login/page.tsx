"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login({
        email,
        password,
      });

      // ✅ save token
      localStorage.setItem("token", res.access_token);
      console.log("TOKEN:", res.access_token);


      // ✅ go to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-100 to-lavender-100">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-pink-600 mb-2">
          Skintelix ✨
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Your personal skin care companion
        </p>

        {/* Error */}
        {error && (
          <p className="text-center text-red-500 text-sm mb-4">
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-pink-200 px-4 py-3
                         focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-pink-200 px-4 py-3
                         focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white
                       bg-gradient-to-r from-pink-400 to-purple-400
                       hover:from-pink-500 hover:to-purple-500
                       transition-all duration-300 shadow-md
                       disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-xs text-center text-gray-400 mt-6">
          Made with 💖 for your skin
        </p>
      </div>
    </div>
  );
}
