import { Router } from "express";
import { waitlistConfirmationEmail } from "../emails/waitlist.js";
import {
  canSendToRecipient,
  getMailFromIssue,
  isEmailConfigured,
  isResendSandbox,
  sendMailInBackground,
} from "../mailer.js";
import { isFirebaseConfigured } from "../firebase.js";
import { deleteWaitlistEntry, saveWaitlistEntry } from "../waitlist.js";

const router = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const WAITLIST_TEST_EMAILS = new Set(
  (process.env.WAITLIST_TEST_EMAILS || "devansh.saxena@thesouledstore.com")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean),
);

function isWaitlistTestEmail(email) {
  return WAITLIST_TEST_EMAILS.has(String(email || "").trim().toLowerCase());
}

function isValidEmail(value) {
  return EMAIL_RE.test(String(value || "").trim());
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function queueWaitlistEmails(saved) {
  const allowSend = saved.testOnly || canSendToRecipient(saved.email);

  if (!allowSend) {
    if (isResendSandbox()) {
      console.warn(
        `[email] Skipped waitlist confirmation to ${saved.email} — set MAIL_FROM to SWING <hello@swing-play.com> on Railway (domain is verified, but sender is still onboarding@resend.dev).`,
      );
    }
    return;
  }

  const confirmation = waitlistConfirmationEmail(saved.email);
  sendMailInBackground(
    {
      to: saved.email,
      subject: confirmation.subject,
      text: confirmation.text,
      html: confirmation.html,
      replyTo: process.env.MAIL_REPLY_TO || process.env.MAIL_FROM,
    },
    "waitlist confirmation",
  );
}

function waitlistSuccessMessage(created, email, testOnly = false) {
  if (!created) {
    return "You're already on the waitlist. We'll keep you posted.";
  }

  if (!isEmailConfigured() || getMailFromIssue()) {
    return "Thanks — you're on the waitlist. We'll be in touch soon.";
  }

  if (testOnly || canSendToRecipient(email)) {
    return "Thanks — you're on the waitlist. Check your inbox for a confirmation.";
  }

  return "Thanks — you're on the waitlist. We'll be in touch soon.";
}

async function handleWaitlistSignup({ email, source, res }) {
  const normalizedEmail = String(email || "").trim().toLowerCase();

  if (isWaitlistTestEmail(normalizedEmail)) {
    if (isFirebaseConfigured()) {
      try {
        const removed = await deleteWaitlistEntry(normalizedEmail);
        if (removed) {
          console.log(`[waitlist] removed prior test entry: ${normalizedEmail}`);
        }
      } catch (err) {
        console.warn(`[waitlist] could not clean test entry for ${normalizedEmail}:`, err.message);
      }
    }

    const saved = { created: true, email: normalizedEmail, testOnly: true };
    console.log(`[waitlist] test-only signup (no DB write): ${normalizedEmail}`);

    queueWaitlistEmails(saved);

    return res.json({
      ok: true,
      message: waitlistSuccessMessage(true, normalizedEmail, true),
      created: true,
      testOnly: true,
    });
  }

  if (!isFirebaseConfigured()) {
    return res.status(503).json({
      ok: false,
      error: "Waitlist storage is not configured yet. Please try again later.",
    });
  }

  let saved;
  try {
    saved = await saveWaitlistEntry({ email, source });
  } catch (err) {
    console.error("Waitlist Firestore save failed:", err);
    return res.status(500).json({
      ok: false,
      error: "Could not save your email. Please try again later.",
    });
  }

  queueWaitlistEmails(saved);

  return res.json({
    ok: true,
    message: waitlistSuccessMessage(saved.created, saved.email),
    created: saved.created,
  });
}

router.post("/join", async (req, res) => {
  const email = String(req.body?.email || "").trim();
  const source = String(req.body?.source || "join-popup").trim() || "join-popup";

  if (!email) {
    return res.status(400).json({ ok: false, error: "Email is required." });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ ok: false, error: "Invalid email address." });
  }

  return handleWaitlistSignup({ email, source, res });
});

router.post("/contact", async (req, res) => {
  const name = String(req.body?.name || "").trim();
  const email = String(req.body?.email || "").trim();
  const subject = String(req.body?.subject || "Website contact").trim();
  const message = String(req.body?.message || "").trim();
  const waitlistOnly = req.body?.waitlist === true || req.body?.type === "waitlist";

  if (waitlistOnly) {
    if (!email) {
      return res.status(400).json({ ok: false, error: "Email is required." });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ ok: false, error: "Invalid email address." });
    }
    return handleWaitlistSignup({ email, source: "contact-page", res });
  }

  if (!name) {
    return res.status(400).json({ ok: false, error: "Name is required." });
  }
  if (!email) {
    return res.status(400).json({ ok: false, error: "Email is required." });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ ok: false, error: "Invalid email address." });
  }
  if (!message) {
    return res.status(400).json({ ok: false, error: "Message is required." });
  }

  if (!isEmailConfigured()) {
    return res.status(503).json({
      ok: false,
      error: "Email service is not configured. Please email swingplay.india@gmail.com directly.",
    });
  }

  sendMailInBackground(
    {
      subject: `[SWING Contact] ${subject}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
      html: `
        <p><strong>Contact form submission</strong></p>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
      `,
    },
    "contact form",
  );

  return res.json({ ok: true, message: "Message sent successfully." });
});

export default router;
