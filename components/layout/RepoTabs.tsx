"use client";

import { Code, ExternalLink, Bot, UserRound } from "lucide-react";

export default function RepoTabs() {
  return (
    <nav className="border-b border-border bg-header">
      <div className="mx-auto flex max-w-screen-2xl gap-3 px-4 sm:gap-8 sm:px-6">
        <button className="flex items-center gap-1.5 border-b-2 border-[#f78166] px-2 py-3 text-xs font-semibold text-foreground sm:gap-2 sm:py-4 sm:text-sm">
          <Code size={16} />
          Code
        </button>

        {/* Ask AI
        <button className="flex items-center gap-1.5 border-b-2 border-transparent px-2 py-3 text-xs font-semibold text-[#8b949e] transition-colors hover:border-[#30363d] hover:text-white sm:gap-2 sm:py-4 sm:text-sm">
          <Bot size={16} />
          About this Site
        </button> */}

        <a
          href="https://www.linkedin.com/in/steven-garcia-6658b88/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 border-b-2 border-transparent px-2 py-3 text-xs font-semibold text-[#8b949e] transition-colors hover:border-border hover:text-accent sm:gap-2 sm:py-4 sm:text-sm"
        >
          <UserRound size={16} />
          LinkedIn
          <ExternalLink size={14} />
        </a>
      </div>
    </nav>
  );
}