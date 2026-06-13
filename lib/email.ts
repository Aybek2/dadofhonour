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
