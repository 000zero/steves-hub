import {
  ExternalLink,
  Globe,
  UserRound,
} from "lucide-react";

export default function RepoHeader() {
  return (
    <section className="bg-header">
      <div className="mx-auto flex max-w-screen-2xl items-start justify-between px-6 py-5">
        {/* Left */}
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold">
            <UserRound
              size={20}
              className="text-muted"
            />

            <span className="text-accent text-xl font-normal">
              steven-garcia
            </span>

            <span className="text-[#8b949e]">/</span>

            <span className="text-accent text-xl font-bold">
              software-engineer
            </span>
          </h1>

        </div>

        {/* Right */}
        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-xs hover:bg-highlight hover:cursor-pointer">
            <Globe size={16} />
            GitHub
            <ExternalLink size={14} />
          </button>

          <button className="flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-xs hover:bg-highlight hover:cursor-pointer">
            <UserRound size={16} />
            LinkedIn
            <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}