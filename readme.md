# AR Dispute Resolution Agent

A working preview of Stuut's upcoming Disputes module — built to show what autonomous dispute handling could look like end-to-end.

**Live demo → [your-vercel-url.vercel.app](https://your-vercel-url.vercel.app)**

---

## What it does

Most AR teams handle disputes manually — reading emails, deciding what to do, drafting responses. This agent does it autonomously.

**Step 1 — Real-time email parser**
Paste any customer dispute email and the parser instantly extracts invoice numbers, dollar amounts, dates, company names, and dispute keywords as tagged chips — before the AI even runs.

**Step 2 — AI classification**
Claude analyzes the email with the pre-parsed entities as structured context and returns: dispute type, priority, recommendation, and a fully drafted response.

**Step 3 — Dispute timeline**
Results are shown as a proper dispute lifecycle — Received → Parsed → Classified → Responded → Resolved — with color-coded recommendations and numbered next steps.

---

## Sample disputes included

- Duplicate charge — same delivery billed twice
- Pricing dispute — invoice doesn't match contract rate
- Goods not received — payment withheld until delivery confirmed
- SLA short-pay — customer deducting penalty per contract terms

---

## Stack

- Next.js 14 (App Router)
- TypeScript
- Claude API (`claude-sonnet-4-6`) — Anthropic
- Deployed on Vercel

---

## Run locally

```bash
git clone https://github.com/your-username/dispute-tracker
cd dispute-tracker
npm install
```

Create a `.env.local` file:
```
ANTHROPIC_API_KEY=your-key-here
```

```bash
npm run dev
```

Open `http://localhost:3000`

---

## Why I built this

Stuut lists Disputes and Credits as coming soon. I wanted to understand the problem deeply enough to build a working version of it — this is the result.

Built by Uma · MS CS @ Clark University  
[LinkedIn](https://linkedin.com/in/your-profile) · [Portfolio](https://your-portfolio.com)