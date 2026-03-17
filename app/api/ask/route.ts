import { NextResponse } from 'next/server';
import { getAllContext } from '@/lib/docs';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const projectContext = await getAllContext();

    const systemMessage = {
      role: "system",
      content: `You are the WebChirpy Internal Assistant. Use the context below to give direct, concrete answers about the projects, their setup, architecture, documentation files, and recent changes.
Ground your response in project-specific details from the provided context.

Rules:
- Never give vague answers; include concrete details from the docs and change history.
- Explicitly mention relevant documentation file paths (for example: content/projects/<project>/<doc>.md) so the user knows where to read more.
- If setup is discussed, call out existing setup docs (frontend, backend, env, deployment, troubleshooting, etc.) when present.
- If a question is broad, summarize key points and then provide a "Where to look" list of the most relevant files.
- Do NOT tell users to check GitHub; use the provided context.
- If information is not available in the context, say what is missing.

${projectContext}`
    };

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "openrouter/free",
        "messages": [systemMessage, ...messages],
        "reasoning": { "enabled": true }
      })
    });

    const result = await response.json();
    const assistantMessage = result.choices[0].message;

    return NextResponse.json({
      answer: assistantMessage.content,
      reasoning_details: assistantMessage.reasoning_details,
      sources: []
    });
  } catch (error) {
    console.error("OpenRouter API Error:", error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
