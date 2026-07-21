import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { Building2, History } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import TopNav from "./TopNav";
import RepoHeader from "./RepoHeader";
import RepoTabs from "./RepoTabs";
import ResumeChat from "../ResumeChat";

async function getResumeMarkdown() {
  const filePath = path.join(process.cwd(), "knowledge", "resume.md");
  const source = await fs.readFile(filePath, "utf8");
  const { content } = matter(source);

  return content.replace(/^(\s*)\*\s+/gm, "$1- ");
}

export default async function MyHubLayout() {
  const resumeMarkdown = await getResumeMarkdown();
  console.log("resumeMarkdown", resumeMarkdown);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav />
      <RepoHeader />
      <RepoTabs />

      <main className="mx-auto max-w-screen-2xl px-6 py-6">
        <div className="grid grid-cols-[1fr_360px] gap-6">
          {/* main content */}
          <section className="space-y-6">

            {/* Repository Contents */}
            <div className="overflow-hidden rounded-md border border-[#d1d9e0]">
              <div className="flex items-center justify-between border-b border-[#d1d9e0] bg-header px-4 py-3 font-semibold">
                <span>Work History</span>
                <span className="flex items-center gap-1 text-xs font-bold">
                  <History className="h-3.5 w-3.5" />
                  5 commits
                </span>
              </div>

              <div className="divide-y divide-[#d1d9e0]">
                {[
                  { name: "Hooray Agency", dateRange: "Jul 2023 - Jun 2026", role: "Software Engineer" },
                  { name: "Pacific Dental Services", dateRange: "Nov 2016 - Jun 2023", role: "Software Engineer" },
                  { name: "CyberCoders", dateRange: "Apr 2015 - Nov 2016", role: "Senior Software Engineer" },
                  { name: "Quality Systems Inc.", dateRange: "Apr 2009 - Dec 2015", role: "EDI Software Lead Developer" },
                  { name: "IntelliStick Inc.", dateRange: "Jun 2007 - Feb 2009", role: "Software Engineer" },
                ].map((company) => (
                  <div
                    key={company.name}
                    className="grid grid-cols-3 items-center px-4 py-3 hover:bg-header cursor-pointer text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-5 w-5 items-center justify-center text-foreground">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div className="text-foreground">{company.name}</div>
                    </div>

                    <div className="text-muted">{company.role}</div>

                    <div className="text-muted text-right">{company.dateRange}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* resume content in the form of a readme */}

            <div className="overflow-hidden rounded-md border border-border bg-background">
              <div className="bg-header border-b border-border px-6 py-4 font-semibold">
                README.md
              </div>

              <div className="prose prose-sm max-w-none space-y-3 p-8 text-sm leading-7 dark:prose-invert">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="mb-4 mt-0 border-b border-border pb-2 text-[2rem] font-semibold leading-tight">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="mb-3 mt-6 border-b border-border pb-2 text-[1.5rem] font-semibold leading-tight">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => <h3 className="mb-2 mt-5 text-[1.25rem] font-semibold leading-tight">{children}</h3>,
                  }}
                >
                  {resumeMarkdown}
                </ReactMarkdown>
              </div>
            </div>
          </section>

          {/* RIGHT SIDEBAR */}

          <aside className="space-y-4">

            <div className="bg-background p-4">
              <h3 className="mb-3 font-semibold">About</h3>

              <div className="space-y-3">
                <p>
                  No one likes to read a long resume, but its difficult to summarize a career in a 
                  few bullet points. So I build this site to provide additional context about my work 
                  history, projects, and skills. You can also ask an AI assistant questions about my experience.
                </p>
                <p>
                  I also took this opportunity to build this site using tools I have not had the chance to work 
                  with professionally, including Next.js, Tailwind, TypeScript, LangChain, and OpenAI.
                </p>
              </div>
            </div>

            <div className="bg-background p-4">
              <h3 className="mb-3 font-semibold">Skills</h3>

              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  "C#",
                  "Python",
                  "JavaScript",
                  "React",
                  "Next.js",
                  "TypeScript",
                  "LangChain",
                  "OpenAI",
                  "RAG",
                  "Tailwind",
                ].map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full bg-[#1f6feb22] px-3 py-1 text-xs font-medium text-[#58a6ff]"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-background p-4">
              <ResumeChat />
            </div>

          </aside>
        </div>
      </main>
    </div>
  );
}