// Renders sample transactional emails to /tmp/ypg-emails/*.html so the
// templates can be eyeballed (or screenshotted with headless Chrome)
// without sending anything. Run: npx tsx scripts/preview-emails.ts
import { mkdirSync, writeFileSync } from "node:fs";
import {
  buildAdminEmailHtml,
  buildConfirmationHtml,
  buildFailureAlertHtml,
  type LeadEmailData,
} from "../src/lib/lead-emails";

const OUT_DIR = "/tmp/ypg-emails";
mkdirSync(OUT_DIR, { recursive: true });

const guideLead: LeadEmailData = {
  type: "guide-download",
  firstName: "Sarah",
  email: "sarah@example.com",
  phone: "0400 000 000",
  suburb: "burpengary-qld-4505",
  propertyType: "house",
  bedrooms: "4",
  sellingTimeframe: "0-3-months",
  agentStatus: "comparing",
  motivation: "Downsizing",
  priceExpectation: "$750k to $1m",
  marketingConsent: true,
  source: "selling-guide-page",
};

const appraisalLead: LeadEmailData = {
  type: "appraisal-request",
  firstName: "Marco",
  email: "marco@example.com",
  appraisalAddress: "15 Smith Street, Burpengary",
  suburb: "burpengary-qld-4505",
  source: "suburb-page-appraisal",
};

const files: [string, string][] = [
  ["admin-guide-hot.html", buildAdminEmailHtml(guideLead, "Jane Agent", "suburb-coverage")],
  ["admin-appraisal.html", buildAdminEmailHtml(appraisalLead, null, "round-robin")],
  ["confirm-guide.html", buildConfirmationHtml(guideLead)],
  ["confirm-appraisal.html", buildConfirmationHtml(appraisalLead)],
  ["alert-failure.html", buildFailureAlertHtml("lead_123", guideLead, new Error("SendGrid 401: api key revoked"))],
];

for (const [name, html] of files) {
  writeFileSync(`${OUT_DIR}/${name}`, html);
  console.log(`wrote ${OUT_DIR}/${name}`);
}
