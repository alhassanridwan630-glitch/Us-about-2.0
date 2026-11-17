"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";

const links = [["Home", "/"], ["How it works", "/#how-it-works"], ["Examples", "/#examples"], ["My invitations", "/my"], ["Contact", "/contact"]] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const go = (e: React.MouseEvent, href: string) => {
    setOpen(false);
    if (location.pathname !== "/") return;
    if (href === "/") { e.preventDefault(); scrollTo({ top: 0, behavior: "smooth" }); }
    else if (href.startsWith("/#")) { e.preventDefault(); document.getElementById(href.slice(2))?.scrollIntoView({ behavior: "smooth" }); }
  };
  const cta = "inline-flex min-h-11 items-center rounded-full bg-gradient-to-r from-blush to-rose px-6 text-sm font-semibold text-midnight";
  return (
    <header className="sticky top-0 z-40 border-b border-cream/10 bg-midnight/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <a href="/" onClick={(e) => go(e, "/")} aria-label="US&ABOUT home"><Logo className="h-9 w-auto" /></a>
        <nav aria-label="Main" className="hidden items-center gap-7 text-sm text-lavender md:flex">
          {links.map(([l, h]) => <a key={l} href={h} onClick={(e) => go(e, h)} className="transition hover:text-cream">{l}</a>)}
          <Link href="/create" className={cta}>Create invitation</Link>
        </nav>
        <button className="grid h-11 w-11 place-items-center rounded-full border border-lavender/40 md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}</button>
      </div>
      {open && <nav aria-label="Mobile" className="flex flex-col gap-1 border-t border-cream/10 px-5 pb-5 pt-3 md:hidden">
        {links.map(([l, h]) => <a key={l} href={h} onClick={(e) => go(e, h)} className="flex min-h-12 items-center text-lg text-cream">{l}</a>)}
        <Link href="/create" onClick={() => setOpen(false)} className={`${cta} mt-2 justify-center`}>Create invitation</Link></nav>}
    </header>
  );
}
