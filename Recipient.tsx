"use client";
import "./recipient.css";
import { useEffect, useRef, useState } from "react";
import { OCCASIONS, THEMES, kindOf, type Draft } from "@/lib/invitations";
import { makeIcs, downloadFile } from "@/lib/ics";
import { toPng, toBlob } from "html-to-image";

type Inv = Draft & { status: string };
type Step = "load" | "error" | "welcome" | "ask" | "declined" | "yes" | "when" | "time" | "do" | "after" | "vibe" | "where" | "rsvp" | "ticket";
const STEPS: Step[] = ["when", "time", "do", "after", "vibe", "where"];
const NOS = ["Are you sure?", "Please reconsider!", "I even planned something special!", "One little YES?", "Think of the snacks…", "Last chance to say yes!", "Okay, okay… I hear you."];
const FINAL = "No, thank you";
const ACTS: Record<string, string[]> = {
  "Food & dining": ["🍽️ Dinner", "🥪 Lunch", "🥞 Brunch", "☕ Coffee", "🍦 Ice cream", "🍢 Food tasting"],
  "Fun & games": ["🎳 Bowling", "🕹️ Arcade", "🎤 Karaoke", "🎮 Gaming", "🎡 Amusement park"],
  Outdoors: ["🧺 Picnic", "🏖️ Beach", "🌿 Nature walk", "🏙️ Sightseeing", "✨ Stargazing", "🚲 Cycling"],
  Entertainment: ["🎬 Cinema", "🎶 Concert", "🏛️ Museum", "🎭 Live show", "🖼️ Exhibition"],
  Adventure: ["🛼 Roller skating", "⛸️ Ice skating", "🏊 Swimming", "🥾 Hiking"],
  "Quality time": ["🚶 Long walk", "🚗 Drive around", "🛍️ Shopping", "💬 Just talking", "🤍 Time together"],
};
const AFTER = ["🍦 Ice cream", "🕹️ Arcade", "🚶 A long walk", "🎬 Movie", "🚗 Drive around", "💬 Just talk", "✨ Stargazing"];
const VIBES = ["✨ Dress up", "👕 Casual", "🫖 Cute & cosy", "🧥 Smart casual", "🌙 Surprise me"];
const TIMES = [["Morning", "10:30"], ["Afternoon", "15:00"], ["Evening", "19:00"], ["Night", "21:30"]];
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const fmt = (i: string) => new Date(i + "T00:00").toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
const tog = (a: string[], set: (v: string[]) => void, v: string) => set(a.includes(v) ? a.filter((x) => x !== v) : [...a, v]);

function hearts(ch = "♥") {
  for (let i = 0; i < 14; i++) {
    const h = document.createElement("span");
    h.className = "rc-fh"; h.textContent = ch; h.style.left = Math.random() * 95 + "%";
    h.style.fontSize = 12 + Math.random() * 18 + "px"; h.style.animationDelay = Math.random() * 0.8 + "s";
    document.body.appendChild(h); setTimeout(() => h.remove(), 4200);
  }
}
const Opt = ({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button className="rc-opt" aria-pressed={on} onClick={onClick}>{children}</button>);

export default function Recipient({ id, demo, noSave }: { id: string; demo?: Inv; noSave?: boolean }) {
  const [inv, setInv] = useState<Inv | null>(null);
  const [step, setStep] = useState<Step>("load");
  const [err, setErr] = useState(""); const [fb, setFb] = useState(""); const [cd, setCd] = useState("");
  const [open, setOpen] = useState(false); const [music, setMusic] = useState<"off" | "on" | "none">("off"); const [busy, setBusy] = useState(false); const [dodge, setDodge] = useState(0);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<{ h: string; l: string } | null>(null);
  const [doing, setDoing] = useState<string[]>([]); const [after, setAfter] = useState<string[]>([]);
  const [vibe, setVibe] = useState(""); const [guests, setGuests] = useState(1); const [where, setWhere] = useState(""); const [notes, setNotes] = useState("");
  const cdate = useRef<HTMLInputElement>(null), ctime = useRef<HTMLInputElement>(null), noRef = useRef<HTMLButtonElement>(null), passRef = useRef<HTMLDivElement>(null), audioRef = useRef<HTMLAudioElement>(null);

  const send = async (body: object) => {
    if (demo || noSave) return true;
    try { return (await fetch("/api/invitation/respond", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...body }) })).ok; }
    catch { return false; }
  };
  useEffect(() => { if (demo) { setInv(demo); setStep("welcome"); return; } fetch(`/api/invitation?id=${encodeURIComponent(id)}`).then(async (r) => { if (!r.ok) throw 0; setInv(await r.json()); setStep("welcome"); }).catch(() => setStep("error")); }, [id]);
  useEffect(() => { window.scrollTo(0, 0); setErr(""); }, [step]);

  const place = (center: boolean) => {
    const n = noRef.current, a = n?.parentElement; if (!n || !a) return;
    const mx = a.clientWidth - n.offsetWidth, my = a.clientHeight - n.offsetHeight;
    n.style.left = (center ? mx / 2 : Math.random() * mx) + "px"; n.style.top = (center ? my / 2 : Math.random() * my) + "px";
  };
  useEffect(() => { if (step === "ask") { const t = requestAnimationFrame(() => place(true)); return () => cancelAnimationFrame(t); } }, [step]);
  useEffect(() => { if (step === "ask" && dodge === NOS.length) place(true); }, [dodge, step]);

  const target = () => {
    if (!date || date === "surprise") return null;
    const [h, m] = (time?.h || "00:00").split(":"); const d = new Date(date + "T00:00"); d.setHours(+h, +m);
    return d.getTime() > Date.now() ? d : null;
  };
  useEffect(() => {
    if (step !== "ticket") return; hearts(inv && kindOf(inv.occasion) === "formal" ? "✦" : "♥");
    const t = target(); if (!t) return;
    const f = () => { const d = Math.max(0, t.getTime() - Date.now()); setCd(`${Math.floor(d / 864e5)}d ${String(Math.floor(d % 864e5 / 36e5)).padStart(2, "0")}:${String(Math.floor(d % 36e5 / 6e4)).padStart(2, "0")}:${String(Math.floor(d % 6e4 / 1e3)).padStart(2, "0")}`); };
    f(); const iv = setInterval(f, 1000); return () => clearInterval(iv);
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  if (step === "load") return <div className="rc"><p style={{ color: "#BBA8C2" }}>Opening your invitation…</p></div>;
  if (step === "error" || !inv) return <div className="rc"><div className="rc-paper"><h1>We couldn’t find this invitation.</h1><p>The link may be wrong, or it was deleted.</p></div></div>;

  const th = THEMES.find((t) => t.id === inv.theme) ?? THEMES[0];
  const vars = { "--pbg": th.bg, "--pfg": th.fg, "--pac": th.accent } as React.CSSProperties;
  const kind = kindOf(inv.occasion), romantic = kind === "romantic", formal = kind === "formal";
  const occLabel = inv.occasion === "custom" ? inv.customOccasion : OCCASIONS.find((o) => o.id === inv.occasion)?.label ?? "";
  const tag = romantic ? "DATE PASS" : formal ? "EVENT PASS" : "PLAN PASS", win = romantic ? "It’s a date." : formal ? "You’re on the list." : "It’s a plan.";
  const yesL = romantic ? "Yes, absolutely ♡" : formal ? "Yes, I’ll be there" : "I’m in!", noL = romantic ? "No" : formal ? "Can’t make it" : "Not this time";
  const idx = STEPS.indexOf(step);
  const today = new Date();

  const decline = async () => { setBusy(true); const ok = await send({ type: "decline" }); setBusy(false); ok ? setStep("declined") : setErr("Couldn’t save your answer. Please try again."); };
  const accept = async () => { setBusy(true); const ok = await send({ type: "accept" }); setBusy(false); if (ok) { setStep("yes"); hearts(romantic ? "♥" : formal ? "✦" : "🎉"); } else setErr("Couldn’t save your answer. Please try again."); };
  const onNo = () => { if (dodge >= NOS.length) return decline(); const n = dodge + 1; setDodge(n); if (n < NOS.length) place(false); };
  const next = () => {
    if (step === "when") { const c = cdate.current?.value; if (c) { if (c < iso(today)) return setErr("Pick today or a future date."); setDate(c); } else if (!date) return setErr("Choose a day, or tap Surprise me."); }
    if (step === "time") { const c = ctime.current?.value; if (c) setTime({ h: c, l: "Custom" }); else if (!time) return setErr("Choose a time, or tap Surprise me."); }
    if (step === "do" && !doing.length) return setErr("Pick at least one thing to do.");
    if (step === "vibe" && !vibe) return setErr("Pick a vibe.");
    setStep(STEPS[idx + 1]);
  };
  const finish = async () => {
    setBusy(true);
    const ok = await send({ type: "plan", plan: { date: date ?? "surprise", time: time ?? { h: "", l: "Surprise me" }, doing, after, vibe, where: where.trim(), notes: notes.trim() } });
    setBusy(false); ok ? setStep("ticket") : setErr("Couldn’t save your plan. Please try again.");
  };
  const detailsPlan = () => [`${tag}: ${inv.creatorName} & ${inv.recipientName}`, date === "surprise" ? "Date: surprise" : `Date: ${fmt(date!)}`, `Time: ${time!.l}${time!.h ? " " + time!.h : ""}`, `Plan: ${doing.join(", ")}`, after.length ? `Then: ${after.join(", ")}` : "", `Vibe: ${vibe}`, where ? `Where: ${where}` : "", notes ? `Notes: ${notes}` : ""].filter(Boolean).join("\n");
  const saveIcs = () => { const t = target(); if (t) downloadFile("us-and-about.ics", makeIcs({ title: `${inv.creatorName} & ${inv.recipientName}: ${occLabel}`, start: t, location: where, description: details() }), "text/calendar"); };
  const confirmRsvp = async () => {
    setBusy(true); const ok = await send({ type: "rsvp", guests, notes: notes.trim() }); setBusy(false);
    if (!ok) return setErr("Couldn’t save your RSVP. Please try again.");
    setDate(inv.preferredDate || "surprise"); setTime(inv.eventTime ? { h: inv.eventTime, l: inv.eventTime } : { h: "", l: "To be announced" }); setWhere(inv.eventLocation); setStep("ticket");
  };
  const details = () => (formal ? [`${tag}: ${inv.creatorName} & ${inv.recipientName}`, `Event: ${occLabel}`, inv.preferredDate ? `Date: ${fmt(inv.preferredDate)}` : "", inv.eventTime ? `Time: ${inv.eventTime}` : "", inv.eventLocation ? `Where: ${inv.eventLocation}` : "", `Guests: ${guests}`].filter(Boolean).join("\n") : detailsPlan());
  const sharePass = async () => {
    try {
      if (passRef.current) {
        const blob = await toBlob(passRef.current, { pixelRatio: 2, cacheBust: true });
        if (blob) { const f = new File([blob], "us-and-about-pass.png", { type: "image/png" }); if (navigator.canShare?.({ files: [f] })) { await navigator.share({ files: [f], title: "Our plan", text: `${inv.creatorName} & ${inv.recipientName}` }); return; } }
      }
    } catch (e) { if ((e as Error).name === "AbortError") return; }
    if (navigator.share) navigator.share({ title: "Our plan", text: details() }).catch(() => {}); else setFb("Sharing isn’t available here. Use Save as image.");
  };
  const saveImg = async () => { if (!passRef.current) return; try { const url = await toPng(passRef.current, { pixelRatio: 2, cacheBust: true }); const a = document.createElement("a"); a.href = url; a.download = "us-and-about-pass.png"; a.click(); } catch { setFb("Couldn’t save the image. Take a screenshot instead."); } };
  const toggleMusic = () => { const a = audioRef.current; if (!a) return; if (music === "on") { a.pause(); setMusic("off"); } else a.play().then(() => setMusic("on")).catch(() => setMusic("none")); };
  const nav = (<><div className="rc-stamps" aria-hidden>{STEPS.map((_, k) => <i key={k} className={k <= idx ? "on" : ""} />)}</div>
    <button className="rc-back" onClick={() => setStep(idx <= 0 ? "ask" : STEPS[idx - 1])}>← Back</button></>);
  const cont = (label = "Continue", fn = next) => (<><p className="rc-err" role="alert">{err}</p><button className="rc-btn" disabled={busy} onClick={fn}>{label}</button></>);

  const quick: [string, string, string][] = [];
  if (inv.preferredDate && inv.preferredDate >= iso(today)) quick.push([`${inv.creatorName}’s pick`, inv.preferredDate, new Date(inv.preferredDate + "T00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" })]);
  for (let k = 0; k < 4; k++) { const x = new Date(); x.setDate(today.getDate() + k); quick.push([k === 0 ? "Today" : k === 1 ? "Tomorrow" : x.toLocaleDateString(undefined, { weekday: "short" }), iso(x), x.toLocaleDateString(undefined, { month: "short", day: "numeric" })]); }

  return (
    <div className="rc" style={vars}>
      {(demo || noSave) && <div className="rc-demo">{demo ? "Demo" : "Preview"} · nothing is saved{demo && <> · <a href="/create">Create your own</a></>}</div>}
      {inv.music && <audio ref={audioRef} src="/music/soft.mp3" loop preload="none" onError={() => setMusic("none")} />}
      {inv.music && music !== "none" && step !== "declined" && <button className="rc-soft" style={{ position: "fixed", top: 12, right: 12, zIndex: 6, color: "#F8EDE8" }} onClick={toggleMusic}>{music === "on" ? "♪ Music on" : "♪ Music off"}</button>}
      {step === "welcome" && <>
        {inv.welcomeMessage && <p style={{ color: "#F5B8CE", maxWidth: 320, textAlign: "center" }}>{inv.welcomeMessage}</p>}
        <div className={`rc-env ${open ? "open" : ""}`}><div className="rc-letter" /><div className="rc-flap" />
          <div className="rc-front">for {inv.recipientName}, from {inv.creatorName}</div>
          <button className="rc-seal" aria-label="Open the envelope" onClick={() => { setOpen(true); send({ type: "open" }); if (inv.music) audioRef.current?.play().then(() => setMusic("on")).catch(() => {}); setTimeout(() => setStep("ask"), 1500); }}>{romantic ? "♥" : formal ? "✦" : "★"}</button></div>
        <p style={{ color: "#BBA8C2", marginTop: 26 }}>Tap the seal</p></>}

      {step === "ask" && <div className={`rc-paper k-${kind}`}><p className="rc-script">{formal ? `${inv.recipientName}, you’re invited` : `Dear ${inv.recipientName},`}</p><h1>{inv.message}</h1>{formal && <p>{[inv.preferredDate && fmt(inv.preferredDate), inv.eventTime, inv.eventLocation].filter(Boolean).join(" · ")}</p>}
        {inv.note && <p style={{ fontStyle: "italic" }}>{inv.note}</p>}
        <button className="rc-btn ac" disabled={busy} style={{ marginTop: 10, transform: `scale(${1 + dodge * 0.07})` }} onClick={accept}>{yesL}</button>
        {formal ? <div className="rc-row"><button className="rc-btn line" disabled={busy} onClick={decline}>{noL}</button></div> : <><div className="rc-play"><button ref={noRef} className="rc-btn line rc-no" onClick={onNo}>{dodge >= NOS.length ? FINAL : noL}</button></div>
        <div className="rc-msg" aria-live="polite">{dodge ? NOS[Math.min(dodge, NOS.length) - 1] : ""}</div></>}
        <p className="rc-err" role="alert">{err}</p>
        {!formal && <button className="rc-soft" onClick={decline}>I’d rather not</button>}
        <p className="rc-script" style={{ fontSize: 28, margin: 0 }}>— {inv.creatorName}</p></div>}

      {step === "declined" && <div className="rc-paper"><h1>That’s completely okay.</h1><p>Thanks for letting {inv.creatorName} know. Your answer has been saved, and no plan was made.</p></div>}

      {step === "yes" && <div className={`rc-paper k-${kind}`}><p className="rc-script">{formal ? "Wonderful!" : "Yay!"}</p><h1>You said yes.</h1><p>{formal ? "Just one more thing." : "Now let’s plan it together."}</p><button className="rc-btn ac" onClick={() => setStep(formal ? "rsvp" : "when")}>{formal ? "Continue" : "Start planning"}</button></div>}

      {step === "rsvp" && <div className="rc-paper k-formal"><h2>Will anyone come with you?</h2><div className="rc-grid">{[1, 2, 3, 4].map((n) => <Opt key={n} on={guests === n} onClick={() => setGuests(n)}>{n === 1 ? "Just me" : `${n} people`}</Opt>)}</div><label>A message for {inv.creatorName} (optional)<textarea rows={3} maxLength={300} value={notes} onChange={(e) => setNotes(e.target.value)} /></label><p className="rc-err" role="alert">{err}</p><button className="rc-btn ac" disabled={busy} onClick={confirmRsvp}>{busy ? "Saving…" : "Confirm"}</button></div>}

      {step === "when" && <div className="rc-paper">{nav}<h2>When are you free?</h2>
        <div className="rc-grid">{quick.map(([l, i, s]) => <Opt key={i} on={date === i} onClick={() => { setDate(i); if (cdate.current) cdate.current.value = ""; }}>{l}<small>{s}</small></Opt>)}
          <Opt on={date === "surprise"} onClick={() => { setDate("surprise"); if (cdate.current) cdate.current.value = ""; }}>Surprise me<small>you choose</small></Opt></div>
        <label>Or pick another date<input ref={cdate} type="date" min={iso(today)} onChange={() => setErr("")} /></label>{cont()}</div>}

      {step === "time" && <div className="rc-paper">{nav}<h2>What time works?</h2>
        <div className="rc-grid">{TIMES.map(([l, h]) => <Opt key={l} on={time?.l === l} onClick={() => { setTime({ h, l }); if (ctime.current) ctime.current.value = ""; }}>{l}<small>{h}</small></Opt>)}
          <Opt on={time?.l === "Surprise me"} onClick={() => setTime({ h: "", l: "Surprise me" })}>Surprise me</Opt></div>
        <label>Or a custom time<input ref={ctime} type="time" onChange={() => setErr("")} /></label>{cont()}</div>}

      {step === "do" && <div className="rc-paper">{nav}<h2>{romantic ? "What should we do?" : "Where to?"}</h2><p>Pick as many as you like.</p>
        {Object.entries(ACTS).map(([c, l]) => <div key={c}><div className="rc-cat">{c}</div><div className="rc-grid">{l.map((a) => <Opt key={a} on={doing.includes(a)} onClick={() => tog(doing, setDoing, a)}>{a}</Opt>)}</div></div>)}{cont()}</div>}

      {step === "after" && <div className="rc-paper">{nav}<h2>And afterwards?</h2><p>Optional. Pick as many as you like.</p>
        <div className="rc-grid">{AFTER.map((a) => <Opt key={a} on={after.includes(a)} onClick={() => tog(after, setAfter, a)}>{a}</Opt>)}</div>{cont()}</div>}

      {step === "vibe" && <div className="rc-paper">{nav}<h2>{romantic ? "What’s our vibe?" : "What’s the vibe?"}</h2>
        <div className="rc-grid">{VIBES.map((v) => <Opt key={v} on={vibe === v} onClick={() => setVibe(v)}>{v}</Opt>)}</div>{cont()}</div>}

      {step === "where" && <div className="rc-paper">{nav}<h2>Where, and anything else?</h2>
        {inv.instructions && <p style={{ fontStyle: "italic" }}>From {inv.creatorName}: {inv.instructions}</p>}
        <label>Venue or location<input maxLength={120} value={where} onChange={(e) => setWhere(e.target.value)} /></label>
        <label>Notes or things to bring<textarea rows={3} maxLength={300} value={notes} onChange={(e) => setNotes(e.target.value)} /></label>
        <br />{cont(busy ? "Saving…" : "Create our pass", finish)}</div>}

      {step === "ticket" && <><div className={`rc-pass k-${kind}`} ref={passRef}><div className="top"><span className="rc-script">us&amp;about</span><small>{tag}</small></div><div className="rc-orn" aria-hidden>{romantic ? "♥ ♥ ♥" : formal ? "✦ ✦ ✦" : "★ ★ ★"}</div><h2>{win}</h2>
        {formal ? <dl><dt>Event</dt><dd>{occLabel}</dd><dt>Hosted by</dt><dd>{inv.creatorName}</dd><dt>Guest</dt><dd>{inv.recipientName}</dd><dt>Date</dt><dd>{inv.preferredDate ? fmt(inv.preferredDate) : "To be announced"}</dd><dt>Time</dt><dd>{inv.eventTime || "To be announced"}</dd><dt>Where</dt><dd>{inv.eventLocation}</dd><dt>Guests</dt><dd>{guests}</dd>{notes && <><dt>Notes</dt><dd>{notes}</dd></>}</dl> : <dl><dt>From</dt><dd>{inv.creatorName}</dd><dt>For</dt><dd>{inv.recipientName}</dd><dt>Occasion</dt><dd>{occLabel}</dd>
          <dt>When</dt><dd>{date === "surprise" ? "A surprise" : fmt(date!)}</dd><dt>Time</dt><dd>{time!.l}{time!.h ? ` · ${time!.h}` : ""}</dd>
          <dt>Plan</dt><dd>{doing.join(", ")}</dd>{after.length > 0 && <><dt>Then</dt><dd>{after.join(", ")}</dd></>}
          <dt>Vibe</dt><dd>{vibe}</dd>{where && <><dt>Where</dt><dd>{where}</dd></>}{notes && <><dt>Notes</dt><dd>{notes}</dd></>}</dl>}
        <div className="rc-perf" /><div className="rc-bot">{target() ? <><div>Starts in</div><div className="rc-cd">{cd}</div></> : <div>Date to be revealed</div>}<div className="rc-bars" /></div></div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginTop: 18 }}>
          {target() && time?.h && <button className="rc-btn ac" onClick={saveIcs}>Add to calendar</button>}
          <button className="rc-btn" onClick={() => navigator.clipboard.writeText(details()).then(() => setFb("Copied.")).catch(() => setFb("Couldn’t copy."))}>Copy details</button>
          <button className="rc-btn" onClick={saveImg}>Save as image</button>
          <button className="rc-btn" onClick={sharePass}>Share as image</button></div>
        <p className="rc-msg" style={{ textAlign: "center" }}>{fb}</p></>}
    </div>
  );
}
