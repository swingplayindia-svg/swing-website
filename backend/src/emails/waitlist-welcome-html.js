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
  const rows = [SPORTS.slice(0, 9), SPORTS.slice(9)];
  return rows
    .map(
      (row) => `
    <tr>
      ${row
        .map(
          (sport) => `
        <td style="padding:4px 3px;">
          <span style="
            display:inline-block;
            background:#f0fdf4;
            border:1px solid #bbf7d0;
            border-radius:100px;
            padding:7px 14px;
            font-size:12px;
            color:#166534;
            font-family:'Segoe UI',system-ui,sans-serif;
            white-space:nowrap;
            font-weight:500;
          ">${sport.icon}&nbsp;${escapeHtml(sport.name)}</span>
        </td>`,
        )
        .join("")}
    </tr>`,
    )
    .join("");
}

const STEPS = [
  {
    num: "01",
    title: "You're confirmed",
    body: "Your spot is secured. We'll never spam you.",
  },
  {
    num: "02",
    title: "Early access invite",
    body: "You'll receive a private invite before the public launch.",
  },
  {
    num: "03",
    title: "Play every game",
    body: "Explore leagues, athletes & live stats across 18 sports.",
  },
];

function stepsHtml() {
  return STEPS.map(
    (step, i) => `
    <td width="33%" style="padding:0 8px;vertical-align:top;">
      <div style="
        background:#f0fdf4;
        border:1px solid #bbf7d0;
        border-radius:12px;
        padding:20px 18px;
      ">
        <div style="
          font-size:11px;
          font-weight:800;
          color:#16a34a;
          font-family:'Segoe UI',system-ui,sans-serif;
          letter-spacing:0.1em;
          margin-bottom:10px;
        ">${step.num}</div>
        <div style="font-size:14px;font-weight:700;color:#14532d;margin-bottom:6px;font-family:'Segoe UI',system-ui,sans-serif;">${escapeHtml(step.title)}</div>
        <div style="font-size:12px;color:#4b7a5e;line-height:1.55;font-family:'Segoe UI',system-ui,sans-serif;">${escapeHtml(step.body)}</div>
      </div>
    </td>`,
  ).join("");
}

export function buildWaitlistWelcomeHtml(email) {
  const safeEmail = escapeHtml(email);
  const confirmationId = `SWG-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>You're on the SWING waitlist</title>
</head>
<body style="margin:0;padding:0;background:#f6f8f6;-webkit-font-smoothing:antialiased;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#f6f8f6">
    <tr>
      <td align="center" style="padding:40px 16px 48px;">

        <!-- Card -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
          style="max-width:600px;background:#ffffff;border:1px solid #e2e8e2;border-radius:16px;overflow:hidden;">

          <!-- Top green bar -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#16a34a,#22c55e,#4ade80);"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding:24px 36px;border-bottom:1px solid #f0f4f0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size:20px;font-weight:900;color:#15803d;font-family:'Segoe UI',system-ui,sans-serif;letter-spacing:-0.3px;">⚡ SWING</span>
                  </td>
                  <td align="right" valign="middle">
                    <span style="
                      font-size:11px;
                      font-weight:600;
                      color:#6b8c6b;
                      font-family:'Segoe UI',system-ui,sans-serif;
                      letter-spacing:0.06em;
                      text-transform:uppercase;
                    ">Sports Reference Guide</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero -->
          <tr>
            <td style="padding:48px 36px 36px;">

              <!-- Badge -->
              <div style="margin-bottom:22px;">
                <span style="
                  display:inline-flex;
                  align-items:center;
                  gap:6px;
                  background:#dcfce7;
                  border:1px solid #bbf7d0;
                  border-radius:100px;
                  padding:7px 16px;
                  font-size:12px;
                  font-weight:700;
                  color:#15803d;
                  font-family:'Segoe UI',system-ui,sans-serif;
                  letter-spacing:0.06em;
                  text-transform:uppercase;
                ">
                  <span style="
                    display:inline-block;
                    width:7px;height:7px;
                    background:#22c55e;
                    border-radius:50%;
                  "></span>
                  Waitlist Confirmed
                </span>
              </div>

              <!-- Headline -->
              <h1 style="
                margin:0 0 14px;
                font-size:36px;
                font-weight:900;
                line-height:1.12;
                color:#0f1f0f;
                letter-spacing:-1px;
                font-family:'Segoe UI',system-ui,sans-serif;
              ">
                Your spot is<br>
                <span style="color:#16a34a;">locked in.</span>
              </h1>

              <!-- Body -->
              <p style="
                margin:0 0 32px;
                font-size:15px;
                line-height:1.75;
                color:#4b5e4b;
                font-family:'Segoe UI',system-ui,sans-serif;
                max-width:460px;
              ">
                Welcome to SWING — the definitive sports reference platform for fans who take their game seriously.
                We're putting the finishing touches on something special.
              </p>

              <!-- CTA -->
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#16a34a;border-radius:10px;padding:14px 30px;">
                    <span style="font-size:13px;font-weight:800;color:#ffffff;font-family:'Segoe UI',system-ui,sans-serif;letter-spacing:0.06em;text-transform:uppercase;">Play Every Game</span>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Confirmation strip -->
          <tr>
            <td style="padding:0 36px 36px;">
              <div style="
                background:#f0fdf4;
                border:1px solid #bbf7d0;
                border-radius:10px;
                padding:16px 20px;
              ">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td>
                      <div style="font-size:10px;font-weight:700;color:#86b896;font-family:'Segoe UI',system-ui,sans-serif;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:3px;">Confirmation ID</div>
                      <div style="font-size:17px;font-weight:800;color:#15803d;font-family:'Courier New',monospace;letter-spacing:0.08em;">${confirmationId}</div>
                    </td>
                    <td align="right" valign="middle">
                      <div style="font-size:10px;color:#86b896;font-family:'Segoe UI',system-ui,sans-serif;text-align:right;margin-bottom:3px;text-transform:uppercase;letter-spacing:0.06em;">Registered as</div>
                      <div style="font-size:13px;font-weight:600;color:#2d5a3d;font-family:'Segoe UI',system-ui,sans-serif;">${safeEmail}</div>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="padding:0 36px;"><div style="height:1px;background:#f0f4f0;"></div></td></tr>

          <!-- What's next -->
          <tr>
            <td style="padding:36px 28px 36px;">
              <div style="font-size:11px;font-weight:700;color:#16a34a;font-family:'Segoe UI',system-ui,sans-serif;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:20px;padding:0 8px;">What happens next</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  ${stepsHtml()}
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="padding:0 36px;"><div style="height:1px;background:#f0f4f0;"></div></td></tr>

          <!-- Sports section -->
          <tr>
            <td style="padding:36px 36px 16px;">
              <div style="font-size:11px;font-weight:700;color:#16a34a;font-family:'Segoe UI',system-ui,sans-serif;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:6px;">18 sports. One platform.</div>
              <p style="margin:0 0 20px;font-size:14px;color:#4b5e4b;font-family:'Segoe UI',system-ui,sans-serif;line-height:1.6;">
                Every league, team, and athlete — from padel courts to IPL pitches.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:0 32px 36px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                ${sportPillsHtml()}
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="padding:0 36px;"><div style="height:1px;background:#f0f4f0;"></div></td></tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 36px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="font-size:15px;font-weight:900;color:#15803d;font-family:'Segoe UI',system-ui,sans-serif;margin-bottom:3px;">⚡ SWING</div>
                    <div style="font-size:12px;color:#9ab09a;font-family:'Segoe UI',system-ui,sans-serif;">Move fast. Stay collaborative.</div>
                  </td>
                  <td align="right" valign="middle">
                    <div style="font-size:11px;color:#9ab09a;font-family:'Segoe UI',system-ui,sans-serif;text-align:right;line-height:1.65;">
                      You received this because<br>you joined the SWING waitlist.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Bottom green bar -->
          <tr>
            <td style="height:3px;background:linear-gradient(90deg,#4ade80,#22c55e,#16a34a);"></td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>

</body>
</html>`;
}