import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb, isFirebaseConfigured } from "./firebase.js";

export const WAITLIST_COLLECTION = "waitlist";
export const WAITLIST_STATUS = "waitlisted";

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function emailDocId(email) {
  return normalizeEmail(email).replace(/[^a-z0-9@._+-]/g, "_");
}

export async function saveWaitlistEntry({ email, source = "website" }) {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase is not configured.");
  }

  const normalizedEmail = normalizeEmail(email);
  const db = getAdminDb();
  const ref = db.collection(WAITLIST_COLLECTION).doc(emailDocId(normalizedEmail));
  const existing = await ref.get();

  if (existing.exists) {
    await ref.set(
      {
        email: normalizedEmail,
        status: WAITLIST_STATUS,
        source,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
    return { created: false, email: normalizedEmail };
  }

  await ref.set({
    email: normalizedEmail,
    status: WAITLIST_STATUS,
    source,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return { created: true, email: normalizedEmail };
}
