import { formatFileSize } from "@/data/jam";

export type JamEmailPayload = {
  song: string;
  name: string;
  email: string;
  socials: string;
  message: string;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  downloadUrl: string;
  receivedAt: Date;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatReceivedAt(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Denver",
  }).format(date);
}

function row(label: string, value: string, { pre = false } = {}): string {
  const body = pre
    ? `<div style="margin:0;white-space:pre-wrap;font-size:15px;line-height:1.55;color:#ededed;">${escapeHtml(value)}</div>`
    : `<div style="margin:0;font-size:15px;line-height:1.55;color:#ededed;">${escapeHtml(value)}</div>`;

  return `
    <tr>
      <td style="padding:0 0 18px;">
        <div style="margin:0 0 4px;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#a8a8a8;">
          ${escapeHtml(label)}
        </div>
        ${body}
      </td>
    </tr>
  `;
}

export function buildJamNotificationEmail(payload: JamEmailPayload): {
  subject: string;
  html: string;
  text: string;
} {
  const received = formatReceivedAt(payload.receivedAt);
  const fileMeta = `${payload.fileName} · ${formatFileSize(payload.fileSize)}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background:#2a2a2a;color:#ededed;font-family:Georgia,'Times New Roman',serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#2a2a2a;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
            <tr>
              <td style="padding:0 0 20px;text-align:center;font-size:13px;letter-spacing:0.28em;text-transform:uppercase;color:#fff983;">
                Merlinn
              </td>
            </tr>
            <tr>
              <td style="background:#3a3a3a;padding:32px 28px;">
                <h1 style="margin:0 0 8px;font-size:22px;font-weight:normal;letter-spacing:0.04em;color:#ffffff;">
                  Let&apos;s Jam — new submission
                </h1>
                <p style="margin:0 0 28px;font-size:14px;line-height:1.6;color:#b0b0b0;">
                  A recording arrived for review. Nothing is published until you say so.
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${row("Song", payload.song)}
                  ${row("Name", payload.name)}
                  ${row("Email", payload.email)}
                  ${payload.socials ? row("Socials", payload.socials) : ""}
                  ${payload.message ? row("Note", payload.message, { pre: true }) : ""}
                  <tr>
                    <td style="padding:0 0 18px;">
                      <div style="margin:0 0 4px;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#a8a8a8;">
                        File
                      </div>
                      <div style="margin:0 0 12px;font-size:15px;line-height:1.55;color:#ededed;">
                        ${escapeHtml(fileMeta)}
                      </div>
                      <a href="${escapeHtml(payload.fileUrl)}" style="display:inline-block;margin-right:12px;color:#2a2a2a;background:#fff983;text-decoration:none;padding:10px 16px;font-size:13px;font-weight:600;">
                        View file
                      </a>
                      <a href="${escapeHtml(payload.downloadUrl)}" style="display:inline-block;color:#fff983;text-decoration:underline;padding:10px 0;font-size:13px;">
                        Download
                      </a>
                    </td>
                  </tr>
                  ${row("Received", received)}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 8px 0;text-align:center;font-size:12px;line-height:1.5;color:#8a8a8a;">
                Reply to this email to write the submitter directly.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`.trim();

  const textLines = [
    "Merlinn — Let's Jam | New submission",
    "",
    "A recording arrived for review. Nothing is published until you say so.",
    "",
    `Song: ${payload.song}`,
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.socials ? `Socials: ${payload.socials}` : null,
    payload.message ? `Note:\n${payload.message}` : null,
    `File: ${fileMeta}`,
    `View: ${payload.fileUrl}`,
    `Download: ${payload.downloadUrl}`,
    `Received: ${received}`,
  ].filter((line): line is string => line !== null);

  return {
    subject: "Merlinn - Let's Jam | New submission",
    html,
    text: textLines.join("\n"),
  };
}
