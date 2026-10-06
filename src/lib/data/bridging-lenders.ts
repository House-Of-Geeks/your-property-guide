// What each bank publishes about bridging finance, for the "Which banks offer
// bridging loans?" table on /guides/bridging-loans-guide (bridging loans plan,
// 6 Oct 2026). Every cell comes from the lender's own page, fact sheet, target
// market determination or rate schedule, read on CHECKED_ON; a cell the
// lender doesn't publish says so rather than guessing. We hold no credit
// licence: this is general information, not a ranking or a recommendation.
// Recheck every quarter: rates and products change (Westpac and ANZ announced
// variable rate changes for 9 Oct 2026, after this was read).

export const BRIDGING_LENDERS_CHECKED_ON = "2026-10-06";

export interface BridgingLender {
  lender: string;
  /** The product name the lender uses, or a note when it has none. */
  product: string;
  offers: "yes" | "no" | "unclear";
  /** Maximum bridging term, as published. */
  term: string;
  /** How interest is handled during the bridging period. */
  interest: string;
  /** Lending limit, as published. */
  limit: string;
  /** Published bridging rate with the date the page gives, or why there isn't one. */
  rate: string;
  /** Anything else a buyer would want to know first. */
  notes: string;
  sources: readonly { label: string; href: string }[];
}

export const BRIDGING_LENDERS: readonly BridgingLender[] = [
  {
    lender: "Westpac",
    product: "Bridging Loan",
    offers: "yes",
    term: "Up to 12 months, including buying land and building",
    interest: "Added to the loan (capitalised); no repayments on the bridging loan. The end debt is a separate home loan.",
    limit: "Total lending up to 80% of both properties' combined value",
    rate: "9.42% a year (page undated, read 6 Oct 2026), rising 1 point after the first 3 months",
    notes: "Owner-occupiers only. $600 establishment, $100 documents, $8 a month, $350 discharge.",
    sources: [
      { label: "Westpac: Bridging loan", href: "https://www.westpac.com.au/personal-banking/home-loans/bridging-loan/" },
      { label: "Westpac: Financing your next home", href: "https://www.westpac.com.au/personal-banking/home-loans/next-home/financing-your-next-home/" },
    ],
  },
  {
    lender: "Commonwealth Bank",
    product: "Bridging loan",
    offers: "yes",
    term: "Up to 12 months from funding to sell",
    interest: "Interest-only payments on the bridging loan; you must show you can pay interest only on the total debt",
    limit: "Not published as a figure: based on both properties, borrowing capacity and LVR",
    rate: "No separate bridging rate: Standard Variable Rate products only",
    notes: "Existing CBA customers, or new customers with at least $250,000 of ongoing debt. Both properties are valued. No early repayment penalty.",
    sources: [
      { label: "CommBank: Bridging loan", href: "https://www.commbank.com.au/home-loans/bridging-loan.html" },
      { label: "CommBank: Bridging loan fact sheet", href: "https://www.commbank.com.au/content/dam/commbank/personal/home-loans/fact-sheets/bridging-loan.pdf" },
    ],
  },
  {
    lender: "NAB",
    product: "NAB FlexiPlus Mortgage (a line of credit for bridging)",
    offers: "yes",
    term: "Up to 12 months",
    interest: "NAB's documents differ: monthly interest on the product page, interest debited to the account in the loan terms",
    limit: "Total credit up to 80% of both homes' combined value (at least 20% equity)",
    rate: "10.11% a year (Choice Package 9.96%), as at 5 Oct 2026",
    notes: "$600 application fee and $250 annual fee.",
    sources: [
      { label: "NAB: FlexiPlus Mortgage facility", href: "https://www.nab.com.au/personal/home-loans/nab-flexiplus-mortgage-facility" },
      { label: "NAB: Home loan interest rates", href: "https://www.nab.com.au/personal/interest-rates-fees-and-charges/home-loan-interest-rates" },
    ],
  },
  {
    lender: "ANZ",
    product: "ANZ Bridging Loan",
    offers: "yes",
    term: "12 months from settling the new home, generally not extended. A construction loan can't be the bridging part.",
    interest: "Interest-only repayments on both homes from drawdown",
    limit: "Up to 80% of the new home's value as ANZ assesses it",
    rate: "No separate bridging rate: ANZ Standard Variable rate applies",
    notes: "You must show you can repay both loans and may need savings. Non-ANZ customers refinance to ANZ first.",
    sources: [
      { label: "ANZ: Bridging loan", href: "https://www.anz.com.au/personal/home-loans/bridging-loan/" },
      { label: "ANZ: Bridging loans guide (PDF)", href: "https://www.anz.com.au/content/dam/anzcomau/pdf/anz-bridging-loans-guide.pdf" },
    ],
  },
  {
    lender: "St.George, Bank of Melbourne, BankSA",
    product: "Relocation Loan (their bridging loan)",
    offers: "yes",
    term: "Up to 12 months, including buying land and building",
    interest: "Added to the loan (capitalised); no repayments on the relocation loan. The end debt is a standard home loan.",
    limit: "Not published",
    rate: "St.George 9.30%, Bank of Melbourne 9.28%, BankSA 9.29% a year (pages undated, read 6 Oct 2026)",
    notes: "Same fees as Westpac: $600 establishment, $100 documents, $8 a month, $350 discharge.",
    sources: [
      { label: "St.George: Relocation loan", href: "https://www.stgeorge.com.au/personal/home-loans/our-home-loans/specialist/relocation-loan" },
      { label: "Bank of Melbourne: Relocation loan", href: "https://www.bankofmelbourne.com.au/personal/home-loans/our-home-loans/specialist/relocation-loan" },
      { label: "BankSA: Relocation loan", href: "https://www.banksa.com.au/personal/home-loans/our-home-loans/specialist/relocation-loan" },
    ],
  },
  {
    lender: "Bankwest",
    product: "Bankwest Simple Bridging Home Loan",
    offers: "yes",
    term: "Usually up to 6 months, unless a longer period or extension is agreed",
    interest: "Your choice: monthly interest-only payments, or capitalised with no repayments",
    limit: "Not published",
    rate: "Not published",
    notes: "Only alongside a Bankwest Simple Home Loan; the existing loan must be with Bankwest or refinanced to it.",
    sources: [
      { label: "Bankwest: Home loans", href: "https://www.bankwest.com.au/home-loans" },
      { label: "Bankwest: Simple Bridging Home Loan TMD (PDF)", href: "https://www.bankwest.com.au/content/dam/bankwest/documents/tmd/Home-loans/27-05-2026/bankwestsimplebridginghomeloan-tmd-270520261254.pdf" },
    ],
  },
  {
    lender: "Bendigo Bank",
    product: "Bridging Home Loan (Variable Rate)",
    offers: "yes",
    term: "6 months for an established home, 12 months for land or construction",
    interest: "Must be capitalised; no repayments during the bridging period",
    limit: "Peak debt, with capitalised interest, up to 80% of both properties' combined value",
    rate: "10.29% a year, effective 5 Oct 2026",
    notes: "Covers homes sold but not settled, and homes not yet sold. Individual borrowers, one property sale.",
    sources: [
      { label: "Bendigo Bank: Bridging finance fact sheet (PDF)", href: "https://www.bendigobank.com.au/globalassets/documents/personal/homeloans/bridging-finance-fact-sheet.pdf" },
      { label: "Bendigo Bank: Schedule of lending interest rates (PDF)", href: "https://www.bendigobank.com.au/globalassets/documents/interestrates/schedule-of-lending-interest-rates.pdf" },
    ],
  },
  {
    lender: "Bridgit (non-bank)",
    product: "Bridging loan",
    offers: "yes",
    term: "Up to 24 months",
    interest: "Calculated upfront and added to the loan, recalculated if you repay early",
    limit: "Up to 85% LVR, loans up to $10 million",
    rate: "Owner-occupier bridge rate from 8.99% a year, then a stay rate from 7.79% once the sale brings the balance down (read 6 Oct 2026)",
    notes: "Set-up fee from 0.60% of the loan, valuations from $220, discharge $450, document preparation $770. No exit fees.",
    sources: [{ label: "Bridgit: Rates and fees", href: "https://www.bridgit.com.au/rates-and-fees" }],
  },
  {
    lender: "Yard (non-bank)",
    product: "Bridging loan",
    offers: "yes",
    term: "6 to 12 months",
    interest: "Can be capitalised",
    limit: "Loans of $150,000 to $5 million",
    rate: "From 6.90% a year variable at up to 80% LVR, for applications from 15 May 2026",
    notes: "Fees not itemised on the product page.",
    sources: [{ label: "Yard: Bridging loan", href: "https://www.yard.com.au/loans/bridging-loan" }],
  },
  {
    lender: "Suncorp",
    product: "Bridging Loan, no longer available for sale",
    offers: "no",
    term: "n/a",
    interest: "n/a",
    limit: "n/a",
    rate: "n/a",
    notes: "Suncorp Bank's fee schedule lists the Bridging Loan as no longer available, and it stops taking home loan applications from 7 Oct 2026.",
    sources: [
      { label: "Suncorp Bank: Lending fees and charges (PDF)", href: "https://www.suncorpbank.com.au/content/dam/suncorp/bank/documents/product-information/personal-business-lending-fees-and-charges.pdf" },
    ],
  },
  {
    lender: "Macquarie, ING",
    product: "No bridging product published",
    offers: "unclear",
    term: "Not published",
    interest: "Not published",
    limit: "Not published",
    rate: "Not published",
    notes: "Neither publishes a bridging loan on its site; ask before you apply.",
    sources: [
      { label: "Macquarie: Broker credit guidelines (PDF)", href: "https://www.macquarie.com.au/assets/bfs/documents/broker/mortgages/macquarie_broker-credit-guidelines.pdf" },
      { label: "ING: Next home loan", href: "https://www.ing.com.au/home-loans/next-home-loan.html" },
    ],
  },
];

/**
 * The published rates of the bank bridging loans that capitalise interest
 * (Westpac 9.42%, the St.George group 9.28% to 9.30%, Bendigo 10.29%), low
 * and high, for the calculator's example rate and the guide's copy. NAB is
 * left out because its documents disagree on whether interest is capitalised.
 */
export const PUBLISHED_CAPITALISED_RATES = { low: 9.28, high: 10.29 } as const;
