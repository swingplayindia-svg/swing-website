import nodemailer from "nodemailer";

const required = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "MAIL_FROM"];

function getConfig() {
  const missing = required.filter((key) => !process.env[key]);
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
  };
}

let transporter;

export function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport(getConfig());
  }
  return transporter;
}

export async function verifySmtpConnection() {
  await getTransporter().verify();
}

export async function sendMail({ to, subject, text, html, replyTo }) {
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
