import Link from "next/link";
import { Logo } from "./Logo";
import { SUPPORT_EMAIL } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="relative z-10 mx-auto max-w-6xl border-t border-cream/10 px-5 py-10">
      <Logo tagline className="h-20 w-auto" />
      <nav aria-label="Footer" className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-lavender">
        <Link href="/create">Create invitation</Link><Link href="/#how-it-works">How it works</Link><Link href="/#faq">FAQ</Link>
        <Link href="/my">My invitations</Link><Link href="/contact">Contact support</Link><Link href="/privacy">Privacy</Link></nav>
      <p className="mt-4 text-sm text-lavender">Need help? <a className="underline" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></p>
      <p className="mt-4 text-xs text-lavender/70">© 2026 US&amp;ABOUT. Free, always.</p>
    </footer>
  );
}
