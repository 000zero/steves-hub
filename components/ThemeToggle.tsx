"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const dark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-[#25292e] transition-colors hover:bg-[#30363d]"
      aria-label="Toggle theme"
    >
      {dark ? (
        <Sun size={18} />
      ) : (
        <Moon size={18} className="text-[#e6edf3]" />
      )}
    </button>
  );
}