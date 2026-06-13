// Google reviews shown on the landing page.
// Source copy: 03_youloogee/google-reviews-draft.md (20 reviews).
// Avatars are rendered natively (coloured circle + initial) — no asset files needed.
// To add/edit a review, change this array; the marquee and curated block both read from it.

export type Review = {
  id: number;
  name: string; // display name, e.g. "Graham M."
  location: string; // city / county
  /** muted avatar circle colour */
  colour: string;
  text: string;
  /** ★ the regenerate-listens-to-feedback stories — surfaced full at the decision point */
  featured?: boolean;
};

// Muted, Google-default-avatar palette. Assigned per review for variety.
const C = {
  slate: "#5D7A8C",
  terracotta: "#A8755C",
  sage: "#6B8E6B",
  plum: "#8C6B8E",
  sand: "#B08968",
  steel: "#5C7A99",
  stone: "#998675",
  fern: "#7C9082",
  clay: "#9C6B6B",
  denim: "#6B8299",
};

export const REVIEWS: Review[] = [
  {
    id: 1,
    name: "Graham M.",
    location: "Leeds",
    colour: C.slate,
    featured: true,
    text: "I'd had four goes at writing it myself over about a month and binned every one. The first draft here was close but a shade too jokey for the day I had in mind — I told it that, said keep the bit about her first morning of school and drop the rest, and the version it sent back was the one I actually stood up and read. Didn't change a word in the end.",
  },
  {
    id: 2,
    name: "Ian R.",
    location: "Cheshire",
    colour: C.terracotta,
    text: "Three weeks out and I still had a blank page. This got me from nothing to something I was proud of in an evening. I edited maybe two lines to sound more like me. That was it.",
  },
  {
    id: 3,
    name: "Sophie",
    location: "Bristol",
    colour: C.sage,
    text: "My dad is brilliant in person and useless on paper, so I filled the form in for him with all the old stories. He thinks he wrote most of it himself now, which tells you how well it caught him. I'm not correcting him.",
  },
  {
    id: 4,
    name: "Malcolm T.",
    location: "Aberdeen",
    colour: C.plum,
    text: "I went for the funnier one of the four. What got me is that the jokes were about our family — Katie's driving test, the caravan — not generic wedding gags you've heard a hundred times. People laughed because it was true.",
  },
  {
    id: 5,
    name: "Dave H.",
    location: "Kent",
    colour: C.sand,
    text: "Wasn't sure about paying for something a computer wrote, if I'm honest. But £29 against the £300-odd the proper speechwriters wanted made it an easy gamble, and I got four versions to pick from. The quiet, story-led one was the keeper.",
  },
  {
    id: 6,
    name: "Roger P.",
    location: "Norwich",
    colour: C.steel,
    featured: true,
    text: "First attempt leaned far too sentimental for me and I nearly gave up on it. Instead I told it I'm not a crier and to cut the soppy ending, and the next one struck the line just right — warm but not wet. Glad I didn't just walk away after the first try.",
  },
  {
    id: 7,
    name: "Hannah",
    location: "Cardiff",
    colour: C.stone,
    text: "Got my dad through the worst three days of nerves I've ever seen him in. Worth every penny just for that.",
  },
  {
    id: 8,
    name: "Stephen W.",
    location: "Solihull",
    colour: C.fern,
    text: "What I didn't expect was how it handled the bit about my late wife. I'd flagged it gently in the form and it landed it with real care — a line, not a paragraph, exactly right for the room. That was the part I'd been dreading writing myself.",
  },
  {
    id: 9,
    name: "Tony G.",
    location: "Hull",
    colour: C.clay,
    text: "Plain and simple: I'm not a words man. I gave it the bones — her job, a couple of memories, what I think of the lad she's marrying — and it gave me a speech that sounded like me on a good day.",
  },
  {
    id: 10,
    name: "Geoff B.",
    location: "Devon",
    colour: C.denim,
    text: "Four different takes for the price, which I liked. I read all four to my wife over a cup of tea and we argued happily about which one. Ended up blending two of them, which the regenerations made easy.",
  },
  {
    id: 11,
    name: "Nigel A.",
    location: "Reading",
    colour: C.slate,
    text: "I'm sixty-three and not what you'd call technical. The form was a dozen questions, took me twenty minutes, and the speeches were in my inbox before I'd finished my coffee. No faff.",
  },
  {
    id: 12,
    name: "Beth",
    location: "Manchester",
    colour: C.terracotta,
    featured: true,
    text: "Dad hated the first draft — too formal, he said, like a bank manager. I sat with him, we typed in exactly what was wrong, and watched it loosen up version by version until it sounded like him talking at Sunday lunch. The fact you can keep refining it is the whole reason it worked for us.",
  },
  {
    id: 13,
    name: "Keith M.",
    location: "Nottingham",
    colour: C.sage,
    text: "The toast at the end was the bit I'd never have cracked on my own. Short, a little funny, then a proper lump-in-throat turn. I practised it twelve times and it got me every time.",
  },
  {
    id: 14,
    name: "Martin L.",
    location: "Essex",
    colour: C.plum,
    text: "Bought it the Wednesday before the wedding in a quiet panic. Had a speech I trusted by Wednesday night. Slept properly for the first time in a fortnight.",
  },
  {
    id: 15,
    name: "Colin D.",
    location: "Glasgow",
    colour: C.sand,
    text: "I expected something glossy and American-sounding and braced myself to rewrite the lot. It wasn't that at all — it actually sounded British, dry, like something I'd say. Barely touched it.",
  },
  {
    id: 16,
    name: "Andrew S.",
    location: "Bath",
    colour: C.steel,
    text: "The childhood memory I gave it was just one line about her hiding in the airing cupboard during thunderstorms. It built a whole thread through the speech out of that one detail and brought it back at the end. I'd never have thought to do that.",
  },
  {
    id: 17,
    name: "Pete F.",
    location: "Newcastle",
    colour: C.stone,
    text: "Five minutes, I'd asked for. Got five minutes, near enough, not the rambling ten I'd have written. Knowing when to stop is half of it and I'd have got that wrong on my own.",
  },
  {
    id: 18,
    name: "Trevor C.",
    location: "Worcester",
    colour: C.fern,
    featured: true,
    text: "I'll be honest, the first version mentioned her brother a bit much and there's history there I didn't want aired. I said so, told it to keep things to the two of them, and it quietly fixed it — no awkward gap where the cut had been. That it listened to that sort of thing is what sold me.",
  },
  {
    id: 19,
    name: "Richard H.",
    location: "Sheffield",
    colour: C.clay,
    text: "My daughter married a lad I genuinely like, and I wanted to say so without it sounding like a reference letter. The line it found about him — “he listens when she talks, and not many do” — got a proper reaction. People still mention it.",
  },
  {
    id: 20,
    name: "Brian N.",
    location: "Surrey",
    colour: C.denim,
    text: "I've sat through a lot of father-of-the-bride speeches that all blur into one. I didn't want to give another of those. This didn't read like a template — it read like ours. That was the whole point, and it's the bit I was most afraid of getting wrong.",
  },
];

export const REVIEW_COUNT = REVIEWS.length;
export const AVERAGE_RATING = 4.9;
