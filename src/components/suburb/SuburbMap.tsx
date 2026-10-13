"use client";

import { useState } from "react";
import { ArrowUpRight, Map as MapIcon } from "lucide-react";

const GMAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "";

interface SuburbMapProps {
  name: string;
  state: string;
  postcode: string;
}

/**
 * Click-to-load map for the Location section. The embed was the profile's
 * hero (an iframe above the fold, the page's LCP and its heaviest request);
 * it now loads only when asked for, and the plain Google Maps link needs no
 * key and no script. Opening the map pushes the content below it down, which
 * Core Web Vitals do not count as a layout shift because it follows a tap.
 */
export function SuburbMap({ name, state, postcode }: SuburbMapProps) {
  const [open, setOpen] = useState(false);
  const query = encodeURIComponent(`${name} ${state} ${postcode}`);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
  const embedUrl = GMAPS_KEY
    ? `https://www.google.com/maps/embed/v1/place?key=${GMAPS_KEY}&q=${query}&zoom=13`
    : null;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {embedUrl && !open && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-md border border-ink px-4 py-2.5 text-sm font-semibold text-ink hover:bg-ink hover:text-white transition-colors cursor-pointer"
          >
            <MapIcon className="w-4 h-4" aria-hidden="true" />
            Show the map
          </button>
        )}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-semibold text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink"
        >
          Open {name} in Google Maps
          <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
        </a>
      </div>
      {embedUrl && open && (
        <iframe
          src={embedUrl}
          title={`Map of ${name} ${state} ${postcode}`}
          className="mt-4 block w-full h-72 sm:h-96 rounded-xl border border-line"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      )}
    </div>
  );
}
