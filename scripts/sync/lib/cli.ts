/**
 * Standard CLI flag parser shared by every overlay source.
 *
 *   --dry-run         — fetch + index but skip DB writes
 *   --limit=N         — process only first N addresses (smoke test)
 *   --offset=N        — start from address row N (resume after crash)
 *   --postcode=2000   — process only this postcode (debug)
 *   --no-cache        — re-fetch source polygons from network
 *   --smoke           — implies --limit=1000, --dry-run; quick validation pass
 */
import type { CliOptions } from "./types";

export function parseCli(): CliOptions {
  const args = process.argv.slice(2);
  const get = (n: string): string | null => {
    const a = args.find((s) => s.startsWith(`--${n}=`));
    return a ? a.split("=").slice(1).join("=") : null;
  };
  const has = (n: string): boolean => args.includes(`--${n}`);
  const smoke = has("smoke");
  return {
    dryRun:   smoke || has("dry-run"),
    limit:    smoke ? 1000 : (get("limit") ? parseInt(get("limit")!, 10) : null),
    offset:   get("offset") ? parseInt(get("offset")!, 10) : 0,
    postcode: get("postcode"),
    useCache: !has("no-cache"),
    smoke,
  };
}
