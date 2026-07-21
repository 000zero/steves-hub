// scripts/generate-embeddings.ts
//
// Run this whenever your markdown content changes:
//   npx tsx scripts/generate-embeddings.ts
//
// It reads every .md file under content/, splits it into chunks,
// embeds each chunk, and writes the result to data/embeddings.json.
// That JSON file gets committed (or generated at Docker build time) —
// no vector database needed at this content volume.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenAI } from "@google/genai";
import { config } from "dotenv";

config({ path: ".env.local" });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const CONTENT_DIR = path.join(process.cwd(), "knowledge");
const OUTPUT_FILE = path.join(process.cwd(), "data", "embeddings.json");

interface Chunk {
  id: string;
  text: string;
  embedding: number[];
  metadata: {
    source: string;
    title: string;
    type: string;
    [key: string]: unknown;
  };
}

function walkMarkdownFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(walkMarkdownFiles(fullPath));
    } else if (entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }
  return files;
}

const EMBEDDING_MODEL = "gemini-embedding-001";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function embedOne(text: string): Promise<number[]> {
  // Retry with backoff if we hit the free tier's rate limit (429)
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const response = await ai.models.embedContent({
        model: EMBEDDING_MODEL,
        contents: text,
      });
      return response.embeddings![0].values!;
    } catch (err: any) {
      if (err?.status === 429 && attempt < 4) {
        const waitMs = 5000 * (attempt + 1);
        console.log(`Rate limited, waiting ${waitMs}ms before retry...`);
        await sleep(waitMs);
        continue;
      }
      throw err;
    }
  }
  throw new Error("Failed to embed after retries");
}

async function main() {
  const files = walkMarkdownFiles(CONTENT_DIR);
  console.log(`Found ${files.length} markdown files`);

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 800,
    chunkOverlap: 100,
    // Prefer splitting on markdown structure before falling back
    // to plain character boundaries.
    separators: ["\n## ", "\n### ", "\n\n", "\n", " ", ""],
  });

  const allChunks: Omit<Chunk, "embedding">[] = [];

  for (const filePath of files) {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data: frontmatter, content } = matter(raw);
    const relativeSource = path.relative(CONTENT_DIR, filePath);

    const pieces = await splitter.splitText(content);

    pieces.forEach((text, i) => {
      // Skip near-empty chunks (e.g. a lone header with no body yet)
      if (text.trim().length < 20) return;

      allChunks.push({
        id: `${relativeSource}::${i}`,
        text: text.trim(),
        metadata: {
          source: relativeSource,
          title: (frontmatter.title as string) ?? relativeSource,
          type: (frontmatter.type as string) ?? "unknown",
          ...frontmatter,
        },
      });
    });
  }

  console.log(`Split into ${allChunks.length} chunks. Embedding (this takes a bit on the free tier)...`);

  // Embed one at a time with a short pause between calls to stay
  // comfortably under Gemini's free-tier requests-per-minute limit.
  const DELAY_MS = 2000;
  const chunksWithEmbeddings: Chunk[] = [];

  for (let i = 0; i < allChunks.length; i++) {
    const chunk = allChunks[i];
    const embedding = await embedOne(chunk.text);
    chunksWithEmbeddings.push({ ...chunk, embedding });
    console.log(`Embedded ${i + 1}/${allChunks.length}`);
    if (i < allChunks.length - 1) await sleep(DELAY_MS);
  }

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(chunksWithEmbeddings, null, 2));

  console.log(`Wrote ${chunksWithEmbeddings.length} chunks to ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
