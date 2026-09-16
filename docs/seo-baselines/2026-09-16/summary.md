# SEO baseline — 2026-09-16

Search Console API pull (service account hog-350@why-solar, property sc-domain:yourpropertyguide.com.au,
web search, no row cap). Requested 2025-05-21 → 2026-09-13; Google holds data from April 2026 only, so this
is the site's full history.

- **Total:** 1,811 clicks, 693,011 impressions. Clicks peaked May 2026 (584), ~315/month since.
- **Query intents (rows with a query attached):** "{suburb} postcode" 263,650 impr / 34 clicks / pos 9.2;
  median/average price 5,504 impr / 0 clicks / pos 31.4; agents 1,900 / 0 / 57.4; house/property prices
  1,557 / 0 / 39.9; commission/fees 1,304 / 0 / 60.4; sell 1,105 / 0 / 71.8; home value/worth 734 / 0 / 46.8;
  appraisal 692 / 0 / 43.3 (mostly rental appraisal landing on /rental-market); sold 14 / 0.
- **Pages:** /suburbs/{slug} 430,408 impr / 294 clicks / pos 10.5; /suburbs/*/rental-market 26,586 / 200;
  /property/* 25,011 / 512; /postcodes/* 74,810 / 30; /guides/* 15,722 / 25.
- **Index status (URL Inspection):** /sold and /agents "Crawled — currently not indexed"; /appraisal,
  /selling-guide, /guides/how-much-is-my-house-worth-australia indexed, 0–11 impressions.
- **Wrong-page landings:** "hawthorn median house price" → hawthorn-east-vic-3123 (pos 23.5) while
  hawthorn-vic-3122 is indexed with a $2,692,500 Land Victoria median; appraisal queries → rental-market
  sub-pages; "what is my house worth hawkesbury" → /regions/hawkesbury (pos 28).

Bing Webmaster and Clarity pulls not taken this round (keys not on this machine). Files: `gsc/queries-by-page.csv`
(37,855 rows), `gsc/pages.csv` (43,830 rows). This is the "before" for valuation plan item 1 (suburb price section).
