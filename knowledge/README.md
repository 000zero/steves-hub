# Resume RAG — starter

A from-scratch retrieval-augmented generation setup for a resume chatbot.
No agent framework, no hosted vector database — just markdown content,
pre-computed embeddings, and cosine similarity search at query time.

## 1. Install dependencies

```bash
npm install openai ai @ai-sdk/openai gray-matter langchain
npm install -D tsx
```

## 2. Set your API key

Add to `.env.local` (and to a Kubernetes Secret for deployment — never
commit this file):

```
OPENAI_API_KEY=sk-...
```

## 3. Fill in the missing project details

Every file in `content/projects/` has `[MISSING: ...]` placeholders.
The more specific you make these, the better the chatbot's answers will
be — vague bullet points make vague answers. Prioritize:

- **Problem it solves** — what was broken/missing before this existed
- **Scale or impact** — numbers, even rough ones, beat adjectives
- **Your specific role** — solo vs. team, your exact contribution
- **Links** — live demos or GitHub repos are the strongest signal you can
  give a visitor asking "can I see this?"

## 4. Generate embeddings

Run this any time your markdown content changes:

```bash
npx tsx scripts/generate-embeddings.ts
```

This writes `data/embeddings.json`. Commit this file, or generate it
during your Docker build (add the command as a `RUN` step in the builder
stage, before `npm run build`, so it's baked into the image).

## 5. Wire up the chat UI

This starter only includes the API route (`app/api/chat/route.ts`). On
the frontend, the Vercel AI SDK's `useChat` hook from `ai/react` pairs
directly with `toDataStreamResponse()` on the server — it handles
streaming, message state, and loading states for you:

```tsx
"use client";
import { useChat } from "ai/react";

export default function ResumeChat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
  });

  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}><strong>{m.role}:</strong> {m.content}</div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} placeholder="Ask about my experience..." />
      </form>
    </div>
  );
}
```

## 6. Deploying with your existing Docker/k8s setup

- Add `npx tsx scripts/generate-embeddings.ts` as a `RUN` step in your
  Dockerfile's builder stage (needs `OPENAI_API_KEY` available at build
  time — pass it as a Docker build arg, or just commit `data/embeddings.json`
  and skip regenerating it in CI).
- Add `OPENAI_API_KEY` to your Deployment via a Kubernetes Secret:
  ```bash
  kubectl create secret generic openai-secret --from-literal=OPENAI_API_KEY=sk-...
  ```
  then reference it in `k8s/deployment.yaml` under `env`:
  ```yaml
  env:
    - name: OPENAI_API_KEY
      valueFrom:
        secretKeyRef:
          name: openai-secret
          key: OPENAI_API_KEY
  ```
- No new Service, no new container, no persistent volume needed — this
  all runs inside your existing Next.js Pod.
