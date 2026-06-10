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
    <div className="min-h-screen flex items-center justify-center bg-[#2a2118]">
      <form onSubmit={handleSubmit} className="bg-white p-10 w-full max-w-sm shadow-lg">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl text-[#2a2118] font-light">
            Andreas CMS
          </h1>
          <div className="w-8 h-px bg-[#c9a96e] mx-auto mt-3" />
        </div>
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="w-full border-2 border-gray-400 px-4 py-3.5 text-base text-gray-900 mb-4 focus:outline-none focus:border-[#c9a96e] pr-12 placeholder:text-gray-500"
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-800 text-xl"
            tabIndex={-1}
          >
            {show ? "🙈" : "👁"}
          </button>
        </div>
        {error && <p className="text-red-600 text-sm mb-4 font-semibold">{error}</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className="w-full bg-[#c9a96e] text-[#2a2118] font-body text-sm tracking-[0.2em] uppercase py-3.5 hover:bg-[#b8743d] hover:text-white transition-colors disabled:opacity-40 font-bold"
        >
          {loading ? "..." : "Enter"}
        </button>
      </form>
    </div>
  );
}
