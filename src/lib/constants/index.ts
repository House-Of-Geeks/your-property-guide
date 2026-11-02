export * from "./suburbs";
export * from "./property-types";
export * from "./seo";
export * from "./journey";

/**
 * 30 days: the window of pages fed by the sync jobs, and of every
 * unstable_cache they read while rendering (a shorter one lowers the page's).
 * Freshness comes from scripts/sync/revalidate-paths.ts after each sync.
 * Page `revalidate` exports must be literals, so they repeat the number.
 */
export const SYNC_FED_REVALIDATE_SECONDS = 2592000;
