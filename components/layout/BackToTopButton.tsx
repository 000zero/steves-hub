"use client";

import { BotMessageSquare } from "lucide-react";
import { useEffect, useState } from "react";

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    toggleVisibility();
    window.addEventListener("scroll", toggleVisibility, { passive: true });

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToChat = () => {
    const chatElement = document.getElementById("resume-chat");
    if (chatElement) {
      chatElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {isVisible ? (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 hidden items-center gap-2 rounded-full border border-border bg-accent2 px-4 py-2 text-sm font-medium text-accent shadow-lg transition hover:cursor-pointer hover:bg-background lg:flex"
          aria-label="Back to top"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 15 7-7 7 7" />
            <path d="M12 8v11" />
          </svg>
          <span>Back to top</span>
        </button>
      ) : null}

      <button
        type="button"
        onClick={scrollToChat}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-accent2 text-accent shadow-lg transition hover:cursor-pointer hover:bg-background lg:hidden"
        aria-label="Jump to chat"
      >
        <BotMessageSquare className="h-5 w-5" />
      </button>
    </>
  );
}
