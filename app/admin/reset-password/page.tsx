"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();

    if (res.ok) {
      setDone(true);
      setTimeout(() => router.push("/admin"), 3000);
    } else {
      setError(data.error || "Failed to reset password");
    }
    setLoading(false);
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900">
        <div className="bg-white p-12 w-full max-w-md shadow-2xl text-center">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">
            Password Reset
          </h1>
          <div className="w-10 h-1 bg-amber-500 mx-auto mb-6" />
          <p className="text-lg text-neutral-600 font-medium mb-6">
            Your password has been reset. Redirecting to sign in...
          </p>
          <Link
            href="/admin"
            className="text-lg font-bold text-amber-600 hover:text-amber-700"
          >
            Sign in now
          </Link>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900">
        <div className="bg-white p-12 w-full max-w-md shadow-2xl text-center">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">
            Invalid Link
          </h1>
          <div className="w-10 h-1 bg-red-500 mx-auto mb-6" />
          <p className="text-lg text-neutral-600 font-medium mb-6">
            This reset link is invalid or missing a token.
          </p>
          <Link
            href="/admin/forgot-password"
            className="text-lg font-bold text-amber-600 hover:text-amber-700"
          >
            Request a new link
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
            New Password
          </h1>
          <div className="w-10 h-1 bg-amber-500 mx-auto mt-4" />
          <p className="text-lg text-neutral-600 font-medium mt-4">
            Enter your new password (min 8 characters).
          </p>
        </div>

        <div className="relative mb-5">
          <input
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            className="w-full border-[3px] border-neutral-400 px-5 py-5 text-xl text-neutral-900 focus:outline-none focus:border-amber-500 pr-14 placeholder:text-neutral-400 font-medium bg-neutral-50"
            autoFocus
            autoComplete="new-password"
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

        {error && (
          <p className="text-red-600 text-lg mb-5 font-bold">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || password.length < 8}
          className="w-full bg-amber-500 text-neutral-900 text-lg font-bold tracking-[0.2em] uppercase py-5 hover:bg-amber-600 transition-colors disabled:opacity-30 mb-6"
        >
          {loading ? "..." : "Reset Password"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-neutral-900">
          <p className="text-white text-xl font-bold">Loading...</p>
        </div>
      }
    >
      <ResetForm />
    </Suspense>
  );
}
