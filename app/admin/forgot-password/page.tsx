"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setSent(true);
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong");
    }
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900">
        <div className="bg-white p-12 w-full max-w-md shadow-2xl text-center">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">
            Check Your Email
          </h1>
          <div className="w-10 h-1 bg-amber-500 mx-auto mb-6" />
          <p className="text-lg text-neutral-600 font-medium mb-8">
            If an account with that email exists, we've sent a password reset
            link.
          </p>
          <Link
            href="/admin"
            className="text-lg font-bold text-amber-600 hover:text-amber-700"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-12 w-full max-w-md shadow-2xl"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
            Reset Password
          </h1>
          <div className="w-10 h-1 bg-amber-500 mx-auto mt-4" />
          <p className="text-lg text-neutral-600 font-medium mt-4">
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border-[3px] border-neutral-400 px-5 py-5 text-xl text-neutral-900 mb-5 focus:outline-none focus:border-amber-500 placeholder:text-neutral-400 font-medium bg-neutral-50"
          autoFocus
          autoComplete="email"
        />

        {error && (
          <p className="text-red-600 text-lg mb-5 font-bold">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !email}
          className="w-full bg-amber-500 text-neutral-900 text-lg font-bold tracking-[0.2em] uppercase py-5 hover:bg-amber-600 transition-colors disabled:opacity-30 mb-6"
        >
          {loading ? "..." : "Send Reset Link"}
        </button>

        <div className="text-center">
          <Link
            href="/admin"
            className="text-lg font-bold text-neutral-600 hover:text-amber-600 transition-colors"
          >
            Back to sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
