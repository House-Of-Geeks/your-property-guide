import type { AustralianState } from "@/lib/utils/stamp-duty";
import type { Timeframe } from "@/lib/introductions/rules";

// What /get-help and /find-an-expert take from their query strings. Both pages
// are static, so the form reads these in the browser after hydration
// (src/components/journeys/IntroductionFormFromUrl.tsx).

type ServiceChoice = "selling-agent" | "buyers-agent" | "both";

interface Params {
  getAll(name: string): string[];
}

const SERVICES = new Set(["selling-agent", "buyers-agent", "both"]);
const STATES = new Set(["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"]);
const TIMEFRAMES = new Set(["0-3-months", "3-6-months", "6-12-months", "12-plus-months", "researching"]);

const SERVICE_PARAM: Record<string, ServiceChoice> = {
  "selling-agent": "selling-agent",
  "buyers-agent": "buyers-agent",
  both: "both",
  // ?intent= from older links (suburb and rental pages).
  selling: "selling-agent",
  buying: "buyers-agent",
};

// A repeated parameter counts as absent.
function one(params: Params, key: string): string | undefined {
  const values = params.getAll(key);
  return values.length === 1 ? values[0] : undefined;
}

export function getHelpPrefill(params: Params) {
  const service = one(params, "service");
  const state = one(params, "state")?.toUpperCase();
  const timeframe = one(params, "timeframe");
  const suburb = one(params, "suburb");
  const from = one(params, "from");
  return {
    defaultService: service && SERVICES.has(service) ? (service as ServiceChoice) : null,
    defaultState: state && STATES.has(state) ? (state as AustralianState) : null,
    defaultTimeframe: timeframe && TIMEFRAMES.has(timeframe) ? (timeframe as Timeframe) : null,
    defaultSuburb: suburb && /^[a-z0-9-]+-[a-z]{2,3}-\d{4}$/.test(suburb) ? suburb : null,
    source: from ? `get-help-${from}`.slice(0, 100) : "get-help",
  };
}

export function findAnExpertService(params: Params): ServiceChoice | null {
  const raw = one(params, "service") ?? one(params, "intent") ?? "";
  return Object.hasOwn(SERVICE_PARAM, raw) ? SERVICE_PARAM[raw] : null;
}
