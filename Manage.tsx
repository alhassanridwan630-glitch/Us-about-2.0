"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Copy, Check, Trash2, RefreshCw } from "lucide-react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { rememberInvitation } from "@/lib/local";
import { OCCASIONS } from "@/lib/invitations";

type Plan = { date: string; time: { h: string; l: string }; doing: string[]; after: string[]; vibe: string; where: string; notes: string };
type Data = { creatorName: string; recipientName: string; occasion: string; customOccasion: string; message: string; status: string; opened: boolean;
  plan: Plan | null; rsvp: { guests: number; notes: string } | null; eventTime: string; eventLocation: string; createdAt: string | null; openedAt: string | null; respondedAt: string | null };

const when = (s: string | null) => (s ? new Date(s).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "—");
const day = (d: string) => (d === "surprise" ? "A surprise" : new Date(d + "T00:00").toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }));
const Row = ({ k, v }: { k: string; v?: string }) => v ? <div className="flex justify-between gap-4 border-b border-burgundy/10 py-2 text-sm"><span className="text-burgundy/60">{k}</span><span className="text-right font-semibold [overflow-wrap:anywhere]">{v}</span></div> : null;

export default function Manage({ id }: { id: string }) {
  const [token, setToken] = useState<string | null>(null);
  const [d, setD] = useState<Data | null>(null);
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false); const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false); const [confirm, setConfirm] = useState(false); const [gone, setGone] = useState(false);

  useEffect(() => {
    const key = `usabout:manage:${id}`; let t = location.hash.slice(1);
    try {
      if (t) { localStorage.setItem(key, t); history.replaceState(null, "", location.pathname); } // keep the token out of the address bar
      else t = localStorage.getItem(key) || "";
    } catch {}
    setToken(t);
  }, [id]);

  const load = useCallback(async () => {
    if (!token) return;
    setBusy(true);
    try {
      const r = await fetch(`/api/invitation/manage?id=${encodeURIComponent(id)}`, { headers: { "x-manage-token": token } });
      if (r.status === 404) setErr("This private link isn’t valid, or the invitation was deleted.");
      else if (!r.ok) setErr((await r.json()).error || "Couldn’t load your invitation.");
      else { const j = await r.json(); setD(j); setErr(""); rememberInvitation({ id, name: j.recipientName, occasion: j.occasion, at: j.createdAt || "" }); }
    } catch { setErr("Couldn’t reach the server. Check your connection."); }
    setBusy(false);
  }, [id, token]);
  useEffect(() => { if (token === "") setErr("Paste your private code below, or open the full private link you saved."); else if (token) { load(); const iv = setInterval(load, 30000); return () => clearInterval(iv); } }, [token, load]);

  const link = typeof location !== "undefined" ? `${location.origin}/invite/${id}` : "";
  const copy = async () => { try { await navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { setErr("Couldn’t copy. Select the link instead."); } };
  const del = async () => {
    setBusy(true);
    try { const r = await fetch(`/api/invitation/manage?id=${encodeURIComponent(id)}`, { method: "DELETE", headers: { "x-manage-token": token || "" } });
      if (r.ok) { try { localStorage.removeItem(`usabout:manage:${id}`); } catch {} setGone(true); } else setErr("Couldn’t delete. Try again."); } catch { setErr("Couldn’t reach the server."); }
    setBusy(false);
  };

  const status = !d ? "" : d.status === "declined" ? "Declined" : d.status === "accepted" ? (d.plan || d.rsvp ? "Accepted — plan submitted" : "Accepted — choosing a plan") : d.opened ? "Opened — waiting for an answer" : "Sent — not opened yet";
  const tone = d?.status === "accepted" ? "bg-rose text-midnight" : d?.status === "declined" ? "bg-lavender text-midnight" : "bg-burgundy text-cream";
  const occ = d ? (d.occasion === "custom" ? d.customOccasion : OCCASIONS.find((o) => o.id === d.occasion)?.label) : "";

  return (
    <><SiteHeader /><main className="mx-auto min-h-[70vh] max-w-xl px-4 pb-16 pt-6">
      {gone ? <div className="rounded-2xl bg-cream p-6 text-burgundy"><p className="font-script text-4xl text-rose">Deleted.</p><p className="mt-2">The invitation and its link no longer work.</p><Link href="/create" className="mt-4 inline-flex min-h-12 items-center rounded-full bg-burgundy px-7 text-sm font-semibold text-cream">Create another</Link></div>
      : !d ? <div className="rounded-2xl bg-cream p-6 text-burgundy" role="status">{err ? <p role="alert">{err}</p> : <p>Loading your invitation…</p>}{token === "" || err.includes("valid") ? <div className="mt-4"><label className="block text-sm">Private code<input className="mt-2 w-full rounded-xl border border-burgundy/30 bg-white/60 px-4 py-3" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Paste your private code" /></label><button className="mt-3 inline-flex min-h-12 items-center rounded-full bg-burgundy px-7 text-sm font-semibold text-cream" onClick={() => { const c = code.trim(); if (!c) return; try { localStorage.setItem(`usabout:manage:${id}`, c); } catch {} setErr(""); setToken(c); }}>Open dashboard</button></div> : null}</div>
      : <div className="rounded-2xl bg-cream p-6 text-burgundy">
        <p className="text-sm text-burgundy/60">{occ}</p>
        <h1 className="font-display text-3xl">{d.creatorName} → {d.recipientName}</h1>
        <p className={`mt-3 inline-block rounded-full px-4 py-1.5 text-sm font-semibold ${tone}`}>{status}</p>
        <p className="mt-4 text-sm italic">“{d.message}”</p>
        <div className="mt-4"><Row k="Created" v={when(d.createdAt)} /><Row k="Opened" v={d.opened ? when(d.openedAt) : "Not yet"} /><Row k="Answered" v={d.respondedAt ? when(d.respondedAt) : "Not yet"} /></div>
        {d.plan && <div className="mt-5"><h2 className="font-display text-2xl">Their plan</h2>
          <Row k="Date" v={day(d.plan.date)} /><Row k="Time" v={d.plan.time.l + (d.plan.time.h ? ` · ${d.plan.time.h}` : "")} /><Row k="Activities" v={d.plan.doing.join(", ")} />
          <Row k="Afterwards" v={d.plan.after.join(", ")} /><Row k="Outfit" v={d.plan.vibe} /><Row k="Location" v={d.plan.where} /><Row k="Message" v={d.plan.notes} /></div>}
        {d.rsvp && <div className="mt-5"><h2 className="font-display text-2xl">Their RSVP</h2><Row k="Guests" v={String(d.rsvp.guests)} /><Row k="Message" v={d.rsvp.notes} /></div>}
        {(d.eventTime || d.eventLocation) && <div className="mt-3"><Row k="Event time" v={d.eventTime} /><Row k="Venue" v={d.eventLocation} /></div>}
        <p role="alert" className="mt-3 min-h-5 text-sm text-[#b3123f]">{err}</p>
        <p className="break-all rounded-xl bg-burgundy/10 p-3 text-sm">{link}</p>
        <div className="mt-3 flex flex-wrap gap-3">
          <button className="inline-flex min-h-12 items-center gap-2 rounded-full bg-burgundy px-6 text-sm font-semibold text-cream" onClick={copy}>{copied ? <Check size={16} /> : <Copy size={16} />}Copy invite link</button>
          <button className="inline-flex min-h-12 items-center gap-2 rounded-full border border-burgundy/40 px-6 text-sm font-semibold" onClick={load} disabled={busy}><RefreshCw size={16} />Refresh</button>
        </div>
        <div className="mt-8 border-t border-burgundy/15 pt-4">{!confirm ? <button className="inline-flex items-center gap-2 text-sm text-[#b3123f] underline" onClick={() => setConfirm(true)}><Trash2 size={16} />Delete this invitation</button>
          : <div><p className="text-sm">Delete for good? The link will stop working and the response is erased.</p><div className="mt-2 flex gap-3">
            <button className="min-h-11 rounded-full bg-[#b3123f] px-6 text-sm font-semibold text-cream" onClick={del} disabled={busy}>Yes, delete</button>
            <button className="min-h-11 rounded-full border border-burgundy/40 px-6 text-sm" onClick={() => setConfirm(false)}>Keep it</button></div></div>}</div>
      </div>}
    </main><SiteFooter /></>
  );
}
