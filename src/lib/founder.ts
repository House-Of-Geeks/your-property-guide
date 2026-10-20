// Andy McMaster, the founder.
//
// These are the only facts the site may state about Andy. The homepage, the
// about page and the Person JSON-LD all read them from here. Anything else
// (a client story, a testimonial, an award, a review count, another figure)
// needs Andy's confirmation first: leave a TODO(andy) instead.
//
// 20 Oct 2026 ("Clear decisions"): Andy's experience is supporting
// background. It establishes why the guides are worth reading; it isn't the
// headline, and the $10 to $20 million homes are never the promise. The
// sales figure stays a verified fact for the about page, not a headline stat.

export const FOUNDER = {
  name: "Andy McMaster",
  role: "Founder",
  /** The about page's anchor and the Person JSON-LD @id fragment (/about#andy-mcmaster). */
  id: "andy-mcmaster",
  /** Andy's own portrait (confirmed by the approved "Clear decisions" design, 20 Oct 2026). */
  photo: "/images/agents/andy-mcmaster.jpg",
  /** One line, beside his portrait. */
  summary:
    "Andy McMaster has worked in property sales and advised property businesses. Your Property Guide brings that experience into practical explanations of the decisions ahead.",
  /** The background, for "More about Andy" and the about page, in the order it happened. */
  facts: [
    "Andy started his career selling homes worth $10 million to $20 million across Australia.",
    "After two years he was head-hunted to advise property companies.",
    "In the past five years his advice has generated over $4 billion in property sales.",
  ],
  /** Why the guides exist, in Andy's words. */
  aim: "The aim is simple: help you understand your options, so you can work out what matters for your move.",
} as const;
