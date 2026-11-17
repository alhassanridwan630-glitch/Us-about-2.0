import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ContactForm } from "@/components/ContactForm";
import { SUPPORT_EMAIL } from "@/lib/site";
export const metadata: Metadata = { title: "Contact support · US&ABOUT", description: "Questions or problems? Get in touch with US&ABOUT support." };
export default function Page() {
  return (<><SiteHeader /><main className="mx-auto max-w-xl px-4 pb-16 pt-8">
    <h1 className="font-display text-4xl">Contact support</h1>
    <p className="mb-6 mt-2 text-lavender">Questions, problems or ideas? Email us at <a className="underline" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> or use the form below.</p>
    <ContactForm email={SUPPORT_EMAIL} /></main><SiteFooter /></>);
}
