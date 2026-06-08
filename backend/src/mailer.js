import nodemailer from "nodemailer";

const required = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "MAIL_FROM"];

function getConfig() {
  const missing = required.filter((key) => !process.env[key]?.trim());
  if (missing.length) {
    throw new Error(`Missing SMTP env vars: ${missing.join(", ")}`);
  }

  const port = Number(process.env.SMTP_PORT);

  return {
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 12000,
  };
}

let transporter;

export function isEmailConfigured() {
  return required.every((key) => Boolean(process.env[key]?.trim()));
}

export function getEmailProvider() {
  return isEmailConfigured() ? "nodemailer-smtp" : "none";
}

export function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport(getConfig());
  }
  return transporter;
}

export async function verifyEmailConnection() {
  if (!isEmailConfigured()) {
    throw new Error("Missing SMTP env vars (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM).");
  }

  await getTransporter().verify();
  return { provider: "nodemailer-smtp", ok: true };
}

export async function sendMail({ to, subject, text, html, replyTo }) {
  const mailTo = to || process.env.MAIL_TO || process.env.SMTP_USER;

  return getTransporter().sendMail({
    from: process.env.MAIL_FROM,
    to: mailTo,
    replyTo: replyTo || process.env.MAIL_TO || process.env.SMTP_USER,
    subject,
    text,
    html,
  });
}

/** Fire-and-forget — never blocks the HTTP response. */
export function sendMailInBackground(payload, label) {
  if (!isEmailConfigured()) {
    console.warn(`[email] Skipped ${label}: SMTP env vars not set.`);
    return;
  }

  void sendMail(payload).catch((err) => {
    console.error(`[email] ${label} failed:`, err.message || err);
  });
}
