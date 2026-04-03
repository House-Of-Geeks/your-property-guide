interface CkanResult<T> {
  success: boolean;
  result: { records: T[]; total: number };
  error?: { message: string };
}

/**
 * Paginate through a CKAN datastore_search endpoint and return all records.
 * Works with data.vic.gov.au, data.nsw.gov.au, data.sa.gov.au, data.qld.gov.au
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
 * Get the latest resource ID from a CKAN package by file format preference.
 * Useful when resource IDs are not known in advance.
 */
export async function getCkanResourceId(
  packageId: string,
  baseUrl: string,
  preferFormat = "CSV"
): Promise<string> {
  const url = `${baseUrl}/api/3/action/package_show?id=${packageId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`CKAN package HTTP ${res.status}: ${url}`);
  const json = await res.json() as { success: boolean; result: { resources: Array<{ id: string; format: string; name: string; created: string }> } };
  if (!json.success) throw new Error(`CKAN package error: ${packageId}`);

  const resources = json.result.resources;
  // Prefer the requested format, fall back to first resource
  const match =
    resources.find((r) => r.format.toUpperCase() === preferFormat.toUpperCase()) ??
    resources[0];
  if (!match) throw new Error(`No resources found in package: ${packageId}`);
  return match.id;
}
