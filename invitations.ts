import { randomBytes, createHash } from "crypto";

export type Kind = "romantic" | "casual" | "formal";
export const OCCASIONS = [
  { id: "first-date", label: "First date" }, { id: "romantic-date", label: "Romantic date" },
  { id: "couples", label: "Couples’ outing" }, { id: "friends", label: "Friends’ hangout" },
  { id: "family", label: "Family outing" }, { id: "birthday", label: "Birthday surprise" },
  { id: "celebration", label: "Special celebration" }, { id: "church", label: "Church program" },
  { id: "gathering", label: "Gathering or event" }, { id: "custom", label: "Custom occasion" },
] as const;

/** romantic = dates and couples; casual = friends, family, birthdays; formal = events with a fixed date and place. */
export const kindOf = (o: string): Kind =>
  ["first-date", "romantic-date", "couples"].includes(o) ? "romantic" : ["friends", "family", "birthday"].includes(o) ? "casual" : "formal";

export const THEMES = [
  { id: "midnight-romance", name: "Midnight Romance", bg: "#1A0D1D", fg: "#F8EDE8", accent: "#E85D91", kinds: ["romantic"] },
  { id: "blush-dreams", name: "Blush Dreams", bg: "#F5B8CE", fg: "#42142D", accent: "#E85D91", kinds: ["romantic", "casual"] },
  { id: "elegant-cream", name: "Elegant Cream", bg: "#F8EDE8", fg: "#42142D", accent: "#42142D", kinds: ["formal", "romantic"] },
  { id: "playful-hearts", name: "Playful Hearts", bg: "#E85D91", fg: "#0B080D", accent: "#F8EDE8", kinds: ["romantic", "casual"] },
  { id: "minimal-black", name: "Minimal Black", bg: "#0B080D", fg: "#F8EDE8", accent: "#BBA8C2", kinds: ["formal", "casual"] },
  { id: "sunset-glow", name: "Sunset Glow", bg: "#42142D", fg: "#F8EDE8", accent: "#F5B8CE", kinds: ["casual", "romantic"] },
  { id: "golden-hour", name: "Golden Hour", bg: "#1B1408", fg: "#F6E7C1", accent: "#D4A64A", kinds: ["formal"] },
  { id: "garden-party", name: "Garden Party", bg: "#EAF1E4", fg: "#1F3A2B", accent: "#5E8C61", kinds: ["formal", "casual"] },
  { id: "confetti", name: "Confetti", bg: "#FFF3D6", fg: "#3B1D5A", accent: "#FF5C8A", kinds: ["casual"] },
] as const;

export const SUGGESTIONS: Record<string, string[]> = {
  "first-date": ["Would you do me the honour of going on a date with me?", "I’d love to take you out. Say yes?", "Let’s see where an evening together goes."],
  "romantic-date": ["Would you let me plan something special for us?", "I made time for you. Will you make time for me?", "You. Me. A plan worth remembering."],
  couples: ["Date night, just the two of us?", "Let’s get out of the house and make a memory.", "I’m planning our next little adventure. Are you in?"],
  friends: ["Hangout this weekend? I’ll bring the plan, you bring yourself.", "It’s been too long. Let’s link up!", "I’m planning something fun and you’re on the list."],
  family: ["Family day out? Everyone’s invited.", "Let’s spend a day together, just family.", "I’d love for us all to be together. Can you make it?"],
  birthday: ["I’ve got something special planned for your birthday. Clear your schedule?", "Your birthday surprise is ready. Will you come?", "Let’s celebrate you properly."],
  celebration: ["We’re celebrating, and it wouldn’t be the same without you.", "Good news deserves good company. Join us?", "Come celebrate with us."],
  church: ["You’re warmly invited to our church program. Come and be blessed.", "Join us for a time of worship and fellowship.", "We’d be glad to have you with us. Please come."],
  gathering: ["You’re invited to our gathering. Come, relax and enjoy the company.", "We’re getting everyone together and we’d love you there.", "Save the date. We’d be honoured to host you."],
  default: ["I’d love to spend some time with you.", "I planned something. Will you come?", "Make time with me?"],
};

export type Draft = {
  creatorName: string; recipientName: string; occasion: string; customOccasion: string;
  message: string; note: string; theme: string; music: boolean;
  welcomeMessage: string; preferredDate: string; instructions: string; eventTime: string; eventLocation: string;
};
export const emptyDraft: Draft = {
  creatorName: "", recipientName: "", occasion: "", customOccasion: "", message: "", note: "",
  theme: "midnight-romance", music: false, welcomeMessage: "", preferredDate: "", instructions: "", eventTime: "", eventLocation: "",
};

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export function validate(b: Record<string, unknown>): { ok: true; data: Draft } | { ok: false; error: string } {
  const d: Draft = {
    creatorName: str(b.creatorName, 30), recipientName: str(b.recipientName, 30),
    occasion: str(b.occasion, 20), customOccasion: str(b.customOccasion, 40),
    message: str(b.message, 300), note: str(b.note, 300), theme: str(b.theme, 30),
    music: b.music === true, welcomeMessage: str(b.welcomeMessage, 120),
    preferredDate: str(b.preferredDate, 10), instructions: str(b.instructions, 300),
    eventTime: str(b.eventTime, 5), eventLocation: str(b.eventLocation, 120),
  };
  if (!d.creatorName || !d.recipientName) return { ok: false, error: "Both names are required." };
  if (!OCCASIONS.some((o) => o.id === d.occasion)) return { ok: false, error: "Choose an occasion." };
  if (d.occasion === "custom" && !d.customOccasion) return { ok: false, error: "Describe your occasion." };
  if (!d.message) return { ok: false, error: "Write an invitation message." };
  if (!THEMES.some((t) => t.id === d.theme)) return { ok: false, error: "Choose a theme." };
  if (d.preferredDate) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d.preferredDate) || new Date(d.preferredDate + "T00:00:00Z").getTime() < Date.now() - 1.5 * 864e5)
      return { ok: false, error: "The date must be today or later." };
  }
  if (d.eventTime && !/^\d{2}:\d{2}$/.test(d.eventTime)) return { ok: false, error: "Invalid event time." };
  if (kindOf(d.occasion) === "formal") {
    if (!d.preferredDate) return { ok: false, error: "Add the event date." };
    if (!d.eventLocation) return { ok: false, error: "Add the event location." };
  }
  return { ok: true, data: d };
}

const B36 = "abcdefghijklmnopqrstuvwxyz0123456789";
export function makeId(name: string) {
  const slug = name.toLowerCase().replace(/[^a-z]/g, "").slice(0, 12) || "invite";
  const r = Array.from(randomBytes(8), (b) => B36[b % 36]).join("");
  return `${slug}-${r}`;
}
export const makeToken = () => randomBytes(24).toString("base64url");
export const hashToken = (t: string) => createHash("sha256").update(t).digest("hex");
export const ID_RE = /^[a-z]{1,12}-[a-z0-9]{8}$/;
