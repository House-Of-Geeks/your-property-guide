'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// Fallback for no-JS, blocked-script and unsupported-browser cases. Google's
// own library takes over the click when it loads (see usePreferredSource).
const FOLLOW_URL =
  'https://www.google.com/preferences/source?q=yourpropertyguide.com.au';

const PUBLISHER_JS = 'https://news.google.com/swg/js/v1/publisher.js';

const TOOLTIP_COPY =
  'Adds Your Property Guide to your Google preferred sources, so we show up more often in your Top Stories and AI Overviews.';

interface PreferredSourceApi {
  init: (options: { theme?: 'light' | 'dark'; lang?: string }) => void;
  addPreferredSource: () => void;
}

declare global {
  // eslint-disable-next-line no-var
  var PREFERRED_SOURCE: Array<(api: PreferredSourceApi) => void> | undefined;
}

// The library is a singleton: load the script once per page and init it once,
// no matter how many buttons are rendered.
let scriptRequested = false;
let initialised = false;

function loadPublisherScript() {
  if (scriptRequested || typeof document === 'undefined') return;
  scriptRequested = true;

  const script = document.createElement('script');
  script.src = PUBLISHER_JS;
  script.async = true;
  // Stops the library auto-rendering Google's own badge into the page. We
  // trigger the identical flow from our button instead.
  script.setAttribute('preferred-sources-control', 'manual');
  document.head.appendChild(script);
}

/**
 * Binds Google's Preferred Sources library to our own button.
 *
 * The library adds the site as a preferred source in an overlay and returns
 * the reader to where they were, rather than sending them off to Google.
 * Until it is ready (or if it never loads) the button stays a plain link to
 * the source preferences tool, so the fallback path always works.
 */
function usePreferredSource() {
  const [api, setApi] = useState<PreferredSourceApi | null>(null);
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    globalThis.PREFERRED_SOURCE = globalThis.PREFERRED_SOURCE || [];
    globalThis.PREFERRED_SOURCE.push((preferredSource) => {
      if (!initialised) {
        initialised = true;
        preferredSource.init({ theme: 'light' });
      }
      setApi(preferredSource);
    });

    // The library and the iframe and scripts it pulls in come to about 230 KB
    // and 180 to 270 ms of main thread on a throttled phone, and the button sits in the footer, which most visitors never
    // reach. So it loads only when the button comes within a screen or so of
    // the viewport. A tap before it is ready follows the href fallback.
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      const start = () => window.setTimeout(loadPublisherScript, 2000);
      if (document.readyState === 'complete') start();
      else window.addEventListener('load', start, { once: true });
      return () => window.removeEventListener('load', start);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          loadPublisherScript();
        }
      },
      { rootMargin: '800px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const onClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (!api) return; // let the href fallback do its job
      event.preventDefault();
      api.addPreferredSource();
    },
    [api]
  );

  return { ref, onClick };
}

interface FollowOnGoogleProps {
  variant?: 'pill' | 'block';
  className?: string;
}

function GoogleG({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

function Tooltip() {
  return (
    <span
      role="tooltip"
      className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-64 -translate-x-1/2 rounded-lg bg-ink px-3 py-2 text-xs leading-snug text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none"
    >
      {TOOLTIP_COPY}
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-ink"
      />
    </span>
  );
}

export function FollowOnGoogle({ variant = 'pill', className = '' }: FollowOnGoogleProps) {
  const { ref, onClick } = usePreferredSource();

  if (variant === 'block') {
    return (
      <div className={`group relative inline-block ${className}`}>
        <a
          ref={ref}
          href={FOLLOW_URL}
          onClick={onClick}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-3 rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink transition-colors hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <GoogleG className="w-5 h-5 flex-shrink-0" />
          <span className="flex flex-col leading-tight">
            <span className="font-bold">Make Your Property Guide a preferred source</span>
            <span className="text-xs text-ink-muted">
              We&apos;ll appear more often in your Google Top Stories
            </span>
          </span>
        </a>
        <Tooltip />
      </div>
    );
  }

  return (
    <span className={`group relative inline-block ${className}`}>
      <a
        ref={ref}
        href={FOLLOW_URL}
        onClick={onClick}
        target="_blank"
        rel="noopener"
        aria-label="Make Your Property Guide a preferred source on Google"
        className="inline-flex h-10 items-center gap-2 rounded-lg border border-line bg-white px-3 text-xs font-medium text-ink transition-colors hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <GoogleG />
        <span>Make us a preferred source</span>
      </a>
      <Tooltip />
    </span>
  );
}
