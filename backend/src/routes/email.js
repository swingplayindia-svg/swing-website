import { Router } from "express";
import { waitlistAdminNotificationEmail, waitlistConfirmationEmail } from "../emails/waitlist.js";
import { sendMail } from "../mailer.js";
import { isFirebaseConfigured } from "../firebase.js";
import { saveWaitlistEntry } from "../waitlist.js";

const router = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

async function handleWaitlistSignup({ email, source, res }) {
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

  const confirmation = waitlistConfirmationEmail(saved.email);

  try {
    await sendMail({
      to: saved.email,
      subject: confirmation.subject,
      text: confirmation.text,
      html: confirmation.html,
      replyTo: process.env.MAIL_FROM || process.env.SMTP_USER,
    });
  } catch (err) {
    console.error("Waitlist confirmation email failed:", err);
  }

  if (saved.created) {
    const adminNotice = waitlistAdminNotificationEmail(saved.email, source);
    try {
      await sendMail({
        subject: adminNotice.subject,
        replyTo: saved.email,
        text: adminNotice.text,
        html: adminNotice.html,
      });
    } catch (err) {
      console.error("Waitlist admin notification failed:", err);
    }
  }

  return res.json({
    ok: true,
    message: saved.created
      ? "Thanks — you're on the waitlist. Check your inbox for a confirmation."
      : "You're already on the waitlist. We'll keep you posted.",
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

  try {
    await sendMail({
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
    });

    return res.json({ ok: true, message: "Message sent successfully." });
  } catch (err) {
    console.error("Contact email failed:", err);
    return res.status(500).json({ ok: false, error: "Could not send email. Try again later." });
  }
});

export default router;
