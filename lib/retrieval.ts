// lib/retrieval.ts
//
// Runtime retrieval — no vector database, no agent framework.
// Loads the pre-computed embeddings.json once (cached across requests
// in the same server process) and does plain cosine similarity search.
// This is fast and simple at the scale of a resume + project docs
// (a few hundred chunks at most).

import fs from "node:fs";
import path from "node:path";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const EMBEDDING_MODEL = "gemini-embedding-001";
const EMBEDDINGS_FILE = path.join(process.cwd(), "data", "embeddings.json");

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

// Module-level cache — populated once per server instance/container,
// not once per request.
let cachedChunks: Chunk[] | null = null;

function loadChunks(): Chunk[] {
  if (cachedChunks) return cachedChunks;
  const raw = fs.readFileSync(EMBEDDINGS_FILE, "utf-8");
  cachedChunks = JSON.parse(raw) as Chunk[];
  return cachedChunks;
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function embedQuery(query: string): Promise<number[]> {
  const response = await ai.models.embedContent({
    model: EMBEDDING_MODEL,
    contents: query,
  });
  return response.embeddings![0].values!;
}

export interface RetrievedChunk {
  text: string;
  score: number;
  source: string;
  title: string;
}

export async function retrieveRelevantChunks(
  query: string,
  topK = 5
): Promise<RetrievedChunk[]> {
  const chunks = loadChunks();
  const queryEmbedding = await embedQuery(query);

  const scored = chunks.map((chunk) => ({
    text: chunk.text,
    source: chunk.metadata.source,
    title: chunk.metadata.title,
    score: cosineSimilarity(queryEmbedding, chunk.embedding),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topK);
}

export function formatContext(chunks: RetrievedChunk[]): string {
  return chunks
    .map((c) => `[Source: ${c.title}]\n${c.text}`)
    .join("\n\n---\n\n");
}
