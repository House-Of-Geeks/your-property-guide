export const PROPERTY_TYPES = [
  { value: "house", label: "House" },
  { value: "townhouse", label: "Townhouse" },
  { value: "apartment", label: "Apartment" },
  { value: "unit", label: "Unit" },
  { value: "land", label: "Land" },
  { value: "acreage", label: "Acreage" },
  { value: "villa", label: "Villa" },
] as const;

export const LISTING_TYPES = [
  { value: "buy", label: "Buy" },
  { value: "rent", label: "Rent" },
  { value: "sold", label: "Sold" },
] as const;

export const BEDROOM_OPTIONS = [
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
  { value: "5", label: "5+" },
] as const;

export const PRICE_RANGES_BUY = [
  { value: "200000", label: "$200K" },
  { value: "300000", label: "$300K" },
  { value: "400000", label: "$400K" },
  { value: "500000", label: "$500K" },
  { value: "600000", label: "$600K" },
  { value: "750000", label: "$750K" },
  { value: "1000000", label: "$1M" },
  { value: "1500000", label: "$1.5M" },
  { value: "2000000", label: "$2M" },
] as const;

export const PRICE_RANGES_RENT = [
  { value: "300", label: "$300/wk" },
  { value: "400", label: "$400/wk" },
  { value: "500", label: "$500/wk" },
  { value: "600", label: "$600/wk" },
  { value: "700", label: "$700/wk" },
  { value: "800", label: "$800/wk" },
  { value: "1000", label: "$1000/wk" },
] as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price (Low to High)" },
  { value: "price-desc", label: "Price (High to Low)" },
  { value: "beds-desc", label: "Bedrooms (Most)" },
] as const;
