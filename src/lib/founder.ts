// Andy McMaster, the founder (15 Oct 2026, "It's the campaign that wins").
//
// These are the only facts the site may state about Andy. The homepage, the
// about page and the Person JSON-LD all read them from here. Anything else
// (a client story, a testimonial, an award, a review count, another figure)
// needs Andy's confirmation first: leave a TODO(andy) instead.

export const FOUNDER = {
  name: "Andy McMaster",
  role: "Founder",
  /** The about page's anchor and the Person JSON-LD @id fragment (/about#andy-mcmaster). */
  id: "andy-mcmaster",
  // TODO(andy): confirm this portrait, or supply the new one for the founder sections.
  photo: "/images/agents/andy-mcmaster.jpg",
  /** The four facts, in the order the story tells them. */
  facts: [
    "Andy started his career selling the top end of the Australian market, homes worth $10 million to $20 million, Australia-wide.",
    "After two years he was head-hunted to advise some of the biggest companies in property.",
    "In the past five years his advice has generated over $4 billion in property sales.",
    "His lesson: the campaign that gets maximum price for a $20 million home is the same one that gets it for a first home. A good market won’t save a weak campaign, and a slack agent can’t hide behind a slow one.",
  ],
  /** The one headline figure about Andy. */
  salesStat: {
    value: "$4B+",
    label: "in property sales from Andy’s advice, past 5 years",
  },
  pullQuote:
    "Your first home or your forever home deserves the same campaign as a $20 million one. Most people are just never shown how.",
} as const;
