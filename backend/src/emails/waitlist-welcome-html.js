function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const STEPS = [
  { num: "01", title: "You're in", body: "Spot secured. We'll never spam you." },
  { num: "02", title: "Early invite", body: "Private access before public launch." },
  { num: "03", title: "Play every game", body: "18 sports. Every league. One place." },
];

function stepsHtml() {
  return STEPS.map(
    (step) => `
    <tr>
      <td style="padding:0 0 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td width="40" valign="top" style="padding-top:2px;">
              <span style="font-size:10px;font-weight:800;color:#22c55e;font-family:'Courier New',monospace;letter-spacing:0.05em;">${step.num}</span>
            </td>
            <td valign="top">
              <div style="font-size:13px;font-weight:700;color:#0f1f0f;font-family:'Segoe UI',system-ui,sans-serif;margin-bottom:2px;">${escapeHtml(step.title)}</div>
              <div style="font-size:12px;color:#6b8c6b;font-family:'Segoe UI',system-ui,sans-serif;line-height:1.5;">${escapeHtml(step.body)}</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>`
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
  <title>Welcome to SWING</title>
</head>
<body style="margin:0;padding:0;background:#f4f7f4;-webkit-font-smoothing:antialiased;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#f4f7f4">
  <tr>
    <td align="center" style="padding:48px 16px 56px;">

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
        style="max-width:480px;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e4ece4;">

        <!-- Green top bar -->
        <tr>
          <td style="height:3px;background:#16a34a;"></td>
        </tr>

        <!-- Logo row -->
        <tr>
          <td style="padding:28px 36px 0;text-align:center;">
            <span style="font-size:13px;font-weight:800;color:#15803d;font-family:'Segoe UI',system-ui,sans-serif;letter-spacing:0.18em;text-transform:uppercase;">⚡ SWING</span>
          </td>
        </tr>

        <!-- Hero -->
        <tr>
          <td style="padding:36px 36px 0;text-align:center;">

            <!-- Big checkmark -->
            <div style="margin:0 auto 20px;width:56px;height:56px;background:#dcfce7;border-radius:50%;text-align:center;line-height:56px;font-size:24px;">✓</div>

            <h1 style="margin:0 0 12px;font-size:30px;font-weight:900;line-height:1.15;color:#0a1a0a;font-family:'Segoe UI',system-ui,sans-serif;letter-spacing:-0.8px;">
              You're on the<br><span style="color:#16a34a;">waitlist.</span>
            </h1>

            <p style="margin:0 0 28px;font-size:14px;line-height:1.75;color:#5a7a5a;font-family:'Segoe UI',system-ui,sans-serif;">
              Welcome to SWING — the sports reference platform<br>
              for fans who take their game seriously.
            </p>

            <!-- CTA -->
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
              <tr>
                <td style="background:#16a34a;border-radius:10px;padding:13px 32px;">
                  <span style="font-size:13px;font-weight:800;color:#ffffff;font-family:'Segoe UI',system-ui,sans-serif;letter-spacing:0.07em;text-transform:uppercase;">Play Every Game</span>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- Confirmation ID -->
        <tr>
          <td style="padding:0 36px 32px;">
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:14px 18px;text-align:center;">
              <div style="font-size:10px;font-weight:700;color:#86b896;font-family:'Segoe UI',system-ui,sans-serif;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:4px;">Confirmation</div>
              <div style="font-size:16px;font-weight:800;color:#15803d;font-family:'Courier New',monospace;letter-spacing:0.1em;">${confirmationId}</div>
              <div style="font-size:11px;color:#86b896;font-family:'Segoe UI',system-ui,sans-serif;margin-top:4px;">${safeEmail}</div>
            </div>
          </td>
        </tr>

        <!-- Divider -->
        <tr><td style="padding:0 36px;"><div style="height:1px;background:#f0f4f0;"></div></td></tr>

        <!-- What's next -->
        <tr>
          <td style="padding:28px 36px 20px;">
            <div style="font-size:10px;font-weight:700;color:#22c55e;letter-spacing:0.14em;text-transform:uppercase;font-family:'Segoe UI',system-ui,sans-serif;margin-bottom:18px;">What's next</div>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${stepsHtml()}
            </table>
          </td>
        </tr>

        <!-- Divider -->
        <tr><td style="padding:0 36px;"><div style="height:1px;background:#f0f4f0;"></div></td></tr>

        <!-- Divider -->
        <tr><td style="padding:0 36px;"><div style="height:1px;background:#f0f4f0;"></div></td></tr>

        <!-- Footer -->
        <tr>
          <td style="padding:22px 36px 26px;text-align:center;">
            <div style="font-size:12px;font-weight:800;color:#15803d;font-family:'Segoe UI',system-ui,sans-serif;margin-bottom:4px;">⚡ SWING</div>
            <div style="font-size:11px;color:#aabfaa;font-family:'Segoe UI',system-ui,sans-serif;line-height:1.6;">
              You joined the SWING waitlist.<br>Move fast. Stay collaborative.
            </div>
          </td>
        </tr>

        <!-- Green bottom bar -->
        <tr>
          <td style="height:3px;background:#16a34a;"></td>
        </tr>

      </table>

    </td>
  </tr>
</table>

</body>
</html>`;
}