"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Bot, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  answerPortfolioQuestion,
  type PortfolioChatResponse,
} from "@/lib/portfolio-knowledge";

type UiMessage = {
  role: "user" | "assistant";
  content: string;
  sources?: PortfolioChatResponse["sources"];
  suggestions?: string[];
};

const starterSuggestions = [
  "AI는 어디에 활용했나요?",
  "DeployPilot은 어떤 프로젝트인가요?",
  "짧은 기간에 만든 프로젝트가 있나요?",
];

const initialMessage: UiMessage = {
  role: "assistant",
  content:
    "이 포트폴리오에 공개된 프로젝트와 작업 방식을 바탕으로 답변드립니다.",
  suggestions: starterSuggestions,
};

export function PortfolioChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState<UiMessage[]>([initialMessage]);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    panelRef.current?.scrollTo({
      top: panelRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, pending]);

  const ask = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || pending) return;

    const nextMessages: UiMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(nextMessages);
    setInput("");
    setPending(true);

    await new Promise((resolve) => window.setTimeout(resolve, 220));

    const data = answerPortfolioQuestion(
      nextMessages.map(({ role, content }) => ({ role, content })),
    );

    setMessages((current) => [
      ...current,
      {
        role: "assistant",
        content: data.answer,
        sources: data.sources,
        suggestions: data.suggestions,
      },
    ]);
    setPending(false);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void ask(input);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[70] flex max-w-[calc(100vw-2rem)] flex-col items-end gap-3">
      <AnimatePresence>
        {open ? (
          <motion.div
            id="portfolio-chat-panel"
            key="portfolio-chat-panel"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="w-[min(380px,calc(100vw-2rem))] overflow-hidden border border-[var(--ink)] bg-white shadow-[0_24px_70px_rgba(20,32,28,0.18)]"
          >
            <div className="flex items-center gap-3 border-b border-[var(--line)] bg-[var(--paper-alt)] px-4 py-3">
              <span className="grid size-8 place-items-center bg-[var(--ink)] text-[var(--paper)]">
                <Bot aria-hidden="true" className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-code text-[10px] uppercase text-[var(--muted)]">
                  Portfolio wiki
                </div>
                <div className="truncate font-display text-[18px] text-[var(--ink)]">
                  포트폴리오에 질문하기
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-8 place-items-center border border-[var(--line)] bg-white text-[var(--ink)]"
                aria-label="챗봇 닫기"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>

            <div
              ref={panelRef}
              className="max-h-[min(520px,62vh)] overflow-y-auto px-4 py-4"
            >
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={message.role === "user" ? "text-right" : ""}
                  >
                    <div
                      className={`inline-block max-w-[92%] border px-3 py-2 text-left ${
                        message.role === "user"
                          ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                          : "border-[var(--line)] bg-[var(--paper)] text-[var(--ink)]"
                      }`}
                    >
                      <p className="korean-copy m-0 whitespace-pre-line font-display text-[15px] leading-6">
                        {message.content}
                      </p>
                    </div>

                    {message.sources?.length ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {message.sources.map((source) => (
                          <a
                            key={source.id}
                            href={source.href ?? "#/"}
                            className="border border-[var(--line)] bg-white px-2 py-1 font-code text-[9px] uppercase text-[var(--graphite)] no-underline"
                          >
                            {source.kind} - {source.title}
                          </a>
                        ))}
                      </div>
                    ) : null}

                    {message.suggestions?.length ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {message.suggestions.slice(0, 3).map((suggestion) => (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() => void ask(suggestion)}
                            className="border border-[var(--line)] bg-white px-2 py-1 text-left font-code text-[9px] text-[var(--graphite)] transition hover:border-[var(--ink)]"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}

                {pending ? (
                  <div className="inline-flex items-center gap-2 border border-[var(--line)] bg-[var(--paper)] px-3 py-2 font-code text-[10px] uppercase text-[var(--graphite)]">
                    <Sparkles
                      aria-hidden="true"
                      className="size-3 animate-pulse"
                    />
                    공개된 기록을 확인하고 있습니다
                  </div>
                ) : null}
              </div>
            </div>

            <form
              onSubmit={onSubmit}
              className="flex gap-2 border-t border-[var(--line)] bg-white p-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="프로젝트나 AI 활용 방식을 물어보세요"
                className="font-display korean-copy min-w-0 flex-1 border border-[var(--line)] bg-[var(--paper)] px-3 py-2 text-[15px] text-[var(--ink)] outline-none focus:border-[var(--ink)]"
              />
              <button
                type="submit"
                disabled={pending}
                className="grid size-10 place-items-center bg-[var(--ink)] text-[var(--paper)] disabled:opacity-60"
                aria-label="질문 보내기"
              >
                <Send aria-hidden="true" className="size-4" />
              </button>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-12 items-center gap-2 border border-[var(--ink)] bg-[var(--ink)] px-4 font-code text-[10px] uppercase text-[var(--paper)] shadow-[0_12px_30px_rgba(20,32,28,0.18)]"
        aria-expanded={open}
        aria-controls="portfolio-chat-panel"
      >
        <MessageCircle aria-hidden="true" className="size-4" />
        포트폴리오에 질문하기
      </button>
    </div>
  );
}
