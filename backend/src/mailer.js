import { Resend } from "resend";

const required = ["RESEND_API_KEY", "MAIL_FROM"];

let resend;

function getResend() {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY?.trim());
  }
  return resend;
}

export function isEmailConfigured() {
  return required.every((key) => Boolean(process.env[key]?.trim()));
}

export function getEmailProvider() {
  return isEmailConfigured() ? "resend" : "none";
}

export async function verifyEmailConnection() {
  if (!isEmailConfigured()) {
    throw new Error("Missing email env vars (RESEND_API_KEY, MAIL_FROM).");
  }

  getResend();
  return { provider: "resend", ok: true };
}

export async function sendMail({ to, subject, text, html, replyTo }) {
  const mailTo = to || process.env.MAIL_TO;
  if (!mailTo) {
    throw new Error("No email recipient (to or MAIL_TO).");
  }

  const payload = {
    from: process.env.MAIL_FROM.trim(),
    to: Array.isArray(mailTo) ? mailTo : [mailTo],
    subject,
  };

  if (html) payload.html = html;
  if (text) payload.text = text;
  if (replyTo) payload.reply_to = replyTo;

  const { data, error } = await getResend().emails.send(payload);

  if (error) {
    throw new Error(error.message || JSON.stringify(error));
  }

  return data;
}

/** Fire-and-forget — never blocks the HTTP response. */
export function sendMailInBackground(payload, label) {
  if (!isEmailConfigured()) {
    console.warn(`[email] Skipped ${label}: RESEND_API_KEY / MAIL_FROM not set.`);
    return;
  }

  void sendMail(payload).catch((err) => {
    console.error(`[email] ${label} failed:`, err.message || err);
  });
}
