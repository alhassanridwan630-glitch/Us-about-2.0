import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const fail = (m: string) => new Error(`Firebase setup problem: ${m}`);

function credentials() {
  // Option A: one variable holding the whole service-account JSON (easiest on a phone).
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (raw) {
    try {
      const j = JSON.parse(raw);
      return { projectId: j.project_id as string, clientEmail: j.client_email as string, privateKey: String(j.private_key).replace(/\\n/g, "\n") };
    } catch { throw fail("FIREBASE_SERVICE_ACCOUNT is not valid JSON. Paste the whole downloaded file."); }
  }
  // Option B: three separate variables.
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || "").trim().replace(/^"|"$/g, "").replace(/\\n/g, "\n");
  const missing = [!projectId && "FIREBASE_PROJECT_ID", !clientEmail && "FIREBASE_CLIENT_EMAIL", !privateKey && "FIREBASE_PRIVATE_KEY"].filter(Boolean);
  if (missing.length) throw fail(`${missing.join(", ")} missing in Vercel. Add it, then redeploy.`);
  return { projectId: projectId!, clientEmail: clientEmail!, privateKey };
}

export function db() {
  try {
    const app = getApps()[0] ?? initializeApp({ credential: cert(credentials()) });
    return getFirestore(app);
  } catch (e) {
    if (e instanceof Error && e.message.startsWith("Firebase setup problem")) throw e;
    console.error("Firebase init error:", e);
    throw fail("the private key looks invalid. Re-copy it from the downloaded JSON.");
  }
}
