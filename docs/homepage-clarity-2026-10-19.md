# Homepage clarity, 19 Oct 2026

Andy's brief: clearer messaging, stronger evidence and a shorter path to useful help, keeping the green, cream and copper palette, the serif headings, Andy's presence and the education-first content. BRAND.md §14 now records the new homepage order; this note says what changed and what's still open.

## What changed

**Homepage** (`src/components/campaign/`)
- First screen: the campaign line stays. Straight under it, the page says what you get: free guidance, a next-step plan built from your answers, and an introduction to one participating agent only if you ask. Andy appears in one line beside his photo.
- Plan card: the choice of selling, buying or both now comes first, then the optional suburb field, then "Build my next-step plan", with "Free · A few quick questions · No sign-up" beside it. Under the button is a preview of the plan: the next three steps, the tools and a checklist. The preview is cut from a real plan (`src/lib/plans/preview.ts`), so it matches what the result gives.
- The move picked in the hero now changes:
  - the supporting message;
  - the field's label;
  - the preview;
  - the calculator;
  - the decision tools;
  - the agent finder;
  - the closing buttons;
  - the header's plan button and the phone bar.

  It works through `MoveProvider publish` in `src/components/interactive/move-context.tsx`. What each move says and offers lives in `moves.ts`.
- Straight under the hero, the "Try it now" band holds the live calculator for the move and three tools that settle the next decision, each saying what it helps you decide. For sellers these are the selling-costs calculator, the agent proposal worksheet and the free 15-minute agreement check, which keeps its general-information line.
- The illustrative $18.5M and $640K homes are gone. In their place is the real Hamilton example (`src/lib/case-studies.ts`, Andy's facts only): $490,000 expected before, $38,000 renovation spend, $820,000 expected after. Both prices are labelled as expected sale prices, and the $330,000 is called an increase in expected sale price, not profit.
- Removed bands: "same playbook" and the five steps (both philosophy), plus the separate tools and agreement-check bands (folded into "Try it now"). The headline figures moved from the hero to the founder band.
- Order: hero, try it now, Hamilton, founder, one agent, the two guides, the closing line.

**Planner** (`src/components/journeys/PlanBuilder.tsx`, `/plan/result`)
- Every answer in the URL is used, and questions already answered are skipped. What's been chosen shows above the question as buttons that reopen it, so a skipped question still counts in the progress bar.
- "Change my answers" sends every answer (`editPlanHref`) and opens a review of all of them, each with its own Change button. Changing the move keeps the state, suburb and timing, and asks only the new questions.
- The state question takes an optional suburb, and picking one sets its state.
- The result shows the move, state, stage, timing and suburb, links the suburb's profile, and offers "Add a suburb" when there isn't one.
- The plan is called the "next-step plan" everywhere (`src/lib/plans/name.ts`): homepage, header, phone bar, questions, result, emails, guide chapters, article CTAs and hubs.
- The links in `next-steps.ts` that carry `ss=` or `h=` now skip those questions. Before, the planner ignored them.

**Navigation** (`src/components/layout/`)
- The header's solid button and the phone bar's first button are the next-step plan for the page's move. They used to be the free guide. The header button is hidden on the planner itself.
- The phone menu has the plan and "Find an agent" at the top, then four collapsible groups (Buying, Selling, Guides and tools, About), one open at a time, then search and the phone number. On a buying or selling page it opens on that group. The repeated move buttons and plan links are gone.
- The Selling menu lists the three decision tools first, each with a one-line "helps you decide" note on phones.

**Agent introductions**
- `/get-help` shows coverage as soon as the place is known. That's on the first step when the link carried a suburb or state, otherwise straight under the suburb field. Before, it came after every other question.
- The optional questions say "(optional)", and the best time and the note sit behind one "Add a best time or a note" toggle.
- The permissions, the fee disclosure and the "what happens when you send this" wording are unchanged.
- The homepage agent finder shows the state's coverage once a suburb is picked.

## Still open
- **Photos of the Hamilton apartment:** none are in the repo, so the case study runs without imagery (`TODO(andy)` in `src/lib/case-studies.ts`).
- **Conversion:** nothing here claims a lift. Measure it from `plan_started` / `plan_completed` (placement `home-hero`) and from qualified introductions (`intro_submitted` with status, and the LeadEvent outcomes) over the next few weeks, against the weeks before 19 Oct.
- **Unused images:** the example-home and styled-room images are still in `public/images/campaign/`, no longer used on the homepage.
