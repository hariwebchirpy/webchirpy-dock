"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: { title: string }[];
  reasoning_details?: any;
};

export default function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages.map(({ role, content, reasoning_details }) => ({ role, content, reasoning_details })) }),
      });

      const data = await res.json();

      const botMessage: Message = {
        role: "assistant",
        content: data.answer || "Sorry, I couldn't process that.",
        reasoning_details: data.reasoning_details,
        sources: data.sources || [],
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 flex h-[500px] w-[380px] flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/50 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/10 border border-blue-500/20">
                <MessageCircle className="h-4 w-4 text-blue-500" />
              </div>
              <span className="text-sm font-bold text-white">Project Assistant</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-zinc-400 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-2 rounded-full bg-zinc-900 p-3">
                  <MessageCircle className="h-6 w-6 text-zinc-500" />
                </div>
                <p className="text-sm text-zinc-500">
                  Ask me anything about the engineering playbooks!
                </p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "mb-4 flex",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed",
                      msg.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-zinc-900 text-zinc-200 border border-zinc-800"
                    )}
                  >
                    <div>{msg.content}</div>

                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 border-t border-white/10 pt-2 text-[10px] opacity-60">
                        <span className="font-bold uppercase tracking-wider">Sources:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {msg.sources.map((s, idx) => (
                            <span
                              key={idx}
                              className="rounded bg-black/20 px-1.5 py-0.5"
                            >
                              {s.title}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </ScrollArea>

          {/* Input */}
          <div className="border-t border-zinc-800 bg-zinc-950 p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about project..."
                className="h-10 border-zinc-800 bg-zinc-900 text-sm placeholder:text-zinc-500 focus-visible:ring-blue-500"
                disabled={loading}
              />
              <Button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                size="icon"
                className="h-10 w-10 shrink-0 bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className={cn(
          "h-14 w-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-105",
          isOpen
            ? "bg-zinc-800 text-white hover:bg-zinc-700"
            : "bg-blue-600 text-white hover:bg-blue-700"
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
}
