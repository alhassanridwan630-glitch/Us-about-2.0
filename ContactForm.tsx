"use client";
import { useState } from "react";

const input = "mt-2 w-full rounded-xl border border-burgundy/30 bg-white/60 px-4 py-3 text-burgundy";
export function ContactForm({ email }: { email: string }) {
  const [name, setName] = useState(""); const [topic, setTopic] = useState("Question"); const [msg, setMsg] = useState(""); const [err, setErr] = useState("");
  const send = () => {
    if (!msg.trim()) return setErr("Write a short message first.");
    location.href = `mailto:${email}?subject=${encodeURIComponent("US&ABOUT support: " + topic)}&body=${encodeURIComponent(msg.trim() + "\n\nFrom: " + (name.trim() || "—"))}`;
  };
  return (
    <div className="rounded-2xl bg-cream p-6 text-burgundy">
      <label className="block text-sm">Your name<input className={input} value={name} maxLength={40} onChange={(e) => setName(e.target.value)} /></label>
      <label className="mt-3 block text-sm">Topic<select className={input} value={topic} onChange={(e) => setTopic(e.target.value)}><option>Question</option><option>Problem with my invitation</option><option>Feedback</option><option>Report something</option></select></label>
      <label className="mt-3 block text-sm">Message<textarea className={input} rows={5} maxLength={1000} value={msg} onChange={(e) => { setMsg(e.target.value); setErr(""); }} /></label>
      <p role="alert" className="mt-2 min-h-5 text-sm text-[#b3123f]">{err}</p>
      <button className="inline-flex min-h-12 items-center rounded-full bg-burgundy px-7 text-sm font-semibold text-cream" onClick={send}>Send by email</button>
      <p className="mt-3 text-xs text-burgundy/70">This opens your email app with the message ready to send.</p>
    </div>
  );
}
