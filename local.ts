// Browser-only helpers (localStorage). Everything is wrapped so private mode never crashes the app.
export type Mine = { id: string; name: string; occasion: string; at: string };
const rd = <T,>(k: string, f: T): T => { try { const s = localStorage.getItem(k); return s ? (JSON.parse(s) as T) : f; } catch { return f; } };
const wr = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
export type SavedDraft = { d: Record<string, unknown>; step: number; at: string };
export function loadDraft(): SavedDraft | null {
  const x = rd<Record<string, unknown> | null>("usabout:draft", null);
  if (!x) return null;
  return "d" in x ? (x as unknown as SavedDraft) : { d: x, step: 0, at: "" };
}
export const saveDraft = (d: object, step: number) => wr("usabout:draft", { d, step, at: new Date().toISOString() });
export const clearDraft = () => { try { localStorage.removeItem("usabout:draft"); } catch {} };
export const getMine = () => rd<Mine[]>("usabout:mine", []);
export const rememberInvitation = (m: Mine) => wr("usabout:mine", [m, ...getMine().filter((x) => x.id !== m.id)].slice(0, 50));
export const forgetInvitation = (id: string) => { wr("usabout:mine", getMine().filter((x) => x.id !== id)); try { localStorage.removeItem(`usabout:manage:${id}`); } catch {} };
export const hasToken = (id: string) => { try { return !!localStorage.getItem(`usabout:manage:${id}`); } catch { return false; } };
