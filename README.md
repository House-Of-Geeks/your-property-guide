This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## House of Geeks HQ lead hand-off

Agent enquiries (the `AgentEnquiryForm` on `/real-estate-leads` and `/real-estate-leads/[type]`, which posts a `general-contact` lead with source `for-agents` to `/api/leads`) also create a deal in House of Geeks HQ. No other lead or form is sent. The call lives in `src/lib/hq-leads.ts`, runs server-side after the response, times out after 4 seconds and never affects the visitor or the team email.

| Variable | Purpose |
| --- | --- |
| `HQ_LEADS_SECRET` | Bearer secret for HQ `POST /api/inbound/leads`. Server-side only. When empty, the hand-off is skipped with a log line. |
| `HQ_URL` | HQ base URL. Defaults to `https://hq.houseofgeeks.com.au`. |

The same module holds the spam check, which `/api/leads` and `/api/introductions` both run. A filled honeypot (`website`), a name or message mostly in Cyrillic or CJK script, a URL in the name, more than two links in the message, or obvious SEO and advertising phrases get the normal success response but no email, no row and no HQ deal. Agent enquiries with a name containing "test" still go through and reach HQ flagged `test: true`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
