// app/api/chat/route.ts
//
// The whole "chain": embed the question -> retrieve top chunks ->
// build a prompt -> stream the answer back. No agent, no tool-calling
// decision loop — just a straight pipeline.

import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { retrieveRelevantChunks, formatContext } from "@/lib/retrieval";

const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });

export const runtime = "nodejs"; // needs fs access to read embeddings.json

const SYSTEM_PROMPT = `You are an assistant answering questions about
Steven Garcia's professional experience, based only on the resume and
project context provided below. Be specific and cite which role or
project the information comes from when relevant. 

If the answer isn't in the provided context, say so honestly rather than
guessing or inventing details. Don't make up metrics, dates, or project
outcomes that aren't stated in the context.

Don't just print out the context verbatim — synthesize the information 
into a clear, concise answer.

Don't include the raw text formatting from the source .md files, instead 
format the answer in natural language.

For example, don't print the "* **" that is in the sample text below

  * **Compute & Infrastructure (AWS EC2):**
  * **Windows Server Management:** Built and ...

`;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const lastMessage = messages[messages.length - 1];
  const question =
    lastMessage?.parts?.find((p) => p.type === "text")?.text ?? "";

  if (!question.trim()) {
    return new Response("Missing question", { status: 400 });
  }

  const relevantChunks = await retrieveRelevantChunks(question, 5);
  const context = formatContext(relevantChunks);

  // Convert UI messages to model messages, then swap the last user
  // message for a version with retrieved context stitched in.
  const modelMessages = await convertToModelMessages(messages);
  modelMessages[modelMessages.length - 1] = {
    role: "user",
    content: `Context:\n${context}\n\nQuestion: ${question}`,
  };

  const result = streamText({
    model: google("gemini-flash-latest"),
    system: SYSTEM_PROMPT,
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}