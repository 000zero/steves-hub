"use client";

import { Code, Bot } from "lucide-react";

export default function RepoTabs() {
  return (
    <nav className="border-b border-border bg-header">
      <div className="mx-auto flex max-w-screen-2xl gap-8 px-6">
        <button className="flex items-center gap-2 border-b-2 border-[#f78166] px-2 py-4 text-sm font-medium text-foreground">
          <Code size={16} />
          Code
        </button>

        {/* Ask AI */}
        <button className="flex items-center gap-2 border-b-2 border-transparent px-2 py-4 text-sm text-[#8b949e] transition-colors hover:border-[#30363d] hover:text-white">
          <Bot size={16} />
          About this Site
        </button>
      </div>
    </nav>
  );
}