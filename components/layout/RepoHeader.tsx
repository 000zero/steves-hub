import {
  ExternalLink,
  Globe,
  UserRound,
} from "lucide-react";

export default function RepoHeader() {
  return (
    <section className="bg-header">
      <div className="mx-auto flex max-w-screen-2xl items-start justify-between px-4 py-4 sm:px-6 sm:py-5">
        {/* Left */}
        <div>
          <h1 className="flex flex-wrap items-center gap-1.5 text-lg font-semibold sm:gap-2 sm:text-2xl">
            <UserRound
              size={20}
              className="text-muted"
            />

            <span className="text-accent text-base font-normal sm:text-xl">
              steven-garcia
            </span>

            <span className="text-[#8b949e]">/</span>

            <span className="text-accent text-base font-bold sm:text-xl">
              software-engineer
            </span>
          </h1>

        </div>
      </div>
    </section>
  );
}