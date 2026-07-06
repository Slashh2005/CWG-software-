# Build Plan — CWG Load Booking System

**Goal:** turn the approved mockup into working software, live on a real
address with real accounts and real bookings, by **Friday 31 July 2026**.

**Today:** 6 July 2026 — that gives us ~3.5 weeks, which is comfortable for
this scope *if* decisions and accounts land in the first week.

---

## 1. What "finished" means (scope)

Everything the mockup shows, but real:

| Area | Mockup today | Finished product |
|---|---|---|
| Load board | Sample data in the browser | Loads stored in a database, same for every visitor |
| Accounts | One-click demo sign-in | Real email + password sign-up, sign-in, password reset |
| Booking | Saved in the browser only | Saved centrally; admin and carrier both see live status |
| Compliance docs | Fake "attach" buttons | Real file uploads, stored securely, expiry dates tracked |
| Admin console | Demo data | Real: post/edit/close loads, approve/decline, verify docs |
| Notifications | On-screen toasts | Email to carrier on approve/decline; email to admin on new booking/registration |
| Address | vercel.app link | `book.cwgholdings.net` (or similar), linked from the Book Now button |

**Explicitly out of scope for v1** (phase 2, after launch): WhatsApp/SMS
notifications, in-app payments/invoicing, driver tracking, rate negotiation,
multiple admin roles/permissions, reports & exports.

## 2. Recommended stack (cheap, boring, reliable)

- **Next.js** app hosted on **Vercel** — already set up and auto-deploying.
- **Supabase** (free tier) — PostgreSQL database + authentication + file
  storage for compliance documents, all in one service.
- **Resend** (free tier, 3 000 emails/month) — transactional email.
- The approved mockup's design carries over 1:1 — no visual rework.

Running cost at launch: **R0/month** on free tiers. If traffic grows or the
business depends on it, Vercel Pro (~$20/mo) is the first sensible upgrade.

## 3. Week-by-week

### Week 0 — Kickoff & decisions (Mon 6 – Wed 8 Jul)
**This week is admin, not code. Everything else depends on it.**
- [ ] **You/client:** confirm the product name (replaces "LINEHAUL") + logo if any
- [ ] **You/client:** choose the address — recommended `book.cwgholdings.net`
- [ ] **You:** create free accounts: Supabase + Resend (10 min each; I provide click-by-click steps)
- [ ] **Client:** confirm registration fields + compliance documents list (current four: GIT insurance, operating licence, tax clearance, roadworthies — add/remove?)
- [ ] **Client:** who gets admin logins (names + emails)?
- [ ] **Me:** project scaffold — Next.js app with the mockup's UI, database schema, deployed skeleton

### Week 1 — Foundation (Thu 9 – Sun 13 Jul)
- [ ] Database: transporters, users, loads, bookings, documents tables
- [ ] Real authentication: register, sign in, sign out, password reset email
- [ ] Load board reads from the database; admin can post/edit/close loads for real
- [ ] **Checkpoint (Sun 13):** live link where a real account can be created and admin can post a load everyone sees

### Week 2 — Core flows (Mon 14 – Sun 20 Jul)
- [ ] Booking flow end-to-end: request → admin approve/decline → truck allocation updates
- [ ] Compliance document upload (PDF/photo), stored in Supabase storage, statuses + expiry dates
- [ ] Admin transporter review + "mark verified"
- [ ] Emails: carrier notified on approve/decline; admin notified on new registration & new booking
- [ ] **Checkpoint (Sun 20):** the full mockup story works with real data — this is the demo to show the client

### Week 3 — Hardening & client testing (Mon 21 – Sun 27 Jul)
- [ ] Input validation, friendly error messages, edge cases (double bookings, expired docs blocking bookings)
- [ ] Security pass: rate limiting, access rules (carriers only see their own data), POPIA-sane handling of personal info
- [ ] Full mobile QA (same battery of width/overlap/scroll tests as the mockup)
- [ ] Load real CWG loads + the client's actual carrier terms text
- [ ] **Client acceptance testing (Wed 23 →):** client + 1–2 friendly transporters use it for real; collect snags
- [ ] Fix round from their feedback

### Launch week (Mon 28 – Fri 31 Jul)
- [ ] Point `book.cwgholdings.net` at the app (one DNS record on the cwgholdings.net domain)
- [ ] Add the **Book Now** button/link on cwgholdings.net
- [ ] Final walkthrough with the client + a 1-page admin how-to (post loads, approve bookings, verify docs)
- [ ] **Go live — target Wed 30 Jul,** leaving Thu/Fri as buffer

## 4. What I need from you (the critical path)

1. **By Wed 9 Jul:** Supabase + Resend accounts created (I'll send exact steps), name decision, domain decision.
2. **By Fri 11 Jul:** client's answers on registration fields, compliance list, admin users.
3. **Week 3:** the client actually testing for 2–3 days — this is the step
   that most often slips; book it with him now.
4. Access to wherever cwgholdings.net's DNS + website are managed (for the
   subdomain and the Book Now button) — needed by ~28 Jul, worth locating early.

## 5. Risks & how we absorb them

| Risk | Plan |
|---|---|
| Decisions slip in week 0 | Timeline holds if decisions land by ~11 Jul; each day late pushes launch a day |
| Client requests new features mid-build | Logged for phase 2 unless trivial; scope above is the invoice scope |
| Client testing delayed | Launch with our own testing; his snag list becomes a patch release in early Aug |
| DNS/website access hard to get | Fallback: launch on the vercel.app address, link it from the site, move domain later |

## 6. After launch (phase 2 menu, priced separately)

WhatsApp notifications · document expiry reminder emails · booking history
exports for accounting · POD (proof of delivery) uploads · multiple admin
roles · analytics dashboard (loads per route, carrier performance).
