// One-time (idempotent) ActiveCampaign setup for the YPG lead sync.
// Creates the seller list and the namespaced custom fields if they don't
// already exist. The House of Geeks AC account is shared across several
// businesses, so everything here is prefixed "YPG".
//
// Run: npx tsx scripts/setup-activecampaign.ts
import { config } from "dotenv";
config({ path: ".env" });

const BASE = process.env.ACTIVECAMPAIGN_API_URL;
const KEY = process.env.ACTIVECAMPAIGN_API_KEY;
if (!BASE || !KEY) {
  console.error("Missing ACTIVECAMPAIGN_API_URL / ACTIVECAMPAIGN_API_KEY in .env");
  process.exit(1);
}

const HEADERS = { "Api-Token": KEY, "Content-Type": "application/json" };

async function api(path: string, init?: RequestInit) {
  const res = await fetch(`${BASE}/api/3${path}`, { ...init, headers: HEADERS });
  const body = await res.json().catch(() => ({}));
  if (!res.ok && res.status !== 422) {
    throw new Error(`${init?.method ?? "GET"} ${path} -> ${res.status}: ${JSON.stringify(body).slice(0, 300)}`);
  }
  return body;
}

// Must match LIST_NAME / FIELD_TITLES in src/lib/activecampaign.ts.
const LIST_NAME = "YPG Property Sellers";

const FIELDS = [
  "YPG Suburb",
  "YPG Suburb Name",
  "YPG Property Type",
  "YPG Bedrooms",
  "YPG Selling Timeframe",
  "YPG Agent Status",
  "YPG Motivation",
  "YPG Price Expectation",
  "YPG Lead Score",
  "YPG Lead Source",
];

async function main() {
  // 1. List
  const lists = await api(`/lists?limit=100`);
  let list = (lists.lists ?? []).find((l: { name: string }) => l.name === LIST_NAME);
  if (list) {
    console.log(`List exists: ${LIST_NAME} (id ${list.id})`);
  } else {
    const created = await api(`/lists`, {
      method: "POST",
      body: JSON.stringify({
        list: {
          name: LIST_NAME,
          stringid: "ypg-property-sellers",
          sender_url: "https://www.yourpropertyguide.com.au",
          sender_reminder:
            "You're receiving this because you downloaded the free Your Property Guide selling guide and opted in to selling tips and market updates.",
        },
      }),
    });
    list = created.list;
    console.log(`Created list: ${LIST_NAME} (id ${list.id})`);
  }

  // 2. Custom fields (+ make them available to all lists via relid 0)
  const existing = await api(`/fields?limit=100`);
  const byTitle = new Map<string, string>(
    (existing.fields ?? []).map((f: { title: string; id: string }) => [f.title, f.id]),
  );
  for (const title of FIELDS) {
    if (byTitle.has(title)) {
      console.log(`Field exists: ${title} (id ${byTitle.get(title)})`);
      continue;
    }
    const created = await api(`/fields`, {
      method: "POST",
      body: JSON.stringify({ field: { type: "text", title, visible: 1 } }),
    });
    const id = created.field?.id;
    console.log(`Created field: ${title} (id ${id})`);
    await api(`/fieldRels`, {
      method: "POST",
      body: JSON.stringify({ fieldRel: { field: id, relid: 0 } }),
    });
  }

  console.log("\nDone. The sync resolves list and field IDs by name at runtime, so no IDs need to be copied anywhere.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
