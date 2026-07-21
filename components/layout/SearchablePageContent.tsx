"use client";

import { cloneElement, Fragment, isValidElement, useEffect, useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface WorkHistoryItem {
  name: string;
  dateRange: string;
  role: string;
  anchor: string;
}

interface SearchablePageContentProps {
  resumeMarkdown: string;
  workHistory: WorkHistoryItem[];
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractTextContent(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(extractTextContent).join("");
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return extractTextContent(node.props.children);
  }

  return "";
}

function renderHighlightedText(node: ReactNode, query: string, onMatchClick: (index: number) => void): ReactNode {
  const trimmed = query.trim();
  if (!trimmed) return node;

  if (typeof node === "string") {
    const regex = new RegExp(`(${escapeRegExp(trimmed)})`, "gi");
    const parts = node.split(regex);
    let matchIndex = 0;

    return parts.map((part, index) => {
      if (!part) return null;
      const isMatch = part.toLowerCase() === trimmed.toLowerCase();
      if (!isMatch) {
        return <span key={`${part}-${index}`}>{part}</span>;
      }

      const currentIndex = matchIndex++;
      return (
        <mark
          key={`${part}-${index}`}
          className="cursor-pointer rounded-sm bg-yellow-300/80 px-0 text-foreground"
          data-search-highlight="true"
          data-search-match-index={currentIndex}
          onClick={() => onMatchClick(currentIndex)}
        >
          {part}
        </mark>
      );
    });
  }

  if (Array.isArray(node)) {
    return (
      <>
        {node.map((child, index) => (
          <Fragment key={`${index}-${typeof child}`}>{renderHighlightedText(child, query, onMatchClick)}</Fragment>
        ))}
      </>
    );
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    const children = renderHighlightedText(node.props.children, query, onMatchClick);
    return cloneElement(node, { children });
  }

  return node;
}

function getCompanyAnchor(children: ReactNode, companies: WorkHistoryItem[]) {
  const text = extractTextContent(children).trim();
  const match = companies.find((company) => text.includes(company.name));
  return match?.anchor;
}

export default function SearchablePageContent({ resumeMarkdown, workHistory }: SearchablePageContentProps) {
  const [query, setQuery] = useState("");

  const handleMatchClick = (index: number) => {
    const marks = Array.from(document.querySelectorAll('mark[data-search-highlight="true"]')) as HTMLElement[];
    const target = marks[index];
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  useEffect(() => {
    const handleQueryChange = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      setQuery(customEvent.detail ?? "");
    };

    window.addEventListener("search:query", handleQueryChange as EventListener);
    return () => {
      window.removeEventListener("search:query", handleQueryChange as EventListener);
    };
  }, []);

  return (
    <>
      <div className="overflow-hidden rounded-md border border-border">
        <div className="flex items-center justify-between border-b border-border bg-header px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-5 w-5 items-center justify-center overflow-hidden rounded-full border border-border bg-white shadow-sm">
              <img src="/icon.png" alt="sgarcia" className="h-5 w-5 object-cover" />
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-foreground font-semibold">{renderHighlightedText("sgarcia", query, handleMatchClick)}</span>
              <span className="text-muted">{renderHighlightedText("Work History", query, handleMatchClick)}</span>
            </div>
          </div>
          <span className="flex items-center gap-1 whitespace-nowrap text-xs font-semibold text-muted">
            <svg className="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.06.56A8.05 8.05 0 0 0 1.24 4.2V1.55H0V5a1.16 1.16 0 0 0 1.15 1.14h3.44V4.9H2.27a6.79 6.79 0 0 1 5.79-3.1 6.48 6.48 0 0 1 6.7 6.2 6.48 6.48 0 0 1-6.7 6.2A6.48 6.48 0 0 1 1.36 8H.12a7.71 7.71 0 0 0 7.94 7.44A7.71 7.71 0 0 0 16 8 7.71 7.71 0 0 0 8.06.56z" />
              <path d="M7.44 4.28v4.34h3.6V7.38H8.68v-3.1H7.44z" />
            </svg>
            <span>5 commits</span>
          </span>
        </div>

        <div className="divide-y divide-border">
          {workHistory.map((company) => (
            <a
              key={company.name}
              href={`#${company.anchor}`}
              className="flex flex-col gap-1 px-4 py-3 text-sm hover:bg-header sm:grid sm:grid-cols-3 sm:items-center sm:gap-0"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-5 w-5 items-center justify-center text-foreground">
                  <svg viewBox="0 0 512 512" className="h-5 w-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M409.516,0H150.385c-5.633,0-10.199,4.566-10.199,10.199v219.283h-37.701c-5.633,0-10.199,4.566-10.199,10.199v262.12c0,5.633,4.566,10.199,10.199,10.199h307.032c5.633,0,10.199-4.566,10.199-10.199V10.199C419.715,4.566,415.149,0,409.516,0z M288.18,491.602H112.682V249.88H288.18V491.602z M399.317,491.602h-90.737v-251.92c0-5.633-4.566-10.199-10.199-10.199H160.584V20.398h238.733V491.602z" /><path d="M224.792,47.936h-35.106c-5.633,0-10.199,4.566-10.199,10.199v49.148c0,5.633,4.566,10.199,10.199,10.199h35.106c5.633,0,10.199-4.566,10.199-10.199V58.135C234.991,52.502,230.425,47.936,224.792,47.936z M214.593,97.084h-14.707v-28.75h14.707V97.084z" /><path d="M297.435,47.936h-35.106c-5.633,0-10.199,4.566-10.199,10.199v49.148c0,5.633,4.566,10.199,10.199,10.199h35.106c5.633,0,10.199-4.566,10.199-10.199V58.135C307.634,52.502,303.068,47.936,297.435,47.936z M287.236,97.084h-14.707v-28.75h14.707V97.084z" /><path d="M370.213,47.936h-35.106c-5.633,0-10.199,4.566-10.199,10.199v49.148c0,5.633,4.566,10.199,10.199,10.199h35.106c5.633,0,10.199-4.566,10.199-10.199V58.135C380.412,52.502,375.846,47.936,370.213,47.936z M360.014,97.084h-14.707v-28.75h14.707V97.084z" /><path d="M224.792,139.729h-35.106c-5.633,0-10.199,4.566-10.199,10.199v49.148c0,5.633,4.566,10.199,10.199,10.199h35.106c5.633,0,10.199-4.566,10.199-10.199v-49.148C234.991,144.295,230.425,139.729,224.792,139.729z M214.593,188.877h-14.707v-28.75h14.707V188.877z" /><path d="M297.435,139.729h-35.106c-5.633,0-10.199,4.566-10.199,10.199v49.148c0,5.633,4.566,10.199,10.199,10.199h35.106c5.633,0,10.199-4.566,10.199-10.199v-49.148C307.634,144.295,303.068,139.729,297.435,139.729z M287.236,188.877h-14.707v-28.75h14.707V188.877z" /><path d="M370.213,139.729h-35.106c-5.633,0-10.199,4.566-10.199,10.199v49.148c0,5.633,4.566,10.199,10.199,10.199h35.106c5.633,0,10.199-4.566,10.199-10.199v-49.148C380.412,144.295,375.846,139.729,370.213,139.729z M360.014,188.877h-14.707v-28.75h14.707V188.877z" /><path d="M177.901,263.139h-42.416c-5.633,0-10.199,4.566-10.199,10.199v33.855c0,5.633,4.566,10.199,10.199,10.199h42.416c5.633,0,10.199-4.566,10.199-10.199v-33.855C188.1,267.706,183.534,263.139,177.901,263.139z M167.702,296.995h-22.018v-13.457h22.018V296.995z" /><path d="M265.671,263.139h-42.416c-5.633,0-10.199,4.566-10.199,10.199v33.855c0,5.633,4.566,10.199,10.199,10.199h42.416c5.633,0,10.199-4.566,10.199-10.199v-33.855C275.871,267.706,271.304,263.139,265.671,263.139z M255.472,296.995h-22.018v-13.457h22.018V296.995z" /><path d="M370.213,231.522h-35.106c-5.633,0-10.199,4.566-10.199,10.199v49.148c0,5.633,4.566,10.199,10.199,10.199h35.106c5.633,0,10.199-4.566,10.199-10.199v-49.148C380.412,236.088,375.846,231.522,370.213,231.522z M360.014,280.67h-14.707V251.92h14.707V280.67z" /><path d="M177.901,339.633h-42.416c-5.633,0-10.199,4.566-10.199,10.199v33.855c0,5.633,4.566,10.199,10.199,10.199h42.416c5.633,0,10.199-4.566,10.199-10.199v-33.855C188.1,344.2,183.534,339.633,177.901,339.633z M167.702,373.489h-22.018v-13.457h22.018V373.489z" /><path d="M265.671,339.633h-42.416c-5.633,0-10.199,4.566-10.199,10.199v33.855c0,5.633,4.566,10.199,10.199,10.199h42.416c5.633,0,10.199-4.566,10.199-10.199v-33.855C275.871,344.2,271.304,339.633,265.671,339.633z M255.472,373.489h-22.018v-13.457h22.018V373.489z" /><path d="M177.901,418.167h-42.416c-5.633,0-10.199,4.566-10.199,10.199v33.855c0,5.633,4.566,10.199,10.199,10.199h42.416c5.633,0,10.199-4.566,10.199-10.199v-33.855C188.1,422.734,183.534,418.167,177.901,418.167z M167.702,452.023h-22.018v-13.457h22.018V452.023z" /><path d="M265.671,418.167h-42.416c-5.633,0-10.199,4.566-10.199,10.199v33.855c0,5.633,4.566,10.199,10.199,10.199h42.416c5.633,0,10.199-4.566,10.199-10.199v-33.855C275.871,422.734,271.304,418.167,265.671,418.167z M255.472,452.023h-22.018v-13.457h22.018V452.023z" /><path d="M370.213,323.315h-35.106c-5.633,0-10.199,4.566-10.199,10.199v49.148c0,5.633,4.566,10.199,10.199,10.199h35.106c5.633,0,10.199-4.566,10.199-10.199v-49.148C380.412,327.881,375.846,323.315,370.213,323.315z M360.014,372.463h-14.707v-28.75h14.707V372.463z" /><path d="M370.722,434.566c-5.633,0-10.199,4.566-10.199,10.199v25.418c0,5.633,4.566,10.199,10.199,10.199c5.633,0,10.199-4.566,10.199-10.199v-25.418C380.921,439.132,376.355,434.566,370.722,434.566z" /><path d="M370.722,403.888c-5.633,0-10.199,4.566-10.199,10.199v3.506c0,5.633,4.566,10.199,10.199,10.199c5.633,0,10.199-4.566,10.199-10.199v-3.506C380.921,408.455,376.355,403.888,370.722,403.888z" /></svg>
                </div>
                <div className="text-foreground font-medium">{renderHighlightedText(company.name, query, handleMatchClick)}</div>
              </div>

              <div className="text-muted">{renderHighlightedText(company.role, query, handleMatchClick)}</div>

              <div className="text-muted sm:text-right">{renderHighlightedText(company.dateRange, query, handleMatchClick)}</div>
            </a>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-border bg-background">
        <div className="border-b border-border bg-header px-6 py-4 font-semibold">RESUME.md</div>

        <div className="prose prose-sm max-w-none space-y-3 p-8 text-sm leading-7 dark:prose-invert">
          <ReactMarkdown
            skipHtml
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="mb-4 mt-0 border-b border-border pb-2 text-[2rem] font-semibold leading-tight">
                  {renderHighlightedText(children, query, handleMatchClick)}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="mb-3 mt-6 border-b border-border pb-2 text-[1.5rem] font-semibold leading-tight">
                  {renderHighlightedText(children, query, handleMatchClick)}
                </h2>
              ),
              h3: ({ children }) => {
                const anchor = getCompanyAnchor(children, workHistory);
                return (
                  <h3
                    id={anchor}
                    className="mb-2 mt-5 text-[1.25rem] font-semibold leading-tight"
                  >
                    {renderHighlightedText(children, query, handleMatchClick)}
                  </h3>
                );
              },
              p: ({ children }) => <p className="mb-4">{renderHighlightedText(children, query, handleMatchClick)}</p>,
              ul: ({ children }) => <ul className="mb-4 ml-6 list-disc space-y-2">{renderHighlightedText(children, query, handleMatchClick)}</ul>,
              li: ({ children }) => <li className="leading-7">{renderHighlightedText(children, query, handleMatchClick)}</li>,
              strong: ({ children }) => <strong className="font-semibold">{renderHighlightedText(children, query, handleMatchClick)}</strong>,
              em: ({ children }) => <em className="italic">{renderHighlightedText(children, query, handleMatchClick)}</em>,
              a: ({ children, href }) => (
                <a href={href} className="text-blue-600 underline">
                  {renderHighlightedText(children, query, handleMatchClick)}
                </a>
              ),
            }}
          >
            {resumeMarkdown}
          </ReactMarkdown>
        </div>
      </div>
    </>
  );
}
