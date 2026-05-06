import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { ArrowRight, MapPin, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Design System Internal",
  description: "Internal token, type and component reference for Your Property Guide.",
  robots: { index: false, follow: false },
};

const BRAND_RAMPS = [
  {
    name: "Primary (purple)",
    note: "Brand core. Use sparingly.",
    swatches: [
      { token: "--primary-darker",  value: "#351438" },
      { token: "--primary-dark",    value: "#4E1F4F" },
      { token: "--primary",         value: "#5c2d5e" },
      { token: "--primary-light",   value: "#8B4A8C" },
      { token: "--primary-lighter", value: "#A96DAA" },
    ],
  },
  {
    name: "Accent / CTA (magenta)",
    note: "Conversion-critical buttons only.",
    swatches: [
      { token: "--accent-darker",  value: "#9E1F48" },
      { token: "--accent-dark",    value: "#C42B5C" },
      { token: "--accent",         value: "#DD3C70" },
      { token: "--accent-light",   value: "#E5638F" },
      { token: "--accent-lighter", value: "#EDA3BB" },
    ],
  },
];

const SEMANTIC_TOKENS = [
  { group: "Ink", items: [
    { name: "--ink",        bg: "var(--ink)",        textOn: "white"   },
    { name: "--ink-muted",  bg: "var(--ink-muted)",  textOn: "white"   },
    { name: "--ink-subtle", bg: "var(--ink-subtle)", textOn: "white"   },
  ]},
  { group: "Surface", items: [
    { name: "--surface",            bg: "var(--surface)",            textOn: "black"   },
    { name: "--surface-raised",     bg: "var(--surface-raised)",     textOn: "black"   },
    { name: "--surface-sunken",     bg: "var(--surface-sunken)",     textOn: "black"   },
    { name: "--surface-inverse",    bg: "var(--surface-inverse)",    textOn: "white"   },
    { name: "--surface-warm",       bg: "var(--surface-warm)",       textOn: "black"   },
    { name: "--surface-warm-sunken",bg: "var(--surface-warm-sunken)",textOn: "black"   },
  ]},
  { group: "Line", items: [
    { name: "--line",        bg: "var(--line)",        textOn: "black" },
    { name: "--line-strong", bg: "var(--line-strong)", textOn: "black" },
    { name: "--line-warm",   bg: "var(--line-warm)",   textOn: "black" },
  ]},
  { group: "Semantic", items: [
    { name: "--success", bg: "var(--success)", textOn: "white" },
    { name: "--warning", bg: "var(--warning)", textOn: "white" },
    { name: "--danger",  bg: "var(--danger)",  textOn: "white" },
    { name: "--info",    bg: "var(--info)",    textOn: "white" },
    { name: "--cta",     bg: "var(--cta)",     textOn: "white" },
    { name: "--cta-hover", bg: "var(--cta-hover)", textOn: "white" },
  ]},
];

const TYPE_SCALE = [
  { label: "Display",         className: "text-7xl font-display leading-none", size: "72 px" },
  { label: "H1 (hero)",       className: "text-4xl sm:text-5xl font-display leading-tight", size: "36 / 48 px" },
  { label: "H2 (section)",    className: "text-3xl sm:text-4xl font-display leading-tight", size: "30 / 36 px" },
  { label: "H3 (sub)",        className: "text-2xl font-display",   size: "24 px" },
  { label: "H4 (card title)", className: "text-xl font-display",    size: "20 px" },
  { label: "Body large",      className: "text-lg font-sans",       size: "18 px" },
  { label: "Body",            className: "text-base font-sans",     size: "16 px" },
  { label: "Caption",         className: "text-sm font-sans",       size: "14 px" },
  { label: "Eyebrow",         className: "text-xs font-sans uppercase tracking-wider", size: "12 px" },
];

function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="border-t border-line py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mb-2">{eyebrow}</p>
        <h2 className="text-3xl sm:text-4xl text-ink mb-8">{title}</h2>
        {children}
      </div>
    </section>
  );
}

function Swatch({ token, value, textOn = "white" }: { token: string; value: string; textOn?: "white" | "black" }) {
  return (
    <div className="rounded-lg overflow-hidden border border-line bg-surface-raised">
      <div
        className="h-20 flex items-end p-3 font-sans text-xs"
        style={{ background: value, color: textOn }}
      >
        {value}
      </div>
      <div className="px-3 py-2 font-sans text-xs text-ink-muted">
        <code>{token}</code>
      </div>
    </div>
  );
}

function SemanticSwatch({ name, bg, textOn }: { name: string; bg: string; textOn: "white" | "black" }) {
  return (
    <div className="rounded-lg overflow-hidden border border-line">
      <div className="h-16 flex items-end p-3 font-sans text-xs" style={{ background: bg, color: textOn }}>
        Aa
      </div>
      <div className="px-3 py-2 font-sans text-xs text-ink-muted bg-surface-raised">
        <code>{name}</code>
      </div>
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <div className="bg-surface">

      {/* Hero */}
      <header className="bg-surface-inverse text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <p className="text-xs font-sans uppercase tracking-[0.3em] text-white/40 mb-4">
            Internal · Design System v0.1
          </p>
          <h1 className="text-5xl sm:text-6xl leading-tight mb-6">
            Your Property Guide
          </h1>
          <p className="font-sans text-lg text-white/70 max-w-2xl leading-relaxed">
            <span className="text-white">Suburb first. Property second. Agent third.</span>
            {" "}The operating principle behind every layout, copy and CTA decision on the site.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 font-sans text-sm">
            <a href="#colour" className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">Colour</a>
            <a href="#type" className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">Type</a>
            <a href="#components" className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">Components</a>
            <a href="#surfaces" className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">Surfaces</a>
            <a href="#charter" className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">Charter</a>
          </div>
        </div>
      </header>

      {/* Colour */}
      <Section id="colour" eyebrow="01 · Tokens" title="Colour">
        <div className="space-y-12">
          {BRAND_RAMPS.map((ramp) => (
            <div key={ramp.name}>
              <div className="mb-4 flex items-baseline gap-3">
                <h3 className="text-xl text-ink">{ramp.name}</h3>
                <p className="font-sans text-sm text-ink-muted">{ramp.note}</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {ramp.swatches.map((s) => (
                  <Swatch key={s.token} token={s.token} value={s.value} textOn={s.token.includes("lighter") ? "black" : "white"} />
                ))}
              </div>
            </div>
          ))}

          <div>
            <div className="mb-4 flex items-baseline gap-3">
              <h3 className="text-xl text-ink">Semantic tokens</h3>
              <p className="font-sans text-sm text-ink-muted">Mapped onto the ramps. Use these names in new code.</p>
            </div>
            <div className="space-y-6">
              {SEMANTIC_TOKENS.map((group) => (
                <div key={group.group}>
                  <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mb-2">{group.group}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                    {group.items.map((s) => (
                      <SemanticSwatch key={s.name} name={s.name} bg={s.bg} textOn={s.textOn as "white" | "black"} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Type */}
      <Section id="type" eyebrow="02 · Tokens" title="Typography">
        <div className="space-y-10">
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="rounded-xl border border-line bg-surface-raised p-6">
              <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mb-2">Display / Headings</p>
              <p className="text-5xl font-display text-ink mb-2 leading-tight">Playfair Display</p>
              <p className="font-sans text-sm text-ink-muted">
                <code>--font-display</code> · weights 400 / 500 / 600 / 700 · loaded via <code>next/font/google</code> in <code>app/layout.tsx</code>.
              </p>
            </div>
            <div className="rounded-xl border border-line bg-surface-raised p-6">
              <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mb-2">Body / UI</p>
              <p className="text-3xl font-sans text-ink mb-2">Plus Jakarta Sans</p>
              <p className="font-sans text-sm text-ink-muted">
                <code>--font-sans</code> · weights 300 / 400 / 500 / 600 / 700 · body line-height 1.625.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {TYPE_SCALE.map((row) => (
              <div key={row.label} className="grid grid-cols-12 items-baseline gap-4 border-b border-line pb-4">
                <p className="col-span-3 font-sans text-xs uppercase tracking-wider text-ink-subtle">{row.label}</p>
                <p className={`col-span-7 text-ink ${row.className}`}>Suburb first. Property second.</p>
                <p className="col-span-2 text-right font-sans text-xs text-ink-muted">{row.size}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Components */}
      <Section id="components" eyebrow="03 · Components" title="Primitives in src/components/ui">
        <p className="font-sans text-sm text-ink-muted mb-8 max-w-prose">
          Rendered from the existing components, unmodified. Phase 3 rebinds Button / Badge variants to semantic tokens, at present the &quot;branded&quot; variants all resolve to black.
        </p>

        <div className="space-y-12">
          {/* Buttons */}
          <div>
            <h3 className="text-xl text-ink mb-4">Button</h3>
            <div className="rounded-xl border border-line bg-surface-raised p-6 space-y-6">
              <div className="flex flex-wrap gap-3 items-center">
                <Button variant="primary"   size="md">Primary</Button>
                <Button variant="secondary" size="md">Secondary</Button>
                <Button variant="outline"   size="md">Outline</Button>
                <Button variant="ghost"     size="md">Ghost</Button>
                <Button variant="accent"    size="md">Accent</Button>
                <Button variant="gradient"  size="md">Gradient</Button>
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="md" isLoading>Loading…</Button>
                <Button size="md" disabled>Disabled</Button>
                <Button size="md">
                  Match me with an agent <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle w-full">Phase 3 target, token-driven CTA:</p>
                <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-cta hover:bg-cta-hover text-white font-medium px-6 py-3 transition-colors cursor-pointer">
                  Match me with a buyer&apos;s agent <ArrowRight className="w-4 h-4" />
                </button>
                <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-line-strong text-ink hover:bg-surface-sunken font-medium px-6 py-3 transition-colors cursor-pointer">
                  Or get connected
                </button>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div>
            <h3 className="text-xl text-ink mb-4">Badge</h3>
            <div className="rounded-xl border border-line bg-surface-raised p-6 space-y-4">
              <div className="flex flex-wrap gap-3 items-center">
                <Badge variant="default">Default</Badge>
                <Badge variant="primary">Primary</Badge>
                <Badge variant="accent">Accent</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle w-full">Phase 3 target, token-driven status badges:</p>
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-success text-white">For sale</span>
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-warning text-white">Off-market</span>
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-danger text-white">Withdrawn</span>
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-info text-white">Indexed</span>
              </div>
            </div>
          </div>

          {/* Card */}
          <div>
            <h3 className="text-xl text-ink mb-4">Card</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <Card>
                <CardContent>
                  <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mb-1">Suburb</p>
                  <h4 className="text-xl text-ink mb-1">Newport</h4>
                  <p className="font-sans text-sm text-ink-muted">QLD 4020 · Moreton Bay</p>
                </CardContent>
              </Card>
              <Card hover>
                <CardContent>
                  <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mb-1">Suburb · hover me</p>
                  <h4 className="text-xl text-ink mb-1">Burpengary</h4>
                  <p className="font-sans text-sm text-ink-muted">QLD 4505 · Moreton Bay</p>
                </CardContent>
              </Card>
              <div className="rounded-xl border border-line-warm bg-surface-warm p-4">
                <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mb-1">Editorial tile</p>
                <h4 className="text-xl text-ink mb-1">Renting in QLD</h4>
                <p className="font-sans text-sm text-ink-muted">Warm-neutral surface for content tiles.</p>
              </div>
            </div>
          </div>

          {/* Inputs */}
          <div>
            <h3 className="text-xl text-ink mb-4">Input &amp; Select</h3>
            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
              <Input label="Email"   id="ds-email" type="email" placeholder="you@example.com" />
              <Input label="Phone"   id="ds-phone" type="tel"   placeholder="0400 000 000" />
              <Input label="Email"   id="ds-email-err" type="email" placeholder="you@example.com" defaultValue="not-an-email" error="Enter a valid email." />
              <Select label="State"  id="ds-state" placeholder="Choose a state…" options={[
                { value: "qld", label: "Queensland" },
                { value: "nsw", label: "New South Wales" },
                { value: "vic", label: "Victoria" },
                { value: "wa",  label: "Western Australia" },
                { value: "sa",  label: "South Australia" },
                { value: "tas", label: "Tasmania" },
                { value: "act", label: "ACT" },
                { value: "nt",  label: "Northern Territory" },
              ]} />
            </div>
          </div>

          {/* Skeleton */}
          <div>
            <h3 className="text-xl text-ink mb-4">Skeleton</h3>
            <div className="rounded-xl border border-line bg-surface-raised p-6 max-w-md">
              <Skeleton className="h-6 w-32 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </Section>

      {/* Surfaces in context */}
      <Section id="surfaces" eyebrow="04 · Patterns" title="Surface examples">
        <div className="space-y-6">
          {/* Default surface */}
          <div className="rounded-2xl border border-line bg-surface-raised p-8">
            <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mb-3">Default surface</p>
            <h3 className="text-2xl text-ink mb-2">Suburb profile · Newport QLD</h3>
            <p className="font-sans text-base text-ink-muted leading-relaxed max-w-[70ch]">
              Median house price $872k. 12-month growth +6.4%. Median days on market 28. Walk score 51.
              These are the numbers we&apos;d want for our own move, published as we have them, dated, sourced.
            </p>
          </div>

          {/* Warm surface */}
          <div className="rounded-2xl border border-line-warm bg-surface-warm p-8">
            <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mb-3">Warm surface</p>
            <h3 className="text-2xl text-ink mb-2">Buying guides</h3>
            <p className="font-sans text-base text-ink-muted leading-relaxed max-w-[70ch]">
              Editorial / tile background. Tokenises the warm-neutral hex literals already inlined in
              <code className="px-1 py-0.5 bg-surface-warm-sunken rounded">home/ResearchTopics.tsx</code> and
              <code className="px-1 py-0.5 bg-surface-warm-sunken rounded">home/SuburbSpotlight.tsx</code>.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-surface-warm-sunken px-3 py-2 text-sm font-sans text-ink-muted">
              <MapPin className="w-4 h-4" /> Nested warm tile
            </div>
          </div>

          {/* Sunken surface */}
          <div className="rounded-2xl border border-line bg-surface-sunken p-8">
            <p className="text-xs font-sans uppercase tracking-wider text-ink-subtle mb-3">Sunken surface</p>
            <h3 className="text-2xl text-ink mb-2">Inset content</h3>
            <p className="font-sans text-base text-ink-muted leading-relaxed max-w-[70ch]">
              For footnotes, code, quoted blocks. Subtle recess from the page background.
            </p>
          </div>

          {/* Inverse */}
          <div className="rounded-2xl bg-surface-inverse text-white p-8">
            <p className="text-xs font-sans uppercase tracking-wider text-white/40 mb-3">Inverse surface</p>
            <h3 className="text-2xl mb-2">Header / Footer / dark CTA blocks</h3>
            <p className="font-sans text-base text-white/70 leading-relaxed max-w-[70ch]">
              The brand&apos;s confident black. Used by <code>Header</code>, <code>Footer</code>, and the homepage Sell-CTA.
            </p>
          </div>
        </div>
      </Section>

      {/* Charter */}
      <Section id="charter" eyebrow="05 · Voice" title="Charter (DRAFT)">
        <p className="font-sans text-sm text-ink-muted mb-8 max-w-prose">
          The four principles that anchor every lead form&apos;s fine print and the <code>/why-were-free</code> page.
          Property-economics rewrite of YFG&apos;s charter. Needs Andy sign-off before shipping.
        </p>

        <div className="grid sm:grid-cols-2 gap-6">
          {[
            {
              n: "01",
              title: "The suburb data is the product",
              body: "Free, ungated, never paywalled. Median, growth, schools, walkability, climate, hazard, crime, all the numbers we'd want for our own move. Listings and agent matches sit inside that research, not on top of it.",
            },
            {
              n: "02",
              title: "Every match is a real match",
              body: "One agent, vetted for the suburb you asked about. Not three competing quotes, not a bidding war for your enquiry. If the right person isn't in our network for your suburb yet, we'll say so.",
            },
            {
              n: "03",
              title: "We earn from agents, not from you",
              body: "Buyers and sellers pay nothing. Agents pay us a referral fee only after they've done engaged work, not for a click, not for an enquiry. We disclose this on every match.",
            },
            {
              n: "04",
              title: "Tell us when we're wrong",
              body: "Suburb data updates monthly; if a school's catchment, a median or a growth figure looks off to you, flag it and we'll fix it within a week. Editorial integrity is the whole brand, if we're wrong, we want to know first.",
            },
          ].map((p) => (
            <div key={p.n} className="rounded-xl border border-line bg-surface-raised p-6">
              <p className="text-xs font-sans uppercase tracking-[0.2em] text-cta mb-3">Principle {p.n}</p>
              <h3 className="text-2xl text-ink mb-3 leading-tight">{p.title}</h3>
              <p className="font-sans text-base text-ink-muted leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Footer note */}
      <div className="border-t border-line py-12 text-center">
        <p className="font-sans text-sm text-ink-muted">
          Edit <code>src/app/globals.css</code> to change tokens · <code>BRAND.md</code> for the full reference.
        </p>
        <p className="font-sans text-xs text-ink-subtle mt-2">
          <Search className="w-3 h-3 inline mr-1" /> noindex / nofollow, internal only.
        </p>
      </div>
    </div>
  );
}
