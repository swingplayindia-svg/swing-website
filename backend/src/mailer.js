import { Resend } from "resend";

const required = ["RESEND_API_KEY", "MAIL_FROM"];

const BLOCKED_FROM_DOMAINS = ["gmail.com", "googlemail.com", "yahoo.com", "hotmail.com", "outlook.com"];

let resend;

function getMailFrom() {
  return process.env.MAIL_FROM?.trim() || "";
}

export function getMailFromIssue() {
  const from = getMailFrom();
  if (!from) return "MAIL_FROM is not set.";

  const emailMatch = from.match(/<([^>]+)>/) || from.match(/([\w.+-]+@[\w.-]+\.\w+)/);
  const email = (emailMatch?.[1] || from).trim().toLowerCase();
  const domain = email.split("@")[1];

  if (!domain) {
    return `MAIL_FROM is invalid: "${from}". Use SWING <hello@yourdomain.com>.`;
  }

  if (BLOCKED_FROM_DOMAINS.includes(domain)) {
    return (
      `MAIL_FROM uses @${domain} — Resend cannot send from free email domains. ` +
      `Set MAIL_FROM to SWING <onboarding@resend.dev> (testing) or SWING <hello@swing-play.com> after verifying your domain at resend.com/domains.`
    );
  }

  return null;
}

export function isResendSandbox() {
  return getMailFrom().includes("@resend.dev");
}

export function canSendToRecipient(email) {
  if (getMailFromIssue()) return false;
  if (!isResendSandbox()) return true;

  const allowed = process.env.MAIL_TO?.trim().toLowerCase();
  return Boolean(allowed && String(email || "").trim().toLowerCase() === allowed);
}

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

  const fromIssue = getMailFromIssue();
  if (fromIssue) {
    throw new Error(fromIssue);
  }

  getResend();
  return { provider: "resend", ok: true, sandbox: isResendSandbox() };
}

export async function sendMail({ to, subject, text, html, replyTo }) {
  const mailTo = to || process.env.MAIL_TO;
  if (!mailTo) {
    throw new Error("No email recipient (to or MAIL_TO).");
  }

  const fromIssue = getMailFromIssue();
  if (fromIssue) {
    throw new Error(fromIssue);
  }

  const payload = {
    from: getMailFrom(),
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

  const fromIssue = getMailFromIssue();
  if (fromIssue) {
    console.error(`[email] Skipped ${label}: ${fromIssue}`);
    return;
  }

  void sendMail(payload)
    .then((data) => {
      if (data?.id) console.log(`[email] ${label} sent (${data.id})`);
    })
    .catch((err) => {
      console.error(`[email] ${label} failed:`, err.message || err);
    });
}
