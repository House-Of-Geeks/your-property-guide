export function makeSchoolSlug(name: string, acaraId: string): string {
  const namePart = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${namePart}-${acaraId}`;
}
