import Link from "next/link";
import { OCCASIONS, THEMES } from "@/lib/invitations";
import { SiteFooter } from "./SiteFooter";

const steps = [["1", "Write it", "Add the names, pick the occasion, write your message and choose a theme."],
  ["2", "Send the link", "Get a unique link to share on WhatsApp or anywhere. They don’t need an account."],
  ["3", "Plan it together", "They answer, pick the day, time and activities, and a ticket is made for you both."]];
const demo = [["Faith", "Would you do me the honour of going on a date with me?", "Alex", "midnight-romance"],
  ["Sam", "Birthday dinner is on me. Say you’ll come?", "Jo", "blush-dreams"], ["Brother David", "You’re warmly invited to our youth program this Sunday.", "Pastor Ife", "golden-hour"]];
const why = [["Always free", "No subscriptions and no locked themes."], ["No accounts", "They tap your link and answer. That’s it."], ["A kind no", "Every invitation gives a real, gentle way to decline."]];
const faq = [["Is it really free?", "Yes. No subscriptions, payments or premium features."],
  ["Does the other person need an account?", "No. They open your link, answer, and plan."],
  ["What if they want to say no?", "They always can. A no is saved as a no and shown to you honestly."],
  ["Who can see my invitation?", "Only people with your link can open it. Only you can see responses, using your private link."],
  ["Can I delete an invitation?", "Yes, from your private link. The invitation link stops working immediately."],
  ["Is it only for dates?", "No. Use it for friends, family, birthdays and any occasion worth making time for."]];
const wrap = "relative z-10 mx-auto max-w-6xl scroll-mt-6 px-5 py-16";
const card = "rounded-2xl border border-cream/10 bg-plum/70 p-6";

export function HomeSections() {
  return (<>
    <section id="how-it-works" className={wrap}><h2 className="font-display text-4xl">How US&amp;ABOUT works</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-3">{steps.map(([n, t, b]) => <div key={n} className={card}><p className="font-script text-4xl text-rose">{n}</p><h3 className="font-display text-2xl">{t}</h3><p className="mt-2 text-lavender">{b}</p></div>)}</div></section>

    <section id="occasions" className={wrap}><h2 className="font-display text-4xl">Choose your occasion</h2>
      <div className="mt-8 flex flex-wrap gap-3">{OCCASIONS.map((o) => <Link key={o.id} href={`/create?occasion=${o.id}`} className="min-h-12 rounded-full border border-lavender/40 px-6 py-3 text-sm transition hover:border-blush hover:bg-cream/5">{o.label}</Link>)}</div></section>

    <section id="examples" className={wrap}><h2 className="font-display text-4xl">Invitation examples</h2>
      <div className="mt-8 grid gap-5 md:grid-cols-3">{demo.map(([to, msg, from, th], i) => { const t = THEMES.find((x) => x.id === th)!;
        return <Link key={to} href={`/demo?k=${["romantic", "friends", "church"][i]}`} className="block rounded-2xl p-6 text-center transition hover:-translate-y-1" style={{ background: t.bg, color: t.fg }}><p className="font-script text-4xl" style={{ color: t.accent }}>Hey {to}!</p>
          <p className="mt-2 font-display text-xl leading-snug">{msg}</p><p className="mt-4 font-script text-2xl" style={{ color: t.accent }}>— {from}</p><p className="mt-3 text-xs opacity-70">Tap to try it →</p></Link>; })}</div></section>

    <section id="planner" className={wrap}><div className="grid items-center gap-8 md:grid-cols-2"><div><h2 className="font-display text-4xl">A planner that feels like a gift</h2>
      <p className="mt-4 text-lavender">After a yes, they choose when they’re free, the time, what to do, what comes after, and the vibe. You get a ticket with a countdown, a calendar file and everything in one place.</p></div>
      <div className="rounded-2xl bg-cream p-6 text-center text-burgundy"><h3 className="font-display text-2xl">When are you free?</h3>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm"><span className="rounded-xl bg-burgundy py-3 text-cream">Tomorrow</span><span className="rounded-xl border border-burgundy/30 py-3">Saturday</span><span className="rounded-xl border border-burgundy/30 py-3">Evening</span><span className="rounded-xl border border-burgundy/30 py-3">Surprise me</span></div></div></div></section>

    <section className={wrap}><h2 className="font-display text-4xl">Why people love it</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-3">{why.map(([t, b]) => <div key={t} className={card}><h3 className="font-display text-2xl">{t}</h3><p className="mt-2 text-lavender">{b}</p></div>)}</div></section>

    <section id="faq" className={wrap}><h2 className="font-display text-4xl">Questions</h2>
      <div className="mt-8 max-w-2xl divide-y divide-cream/10">{faq.map(([q, a]) => <details key={q} className="group py-4"><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-semibold">{q}<span className="text-rose transition group-open:rotate-45">+</span></summary><p className="mt-2 text-lavender">{a}</p></details>)}</div></section>

    <SiteFooter />
  </>);
}
