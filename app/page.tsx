"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Upload, MessageCircle, TrendingUp, Sparkles } from "lucide-react";

interface User {
  email: string;
  full_name: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("http://127.0.0.1:8000/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/login");
      });
  }, [router]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-pink-accent/10 via-lavender-accent/10 to-rose/10 rounded-2xl p-8 border border-rose/20 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-8 h-8 text-pink-accent" />
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {user.full_name} ✨
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Ready to take care of your skin today?
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/dashboard/upload" className="bg-white rounded-2xl p-6 border border-rose/20 shadow-md">
          <Upload /> Upload
        </Link>

        <Link href="/dashboard/chat" className="bg-white rounded-2xl p-6 border border-rose/20 shadow-md">
          <MessageCircle /> Chat
        </Link>

        <Link href="/dashboard/tracking" className="bg-white rounded-2xl p-6 border border-rose/20 shadow-md">
          <TrendingUp /> Tracking
        </Link>
      </div>
    </div>
  );
}
