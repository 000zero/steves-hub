import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import TopNav from "./TopNav";
import RepoHeader from "./RepoHeader";
import RepoTabs from "./RepoTabs";
import ResumeChat from "../ResumeChat";
import SearchablePageContent from "./SearchablePageContent";
import BackToTopButton from "./BackToTopButton";

async function getResumeMarkdown() {
  const filePath = path.join(process.cwd(), "knowledge", "resume.md");
  const source = await fs.readFile(filePath, "utf8");
  const { content } = matter(source);

  return content.replace(/^(\s*)\*\s+/gm, "$1- ");
}

export default async function MyHubLayout() {
  const resumeMarkdown = await getResumeMarkdown();
  //console.log("resumeMarkdown", resumeMarkdown);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav />
      <RepoHeader />
      <RepoTabs />

      <main className="mx-auto max-w-screen-2xl px-4 py-4 sm:px-6 sm:py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* main content */}
          <section className="space-y-6">

            <SearchablePageContent
              resumeMarkdown={resumeMarkdown}
              workHistory={[
                { name: "Hooray Agency", dateRange: "Jul 2023 - Jun 2026", role: "FullStack/DevOps Developer", anchor: "hooray-agency" },
                { name: "Pacific Dental Services", dateRange: "Nov 2016 - Jun 2023", role: "Senior Software Engineer", anchor: "pacific-dental-services" },
                { name: "CyberCoders", dateRange: "Apr 2015 - Nov 2016", role: "Senior Software Engineer", anchor: "cybercoders" },
                { name: "Quality Systems Inc.", dateRange: "Apr 2009 - Apr 2015", role: "EDI Software Lead Developer", anchor: "quality-systems-inc" },
                { name: "IntelliStick Inc.", dateRange: "Jun 2007 - Feb 2009", role: "Software Engineer", anchor: "intellistick-inc" },
              ]}
            />
          </section>

          {/* RIGHT SIDEBAR */}

          <aside className="space-y-4">

            <div className="bg-background px-4 pb-4">
              <ResumeChat />
            </div>

            <div className="bg-background p-4">
              <h3 className="mb-3 font-semibold">About</h3>

              <div className="space-y-3">
                <p>
                  Software Engineer capable of Fullstack and DevOps development who enjoys implementing solutions
                  from conception to deployment. If you need it, I will build it. If I don't know how to build it,
                  I will learn.
                </p>
              </div>
            </div>

            <div className="bg-background p-4">
              <h3 className="mb-3 font-semibold">Skills</h3>

              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  "C#",
                  "C",
                  "C++",
                  "Python",
                  "JavaScript",
                  "TypeScript",
                  "ES6",
                  "React",
                  "Next.js",
                  "Angularjs",
                  "MVC",
                  "ASP.NET",
                  ".NET Core",
                  "Razor Pages",
                  "Blazor",
                  "WebForms",
                  "CSS",
                  "SCSS",
                  "Tailwind",
                  "SQL",
                  "MySQL",
                  "MariaDB",
                  "RavenDB",
                  "GraphQL",
                  "LangChain",
                  "OpenAI",
                  "Gemnini ADK",
                  "RAG",
                  "MCP",
                  "AWS",
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

          </aside>
        </div>
      </main>

      <BackToTopButton />
    </div>
  );
}