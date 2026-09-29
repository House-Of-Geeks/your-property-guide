// The words on a postcode page: title, description, lead and the two
// reverse-lookup answers. Pure; tested in tests/seo/postcode-copy.test.ts.
//
// A postcode's suburbs and the delivery names Australia Post uses in it are
// different things ("Hervey Bay" and "Hervey Bay DC"). The page names the
// suburbs as suburbs and the delivery names as delivery names; a postcode
// that only has delivery names (6849, Perth BC) says so. With no delivery
// names the copy is what it was before 29 Sep 2026, word for word.

export interface PostcodeCopyInput {
  postcode: string;
  state: string;
  /** Real suburbs, in display order. */
  suburbNames: string[];
  /** Delivery names, institutions and shopping-centre post offices. */
  postalNames: string[];
  avgMedianHousePrice?: string | null;
}

const TITLE_BUDGET = 60;

function list(names: string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

export function postcodeTitle({ postcode, state, suburbNames, postalNames }: PostcodeCopyInput): string {
  const names = suburbNames.length > 0 ? suburbNames : postalNames;
  const build = (count: number) => {
    const more = names.length > count ? " & more" : "";
    return `${postcode} Postcode — ${names.slice(0, count).join(", ")}${more} (${state})`;
  };
  const three = build(3);
  return three.length <= TITLE_BUDGET ? three : build(2);
}

function alsoUsedFor(postcode: string, postalNames: string[]): string {
  if (postalNames.length === 0) return "";
  const one = postalNames.length === 1;
  return ` Australia Post also uses ${postcode} for ${list(postalNames)}, ${one ? "a delivery name rather than a suburb" : "delivery names rather than suburbs"}.`;
}

export function postcodeDescription({ postcode, state, suburbNames, postalNames, avgMedianHousePrice }: PostcodeCopyInput): string {
  if (suburbNames.length === 0) {
    return `Postcode ${postcode} is an Australia Post delivery postcode in ${state}, used for ${list(postalNames)}. It has no residential suburbs of its own.`;
  }
  const shown = suburbNames.slice(0, 3).join(", ");
  const more = suburbNames.length > 3 ? ` and ${suburbNames.length - 3} more` : "";
  const price = avgMedianHousePrice ? `Average median house price ${avgMedianHousePrice}. ` : "";
  return `Postcode ${postcode} is ${shown}${more} in ${state}. ${price}Browse suburb profiles, schools and property data.`;
}

export function postcodeLead({ postcode, state, suburbNames, postalNames }: PostcodeCopyInput): string {
  if (suburbNames.length === 0) {
    return `Postcode ${postcode} is in ${state}. Australia Post uses it for ${list(postalNames)}; it has no residential suburbs of its own.`;
  }
  const namesShort =
    suburbNames.length > 4
      ? `${suburbNames.slice(0, 4).join(", ")} and ${suburbNames.length - 4} more`
      : suburbNames.join(", ");
  const covers = suburbNames.length === 1 ? "the suburb of" : `${suburbNames.length} suburbs:`;
  return `Postcode ${postcode} is in ${state} and covers ${covers} ${namesShort}. Browse profiles, median prices, schools and property data for each below.`;
}

export function postcodeFaqs(input: PostcodeCopyInput): { question: string; answer: string }[] {
  const { postcode, state, suburbNames, postalNames } = input;
  const which =
    suburbNames.length === 0
      ? `Postcode ${postcode} is not a residential suburb. Australia Post uses it for ${list(postalNames)} in ${state}.`
      : (suburbNames.length === 1
          ? `Postcode ${postcode} is ${suburbNames[0]}, ${state}.`
          : `Postcode ${postcode} covers ${suburbNames.length} suburbs in ${state}: ${suburbNames.join(", ")}.`) +
        alsoUsedFor(postcode, postalNames);
  return [
    { question: `What suburb is postcode ${postcode}?`, answer: which },
    { question: `What state is postcode ${postcode} in?`, answer: `Postcode ${postcode} is in ${state}, Australia.` },
  ];
}
