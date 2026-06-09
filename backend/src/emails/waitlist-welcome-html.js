function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const SPORTS = [
  { icon: "⚽", name: "Football" },
  { icon: "🏏", name: "Cricket" },
  { icon: "🏀", name: "Basketball" },
  { icon: "🎾", name: "Padel" },
  { icon: "🏓", name: "Pickleball" },
  { icon: "🎾", name: "Tennis" },
  { icon: "🏸", name: "Badminton" },
  { icon: "🏊", name: "Swimming" },
  { icon: "🥊", name: "Combat Sports" },
  { icon: "🏎️", name: "F1 / Karting" },
  { icon: "🎮", name: "Esports" },
  { icon: "⛳", name: "Golf" },
  { icon: "🐎", name: "Polo" },
  { icon: "🧘", name: "Yoga" },
  { icon: "💪", name: "Gym" },
  { icon: "🎳", name: "Bowling" },
  { icon: "🤼", name: "Kabaddi" },
  { icon: "🏃", name: "Running" },
];

function sportPillsHtml() {
  return SPORTS.map(
    (sport) => `
      <td style="padding:6px;">
        <span style="display:inline-block;background:#1e2535;border:1px solid #2a3347;border-radius:20px;padding:8px 14px;font-size:13px;color:#e8eaf0;font-family:'Segoe UI',system-ui,sans-serif;white-space:nowrap;">
          ${sport.icon}&nbsp;${escapeHtml(sport.name)}
        </span>
      </td>`,
  ).join("");
}

export function buildWaitlistWelcomeHtml(email) {
  const safeEmail = escapeHtml(email);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to SWING</title>
</head>
<body style="margin:0;padding:0;background:#0d0f14;color:#e8eaf0;font-family:'Segoe UI',system-ui,-apple-system,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0d0f14;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#161b25;border:1px solid #2a3347;border-radius:16px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="padding:28px 32px 20px;background:linear-gradient(135deg,#0d0f14 0%,#1a1f2e 100%);border-bottom:1px solid #2a3347;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="font-size:28px;font-weight:800;letter-spacing:-1px;color:#f0a500;line-height:1.1;">⚡ SWING</div>
                    <div style="font-size:14px;color:#8892a4;margin-top:6px;">Sports Reference Guide · Waitlist</div>
                  </td>
                  <td align="right" valign="top">
                    <span style="display:inline-block;background:#f0a500;color:#000;font-weight:700;font-size:12px;padding:4px 10px;border-radius:20px;">18 Sports</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero -->
          <tr>
            <td style="padding:32px 32px 24px;">
              <h1 style="margin:0 0 12px;font-size:32px;font-weight:800;line-height:1.15;color:#ffffff;letter-spacing:-0.5px;">
                You're on the <span style="color:#22c55e;">waitlist</span>
              </h1>
              <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#8892a4;">
                Thanks for joining SWING — a passionate community playing sports loved by millions.
                We'll email you when the app is ready and share early updates along the way.
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#016B04;border-radius:10px;padding:14px 24px;">
                    <span style="font-size:15px;font-weight:700;color:#ffffff;letter-spacing:0.03em;text-transform:uppercase;">Play Every Game</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Sports preview -->
          <tr>
            <td style="padding:0 32px 8px;">
              <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#f0a500;margin-bottom:14px;">
                🏆 What's coming
              </div>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.55;color:#c5cad4;">
                Discover leagues, teams, and athletes across 18 sports — from padel and pickleball to cricket, F1, esports, and more.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:0 24px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>${sportPillsHtml()}</tr>
              </table>
            </td>
          </tr>

          <!-- Featured sports cards -->
          <tr>
            <td style="padding:0 32px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="padding:6px;vertical-align:top;">
                    <div style="background:#1e2535;border:1px solid #2a3347;border-radius:12px;padding:16px;">
                      <div style="font-size:24px;margin-bottom:8px;">⚽</div>
                      <div style="font-size:15px;font-weight:700;color:#ffffff;">Football</div>
                      <div style="font-size:12px;color:#8892a4;margin-top:4px;">Premier League · La Liga · ISL</div>
                    </div>
                  </td>
                  <td width="50%" style="padding:6px;vertical-align:top;">
                    <div style="background:#1e2535;border:1px solid #2a3347;border-radius:12px;padding:16px;">
                      <div style="font-size:24px;margin-bottom:8px;">🏏</div>
                      <div style="font-size:15px;font-weight:700;color:#ffffff;">Cricket</div>
                      <div style="font-size:12px;color:#8892a4;margin-top:4px;">IPL · T20 World Cup · The Ashes</div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="padding:6px;vertical-align:top;">
                    <div style="background:#1e2535;border:1px solid #2a3347;border-radius:12px;padding:16px;">
                      <div style="font-size:24px;margin-bottom:8px;">🎾</div>
                      <div style="font-size:15px;font-weight:700;color:#ffffff;">Padel</div>
                      <div style="font-size:12px;color:#8892a4;margin-top:4px;">Premier Padel · World Padel Tour</div>
                    </div>
                  </td>
                  <td width="50%" style="padding:6px;vertical-align:top;">
                    <div style="background:#1e2535;border:1px solid #2a3347;border-radius:12px;padding:16px;">
                      <div style="font-size:24px;margin-bottom:8px;">🏓</div>
                      <div style="font-size:15px;font-weight:700;color:#ffffff;">Pickleball</div>
                      <div style="font-size:12px;color:#8892a4;margin-top:4px;">MLP · PPA Tour · US Open</div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px 28px;border-top:1px solid #2a3347;background:#0d0f14;">
              <p style="margin:0 0 8px;font-size:14px;color:#8892a4;">
                Registered as <strong style="color:#e8eaf0;">${safeEmail}</strong>
              </p>
              <p style="margin:0;font-size:13px;line-height:1.5;color:#5c6578;">
                Team SWING · Move fast. Stay collaborative.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
