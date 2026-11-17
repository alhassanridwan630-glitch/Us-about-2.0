import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { db } from "@/lib/firebase-admin";
import { ID_RE, hashToken } from "@/lib/invitations";

const iso = (t: unknown) => (t as { toDate?: () => Date } | undefined)?.toDate?.().toISOString() ?? null;
const NOPE = () => NextResponse.json({ error: "Not found." }, { status: 404 }); // same answer for wrong id or wrong token

async function authorise(req: Request) {
  const id = new URL(req.url).searchParams.get("id") || "";
  const token = req.headers.get("x-manage-token") || "";
  if (!ID_RE.test(id) || !token) return null;
  const ref = db().collection("invitations").doc(id);
  const snap = await ref.get();
  if (!snap.exists) return null;
  const a = Buffer.from(String(snap.data()!.tokenHash), "hex"), b = Buffer.from(hashToken(token), "hex");
  return a.length === b.length && timingSafeEqual(a, b) ? { ref, d: snap.data()! } : null;
}

export async function GET(req: Request) {
  try {
    const x = await authorise(req); if (!x) return NOPE();
    const d = x.d;
    return NextResponse.json({
      creatorName: d.creatorName, recipientName: d.recipientName, occasion: d.occasion, customOccasion: d.customOccasion,
      message: d.message, preferredDate: d.preferredDate, status: d.status, opened: !!d.opened, plan: d.plan ?? null, rsvp: d.rsvp ?? null, eventTime: d.eventTime ?? "", eventLocation: d.eventLocation ?? "",
      createdAt: iso(d.createdAt), openedAt: iso(d.openedAt), respondedAt: iso(d.respondedAt),
    });
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Server error." }, { status: 503 }); }
}

export async function DELETE(req: Request) {
  try {
    const x = await authorise(req); if (!x) return NOPE();
    await x.ref.delete();
    return NextResponse.json({ ok: true });
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Server error." }, { status: 503 }); }
}
