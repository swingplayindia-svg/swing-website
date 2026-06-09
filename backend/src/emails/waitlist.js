import { buildWaitlistWelcomeHtml } from "./waitlist-welcome-html.js";

export function waitlistConfirmationEmail(email) {
  const subject = "You're on the SWING waitlist ⚡";

  const text = [
    "Hi there,",
    "",
    "Thanks for joining the SWING waitlist!",
    "",
    "SWING is a passionate community playing sports loved by millions — football, cricket, padel, pickleball, tennis, and 18 sports in all.",
    "",
    "We'll email you when the app is ready and share early updates along the way.",
    "",
    "Play every game,",
    "Team SWING",
    "",
    `Registered email: ${email}`,
  ].join("\n");

  const html = buildWaitlistWelcomeHtml(email);

  return { subject, text, html };
}
