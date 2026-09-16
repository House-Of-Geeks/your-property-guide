# Your Property Guide — valuation & agent search plan

September 2026. Built as soon as it is agreed; measured 30, 60 and 90 days after the last item ships.

## Objective

Make yourpropertyguide.com.au rank for the searches people run before they decide to sell or buy:
what is my home worth, what do homes in my suburb sell for, who are the agents here. Convert that
traffic into appraisal requests and guide downloads.

## What this plan is built on

1. **The intent brief.** The commercial-intent searches we want are people working out what their
   own home is worth, or what homes in an area are worth, so they can buy or sell. Every item below
   serves that intent or the step after it: appraisal, then agent. Generic buying guides, renting,
   first-home schemes and investing content are out of scope here.
2. **Keyword research, 15–16 September.** Two Google Keyword Planner pulls for Australia, 28,000
   keywords. Roughly 190,000 searches a month across valuation, appraisal, area-price and
   sold-price intents, plus an estimated 150,000–250,000 a month for "real estate agents {suburb}".
   This sizes and ranks the items.
3. **Search Console baseline, 16 September.** The site's full Google history, pulled through the API
   with no row cap. It starts in April 2026, when the site first appeared in Google, so it is about
   five and a half months of data. Zero clicks on any of these intents. 5,504 impressions on
   "{suburb} median price" searches at an average position of 31. Appraisal searches landing on the
   rental sub-page instead of the suburb page. The sold hub and the agents hub crawled by Google but
   left out of the index as thin. The valuation pages indexed but never shown. This sets the order
   and the targets.

All three point the same way: the brief names the intent, the keyword data shows it is large, and
the Search Console data shows the site is not yet serving it.

## Ground rules

These are how we work on this site, and they apply to every item.

- **Measure before and after.** A Search Console and Bing snapshot is saved before each change,
  and the pulls in the measures table are the after.
- **Existing URLs never change.** Where a page already serves an intent, we improve that page. New
  URLs are only for intents that have no page.
- **Every figure passes a data-quality check.** Medians, growth rates and yields only render when
  the data behind them clears an automated test. Where it does not, the figure is withheld and the
  page says so.
- **One change ships at a time, on its own commit.** Anything can be rolled back alone.
- **Deploys avoid the crawl window.** No deployment within two hours of notifying search engines of
  changed URLs, because a fresh deploy plus a crawl wave has taken the database down before.
- **Template changes are normally spaced apart** so Search Console movement can be attributed to
  one cause. Here they ship as each is ready. The cost is that the movement reads as one change
  rather than four; the change log keeps each ship date.

## Success measures

Baseline is the 16 September pull. Measurement is 30, 60 and 90 days after the last item ships,
using the same pull. Targets are modest on purpose: Google has only five months
of history on this domain. Leads are the number that matters; the rest are leading indicators.

| Measure | Baseline, 16 Sep | +30 days | +60 days | +90 days |
| --- | ---: | ---: | ---: | ---: |
| Clicks a month across all commercial intents | 0 | 20 | 80 | 200 |
| "{suburb} median / average price" searches: average position | 31 | 25 | 18 | 14 |
| "{suburb} median / average price" searches: clicks a month | 0 | 10 | 40 | 100 |
| Appraisal searches landing on the suburb page rather than the rental sub-page | 0% | 50% | 80% | 90% |
| "How much is my house worth" page: impressions a month | 0 | 200 | 1,000 | 3,000 |
| City market pages: average position | 51 | 45 | 35 | 25 |
| "Agents in {suburb}" pages indexed | – | 500 | 2,000 | 5,000 |
| Match requests a month from agents pages | 0 | 3 | 8 | 15 |
| Appraisal requests, match requests and guide downloads a month | 4 | 8 | 15 | 30 |
| NSW sold pages indexed (measured from their own ship date) | 0 | 100 | 200 | 400 |

## Order of work

Everything can be built in parallel. Shipping follows this order because each later item links
into the earlier ones:

1. **Suburb price section** — all states at once.
2. **House-worth page** — suburb first, then the appraisal form; links into the price section.
3. **City house-price pages** — link into suburb price sections and the estimator.
4. **Real estate agents in {suburb} pages** — lead-gen first, agent listings grow as the network
   does.
5. **Sold in {suburb} pages, NSW** — as soon as the manual Valuer General downloads are imported.

The two content items, appraisal page copy and the private-sale guide, ship whenever the copy is
approved; they do not touch a template and have no place in the order.

Before each ship: snapshot saved, five sample pages checked in Google's Rich Results Test, change
log row written. Sold-in-suburb pages outside NSW stay parked until there is a per-sale data source (item 7).

## Work items

Each item states the searches it serves, what gets built, the quality gate, how it rolls out, and
the test for "done".

### 1. Suburb price section

**Searches served.** "{suburb} median house price", "{suburb} house prices", "{suburb} property
appraisal", "how much is my house worth {suburb}". 5,504 impressions a month at position 31 today.
Google currently shows the neighbouring suburb (Hawthorn East for "hawthorn median house price")
because the median appears once in a paragraph and never in a heading, so it cannot tell which
page is the Hawthorn price page.

**What gets built.** On every suburb page:

1. A new section directly under the summary strip, headed **"House prices in {Suburb}"**: median
   house and unit price, twelve-month change, the number of sales behind the median, and the
   existing source-and-date line. The five-year price history table and chart move up into this
   section from lower on the page. A "recent sales" block joins it for NSW suburbs once the sales
   data is imported (item 7).
2. Two new questions in the page's FAQ, worded the way people search: "What is the median house
   price in {Suburb}?" and "How much is my house worth in {Suburb}?" The second answers with the
   median range by property type and points to the appraisal form. The page's structured data
   follows the visible text.
3. A visible heading, **"Free property appraisal in {Suburb}"**, above the existing appraisal form,
   with one sentence on what an appraisal is.
4. Page titles stay as they are. The description gains "Median house price $X" only when the
   figure clears the quality check.
5. On the rental-market sub-page, one link back to the suburb page's appraisal block, so the
   rental page stops winning sale-appraisal searches.

**Quality gate.** Nothing renders unless the price is reliable; growth only within plausible
bounds; each rule has a test.

**Rollout.** All states in one release. The quality gate already withholds figures where data is
weak, so a state-by-state rollout adds nothing but delay. The section reads figures already stored
on each suburb, so it adds no database load.

**Done when.** Five sample pages pass the Rich Results Test; "hawthorn median house price" shows
the Hawthorn page; the +30 day pull has the median cluster below position 25.

### 2. House-worth page: suburb first, then a free appraisal

**Searches served.** "How much is my house worth" and its variants (about 40,000 a month),
"property value estimate" (14,800), "home appraisal calculator" (3,400). The existing guide has had
zero impressions since July because it explained why estimates differ and offered nothing to do.

**Why not an estimator.** Any number we computed from a suburb median would be the suburb's
median dressed up as a valuation, and people searching this phrase have already seen real
estimates from the portals. Dressing ours up would undercut the trust the site is built on and the
appraisal it sits beside. The suburb pages already carry the appraisal form under the price
section and the "How much is my house worth in {Suburb}?" question, so the intent is served at
suburb level; what was missing was a way to act on the national page.

**What gets built.**

1. The guide page keeps its URL and gains an action block at the top: pick a suburb, see that
   suburb's median house price, twelve-month change, unit median and source line, stated plainly
   as the suburb's figures and not the visitor's house, then the same short appraisal form (name, email, mobile, address)
   the suburb pages use, attributed to the guide and the suburb. Where a suburb's median is
   withheld, the form still works and the page says why there is no figure.
2. The guide is retitled **"How Much Is My House Worth? Free Property Appraisal (Australia)"**
   with a description that says what the page now does. The explainer on the three kinds of number
   stays below the block.
3. The appraisal form everywhere gains one optional, one-tap question: when are you thinking of
   selling. Leads that answer "within 3 months" are flagged hot in the agent handoff, the same
   scoring the guide funnel uses, without adding a required field to a form that converts because
   it is short.
4. No suburb-level sub-pages. The suburb page owns "how much is my house worth in {Suburb}";
   a second URL for the same intent would compete with it.

**Quality gate.** The suburb figures shown pass the same reliable-price test as the suburb page;
nothing is labelled an estimate or a valuation.

**Done when.** The guide records impressions on "how much is my house worth" queries in the
+30 day pull; the first appraisal request arrives with a guide source.

### 3. City house-price pages

**Searches served.** "perth property market" (6,600 a month, already position 10 on Bing), "sydney
house prices" (5,400), "median house price {city}"; about 87,000 a month across the capitals. The
city pages average position 51 today.

**What gets built.** On each city market page: title **"{City} House Prices & Property Market
2026: Median, Growth, Suburbs"**; a heading "Median house price in {City}"; a table of the twenty
highest-volume suburbs with median, twelve-month change and a link to each suburb's price section;
a twelve-month trend; the appraisal call to action. Three hundred words of copy per city describing
what the numbers show, sourced and dated, no recommendations.

**Rollout.** All eight cities in one release: Perth, Sydney, Melbourne, Brisbane, Adelaide, Gold
Coast, Canberra, Hobart. Perth copy is written first so it is the best of them.

**Done when.** The Perth page is in Google's top 30 for "perth property market" at +60 days.

### 4. Real estate agents in {suburb} pages

**Searches served.** "real estate agents {suburb}": a median of 190 a month per residential suburb
and about 880 per regional city in our sample, at $3–30 a click on Google Ads, which is the
incumbents (OpenAgent, LocalAgentFinder, WhichRealEstateAgent) bidding on exactly this moment.
Nobody searches "best real estate agent {suburb}"; they search for the agents and decide on the
page. The agents hub is crawled and not indexed today, and no suburb-level page exists.

**The approach.** We do not yet have agents for most suburbs, so the page launches as a lead-gen
page first and grows into a directory as the agent network does. The searcher gets a useful answer
either way: what agents in this suburb charge, what to ask them, and a way to be matched with two
or three who work the area. Listed agents appear on the page as soon as any cover the suburb.

**What gets built.** A new page per suburb at `/suburbs/{suburb}/agents`, **"Real Estate Agents in
{Suburb} {State} {Postcode}"**, with these sections in order:

1. **Get matched** — the existing homepage agent-match flow, reused as is with the intent set to
   selling and the suburb pre-set, so the visitor lands straight on the timeframe question and then
   the contact step. Framed as "we'll connect you with two to three agents who sell in {Suburb}".
   This is the lead, with the same scoring and routing as the homepage.
2. **Agents who sell in {Suburb}** — the agents and agencies whose coverage includes the suburb,
   each with their agency and the suburbs they cover. Where there are none yet, the section reads
   "We're adding agents in {Suburb}. Request a match and we'll find you one" and the match form is
   the only path. As agents are onboarded, this section fills in without any further template work.
3. **What agents charge in {Suburb}** — the state's commission range and typical marketing costs,
   linked to the state commission guide and the commission calculator, worked on the suburb's
   median price so the figure is local: "On a $X median house, 2 to 2.5% is $Y to $Z".
4. **Choosing an agent here** — the questions-to-ask guide and the how-to-choose-a-selling-agent
   guide, summarised in five points with links.
5. **Selling in {Suburb} right now** — median, twelve-month change and sales count from the suburb
   price section, and the free appraisal call to action.

Regional-city and capital-city versions come from the same template.

**Quality gate.** The page carries real local substance with zero agents: the commission figures
worked on the suburb median, the choosing-an-agent content and the price data. It enters the
sitemap wherever the suburb has a reliable median, the same gate as the price section. Suburbs
without a reliable median render the page but tell search engines not to index it. No ratings and
no "best" claims. Agents are listed only with their consent, in the order they were onboarded, no
paid placement without labelling.

**Rollout.** All eligible suburbs in one release. Agent listings switch on suburb by suburb as
agents sign up through the "for agents" page; no further template change is needed.

**Done when.** The page is indexed for the top 200 suburbs by search volume; the first match
request arrives with an agents-page source; the first suburb shows a listed agent.

### 5. Appraisal page content

**Searches served.** "property appraisal", "free property appraisal", "house appraisal"; about
9,200 a month at $7–40 a click, the highest of any cluster in the research. The page is a bare form
today: seven impressions in the site's whole history.

**What gets built.** Six hundred words rendered above the form: what an agent appraisal is, how it
differs from a bank valuation and an online estimate, what to have ready, what happens after you
submit, coverage by state. A visible FAQ. Title **"Free Property Appraisal from a Local Agent | No
Obligation"**. Not a template change, so it ships as soon as the copy is approved.

**Done when.** Copy approved; the page records impressions on non-brand appraisal searches.

### 6. Private-sale guide

**Searches served.** "sell my own home", "sell house privately", "sell house yourself"; about
1,600 a month, with no page on the site today.

**What gets built.** A new guide, **"How to sell your house privately in Australia: costs, steps,
and when an agent is worth it"**, published through the normal blog pipeline. An honest
comparison that routes to the selling guide.

### 7. Sold in {suburb} pages — NSW first, once the manual downloads are in

**Searches served.** "sold prices", "recently sold houses near me", "{suburb} sold prices",
"property price history"; about 6,300 a month at the head. The sold hub is crawled and not indexed.

**Data.** The only free per-sale source is the NSW Valuer General's property sales files, which
carry address, sale price, contract date and property type for every NSW sale. The site's sales
table and import were built for exactly these files. The Valuer General blocks automated
downloads, so the step that unblocks this item is a manual download of the weekly and yearly files
into the import folder, then a rerun of the import. Around 15–30% of records will not match to an
address and are left out. Every other state needs a commercial APM or Domain Insight licence and
stays parked.

**What gets built.** The existing `/sold/{suburb}` URLs become **"Recently sold houses in {Suburb}
{State} {Postcode}"**: address, sale price, contract date and property type for the last 24 months,
with the median of the listed sales. The hub becomes a state → suburb index. Linked from the
suburb price section and the house-worth page. Once the data is in, the suburb price section also gains
its "recent sales" block for NSW suburbs.

**Quality gate.** A suburb enters the sitemap only with ten or more matched sales in 24 months;
addresses only where the match to an address is confident; never an owner's name.

**Rollout.** NSW only, all eligible suburbs in one release after the first import. Other states
when a source exists.

**Done when.** The first import is in and 200 NSW sold pages are indexed at +60 days from its ship.

### 8. Measurement and second pass

- 30, 60 and 90 days after the last item ships: re-run the Search Console pull, fill the measures
  table, and compare against the change log.
- After the 60-day pull: whichever of items 1–4 moved least gets a second pass.

## Decisions made

1. **House-worth page.** No estimator: the existing guide page keeps its URL and gains a
   suburb-first appraisal block instead. No suburb sub-pages; the suburb page owns that intent.
2. **Match flow on the agents page.** Reuse the homepage agent-match flow as is, with intent and
   suburb pre-set. No new form.
3. **Sold data.** Manual downloads of the NSW Valuer General sales files. NSW sold pages proceed
   once the first import is in; other states stay parked until a source exists.
4. **Ads.** Not yet, but coming. When they start, the first groups to buy are appraisal and "sell
   my house" at $7–50 a click, pointed at the selling guide. The estimate searches stay organic:
   $1–4 clicks landing on a free tool do not pay back. The pages in this plan are the landing pages
   those ads will need, so nothing here changes when ads begin.

## Risks

- **Domain age.** Google has five months of history on this site. Positions 30–80 on competitive
  head terms are expected for now; the plan bets on suburb-level long tail, where authority matters
  less and the site already has 18,000 pages.
- **Database load.** The agents pages add one lookup per suburb page across up to 18,000 pages. It
  goes through the existing cache, never per request, and deploys stay clear of the crawl window.
  The separate work to move the database further out of the crawl path is still in progress; if it
  is not done first, the agents pages ship with the cache and the caching work follows.
- **Thin pages.** The agents hub was rejected as thin because it had nothing local on it. The
  suburb agents pages avoid that by carrying commission figures worked on the local median, the
  choosing-an-agent content and the suburb price data, whether or not any agent is listed yet. If
  Google still treats them as thin, the fix is more local substance, not more pages.
- **Attribution.** Four template changes shipped close together means the Search Console movement
  reads as one change, not four. Accepted in exchange for speed; the change log keeps the dates,
  and each item can be rolled back on its own.
