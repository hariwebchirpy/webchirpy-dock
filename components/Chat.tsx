"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: { title: string }[];
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/ask", {
      method: "POST",
      body: JSON.stringify({ query: input }),
    });

    const data = await res.json();

    const botMessage: Message = {
      role: "assistant",
      content: data.answer,
      sources: data.sources || [],
    };

    setMessages((prev) => [...prev, botMessage]);
    setLoading(false);
  };

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 p-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-3 flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-3 py-2 ${
                msg.role === "user" ? "bg-primary text-white" : "bg-muted"
              }`}
            >
              <div>{msg.content}</div>

              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-2 text-xs opacity-70">
                  Sources:{" "}
                  {msg.sources.map((s, idx) => (
                    <span key={idx}>{s.title}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </ScrollArea>

      <div className="flex gap-2 border-t p-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about project..."
        />
        <Button onClick={handleSend} disabled={loading}>
          {loading ? "..." : "Send"}
        </Button>
      </div>
    </div>
  );
}
