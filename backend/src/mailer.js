import nodemailer from "nodemailer";
import { isResendConfigured, sendResendMail } from "./resend-mail.js";

const smtpRequired = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "MAIL_FROM"];

function isRailway() {
  return Boolean(process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_ID);
}

function isSmtpConfigured() {
  return smtpRequired.every((key) => Boolean(process.env[key]?.trim()));
}

function canUseSmtp() {
  return isSmtpConfigured() && !isRailway();
}

function getSmtpConfig() {
  const missing = smtpRequired.filter((key) => !process.env[key]?.trim());
  if (missing.length) {
    throw new Error(`Missing SMTP env vars: ${missing.join(", ")}`);
  }

  return {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 8000,
  };
}

let transporter;

export function getEmailProvider() {
  if (isResendConfigured()) return "resend";
  if (canUseSmtp()) return "smtp";
  if (isRailway()) return "none (set RESEND_API_KEY on Railway)";
  return "none";
}

export function isEmailConfigured() {
  return isResendConfigured() || canUseSmtp();
}

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport(getSmtpConfig());
  }
  return transporter;
}

export async function verifyEmailConnection() {
  if (isResendConfigured()) {
    return { provider: "resend", ok: true };
  }

  if (isRailway()) {
    throw new Error("Set RESEND_API_KEY on Railway. SMTP is blocked on Railway.");
  }

  if (!canUseSmtp()) {
    throw new Error("No email provider configured. Set RESEND_API_KEY or SMTP_* vars.");
  }

  await getTransporter().verify();
  return { provider: "smtp", ok: true };
}

async function sendViaSmtp({ to, subject, text, html, replyTo }) {
  const mailTo = to || process.env.MAIL_TO || process.env.SMTP_USER;

  return getTransporter().sendMail({
    from: process.env.MAIL_FROM,
    to: mailTo,
    replyTo,
    subject,
    text,
    html,
  });
}

export async function sendMail({ to, subject, text, html, replyTo }) {
  if (isResendConfigured()) {
    const mailTo = to || process.env.MAIL_TO || process.env.SMTP_USER;
    return sendResendMail({
      to: mailTo,
      subject,
      text,
      html,
      replyTo: replyTo || process.env.MAIL_TO || "swingplay.india@gmail.com",
    });
  }

  if (isRailway()) {
    throw new Error("RESEND_API_KEY is required on Railway. SMTP is blocked.");
  }

  if (canUseSmtp()) {
    return sendViaSmtp({ to, subject, text, html, replyTo });
  }

  throw new Error("No email provider configured. Set RESEND_API_KEY or SMTP_* vars.");
}

/** Fire-and-forget — never blocks the HTTP response. */
export function sendMailInBackground(payload, label) {
  if (!isEmailConfigured()) {
    console.warn(`[email] Skipped ${label}: no provider configured.`);
    return;
  }

  void sendMail(payload).catch((err) => {
    console.error(`[email] ${label} failed:`, err.message || err);
  });
}
