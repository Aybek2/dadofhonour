import Anthropic from "@anthropic-ai/sdk";
import { PROMPTS } from "./prompts";
import { sql } from "./db";
import type { FormAnswers, Archetype } from "./types";

const client = new Anthropic();

export async function generateSpeeches(
  submissionId: string,
  answers: FormAnswers
) {
  const archetypes: Archetype[] = [
    "traditionalist",
    "storyteller",
    "warm-wit",
    "heart-on-sleeve",
  ];

  // Strip undefined/null/empty fields before passing to Claude
  const cleanAnswers = Object.fromEntries(
    Object.entries(answers).filter(
      ([, v]) => v !== undefined && v !== null && v !== ""
    )
  );

  const results = await Promise.all(
    archetypes.map(async (archetype) => {
      const response = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 2048,
        system: PROMPTS[archetype],
        messages: [{ role: "user", content: JSON.stringify(cleanAnswers) }],
      });
      const text =
        response.content[0].type === "text" ? response.content[0].text : "";
      return { archetype, text };
    })
  );

  await Promise.all(
    results.map(({ archetype, text }) =>
      sql`INSERT INTO generations (submission_id, archetype, prompt_version, output)
          VALUES (${submissionId}, ${archetype}, ${"v1.0"}, ${text})`
    )
  );
}
