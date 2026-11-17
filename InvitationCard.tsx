"use client";
import Link from "next/link";
import { motion } from "framer-motion";

/** Hero visual. Tapping it opens the live demo of the recipient experience. */
export function InvitationCard() {
  return (
    <Link href="/demo?k=romantic" aria-label="Try a demo invitation" className="block">
      <motion.div initial={{ opacity: 0, y: 24, rotate: -3 }} animate={{ opacity: 1, y: 0, rotate: -3 }}
        whileHover={{ rotate: 0, scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 90, damping: 14 }}
        className="relative mx-auto w-full max-w-sm rounded-[2rem] border border-blush/15 bg-gradient-to-b from-plum to-midnight p-8 shadow-glow">
        <svg viewBox="0 0 100 90" className="mx-auto w-full" aria-hidden>
          <path d="M50 85C10 55 0 30 15 15 28 3 45 10 50 25 55 10 72 3 85 15 100 30 90 55 50 85Z" fill="none" stroke="#F5B8CE" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="0.1 3.2" />
        </svg>
        <div className="-mt-40 pb-16 text-center sm:-mt-44">
          <p className="font-display text-2xl text-cream">I made something for you.</p>
          <span className="mt-4 inline-block rounded-full bg-cream px-6 py-2 text-xs font-semibold tracking-[.2em] text-midnight">ENTER</span>
        </div>
        <p className="text-center font-script text-3xl text-blush">for you, from me</p>
      </motion.div>
      <p className="mt-4 text-center text-sm text-lavender">Tap the card to try the demo →</p>
    </Link>
  );
}
