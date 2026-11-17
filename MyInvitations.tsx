"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { OCCASIONS } from "@/lib/invitations";
import { loadDraft, clearDraft, getMine, forgetInvitation, hasToken, type Mine, type SavedDraft } from "@/lib/local";

const btn = "inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold";
const label = (o: string) => OCCASIONS.find((x) => x.id === o)?.label ?? "Invitation";

export default function MyInvitations() {
  const [draft, setDraft] = useState<SavedDraft | null>(null);
  const [mine, setMine] = useState<Mine[]>([]);
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState("");
  useEffect(() => { setDraft(loadDraft()); setMine(getMine()); setReady(true); }, []);
  const copy = async (id: string) => { try { await navigator.clipboard.writeText(`${location.origin}/invite/${id}`); setCopied(id); setTimeout(() => setCopied(""), 1500); } catch {} };
  const dn = draft ? String((draft.d as { recipientName?: string }).recipientName || "") : "";
  return (
    <main className="mx-auto min-h-[60vh] max-w-xl px-4 pb-16 pt-8">
      <h1 className="font-display text-4xl">My invitations</h1>
      <p className="mt-2 text-lavender">Saved on this device only. Use the same browser you created them in.</p>
      {!ready ? null : (<>
        <h2 className="mt-8 font-display text-2xl">Draft</h2>
        {draft ? <div className="mt-3 rounded-2xl bg-cream p-5 text-burgundy">
          <p className="font-semibold">{dn ? `Invitation for ${dn}` : "Untitled draft"}</p>
          <p className="text-sm text-burgundy/70">{label(String(draft.d.occasion || ""))}{draft.at ? ` · saved ${new Date(draft.at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}` : ""}</p>
          <div className="mt-3 flex flex-wrap gap-3"><Link href="/create?draft=1" className={`${btn} bg-burgundy text-cream`}>Continue draft</Link>
            <button className={`${btn} border border-burgundy/40`} onClick={() => { clearDraft(); setDraft(null); }}>Delete draft</button></div></div>
          : <p className="mt-3 text-lavender">No saved draft.</p>}
        <h2 className="mt-8 font-display text-2xl">Sent invitations</h2>
        {mine.length === 0 ? <div className="mt-3 rounded-2xl border border-cream/10 p-5"><p className="text-lavender">Nothing sent yet.</p><Link href="/create" className={`${btn} mt-3 bg-gradient-to-r from-blush to-rose text-midnight`}>Create an invitation</Link></div>
          : <ul className="mt-3 space-y-3">{mine.map((m) => (
            <li key={m.id} className="rounded-2xl bg-cream p-5 text-burgundy">
              <p className="font-semibold">For {m.name}</p><p className="text-sm text-burgundy/70">{label(m.occasion)}{m.at ? ` · ${new Date(m.at).toLocaleDateString()}` : ""}</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {hasToken(m.id) ? <Link href={`/manage/${m.id}`} className={`${btn} bg-burgundy text-cream`}>See response</Link> : <Link href={`/manage/${m.id}`} className={`${btn} bg-burgundy text-cream`}>Open with code</Link>}
                <button className={`${btn} border border-burgundy/40`} onClick={() => copy(m.id)}>{copied === m.id ? "Copied" : "Copy link"}</button>
                <button className="min-h-11 px-2 text-sm underline" onClick={() => { forgetInvitation(m.id); setMine(getMine()); }}>Remove from list</button></div></li>))}</ul>}
      </>)}
    </main>
  );
}
