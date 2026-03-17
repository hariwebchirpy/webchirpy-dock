import { NextResponse } from 'next/server';
import { getAllContext } from '@/lib/docs';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const projectContext = await getAllContext();

    const systemMessage = {
      role: "system",
      content: `You are the WebChirpy Internal Assistant. Use the context below to give direct, real answers about the projects, their documentation, and recent changes. 
Do NOT be generic. Do NOT tell users to check GitHub; use the data provided. 
If the user asks about a specific repository (like TaxSense), look for its details in the context.

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
