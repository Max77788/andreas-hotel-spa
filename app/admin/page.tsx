"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setError("Invalid password");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--hotel-charcoal)]">
      <form onSubmit={handleSubmit} className="bg-white p-10 w-full max-w-sm shadow-lg">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl text-[var(--hotel-charcoal)] font-light">
            Andreas CMS
          </h1>
          <div className="w-8 h-px bg-[var(--hotel-gold)] mx-auto mt-3" />
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Admin password"
          className="w-full border border-gray-200 px-4 py-3 text-sm mb-4 focus:outline-none focus:border-[var(--hotel-gold)]"
          autoFocus
        />
        {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className="w-full bg-[var(--hotel-gold)] text-[var(--hotel-charcoal)] font-body text-xs tracking-[0.3em] uppercase py-3 hover:bg-[var(--hotel-terracotta)] hover:text-white transition-colors disabled:opacity-50"
        >
          {loading ? "..." : "Enter"}
        </button>
      </form>
    </div>
  );
}
