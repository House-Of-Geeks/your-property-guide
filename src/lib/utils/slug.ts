export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function propertySlug(address: {
  street: string;
  suburb: string;
  state: string;
  postcode: string;
}): string {
  return toSlug(`${address.street}-${address.suburb}-${address.state}-${address.postcode}`);
}

export function suburbSlug(name: string, state: string, postcode: string): string {
  return toSlug(`${name}-${state}-${postcode}`);
}

export function agentSlug(firstName: string, lastName: string): string {
  return toSlug(`${firstName}-${lastName}`);
}

export function agencySlug(name: string): string {
  return toSlug(name);
}

export function streetSlug(
  streetName: string,
  streetType: string | null,
  streetSuffix: string | null,
): string {
  const parts = [streetName, streetType, streetSuffix].filter(Boolean).join(" ");
  return toSlug(parts);
}
