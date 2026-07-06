"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  const btnBase =
    "relative flex items-center justify-center w-9 h-9 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all duration-200 cursor-pointer";

  if (!mounted) {
    return (
      <button className={btnBase} aria-label="Toggle theme">
        <Sun className="w-4 h-4" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  const toggle = () => {
    const next = isDark ? "light" : "dark";
    console.log("Theme toggle:", resolvedTheme, "->", next);
    setTheme(next);
  };

  return (
    <button
      onClick={toggle}
      className={btnBase}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Currently ${isDark ? "dark" : "light"} – click to switch`}
    >
      {isDark ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
}
