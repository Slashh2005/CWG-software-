# Linehaul — Transporter Load Booking System (mockup)

An unbranded, clickable mockup of a load booking system for **cwgholdings.net**.
The idea: a **Book now** button on the main website sends transporters here, where
they can see the loads CWG has available and book their trucks in.

> "Linehaul" is a placeholder name — swap in the real brand, logo and colours once decided.

## How to view it

Open `index.html` in any browser — no installation, no server, no build step.
It also works hosted anywhere (GitHub Pages, Netlify, or a folder on the cwgholdings.net server).

## What's in the demo

Use the dark **demo bar** at the very top to flip between the two sides while presenting:

**Transporter view**
- **Load board** — every load shows route (from → to), commodity, tonnage per truck,
  distance, loading date, the rate offered (R/ton) and the estimated value per truck.
  Search and filter by commodity, sort by date / rate / distance.
- **Booking flow** — open a load, choose how many trucks to offer, send the request.
- **Accounts** — register once (company details, fleet size, truck types, GIT cover,
  compliance documents) and every future booking is pre-filled. The sign-in screen has
  three sample carriers so you can demo a "returning user" instantly.
- **My account** — saved profile, fleet details, compliance document statuses
  (verified / pending / expired) and full booking history.

**Admin view (CWG owner/staff)**
- **Overview** — pending requests, open loads, trucks still needed, carriers registered.
- **Loads** — post new loads, edit, close and reopen them; truck allocation tracked per load.
- **Booking requests** — approve or decline; approving allocates trucks against the load.
- **Transporters** — every registered carrier with fleet, compliance status, and the
  ability to review and verify their documents.

Everything you do (bookings, new loads, approvals, registrations) is saved in the
browser's localStorage so the demo feels real between page reloads.
**Reset demo data** in the demo bar restores the original sample data.

## What's mocked (for now)

- No real authentication — sign-in is one click, there are no passwords.
- File uploads for compliance documents are simulated.
- No emails/SMS notifications; approvals just update on screen.
- All loads, rates and companies are sample data.

## Next step: the real backend

Once the design is approved, the same screens get wired to a real backend:

1. **Database** (PostgreSQL) — loads, transporters, bookings, documents.
2. **API** (Node.js) — the actions in this mockup map 1:1 to API endpoints
   (post load, request booking, approve/decline, verify document).
3. **Real accounts** — email/password sign-in, password reset, admin roles.
4. **File storage** for compliance documents, with expiry reminders.
5. **Notifications** — email or WhatsApp when a booking is approved/declined
   or a new load matching a carrier's lanes is posted.
6. **Hosting** — linked from cwgholdings.net via the Book now button.
