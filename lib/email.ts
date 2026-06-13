import { Resend } from "resend";
import { signToken } from "./magic-link";
import type { Generation } from "./types";

const resend = new Resend(process.env.RESEND_API_KEY);

const ARCHETYPE_LABELS: Record<string, string> = {
  traditionalist: "The Proud Traditionalist",
  storyteller: "The Quiet Storyteller",
  "warm-wit": "The Warm Wit",
  "heart-on-sleeve": "The Heart-on-Sleeve",
};

export async function sendSpeeches(
  orderId: string,
  email: string,
  fatherName: string,
  generations: Generation[]
) {
  const token = await signToken(orderId);
  const link = `${process.env.NEXT_PUBLIC_BASE_URL}/order/${token}`;

  const speechesHtml = generations
    .map(
      (g) => `
      <h2 style="margin-top:32px;font-size:18px;font-weight:600;">${ARCHETYPE_LABELS[g.archetype] ?? g.archetype}</h2>
      <div style="white-space:pre-wrap;line-height:1.7;">${g.output}</div>
    `
    )
    .join(
      "\n<hr style='margin:32px 0;border:none;border-top:1px solid #e5e5e5;'/>\n"
    );

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: `Your speech is ready, ${fatherName}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:640px;margin:0 auto;padding:32px 24px;color:#171717;">
        <p style="font-size:16px;">Hi ${fatherName},</p>
        <p style="font-size:16px;">Your four speech drafts are ready. You can read them below or return to them any time via your personal link (valid for 7 days).</p>
        <p style="margin:32px 0;">
          <a href="${link}" style="background:#171717;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-size:15px;">View your speeches &rarr;</a>
        </p>
        <p style="font-size:13px;color:#737373;">You have 20 free regenerations &mdash; if any draft isn&apos;t quite right, you can regenerate it from your personal page.</p>
        <hr style="margin:32px 0;border:none;border-top:1px solid #e5e5e5;"/>
        ${speechesHtml}
        <hr style="margin:32px 0;border:none;border-top:1px solid #e5e5e5;"/>
        <p style="font-size:13px;color:#737373;">DadOfHonour.co.uk &mdash; Father of the bride speech service</p>
      </div>
    `,
  });
}

// Escape user-supplied text before interpolating it into the email HTML.
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * "Gift nudge" email — sent by a daughter/relative to the father-of-the-bride,
 * letting him know about the service. Built to be opened and clicked: warm
 * subject in the sender's name, one clear job, the key facts, one CTA.
 */
export async function sendGiftEmail(senderName: string, recipientEmail: string) {
  const sender = escapeHtml(senderName.trim());
  const base = process.env.NEXT_PUBLIC_BASE_URL;

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: recipientEmail,
    replyTo: "support@dadofhonour.co.uk",
    subject: `${sender} thought this might help with your speech`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px 24px;color:#171717;">
        <p style="font-size:16px;line-height:1.6;margin:0 0 16px;">Hi,</p>
        <p style="font-size:16px;line-height:1.6;margin:0 0 16px;">
          <strong>${sender}</strong> thought you might find this useful for your
          father-of-the-bride speech.
        </p>
        <p style="font-size:16px;line-height:1.6;margin:0 0 16px;">
          It&apos;s a simple thing called <strong>Dad of Honour</strong>. You answer a
          dozen short questions about your daughter &mdash; a memory or two, what you
          admire about her partner, how you&apos;d like it to feel &mdash; and it writes
          you <strong>four complete speeches</strong>, each in a different voice, all
          built entirely from your own stories. They land in your inbox within minutes.
        </p>

        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;">
          <tr><td style="font-size:15px;line-height:1.9;color:#171717;">
            &bull;&nbsp; Four drafts to choose from &mdash; keep the one that sounds like you<br/>
            &bull;&nbsp; Free regenerations &mdash; tell it what to change and it rewrites<br/>
            &bull;&nbsp; Ready in minutes, not days<br/>
            &bull;&nbsp; £29 one-off &mdash; with a money-back guarantee
          </td></tr>
        </table>

        <p style="margin:0 0 28px;">
          <a href="${base}/?utm_source=gift&utm_medium=email"
             style="background:#171717;color:#fff;padding:14px 28px;text-decoration:none;border-radius:6px;font-size:16px;display:inline-block;">
            Take a look &rarr;
          </a>
        </p>

        <p style="font-size:15px;line-height:1.6;margin:0 0 16px;color:#444;">
          No pressure and nothing to set up &mdash; have a read in your own time. The
          hardest part of the speech is the blank page, and this gets you past it.
        </p>
        <hr style="margin:28px 0;border:none;border-top:1px solid #e5e5e5;"/>
        <p style="font-size:13px;color:#737373;line-height:1.6;margin:0;">
          ${sender} asked us to send this one email to you via DadOfHonour.co.uk.
          We won&apos;t email you again or share your address. Questions? Just reply to
          this message.
        </p>
      </div>
    `,
  });
}
