import "dotenv/config";
import cors from "cors";
import express from "express";
import emailRoutes from "./routes/email.js";
import { isFirebaseConfigured } from "./firebase.js";
import { getEmailProvider, isEmailConfigured, verifyEmailConnection } from "./mailer.js";

const app = express();
const port = Number(process.env.PORT) || 3001;

const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: corsOrigin.split(",").map((value) => value.trim()),
  })
);
app.use(express.json({ limit: "32kb" }));

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "swing-api",
    firebase: isFirebaseConfigured(),
    email: getEmailProvider(),
    emailReady: isEmailConfigured(),
  });
});

app.use("/api", emailRoutes);

app.use((_req, res) => {
  res.status(404).json({ ok: false, error: "Not found" });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ ok: false, error: "Internal server error" });
});

app.listen(port, async () => {
  console.log(`SWING API listening on http://localhost:${port}`);

  try {
    const status = await verifyEmailConnection();
    console.log(`Nodemailer SMTP ready (${status.provider})`);
  } catch (err) {
    console.warn("SMTP not ready — check SMTP_* env vars:", err.message);
    if (process.env.RAILWAY_ENVIRONMENT) {
      console.warn(
        "Note: Railway blocks outbound SMTP (ports 587/465). Nodemailer + Gmail works on Fly.io, Render, or a VPS — not Railway.",
      );
    }
  }

  if (!isFirebaseConfigured()) {
    console.warn("Firebase Admin not configured — waitlist signups will fail until env is set.");
  } else {
    console.log("Firebase Admin configured for waitlist storage");
  }
});
