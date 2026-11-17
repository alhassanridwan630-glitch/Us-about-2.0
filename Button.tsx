"use client";
import Link from "next/link";
import type { ReactNode } from "react";

const base = "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-semibold tracking-wide transition duration-300 active:scale-[.97]";
const variants = {
  primary: "bg-gradient-to-r from-blush to-rose text-midnight shadow-glow hover:shadow-[0_0_56px_-6px_rgba(232,93,145,.8)] hover:-translate-y-0.5",
  ghost: "border border-lavender/40 text-cream hover:border-blush hover:bg-cream/5",
};

export function Button({ href, variant = "primary", children }: { href: string; variant?: keyof typeof variants; children: ReactNode }) {
  const cls = `${base} ${variants[variant]}`;
  if (href.startsWith("/#"))
    return <a href={href} className={cls} onClick={(e) => { if (location.pathname === "/") { e.preventDefault(); document.getElementById(href.slice(2))?.scrollIntoView({ behavior: "smooth" }); } }}>{children}</a>;
  return <Link href={href} className={cls}>{children}</Link>;
}
