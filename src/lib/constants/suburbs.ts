export const SUBURBS = [
  { name: "Burpengary", postcode: "4505", slug: "burpengary-qld-4505", state: "QLD", region: "Moreton Bay" },
  { name: "Caboolture", postcode: "4510", slug: "caboolture-qld-4510", state: "QLD", region: "Moreton Bay" },
  { name: "Narangba", postcode: "4504", slug: "narangba-qld-4504", state: "QLD", region: "Moreton Bay" },
  { name: "Morayfield", postcode: "4506", slug: "morayfield-qld-4506", state: "QLD", region: "Moreton Bay" },
  { name: "Deception Bay", postcode: "4508", slug: "deception-bay-qld-4508", state: "QLD", region: "Moreton Bay" },
  { name: "North Lakes", postcode: "4509", slug: "north-lakes-qld-4509", state: "QLD", region: "Moreton Bay" },
] as const;

export type SuburbSlug = (typeof SUBURBS)[number]["slug"];
