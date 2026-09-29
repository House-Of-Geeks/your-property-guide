# The remaining readers of a suburb's sales figures: dry run, 29 Sep 2026

Fix item 47, cohort 3. Read-only. Every count below is worked out over the production export of 29 Sep 2026
(17,994 Suburb rows, of which 17,650 are localities; each suburb's newest rental row; 0 hazard rows), by the code
on main ("before") and the code on the branch ("after"). No database was written to. What production printed
before the change is in `before-readers.csv` (54 pages, fetched 29 Sep 2026).

The rule is the suburb page's own (`src/lib/published-medians.ts`): a median is published from a trusted sales
source, with five recorded sales where the count is known; a 12-month change is published from a feed that
measures one (NSW, SA), inside 25%, and never as 0.

## Capital-city pages (8)

| City | Suburbs counted | Median house | Median unit | Typical 12-month change | Fastest-growing table |
|---|---|---|---|---|---|
| Sydney | 729 → 665 | $1,790,046 → $1,775,000 | $411,840, unchanged | 5.2% → 5.3% | 8 rows → 8 rows |
| Melbourne | 417, unchanged | $1,050,000, unchanged | $577,500, unchanged | none → none | none → none |
| Brisbane | 150, unchanged | $1,018,750, unchanged | $564,500, unchanged | 6.9% → none | 7 rows → none |
| Perth | 66, unchanged | $761,250, unchanged | $452,500, unchanged | none → none | none → none |
| Adelaide | 379 → 268 | $1,130,000 → $1,055,625 | $274,320 → $260,280 | 10.6% → 11.5% | 8 rows → 8 rows |
| Hobart | 10, unchanged | $754,750, unchanged | $473,750, unchanged | none → none | none → none |
| Canberra | 91, unchanged | $996,000, unchanged | $636,375, unchanged | none → none | none → none |
| Darwin | 23, unchanged | $575,000, unchanged | $326,160, unchanged | none → none | none → none |

Sydney and Adelaide drop the suburbs whose median rests on one to four sales (64 and 111). Brisbane's 6.9% and
its seven-row table were the seven Moreton Bay and Brisbane suburbs whose growth was entered by hand with the
April seed (Bridgeman Downs, North Lakes, Dakabin, Burpengary, Narangba, Morayfield, Deception Bay); the ABS
figures beside them come without a change. Melbourne, Perth, Hobart, Canberra and Darwin already showed none.

## Region pages (498 region names)

| | Before | After |
|---|---:|---:|
| Regions with a median | 353 | 349 |
| Regions with a typical 12-month change | 140 | 136 |
| Regions with a fastest-growing table (three rows or more) | 87 | 84 |

- The median changes in 116 regions: by under 10% in 67, by 10% or more in 45, and 4 lose it.
- The four that lose it had no suburb with five recorded sales: Alexandrina (4 suburbs, of 1, 2, 1 and 1 sales),
  Blayney (2), Barossa (1), Bland (1).
- Largest moves: Armidale $630,000 → $316,250; Muswellbrook $1,150,000 → $600,000; The Hills $1,175,000 →
  $1,670,000; Moree Plains $250,000 → $350,000; Walgett $255,000 → $350,000. In each, most of the suburbs
  counted before had one to four sales: in Armidale 13 of 15 ("Pinkett, $4,100,000" on one sale).
- Four lose their typical change: Brisbane and Moreton Bay (the hand-entered figures above), Alexandrina and
  Barossa (no suburb left). Three lose the fastest-growing table: Moreton Bay, Prospect, Unley.

## Postcode pages (2,651 postcodes with a locality)

| | Rows |
|---|---:|
| Suburb rows printing a house median before | 4,719 |
| of which the suburb's own page withholds (one to four sales) | 1,268 |
| Unit medians withheld the same way | 1,262 |
| Rows printing a 12-month change of "+0.0%" (no earlier year to compare, printed as a flat year) | 1,733 |
| Rows printing another change that the suburb's page does not | 402 |

| | Postcodes |
|---|---:|
| With an average median before | 1,505 |
| Average changes | 327 |
| of which no average is left | 37 |
| With an average 12-month change before | 1,456 |
| Average changes (the zeros were averaged in) | 1,067 |
| of which none is left | 840 |
| of those, the average was exactly 0 | 804 |

The average median is in the page's meta description, so 327 descriptions change and 37 lose the sentence.

## Search results

17,383 suburbs printed a median in a search result. For 13,932 (80%) the suburb's own page withholds it:
2,960 from the 2021 census proxy, 6,709 left under a rental feed's name, 2,995 from the distrusted QLD and WA
feeds, 1,268 from a trusted feed on fewer than five sales. After: 3,451.

## Suburb finder

| | Before | After |
|---|---:|---:|
| Suburbs a search could match | 4,640, of which 1,500 were taken in no stated order | 2,776, all scored |
| of which the suburb's page withholds the median | 1,864 | 0 |
| With a 12-month change beyond 25%, printed as a reason | 233 | 0 |
| With a published 12-month change | | 1,546 (NSW 1,321, SA 225) |
| With a yield | every suburb with a rent column | 312 (VIC 135, QLD 177), by the yield ranking's rule |
| Hazard records behind "Low flood and bushfire risk" | 0 | 0, and the claim is not made |

After, by state: NSW 1,480, VIC 560, SA 269, QLD 222, WA 104, ACT 90, NT 28, TAS 23.

A search whose top priority has no figure for any suburb has nothing to rank and says why: growth outside NSW
and SA, yield outside VIC and QLD, hazard everywhere until a hazard feed is loaded.

## Listing pages (6 in the sitemap, all in Queensland)

All six printed "Days on market" (24 to 35, from the April seed; no feed measures it) and a hand-entered growth
figure (+7.0% to +9.5%). Three printed a median the suburb's own page withholds (Newport $418,000, Griffin
$427,000, Burpengary East $453,000: census proxies under the rental feed's name). The heading read "Insights for
3-bedroom homes in Newport" over suburb-wide figures for houses. The source line read "ABS Census".

After: Dakabin, Redcliffe and North Lakes print the ABS statistical-area median, labelled as one; all six print
the rent from the suburb's newest bond-data row; none prints a change or days on market.

## School comparisons

The comparison prints each school's suburb median. Five comparisons were read: of their ten medians, four are
ones the suburb's own page withholds (Caboolture $344,000 and Griffin $427,000, census proxies under the rental
feed's name; Richmond, Tasmania, $360,000 from the 2021 census; Keswick $2,475,000, a median of two sales).
After, each prints a dash.

## Not changed, and seen while counting

- Unit medians for NSW and SA look low (Sydney $411,840, Adelaide $260,280). The suburb pages print them, so the
  rollups do. Item 1 follow-up.
- The rollups' rent is a median of the Suburb rent column, which holds seed values where no bond-data row exists.
- Region assignment: see item 50 in the tracker.
- ABS statistical-area medians that look high for the suburb (Morayfield $1,095,000, Upper Caboolture $1,063,750)
  are what the suburb pages publish; whether the right area is matched to the suburb is a question for the feed.
