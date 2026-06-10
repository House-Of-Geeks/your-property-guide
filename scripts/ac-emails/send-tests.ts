// Sends every generated ActiveCampaign template as a [TEST] email via the
// site's SendGrid SMTP so the designs can be reviewed in a real inbox.
// AC placeholders are substituted with sample values.
//
// Run: npx tsx scripts/ac-emails/send-tests.ts you@example.com
import { readFileSync, readdirSync } from "node:fs";
import { config } from "dotenv";
import nodemailer from "nodemailer";

config({ path: ".env" });

const TO = process.argv[2];
if (!TO) {
  console.error("Usage: npx tsx scripts/ac-emails/send-tests.ts you@example.com");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: { user: "apikey", pass: process.env.SENDGRID_API_KEY },
});

const SUBJECTS: Record<string, string> = {
  "hot-1-appraisal.html": "What's your place actually worth?",
  "hot-2-60-day-window.html": "The 60-day trap (and how to never see it)",
  "warm-1-costs.html": "Where the 3 to 5% goes",
  "warm-2-negotiation.html": "Most sellers never ask. You will.",
  "warm-3-preparation.html": "The $3,000 weekend",
  "warm-4-method.html": "Auction or private treaty for Burpengary QLD 4505?",
  "warm-5-appraisal-traps.html": "How to read an agent's appraisal",
  "warm-6-ready.html": "Ready to put a number on it?",
  "monthly-market-read.html": "Your market this month",
  "reengage-still-thinking.html": "Still thinking of selling?",
};

const SUBSTITUTIONS: [string, string][] = [
  ["%FIRSTNAME%", "Andy"],
  ["%YPG_SUBURB_NAME%", "Burpengary QLD 4505"],
  ["%YPG_SUBURB%", "burpengary-qld-4505"],
  ["%SENDER-INFO%", "Your Property Guide · A Profit Geeks publication · Brisbane, Australia"],
  ["%UNSUBSCRIBELINK%", "https://www.yourpropertyguide.com.au/#unsubscribe-preview"],
];

async function main() {
  const dir = "emails/activecampaign";
  const files = readdirSync(dir).filter((f) => f.endsWith(".html"));
  let n = 0;
  for (const file of files) {
    let html = readFileSync(`${dir}/${file}`, "utf8");
    for (const [tag, value] of SUBSTITUTIONS) html = html.split(tag).join(value);
    const subject = `[TEST ${++n}/${files.length}] ${SUBJECTS[file] ?? file}`;
    await transporter.sendMail({
      from: `"Your Property Guide" <${process.env.EMAIL_FROM ?? "noreply@yourpropertyguide.com.au"}>`,
      to: TO,
      subject,
      html,
    });
    console.log(`sent: ${subject}`);
  }
  console.log(`\n${n} test emails sent to ${TO}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
