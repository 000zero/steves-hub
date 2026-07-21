import {
  Bell,
  CircleUserRound,
  Rocket,
  Search,
} from "lucide-react";
import ThemeToggle from "../ThemeToggle";

export default function TopNav() {
  return (
    <header className="border-b border-[#30363d] bg-[#25292e]">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Rocket className="text-[#e6edf3]" size={28} />

          <span className="font-semibold text-[#e6edf3]">
            Steve's Hub
          </span>

          <div className="relative">
            <Search
              className="absolute left-3 top-2.5 text-[#e6edf3]"
              size={16}
            />

            <input
              className="w-80 rounded-md border text-[#ffffff] border-[#e6edf3] bg-[#25292e] py-2 pl-9 pr-4 text-sm outline-none focus:border-blue-500"
              placeholder="Search resume..."
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}