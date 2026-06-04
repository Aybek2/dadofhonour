import fs from "fs";
import path from "path";
import type { Archetype } from "./types";

function loadPrompts(): Record<Archetype, string> {
  // process.cwd() is always the Next.js project root (03_youloogee/app/)
  // speech-prompts.md is copied into app/docs/ so Vercel bundles it
  const filePath = path.join(process.cwd(), "docs", "speech-prompts.md");
  const raw = fs.readFileSync(filePath, "utf-8");

  // Each archetype section looks like:
  //   ## Archetype N — Title
  //   ```
  //   ...prompt text...
  //   ```
  // Extract the content of each fenced code block in order.
  const codeBlockRegex = /```\n([\s\S]*?)```/g;
  const blocks: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = codeBlockRegex.exec(raw)) !== null) {
    blocks.push(match[1].trim());
  }

  if (blocks.length < 4) {
    throw new Error(
      `Expected 4 archetype prompts in speech-prompts.md, found ${blocks.length}`
    );
  }

  return {
    traditionalist: blocks[0],
    storyteller: blocks[1],
    "warm-wit": blocks[2],
    "heart-on-sleeve": blocks[3],
  };
}

export const PROMPTS: Record<Archetype, string> = loadPrompts();
