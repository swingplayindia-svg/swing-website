import nodemailer from "nodemailer";
import { isResendConfigured, sendResendMail } from "./resend-mail.js";

const smtpRequired = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "MAIL_FROM"];

function isSmtpConfigured() {
  return smtpRequired.every((key) => Boolean(process.env[key]?.trim()));
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
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  };
}

let transporter;

export function getEmailProvider() {
  if (isResendConfigured()) return "resend";
  if (isSmtpConfigured()) return "smtp";
  return "none";
}

export function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport(getSmtpConfig());
  }
  return transporter;
}

export async function verifyEmailConnection() {
  if (isResendConfigured()) {
    return { provider: "resend", ok: true };
  }

  if (!isSmtpConfigured()) {
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

  if (isSmtpConfigured()) {
    return sendViaSmtp({ to, subject, text, html, replyTo });
  }

  throw new Error("No email provider configured. Set RESEND_API_KEY or SMTP_* vars.");
}
