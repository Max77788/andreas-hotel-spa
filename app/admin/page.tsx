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
    <div className="min-h-screen flex items-center justify-center bg-neutral-900">
      <form onSubmit={handleSubmit} className="bg-white p-12 w-full max-w-md shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
            Andreas CMS
          </h1>
          <div className="w-10 h-1 bg-amber-500 mx-auto mt-4" />
        </div>
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="w-full border-[3px] border-neutral-400 px-5 py-5 text-xl text-neutral-900 mb-5 focus:outline-none focus:border-amber-500 pr-14 placeholder:text-neutral-400 font-medium"
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-4 top-5 text-2xl text-neutral-500 hover:text-neutral-800"
            tabIndex={-1}
          >
            {show ? "🙈" : "👁"}
          </button>
        </div>
        {error && <p className="text-red-600 text-lg mb-5 font-bold">{error}</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className="w-full bg-amber-500 text-neutral-900 text-lg font-bold tracking-[0.2em] uppercase py-5 hover:bg-amber-600 transition-colors disabled:opacity-30"
        >
          {loading ? "..." : "Enter"}
        </button>
      </form>
    </div>
  );
}
