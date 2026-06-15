"use client";

import { useRouter } from "next/navigation";
import { Shield, LogOut, Users } from "lucide-react";

interface Session {
  name: string;
  email: string;
  role: "admin" | "editor";
}

export default function AdminNav({ session }: { session: Session | null }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin");
  }

  // Don't render nav on login/forgot/reset pages
  if (!session) return null;

  return (
    <nav className="bg-neutral-900 border-b-[3px] border-amber-500">
      <div className="max-w-5xl mx-auto px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <a href="/admin/dashboard" className="text-xl font-bold text-white">
            Andreas CMS
          </a>
          <a
            href="/admin/dashboard"
            className="text-lg font-bold text-neutral-400 hover:text-white transition-colors"
          >
            Dashboard
          </a>
          {session.role === "admin" && (
            <a
              href="/admin/users"
              className="flex items-center gap-1 text-lg font-bold text-neutral-400 hover:text-white transition-colors"
            >
              <Users size={18} />
              Users
            </a>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-neutral-300">
            <Shield size={16} className="text-amber-500" />
            <span className="text-lg font-bold">{session.name}</span>
            <span className="text-sm font-medium text-neutral-500">
              ({session.role})
            </span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1 text-lg font-bold text-neutral-400 hover:text-red-400 transition-colors"
            title="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
}
