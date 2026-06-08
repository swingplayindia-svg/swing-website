import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let adminDb;

function normalizePrivateKey(raw) {
  let key = String(raw || "").trim();

  for (let i = 0; i < 2; i++) {
    if (
      (key.startsWith('"') && key.endsWith('"')) ||
      (key.startsWith("'") && key.endsWith("'"))
    ) {
      key = key.slice(1, -1).trim();
    }
  }

  if (key.includes("\\n")) {
    key = key.replace(/\\n/g, "\n");
  }

  return key;
}

function readFirebaseAdminEnv() {
  const jsonRaw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (jsonRaw) {
    const json = JSON.parse(jsonRaw);
    const projectId = json.project_id?.trim();
    const clientEmail = json.client_email?.trim();
    const privateKey = json.private_key ? normalizePrivateKey(json.private_key) : "";
    if (projectId && clientEmail && privateKey) {
      return { projectId, clientEmail, privateKey };
    }
  }

  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY?.trim();
  if (!projectId || !clientEmail || !privateKeyRaw) return null;

  return {
    projectId,
    clientEmail,
    privateKey: normalizePrivateKey(privateKeyRaw),
  };
}

function ensureAdminApp() {
  const existing = getApps().find((app) => app.name === "swing-backend");
  if (existing) return existing;

  const env = readFirebaseAdminEnv();
  if (!env) {
    throw new Error(
      "Firebase Admin not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY.",
    );
  }

  return initializeApp(
    {
      projectId: env.projectId,
      credential: cert({
        projectId: env.projectId,
        clientEmail: env.clientEmail,
        privateKey: env.privateKey,
      }),
    },
    "swing-backend",
  );
}

export function getAdminDb() {
  if (!adminDb) {
    adminDb = getFirestore(ensureAdminApp());
  }
  return adminDb;
}

export function isFirebaseConfigured() {
  return Boolean(readFirebaseAdminEnv());
}
