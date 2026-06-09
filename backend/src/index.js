import "dotenv/config";
import cors from "cors";
import express from "express";
import emailRoutes from "./routes/email.js";
import { isFirebaseConfigured } from "./firebase.js";
import {
  getEmailProvider,
  getMailFromIssue,
  isEmailConfigured,
  isResendSandbox,
  verifyEmailConnection,
} from "./mailer.js";

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
  const mailFromIssue = getMailFromIssue();
  res.json({
    ok: true,
    service: "swing-api",
    firebase: isFirebaseConfigured(),
    email: getEmailProvider(),
    emailReady: isEmailConfigured() && !mailFromIssue,
    emailSandbox: isResendSandbox(),
    emailIssue: mailFromIssue,
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
    if (status.sandbox) {
      console.log(`Resend email ready (test mode — user confirmations only go to MAIL_TO until your domain is verified)`);
    } else {
      console.log(`Resend email ready (${status.provider})`);
    }
  } catch (err) {
    console.error("EMAIL NOT CONFIGURED:", err.message);
  }

  if (!isFirebaseConfigured()) {
    console.warn("Firebase Admin not configured — waitlist signups will fail until env is set.");
  } else {
    console.log("Firebase Admin configured for waitlist storage");
  }
});
