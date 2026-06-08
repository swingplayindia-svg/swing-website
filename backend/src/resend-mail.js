const RESEND_API = "https://api.resend.com/emails";

export function isResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export function getResendFromAddress() {
  return (
    process.env.RESEND_FROM_EMAIL?.trim() ||
    process.env.MAIL_FROM?.trim() ||
    "SWING <noreply@swing-play.com>"
  );
}

function normalizeRecipients(to) {
  const list = Array.isArray(to) ? to : [to];
  return list
    .map((value) => String(value || "").trim().toLowerCase())
    .filter((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
}

export async function sendResendMail({ to, subject, text, html, replyTo }) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const recipients = normalizeRecipients(to);
  if (recipients.length === 0) {
    throw new Error("No valid recipient email.");
  }

  const res = await fetch(RESEND_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: getResendFromAddress(),
      to: recipients,
      subject,
      html,
      text,
      reply_to: replyTo,
    }),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.message || `Resend API error (${res.status}).`);
  }

  return { id: json.id, provider: "resend" };
}
