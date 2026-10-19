import { DEFAULT_OG } from "@/lib/og/defaults";
import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";
import { Band, HeroLead, HeroTitle, PhotoHero } from "@/components/premium";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Your Property Guide privacy policy. Learn how we collect, use, and protect your personal information.",
  alternates: { canonical: `${SITE_URL}/privacy` },
  openGraph: { ...DEFAULT_OG, url: `${SITE_URL}/privacy`, title: "Privacy Policy", description: "Your Property Guide privacy policy. Learn how we collect, use, and protect your personal information.", type: "website" },
};

export default function PrivacyPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Privacy Policy", url: "/privacy" }]} />

      {/* A plain charcoal hero: a legal page needs no photo. */}
      <PhotoHero breadcrumbs={[{ label: "Privacy Policy" }]}>
        <HeroTitle>Privacy Policy</HeroTitle>
        <HeroLead>Last updated: October 2026</HeroLead>
      </PhotoHero>

      <Band spacing="compact">
        <div className="max-w-3xl prose-ypg">
          <h2>1. Information We Collect</h2>
          <p>
            When you use Your Property Guide, we collect your name, email address and phone number, and the details
            you give us in our forms. These can include your suburb, property address, property type and number of
            bedrooms, when you plan to sell, whether you already have an agent, your reason for selling and your price
            expectation. For buyers, they can also include your buyer type, finance status and budget. We collect
            these when you request an appraisal or a specialist match, enquire about a property, package, agent or
            agency, download a guide, join our off-market register, or sign up for alerts or our newsletter.
          </p>
          <p>
            We also record how you found us: the page you first landed on, the website that referred you, and any
            advertising campaign tags or ad click identifiers in the link you followed (for example Google&rsquo;s
            &ldquo;gclid&rdquo;). If you then send us one of our forms (for example an enquiry, appraisal request,
            guide download, or alert or off-market sign-up), we keep these with what you send, along with the page
            you sent it from. If we connect you with an agent or specialist, they may tell us whether an appraisal
            or listing followed.
          </p>
          <p>
            When you ask for an introduction, we also keep how and when you&rsquo;d like to be contacted, the exact
            permission statement you ticked, whether you ticked our separate box for tips emails, and what happened
            next: whether we passed your request to an agent, whether the agent took it on, whether an appraisal or
            consultation was booked or an agreement signed (as the agent, our team or you tell us), and any feedback
            you give us about the introduction. When you make a next-step plan, your answers stay in the page&rsquo;s
            web address; we only keep them if you ask us to email you the plan.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>We use your personal information to:</p>
          <ul>
            <li>Connect you with one agent when you ask us to and give your permission, and check afterwards whether it was useful</li>
            <li>Send property alerts matching your criteria</li>
            <li>
              Email you the guide or plan you asked for. We only send a short series of tips if you tick the separate
              box for it, and our quarterly newsletter only if you sign up for it. Every one of these emails has an
              unsubscribe link
            </li>
            <li>Process your property appraisal requests</li>
            <li>Improve our website and services</li>
            <li>
              Measure which of our advertising leads to enquiries, appraisals and listings, including telling the ad
              platform that served an ad (such as Google) when a click led to an enquiry and whether that enquiry went
              on to an appraisal or a listing
            </li>
            <li>Communicate important updates about your enquiries</li>
          </ul>

          <h2>3. Information Sharing</h2>
          <p>
            When you ask us to connect you, for example by requesting an appraisal, a rental appraisal, a specialist
            match or an agent through our selling guide, we share your details with the one agent, property manager
            or specialist you are matched with.
            For a house-and-land package enquiry, that is the listing agent or builder for that package. They pay us
            a fee for the introduction. You pay us nothing. If you enquire about a property listed for sale or rent,
            your enquiry goes to the listing agent or property manager for that property. If you contact an agent or
            agency through their profile on our site, your message goes to that agent or agency. If you ask them about
            selling or an appraisal, they pay us a fee for that introduction.
          </p>
          <p>
            We do not sell your personal information to anyone else, and we never pass the same request to a second
            agent or specialist. We do not pass your details to any agent when you download a guide, make or email a
            plan, sign up for our newsletter or tips, or tell us you&rsquo;re already working with an agent. An
            introduction only happens when you ask for one and tick its permission box; if you ask for a selling agent
            and a buyer&rsquo;s agent, each is a separate permission.
          </p>

          <h2>4. Data Security</h2>
          <p>
            We take reasonable measures to protect your personal information from unauthorised access,
            modification, or disclosure. However, no internet transmission is completely secure.
          </p>

          <h2>5. Cookies</h2>
          <p>
            Our website uses cookies to improve your browsing experience and analyse website traffic. One of them,
            called <code>ypg_attr</code>, is set by us and stores how you arrived: the landing page, the referring
            site, campaign tags and ad click identifiers. It is set on your first visit and lasts 90 days from then,
            or from your most recent visit through an ad or campaign link if that is later. Our site updates it on
            your first visit and when you arrive through an ad or campaign link, and we store it with your details
            only when you send us one of our enquiry, appraisal, guide or alert forms.
            You can control cookie settings through your browser preferences.
          </p>

          <h2>6. Service Providers and Overseas Disclosure</h2>
          <p>
            We use service providers to host the site, send email, manage our mailing list, deliver your details to
            the agent you are matched with, and measure how the site is used. These include Sent 24/7, ActiveCampaign,
            SendGrid, Microsoft Clarity and Quantcast. When we measure
            advertising, we may send an ad click identifier, and whether it led to an enquiry, an appraisal or a
            listing (with a value we assign to it), to the ad platform that served the ad, such as Google. Some of these providers store information outside Australia,
            including in the United States.
          </p>

          <h2>7. Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal information. Contact us at
            hello@yourpropertyguide.com.au to make a request.
          </p>

          <h2>8. Contact Us</h2>
          <p>
            If you have questions about this privacy policy, please contact us at{" "}
            hello@yourpropertyguide.com.au.
          </p>
          <p>
            If you think we have breached the Australian Privacy Principles, email us at
            hello@yourpropertyguide.com.au and tell us what happened. We will respond within 30 days. If you are not
            satisfied with our response, you can complain to the Office of the Australian Information Commissioner at
            oaic.gov.au.
          </p>
        </div>
      </Band>
    </>
  );
}
