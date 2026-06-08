export function waitlistConfirmationEmail(email) {
  const subject = "You're on the SWING waitlist";
  const text = [
    "Hi there,",
    "",
    "Thanks for joining the SWING waitlist!",
    "",
    "We'll email you when the app is ready and share early updates along the way.",
    "",
    "Play every game,",
    "Team SWING",
    "",
    `Registered email: ${email}`,
  ].join("\n");

  const html = `
    <p>Hi there,</p>
    <p>Thanks for joining the <strong>SWING</strong> waitlist!</p>
    <p>We'll email you when the app is ready and share early updates along the way.</p>
    <p>Play every game,<br><strong>Team SWING</strong></p>
    <p style="color:#666;font-size:12px;">Registered email: ${email}</p>
  `;

  return { subject, text, html };
}

export function waitlistAdminNotificationEmail(email, source) {
  const subject = "New SWING waitlist signup";
  const text = `New waitlist signup:\n\nEmail: ${email}\nSource: ${source}\nStatus: waitlisted`;
  const html = `
    <p><strong>New waitlist signup</strong></p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Source:</strong> ${source}</p>
    <p><strong>Status:</strong> waitlisted</p>
  `;

  return { subject, text, html };
}
