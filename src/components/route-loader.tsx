"use client";

import { motion, useReducedMotion } from "framer-motion";

const codeLines = [
  "const product = ship({",
  "  speed: 'fast',",
  "  judgment: 'human',",
  "});",
];

export function RouteLoader({ active }: { active: boolean }) {
  const shouldReduceMotion = useReducedMotion();

  if (!active) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[80] grid place-items-center bg-[var(--paper)]/88 px-5 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
      role="status"
      aria-label="페이지 전환 중"
    >
      <div className="w-full max-w-[360px]">
        <motion.div
          className="rounded-t-[14px] border border-[var(--ink)] bg-[var(--ink)] p-4 shadow-[0_24px_70px_rgba(20,32,28,0.18)]"
          initial={shouldReduceMotion ? false : { y: 10, scale: 0.98 }}
          animate={{ y: 0, scale: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.34, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-3 flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#be123c]" />
            <span className="size-2 rounded-full bg-[#d9a300]" />
            <span className="size-2 rounded-full bg-[#65a30d]" />
            <span className="ml-auto font-code text-[9px] uppercase text-[#a8b3af]">
              portfolio.boot
            </span>
          </div>
          <pre className="m-0 min-h-[112px] overflow-hidden font-code text-[12px] leading-7 text-[#a7f3d0]">
            {codeLines.map((line, index) => (
              <motion.span
                key={line}
                className="block"
                initial={shouldReduceMotion ? false : { opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: shouldReduceMotion ? 0 : index * 0.11,
                  duration: shouldReduceMotion ? 0 : 0.22,
                }}
              >
                {line}
              </motion.span>
            ))}
            <motion.span
              className="mt-1 inline-block h-4 w-2 bg-[#a7f3d0]"
              animate={shouldReduceMotion ? undefined : { opacity: [1, 0.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          </pre>
        </motion.div>
        <div className="mx-auto h-3 w-[62%] rounded-b-[18px] border-x border-b border-[var(--line-strong)] bg-[var(--paper-alt)]" />
        <div className="mt-4 text-center font-code text-[10px] uppercase tracking-[0.08em] text-[var(--graphite)]">
          Loading case notes
        </div>
      </div>
    </motion.div>
  );
}
