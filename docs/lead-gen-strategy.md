# Vendor Lead-Gen Strategy — Your Property Guide

**Date:** 10 June 2026. **Decision:** reposition yourpropertyguide.com.au from passive education site to a vendor (home seller) lead-generation engine for Australian real estate agents, with a real downloadable "Your Property Guide" as the lead magnet and a multi-step qualification funnel.

This doc condenses three research passes (DataForSEO keyword data, competitor funnel teardowns, lead-magnet/qualification best practice) so the strategy survives beyond the session that produced it.

---

## 1. Why the site wasn't producing leads

- Organic footprint is 939 keywords, almost all programmatic suburb pages ranking positions 23 to 76. Zero top-20 rankings. Estimated traffic value $1,310/mo vs LocalAgentFinder's $43k/mo on the SAME keyword count. Scale exists, commercial relevance does not.
- Every lead surface was passive: single-step forms (enquiry, appraisal, match) with no lead magnet pulling people in and no qualification separating hot vendors from browsers.
- The homepage charter promised "one specialist match, no follow-up", which is a conversion-hostile promise for a lead-gen business.

## 2. Market facts (June 2026, DataForSEO + teardowns)

### Keyword opportunities (AU monthly volume / difficulty)
| Cluster | Keywords | Vol | KD |
|---|---|---|---|
| Fees/commission | real estate agent fees (1,000/KD 1), commission calculator (480/~0), cost to sell my house (480/low) | ~2,000 | 0–2 |
| Valuation | how much is my house worth (4,400/44), property valuation online (1,000/26), free property appraisal (720/36) | ~6,100 | mixed |
| Sell my house | sell my house (720/17, $28 CPC), privately/myself/without-agent cluster (~1,400) | ~3,000 | 3–22 |
| Agent selection | compare real estate agents (170, **$40.59 CPC**), best/find/reviews | ~1,100 | 1–46 |

CPCs of $25–41 on agent-comparison terms prove what a vendor click is worth. Seasonal peak: September (spring). Content should be live by July/August.

### Incumbent economics
- OpenAgent: 20–30% of agent commission per settled referral; ~15k leads/mo in, only ~2k passed on (the qualification IS the product). $187k/mo organic value.
- LocalAgentFinder: flat 0.395% of sale price capped $4,750+GST.
- WhichRealEstateAgent: ~20% of commission; SMS-OTP-verified leads.
- Rule of thumb: a settled vendor referral is worth $4–6k to every platform.
- Agent-side gripe (the market gap): top agents refuse 20–30% commission share, so incumbents skew toward weaker agents. Speed matters: contact within 24h of an appraisal request converts ~80%; a 24h delay cuts it ~60%.

### The winning funnel pattern (all incumbents converge on it)
postcode first → intent split (selling vs browsing) → property type → timeframe → value → contact LAST → verification layer. Multi-step converts ~86% better than single-step (13.85% vs 4.53% avg). 3–5 steps, 1–2 questions per step, auto-advance radios, progress bar from step 2.

## 3. The YPG play

1. **Lead magnet:** a real "Your Property Guide" PDF (The Complete Guide to Selling Your Property in Australia) delivered after a multi-step qualification funnel at `/selling-guide`. Every question framed as personalising the guide.
2. **Qualification (order fixed by research):** suburb → property type+beds → timeframe (the money question) → "signed with an agent yet?" (kill/branch) → motivation (optional) → price expectation (optional) → contact + consent.
3. **Scoring:** HOT = selling ≤3 months + owner + not listed → immediate handoff/callback. WARM = 3–6 months → nurture, agent offer at ~day 30. COLD = everything else → nurture only. Already-listed → guide only, never sold as a lead.
4. **SEO spearheads into the funnel:** commission calculator page (KD~0), agent-fees guide (KD 1), cost-of-selling content, plus a "Selling in {suburb}" module on all 9,600 suburb pages (converts the existing index footprint into funnel entries without touching rankings — keep every URL, 301 nothing).
5. **Agent side (`/for-agents`):** sell *filtering*, not traffic. Qualified, guide-engaged, appraisal-ready vendors; max 2–3 agents per lead; freshness SLA; flat-fee positioning against the 20–30% commission-share incumbents.
6. **Nurture:** delivery email is transactional; drip requires the separate marketing consent. Core seller sequence 8–10 emails over 6–10 weeks keyed to guide chapters; hot leads skip to callback.

## 4. Compliance (Privacy Act / Spam Act)

- APP 7.3: disclosing details to agents for their marketing requires consent. Put a plain-English collection statement at the point of collection, stated as part of the value ("we'll connect you with up to 3 top local agents who may contact you about selling").
- Separate, **unticked** checkbox for YPG's own marketing emails (Spam Act express consent). Guide-delivery email is transactional and doesn't need it.
- Keep consent records: wording shown, timestamp (Lead.message carries the consent snapshot).
- Sender ID + functional unsubscribe on every marketing message, actioned within 5 business days.

## 5. What was built (June 2026)

- `/selling-guide` — multi-step qualification funnel (the lead engine).
- `public/downloads/` guide PDF (regenerate from `scripts/guide-pdf/selling-guide.html` with headless Chrome).
- `/api/leads` extended with `guide-download` type, server-side scoring, score-tagged admin email, guide-delivery confirmation email.
- `/real-estate-commission-calculator` — KD~0 SEO spearhead.
- `/for-agents` — agent acquisition page.
- "Selling in {suburb}" funnel module on suburb profiles.
- Homepage hero: guide-first vendor CTA.

Round 2 (same week):
- All transactional email rebranded to the warm terracotta palette via shared `src/lib/email-theme.ts`; lead email builders extracted to `src/lib/lead-emails.ts` (unit-tested, and the seam for the ActiveCampaign sync). Preview any template with `npx tsx scripts/preview-emails.ts`.
- Guide-delivery email now includes chapter highlights ("start with Ch 3 / Ch 5 / Ch 10").
- OG card renderer (`src/lib/og/render.tsx`) rebranded from the legacy purple to the warm palette — fixes every guide/suburb social card.
- Selling persona hub and both selling guides now link the funnel + commission calculator; llms.txt lists the guide and calculator.
- 12 new tests covering scoring bands, consent serialisation, subject prefixes and email branding (25 total, all passing).

### ActiveCampaign (LIVE as of 2026-06-10)
The sync is built and verified end to end: every guide-download lead is upserted into the House of Geeks AC account (`src/lib/activecampaign.ts`, hook in `/api/leads` after `db.lead.create`, best-effort). List "YPG Property Sellers" + nine YPG custom fields created via `scripts/setup-activecampaign.ts`; tags `ypg-seller`/`ypg-score-*`/`ypg-timeframe-*`/`ypg-agent-*`/`ypg-consented`. List subscription is gated on the marketing-consent checkbox; DO-NOT-CONTACT vendors get a CRM record only. Env vars are in the project `.env` and Vercel production. The four nurture automations (with full email copy) are blueprinted in `docs/activecampaign-automations.md` and need assembling in the AC UI; DKIM on Cloudflare is the blocking step before any marketing send.

### Buying guide (LIVE as of 2026-06-11)
The buyer side of the machine mirrors the seller side. `/buying-guide` runs a 7-step persona funnel (suburb, persona, property type, budget, timeframe, finance, contact) into the same `/api/leads` endpoint with `guideType: "buying"`. Personas: first home / upgrading / investing / downsizing. Buyer scoring: HOT = buying within 3 months AND (pre-approved or cash); WARM = within 3 months without finance, or 3-6 months; COLD = the rest. PDF is `scripts/guide-pdf/buying-guide.html` (35pp, persona call-out boxes, 2026 scheme caps verified) rendered to `public/downloads/your-property-guide-buying-property-australia.pdf`. Buyer-side persona hubs (first home, upgrading, investing) embed the buying funnel as their closing band; selling and renovating hubs embed the selling funnel. AC: buyers land on list "YPG Property Buyers" (id 7) with fields YPG Guide Type / Buyer Persona / Finance Status / Budget (ids 16-19) and tags `ypg-buyer` / `ypg-persona-*` / `ypg-finance-*`. Same consent gate as sellers.

## 6. Not built yet / next

- Email nurture sequence (needs ESP automation; SendGrid templates or Resend).
- SMS OTP verification of phone numbers (WhichRealEstateAgent pattern) once volume justifies it.
- Per-state guide variants and a printable 12-week checklist as secondary magnets.
- Real agent coverage map in lead routing (placeholder IDs remain).
- Paid retargeting of guide downloaders (Meta) once pixel volume exists.
