/**
 * About-page copy for vv-styles.
 *
 * Reflects brand facts we've locked: "vv" = Very Vocal; designs range from
 * recovery wordage to motivational / matter-of-fact truths; made in recovery;
 * anonymity is intentional; a new collection drops every few months; vv-styles
 * is a venture under Esoh Creations LLC.
 *
 * Founder note added 2026-07-09 from Sunshine's own account. It is deliberately
 * first-person and signed, rather than folded into the page's "we" voice, so
 * the personal testimony reads as testimony and stays unattributed by name.
 *
 * Note the aperture: recovery here is NOT only substance recovery. The founder
 * frames it as any journey survived — abuse, misuse, mistakes — and the reader
 * we're writing for is a "survivor" proud of their own road. Keep new copy
 * consistent with that, even though the product's cleantime personalization
 * skews substance-recovery.
 */

export const aboutHero = {
  eyebrow: "Our story",
  heading: "Very Vocal about what recovery really sounds like.",
  lede: "vv-styles makes shirts in the language people in recovery actually use — the phrases you'd only hear from someone who has lived it.",
};

export type AboutSection = { heading: string; body: string[] };

/** First-person testimony from the founder, rendered as a signed note. */
export const founderNote = {
  body: [
    "I was sitting in a meeting one day and someone said, “I’m proud of my recovery. This journey hasn’t been easy.” It hit me all at once — I’m proud of my recovery, too.",
    "I kept turning the words over afterward: proud to be recovering. I survived physical, mental, and emotional abuse, and drug abuse along with it. My journey isn’t unique, though it is mine. And I’ve gotten to a place where I understand that my past does not have to dictate my future.",
    "I want you to know that about yours. That sounded like something a person should be able to wear — so I made it.",
  ],
  attribution: "— Founder, vv-styles",
};

export const aboutSections: AboutSection[] = [
  {
    heading: "Why vv-styles exists",
    body: [
      "The words that get people through recovery deserve to be worn out loud — not clinical slogans or motivational-poster fluff, but the real, matter-of-fact language you only hear from someone who has actually done the work.",
    ],
  },
  {
    heading: 'What "Very Vocal" means',
    body: [
      "The vv stands for Very Vocal. Recovery teaches that staying quiet is what keeps people sick — and that saying the true thing plainly is how we heal and how we help the next person.",
      "Our designs range from recovery-based wordage to straight-up motivational, matter-of-fact truths. Some hit home if you're counting days; others are just for anyone who needs to hear it said out loud.",
    ],
  },
  {
    heading: "Who these shirts are for",
    body: [
      "Recovery isn't only one thing. Some of us are counting days. Others are recovering from abuse, from misuse, from mistakes — from things we survived and don't always have the words for.",
      "If you're proud of the road you've walked, whatever road that was, these words are for you. Survivors, wearing their gratitude out loud.",
    ],
  },
  {
    heading: "Made in recovery, for people in recovery",
    body: [
      "Every shirt is designed by someone in recovery, for the community we're part of. We keep it anonymous on purpose — a nod to the traditions many of us came up in — which is why you'll rarely see a face here, just the words.",
      "When you buy one, you're supporting a person in recovery building something real.",
    ],
  },
  {
    heading: "New words, every few months",
    body: [
      "Recovery isn't static, and neither is this shop. We release a new collection of designs every few months, so there's always fresh language to wear — and room for the phrases you'd only ever hear from us.",
    ],
  },
  {
    heading: "Part of Esoh Creations",
    body: [
      "vv-styles is one of several ventures under Esoh Creations LLC. Each has its own name and its own lane, but they all come from the same place: making real things that give people a voice.",
    ],
  },
];
