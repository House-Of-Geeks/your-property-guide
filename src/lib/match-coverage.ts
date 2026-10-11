// What the match and appraisal forms may promise (commercial-intent review,
// 10 Oct 2026, F4 and section 0.2 item 11). Coverage behind the "one local
// agent" introduction is not confirmed suburb by suburb, so no form promises
// an agent "who sells in {suburb}", a reply "within one business day" or "the
// right person". Each form carries the coverage caveat /appraisal has printed
// since 1 Oct (less the word "vetted": no vetting criteria are stated) beside
// the #57 fee disclosure, which stays as it was.
//
// Pure strings, safe to import from client components. Tested in
// tests/seo/match-promises.test.ts, which also scans the pages and forms for
// the promise wording.

/** Printed beside every match and appraisal form. */
export const COVERAGE_CAVEAT =
  "Coverage depends on having an agent in your area. Where we do not yet have one, we tell you rather than pass your details on.";

/** The same rule for the match form, which also introduces brokers and other specialists. */
export const MATCH_COVERAGE_CAVEAT =
  "Coverage depends on having a specialist for your situation in your area. Where we do not yet have one, we tell you rather than pass your details on.";

/**
 * Phrases no consumer page or form in the agents and appraisal vertical may
 * print: a match or speed promise the network cannot back.
 */
export const PROMISE_PATTERNS: readonly RegExp[] = [
  /within (one|1|24) (business )?(day|hours?)/i,
  /24-hour response/i,
  /reach out within/i,
  /find (you )?the right (person|specialist)/i,
  /we(?:&rsquo;|'|’)ll find/i,
  /we(?:&rsquo;|'|’)ve got the right person/i,
  /one agent who (sells|has recent sales) in/i,
  /our team will find you/i,
  /agent who actually sells in/i,
  /vetted (local )?(agent|specialist)/i,
  /know which lender will say yes/i,
  /compares 30\+ lenders/i,
];
