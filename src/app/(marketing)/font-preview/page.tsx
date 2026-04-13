import {
  Cormorant_Garamond,
  DM_Sans,
  Playfair_Display,
  Fraunces,
  Plus_Jakarta_Sans,
} from "next/font/google";

// ── Option A: "The Estate" ────────────────────────────────────────
// Cormorant Garamond: ultra high-contrast, razor-thin luxury serif
// DM Sans: clean geometric sans, restrained and sharp
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--preview-heading-a",
  display: "swap",
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--preview-body-a",
  display: "swap",
});

// ── Option B: "The Journal" ───────────────────────────────────────
// Playfair Display: editorial newspaper serif, authoritative contrast
// Plus Jakarta Sans: contemporary, slightly premium, very readable
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--preview-heading-b",
  display: "swap",
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--preview-body-b",
  display: "swap",
});

// ── Option C: "The Prestige" ──────────────────────────────────────
// Fraunces: optical-size serif with warmth, real character, vintage luxury
// DM Sans: reused — pairs equally well here
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--preview-heading-c",
  display: "swap",
});

// Shared demo content
const DEMO_SUBURB = "Noosa Heads";
const DEMO_PRICE = "$2,850,000";
const DEMO_ADDR = "42 Hastings Street, Noosa Heads QLD 4567";
const DEMO_DESC =
  "A rare opportunity to secure a prestige position in one of Australia's most coveted coastal enclaves. Architecturally designed with an emphasis on natural light and seamless indoor-outdoor flow.";

function NavBar({ heading, body, label }: { heading: string; body: string; label: string }) {
  return (
    <div
      className="bg-black px-6 py-4 flex items-center justify-between"
      style={{ fontFamily: body }}
    >
      <span className="text-white text-lg tracking-widest uppercase" style={{ fontFamily: heading, letterSpacing: "0.2em", fontWeight: 400 }}>
        Your Property Guide
      </span>
      <div className="hidden sm:flex items-center gap-6 text-white/70 text-sm font-medium">
        <span>Find a Property</span>
        <span>Research</span>
        <span>Find Agents</span>
        <span>Blog</span>
      </div>
      <span className="bg-white text-black text-xs font-semibold px-4 py-2 rounded-full tracking-wide">
        Free Appraisal
      </span>
      <span className="text-xs text-white/40 ml-4 hidden lg:block">{label}</span>
    </div>
  );
}

function HeroBlock({ heading, body }: { heading: string; body: string }) {
  return (
    <div className="bg-gray-900 px-8 py-14 text-white text-center">
      <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-4" style={{ fontFamily: body }}>
        Australia's property guide
      </p>
      <h1
        className="text-5xl sm:text-6xl font-light leading-tight mb-5"
        style={{ fontFamily: heading }}
      >
        Property research,<br />made simple
      </h1>
      <p className="text-white/60 text-lg max-w-xl mx-auto leading-relaxed" style={{ fontFamily: body, fontWeight: 300 }}>
        Suburb data, school catchments, market trends and local listings.
        Everything you need before you decide.
      </p>
      <div className="mt-8 flex justify-center">
        <div className="bg-white rounded-xl px-5 py-3 flex items-center gap-4 text-gray-400 text-sm w-full max-w-md" style={{ fontFamily: body }}>
          <span className="text-gray-300">⌕</span>
          <span>Try a suburb, postcode or school…</span>
          <span className="ml-auto bg-black text-white text-xs px-4 py-1.5 rounded-lg font-medium">Search</span>
        </div>
      </div>
    </div>
  );
}

function PropertyCard({ heading, body }: { heading: string; body: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="bg-gray-200 h-44 flex items-end p-3">
        <span className="bg-black text-white text-xs px-2.5 py-1 rounded-full" style={{ fontFamily: body }}>For Sale</span>
      </div>
      <div className="p-5">
        <p className="text-2xl font-semibold text-gray-900 mb-1" style={{ fontFamily: heading }}>{DEMO_PRICE}</p>
        <p className="text-sm text-gray-500 mb-3" style={{ fontFamily: body }}>{DEMO_ADDR}</p>
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3" style={{ fontFamily: body, fontWeight: 300 }}>{DEMO_DESC}</p>
        <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500" style={{ fontFamily: body }}>
          <span>4 Beds</span><span>3 Baths</span><span>2 Cars</span>
        </div>
      </div>
    </div>
  );
}

function SuburbStat({ heading, body, label, value }: { heading: string; body: string; label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1" style={{ fontFamily: body }}>{label}</p>
      <p className="text-2xl font-semibold text-gray-900" style={{ fontFamily: heading }}>{value}</p>
    </div>
  );
}

function SuburbCard({ heading, body }: { heading: string; body: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1" style={{ fontFamily: body }}>Suburb Profile</p>
          <h2 className="text-3xl font-light text-gray-900" style={{ fontFamily: heading }}>{DEMO_SUBURB}</h2>
          <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: body }}>Noosa Shire, QLD · 4567</p>
        </div>
        <span className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded-full" style={{ fontFamily: body }}>View Profile</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SuburbStat heading={heading} body={body} label="Median House" value="$2.1M" />
        <SuburbStat heading={heading} body={body} label="Annual Growth" value="+8.4%" />
        <SuburbStat heading={heading} body={body} label="Avg Days Listed" value="22" />
        <SuburbStat heading={heading} body={body} label="Schools Nearby" value="7" />
      </div>
    </div>
  );
}

function OptionSection({
  label,
  sublabel,
  headingFont,
  bodyFont,
  headingName,
  bodyName,
}: {
  label: string;
  sublabel: string;
  headingFont: string;
  bodyFont: string;
  headingName: string;
  bodyName: string;
}) {
  return (
    <section className="mb-20">
      {/* Option label */}
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-black text-white text-xs font-bold px-4 py-1.5 rounded-full tracking-widest uppercase">
          {label}
        </div>
        <p className="text-gray-500 text-sm italic">{sublabel}</p>
        <div className="ml-auto flex gap-3 text-xs text-gray-400">
          <span className="bg-gray-100 px-2 py-1 rounded font-mono">{headingName}</span>
          <span className="text-gray-300">+</span>
          <span className="bg-gray-100 px-2 py-1 rounded font-mono">{bodyName}</span>
        </div>
      </div>

      {/* Sections */}
      <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md">
        <NavBar heading={headingFont} body={bodyFont} label={label} />
        <HeroBlock heading={headingFont} body={bodyFont} />
        <div className="bg-white px-6 py-8 space-y-6">
          <SuburbCard heading={headingFont} body={bodyFont} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <PropertyCard heading={headingFont} body={bodyFont} />
            <PropertyCard heading={headingFont} body={bodyFont} />
            <PropertyCard heading={headingFont} body={bodyFont} />
          </div>
        </div>

        {/* Typography specimen */}
        <div className="bg-gray-50 border-t border-gray-100 px-8 py-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-3" style={{ fontFamily: bodyFont }}>Heading scale</p>
            <p className="text-5xl font-light text-gray-900 leading-none mb-2" style={{ fontFamily: headingFont }}>Aa</p>
            <p className="text-3xl font-normal text-gray-700 mb-1" style={{ fontFamily: headingFont }}>Prestige Living</p>
            <p className="text-xl font-light text-gray-600" style={{ fontFamily: headingFont }}>4 Bedroom Coastal Retreat</p>
            <p className="text-base text-gray-500 mt-2" style={{ fontFamily: headingFont }}>$2,850,000 · Noosa Heads QLD</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-3" style={{ fontFamily: bodyFont }}>Body &amp; UI text</p>
            <p className="text-sm text-gray-700 leading-relaxed mb-3" style={{ fontFamily: bodyFont, fontWeight: 400 }}>
              A rare opportunity to secure a prestige position in one of Australia's most
              coveted coastal enclaves. Architecturally designed with an emphasis on natural
              light and seamless indoor-outdoor flow.
            </p>
            <p className="text-xs text-gray-400 leading-relaxed" style={{ fontFamily: bodyFont }}>
              Suburb · Postcode · School Catchment · Median Price · Annual Growth
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function FontPreviewPage() {
  const optionA = { heading: cormorant.style.fontFamily, body: dmSans.style.fontFamily };
  const optionB = { heading: playfair.style.fontFamily, body: jakarta.style.fontFamily };
  const optionC = { heading: fraunces.style.fontFamily, body: dmSans.style.fontFamily };

  return (
    <div className={`${cormorant.variable} ${dmSans.variable} ${playfair.variable} ${jakarta.variable} ${fraunces.variable}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">

        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Font Preview</h1>
          <p className="text-gray-500">Three premium pairings — each applied to real site content. Pick your favourite.</p>
        </div>

        <OptionSection
          label="Option A"
          sublabel="The Estate — ultra-refined luxury, whisper-thin contrast"
          headingFont={optionA.heading}
          bodyFont={optionA.body}
          headingName="Cormorant Garamond"
          bodyName="DM Sans"
        />

        <OptionSection
          label="Option B"
          sublabel="The Journal — editorial authority, strong newspaper contrast"
          headingFont={optionB.heading}
          bodyFont={optionB.body}
          headingName="Playfair Display"
          bodyName="Plus Jakarta Sans"
        />

        <OptionSection
          label="Option C"
          sublabel="The Prestige — warm vintage character, real personality"
          headingFont={optionC.heading}
          bodyFont={optionC.body}
          headingName="Fraunces"
          bodyName="DM Sans"
        />

      </div>
    </div>
  );
}
