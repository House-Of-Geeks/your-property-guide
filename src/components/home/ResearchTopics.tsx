import Link from "next/link";
import { MapPin, GraduationCap, TrendingUp, BookOpen, ArrowRight } from "lucide-react";

const TOPICS = [
  {
    icon: MapPin,
    title: "Suburb Profiles",
    description: "Median prices, rental yields, crime stats, demographics and more for every suburb in Australia.",
    href: "/suburbs",
    cta: "Explore suburbs",
  },
  {
    icon: GraduationCap,
    title: "School Finder",
    description: "Browse 9,600+ schools with NAPLAN results, enrolment stats and nearby properties for sale.",
    href: "/schools",
    cta: "Find a school",
  },
  {
    icon: TrendingUp,
    title: "Market Trends",
    description: "Track median price growth, days on market and clearance rates across Australian suburbs.",
    href: "/suburbs",
    cta: "View market data",
  },
  {
    icon: BookOpen,
    title: "Buying Guides",
    description: "From first home buyers to investors. Practical guides written for the Australian market.",
    href: "/guides",
    cta: "Read the guides",
  },
];

export function ResearchTopics() {
  return (
    <section className="py-16 bg-[#f7f6f4]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="max-w-2xl mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-black">What would you like to research?</h2>
          <p className="text-gray-500 mt-3 text-lg">
            Everything you need to make a confident property decision, before you ever speak to an agent.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TOPICS.map((topic) => {
            const Icon = topic.icon;
            return (
              <Link
                key={topic.title}
                href={topic.href}
                className="group relative block bg-white rounded-2xl border border-[#e8e6e2] overflow-hidden hover:shadow-lg hover:border-gray-400 transition-all duration-200"
              >
                {/* Black top strip */}
                <div className="h-1 w-full bg-black" />

                <div className="p-6">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 bg-[#f0efec] text-gray-700">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-black text-base mb-2">{topic.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-5">{topic.description}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-black group-hover:gap-2.5 transition-all duration-150">
                    {topic.cta} <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
