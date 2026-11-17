"use client";
import { motion, useReducedMotion } from "framer-motion";

// Fixed positions (no Math.random) so server and client render identically.
const items = [
  { x: "8%", d: 0, s: 14 }, { x: "22%", d: 3, s: 10 }, { x: "41%", d: 6, s: 12 },
  { x: "63%", d: 2, s: 9 }, { x: "78%", d: 5, s: 15 }, { x: "92%", d: 8, s: 11 },
];

export function FloatingHearts() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((h, i) => (
        <motion.svg key={i} viewBox="0 0 100 90" width={h.s} height={h.s}
          className="absolute bottom-0 fill-rose/40" style={{ left: h.x }}
          initial={{ y: 0, opacity: 0 }} animate={{ y: -700, opacity: [0, .8, 0] }}
          transition={{ duration: 14, delay: h.d, repeat: Infinity, ease: "easeOut" }}>
          <path d="M50 85C10 55 0 30 15 15 28 3 45 10 50 25 55 10 72 3 85 15 100 30 90 55 50 85Z" />
        </motion.svg>
      ))}
    </div>
  );
}
