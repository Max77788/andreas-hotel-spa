"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
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
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="w-full border-2 border-gray-300 px-4 py-3.5 text-base mb-4 focus:outline-none focus:border-[var(--hotel-gold)] pr-12"
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 text-xl"
            tabIndex={-1}
          >
            {show ? "🙈" : "👁"}
          </button>
        </div>
        {error && <p className="text-red-600 text-sm mb-4 font-medium">{error}</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className="w-full bg-[var(--hotel-gold)] text-[var(--hotel-charcoal)] font-body text-sm tracking-[0.2em] uppercase py-3.5 hover:bg-[var(--hotel-terracotta)] hover:text-white transition-colors disabled:opacity-40 font-semibold"
        >
          {loading ? "..." : "Enter"}
        </button>
      </form>
    </div>
  );
}
