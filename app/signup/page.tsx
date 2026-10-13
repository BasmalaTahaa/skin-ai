"use client";

import { useState } from "react";
import { signup } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await signup({
        email,
        password,
        full_name: fullName,
      });

      // 🔐 حفظ التوكن
      localStorage.setItem("token", res.access_token);

      // 👉 روحي Dashboard
      router.push("/dashboard");
    } catch (err) {
      setError("Signup failed. Try another email.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100">
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center text-pink-600">
          Create Account ✨
        </h1>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <input
          type="text"
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border px-4 py-2 rounded-xl"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-4 py-2 rounded-xl"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-4 py-2 rounded-xl"
          required
        />

        <button
          type="submit"
          className="w-full py-2 bg-pink-500 text-white rounded-xl font-semibold"
        >
          Sign up
        </button>
      </form>
    </div>
  );
}
