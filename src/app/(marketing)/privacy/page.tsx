import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout";
import { BreadcrumbJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Privacy Policy | ${SITE_NAME}`,
  description: "Your Property Guide privacy policy. Learn how we collect, use, and protect your personal information.",
  alternates: { canonical: `${SITE_URL}/privacy` },
  openGraph: { url: `${SITE_URL}/privacy`, title: "Privacy Policy", description: "Your Property Guide privacy policy. Learn how we collect, use, and protect your personal information.", type: "website" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbJsonLd items={[{ name: "Privacy Policy", url: "/privacy" }]} />
      <Breadcrumbs items={[{ label: "Privacy Policy" }]} />

      <div className="max-w-3xl mx-auto prose prose-gray">
        <h1>Privacy Policy</h1>
        <p><em>Last updated: January 2025</em></p>

        <h2>1. Information We Collect</h2>
        <p>
          When you use Your Property Guide, we may collect personal information including your name, email address,
          phone number, and property preferences. This information is provided when you submit enquiry forms,
          register for off-market alerts, or request property appraisals.
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>We use your personal information to:</p>
        <ul>
          <li>Connect you with relevant real estate agents and agencies</li>
          <li>Send property alerts matching your criteria</li>
          <li>Process your property appraisal requests</li>
          <li>Improve our website and services</li>
          <li>Communicate important updates about your enquiries</li>
        </ul>

        <h2>3. Information Sharing</h2>
        <p>
          Your enquiry details are shared with the relevant real estate agent or agency to facilitate your
          property enquiry. We do not sell your personal information to third parties.
        </p>

        <h2>4. Data Security</h2>
        <p>
          We take reasonable measures to protect your personal information from unauthorised access,
          modification, or disclosure. However, no internet transmission is completely secure.
        </p>

        <h2>5. Cookies</h2>
        <p>
          Our website uses cookies to improve your browsing experience and analyse website traffic.
          You can control cookie settings through your browser preferences.
        </p>

        <h2>6. Your Rights</h2>
        <p>
          You have the right to access, correct, or delete your personal information. Contact us at
          hello@yourpropertyguide.com.au to make a request.
        </p>

        <h2>7. Contact Us</h2>
        <p>
          If you have questions about this privacy policy, please contact us at{" "}
          hello@yourpropertyguide.com.au.
        </p>
      </div>
    </div>
  );
}
