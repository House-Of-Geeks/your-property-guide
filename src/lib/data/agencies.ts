import type { Agency } from "@/types";

export const agencies: Agency[] = [
  {
    id: "agency-1",
    slug: "thomson-property-group",
    name: "Thomson Property Group",
    logo: "/images/agencies/thomson-property-group.png",
    description:
      "Thomson Property Group has been serving the Caboolture and Moreton Bay region for over two decades. Founded by James Thomson, the agency has grown into one of the most respected names in local real estate, with a team of experienced agents covering sales, property management, and investment advisory. Their deep community ties and comprehensive market knowledge make them the first choice for buyers and sellers across the northern corridor.",
    phone: "07 5495 1200",
    email: "info@thomsonpropertygroup.com.au",
    website: "https://www.thomsonpropertygroup.com.au",
    address: {
      street: "42 King Street",
      suburb: "Caboolture",
      state: "QLD",
      postcode: "4510",
      full: "42 King Street, Caboolture QLD 4510",
    },
    suburbs: [
      "caboolture-qld-4510",
      "caboolture-south-qld-4510",
      "morayfield-qld-4506",
      "burpengary-qld-4505",
      "burpengary-east-qld-4505",
      "narangba-qld-4504",
    ],
    agentIds: ["agent-1", "agent-2", "agent-3", "agent-4", "agent-5", "agent-6"],
    primaryColor: "#1B3A5C",
  },
  {
    id: "agency-2",
    slug: "moreton-bay-realty",
    name: "Moreton Bay Realty",
    logo: "/images/agencies/moreton-bay-realty.png",
    description:
      "Moreton Bay Realty is a dynamic agency focused on the high-growth suburbs of North Lakes, Deception Bay, and Narangba. Led by principal and auctioneer Mark Sullivan, the team combines modern marketing techniques with old-fashioned customer service. Whether you are buying your first home, upgrading, or building an investment portfolio, Moreton Bay Realty delivers results backed by decades of local experience.",
    phone: "07 3482 3100",
    email: "info@moretonbayrealty.com.au",
    website: "https://www.moretonbayrealty.com.au",
    address: {
      street: "15 Endeavour Boulevard",
      suburb: "North Lakes",
      state: "QLD",
      postcode: "4509",
      full: "15 Endeavour Boulevard, North Lakes QLD 4509",
    },
    suburbs: [
      "north-lakes-qld-4509",
      "deception-bay-qld-4508",
      "narangba-qld-4504",
    ],
    agentIds: ["agent-7", "agent-8", "agent-9"],
    primaryColor: "#2E7D32",
  },
  {
    id: "agency-3",
    slug: "north-lakes-property-co",
    name: "North Lakes Property Co",
    logo: "/images/agencies/north-lakes-property-co.png",
    description:
      "North Lakes Property Co is a boutique agency dedicated exclusively to the North Lakes market. Founded by Olivia Park, the agency prides itself on a personalised, data-driven approach that consistently achieves premium results. With a singular focus on one of South East Queensland's most sought-after suburbs, North Lakes Property Co offers unrivalled local expertise and hands-on service from listing to settlement.",
    phone: "07 3482 4500",
    email: "info@northlakespropertyco.com.au",
    website: "https://www.northlakespropertyco.com.au",
    address: {
      street: "8 Commercial Drive",
      suburb: "North Lakes",
      state: "QLD",
      postcode: "4509",
      full: "8 Commercial Drive, North Lakes QLD 4509",
    },
    suburbs: ["north-lakes-qld-4509"],
    agentIds: ["agent-10"],
    primaryColor: "#6A1B9A",
  },
];
