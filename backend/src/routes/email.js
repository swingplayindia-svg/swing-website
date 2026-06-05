import { Router } from "express";
import { sendMail } from "../mailer.js";

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

router.post("/join", async (req, res) => {
  const email = String(req.body?.email || "").trim();

  if (!email) {
    return res.status(400).json({ ok: false, error: "Email is required." });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ ok: false, error: "Invalid email address." });
  }

  try {
    await sendMail({
      subject: "New SWING waitlist signup",
      replyTo: email,
      text: `New waitlist signup:\n\nEmail: ${email}`,
      html: `<p><strong>New waitlist signup</strong></p><p>Email: ${escapeHtml(email)}</p>`,
    });

    return res.json({ ok: true, message: "Thanks — we will be in touch." });
  } catch (err) {
    console.error("Join email failed:", err);
    return res.status(500).json({ ok: false, error: "Could not send email. Try again later." });
  }
});

router.post("/contact", async (req, res) => {
  const name = String(req.body?.name || "").trim();
  const email = String(req.body?.email || "").trim();
  const subject = String(req.body?.subject || "Website contact").trim();
  const message = String(req.body?.message || "").trim();

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
