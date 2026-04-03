import Papa from "papaparse";

interface CkanResult<T> {
  success: boolean;
  result: { records: T[]; total: number };
  error?: { message: string };
}

interface CkanResource {
  id:      string;
  format:  string;
  name:    string;
  url:     string;
  created: string;
}

/**
 * Paginate through a CKAN datastore_search endpoint and return all records.
 * NOTE: Only works when the resource has been ingested into the CKAN datastore.
 * Most Australian government portals store data as file downloads — use
 * getCkanDownloadUrl + downloadCsv instead.
 */
export async function fetchCkan<T>(
  resourceId: string,
  baseUrl: string,
  filters?: Record<string, string>
): Promise<T[]> {
  const results: T[] = [];
  let offset = 0;
  const limit = 1000;

  while (true) {
    const params = new URLSearchParams({
      resource_id: resourceId,
      limit: String(limit),
      offset: String(offset),
      ...(filters ? { filters: JSON.stringify(filters) } : {}),
    });
    const url = `${baseUrl}/api/3/action/datastore_search?${params}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`CKAN HTTP ${res.status}: ${url}`);
    const json = (await res.json()) as CkanResult<T>;
    if (!json.success) throw new Error(json.error?.message ?? "CKAN error");
    results.push(...json.result.records);
    if (json.result.records.length < limit) break;
    offset += json.result.records.length;
  }
  return results;
}

/**
 * Get the package metadata from a CKAN portal.
 */
async function getCkanPackage(packageId: string, baseUrl: string): Promise<CkanResource[]> {
  const url = `${baseUrl}/api/3/action/package_show?id=${packageId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`CKAN package HTTP ${res.status}: ${url}`);
  const json = await res.json() as { success: boolean; result: { resources: CkanResource[] } };
  if (!json.success) throw new Error(`CKAN package error: ${packageId}`);
  return json.result.resources;
}

/**
 * Get the latest resource ID from a CKAN package by file format preference.
 */
export async function getCkanResourceId(
  packageId: string,
  baseUrl: string,
  preferFormat = "CSV"
): Promise<string> {
  const resources = await getCkanPackage(packageId, baseUrl);
  const match =
    resources.find((r) => r.format.toUpperCase() === preferFormat.toUpperCase()) ??
    resources[0];
  if (!match) throw new Error(`No resources found in package: ${packageId}`);
  return match.id;
}

/**
 * Get the direct download URL for a resource in a CKAN package.
 * Use this instead of getCkanResourceId + fetchCkan for file-based resources.
 *
 * @param nameContains - Optional substring to filter resource names (case-insensitive)
 */
export async function getCkanDownloadUrl(
  packageId: string,
  baseUrl: string,
  preferFormat = "CSV",
  nameContains?: string
): Promise<string> {
  const resources = await getCkanPackage(packageId, baseUrl);
  const upper = preferFormat.toUpperCase();

  // Filter by name if provided
  const candidates = nameContains
    ? resources.filter((r) => r.name.toLowerCase().includes(nameContains.toLowerCase()))
    : resources;

  const pool = candidates.length > 0 ? candidates : resources;

  const match =
    pool.find((r) => r.format.toUpperCase() === upper) ??
    pool.find((r) => r.format.toUpperCase() === "XLSX") ??
    pool.find((r) => r.format.toUpperCase() === "XLS") ??
    pool[0];
  if (!match) throw new Error(`No resources found in package: ${packageId}`);
  if (!match.url) throw new Error(`Resource has no download URL: ${match.id}`);
  return match.url;
}

/**
 * Download a CSV from a URL and parse it into typed rows.
 */
export async function downloadCsv<T>(url: string): Promise<T[]> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} downloading CSV: ${url}`);
  const text = await res.text();
  const { data, errors } = Papa.parse<T>(text, { header: true, skipEmptyLines: true, dynamicTyping: false });
  if (errors.length > 0) {
    const critical = errors.filter((e) => e.type === "FieldMismatch" || e.type === "Delimiter");
    if (critical.length > 0) throw new Error(`CSV parse error: ${critical[0].message}`);
  }
  return data;
}
