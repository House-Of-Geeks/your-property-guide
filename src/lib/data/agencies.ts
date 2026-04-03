import type { Agency } from "@/types";

export const agencies: Agency[] = [
  {
    id: "agency-1",
    slug: "thomson-property-group",
    name: "Thomson Property Group",
    logo: "/images/agencies/thomson-property-group.png",
    description:
      "Thomson Property Group is a Margate-based real estate agency specialising in residential sales, property management, and commercial property across the Moreton Bay region. With a commitment to understanding clients' needs and developing tailored plans to achieve their goals, the Thomson family team delivers exceptional service for buyers, sellers, landlords, and tenants.",
    phone: "0434 361 426",
    email: "info@thomsonpropertygroup.com.au",
    website: "https://www.thomsonpropertygroup.com.au",
    address: {
      street: "315 Oxley Ave",
      suburb: "Margate",
      state: "QLD",
      postcode: "4019",
      full: "315 Oxley Ave, Margate QLD 4019",
    },
    suburbs: [
      "burpengary-qld-4505",
      "caboolture-qld-4510",
      "narangba-qld-4504",
      "morayfield-qld-4506",
      "north-lakes-qld-4509",
    ],
    agentIds: ["agent-1", "agent-2", "agent-3"],
    primaryColor: "#1B3A5C",
  },
];
