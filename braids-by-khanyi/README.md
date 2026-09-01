# Braids by Khanyi — Website

A premium, multi-page website for **Braids by Khanyi**, built as plain
HTML/CSS/JS — no build step, no framework, works anywhere.

## Pages

| File | Content |
|---|---|
| `index.html` | Home — hero, about, links to the other three pages, Instagram |
| `styles.html` | Signature Styles (Classics / Boho / Twist collections) + Length Guide |
| `why-us.html` | Why Braids by Khanyi (feature cards) |
| `booking.html` | Prep & Maintenance, Important Booking Information, the booking form, a WhatsApp CTA band, and Location & Hours |

Every page shares the same header/nav, footer and floating WhatsApp button
(duplicated in each file, since this is a plain static site with no
templating — update all four when changing shared content like the phone
number or address).

## How to view it

Open `index.html` in any browser, or serve the folder:

```
cd braids-by-khanyi
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

## Before going live — replace these placeholders

Everything below is clearly marked in the code so it's a find-and-replace job.

1. **WhatsApp number** — `js/script.js`, top of the file:
   ```js
   whatsappNumber: "27000000000", // digits only, country code first
   ```
2. **Phone, email, address, Instagram handle** — search all four HTML files
   for `+27 00 000 0000`, `hello@braidsbykhanyi.co.za`, `Insert studio
   address here`, and `braids.by_khanyi`, and update each occurrence
   (header nav is text-only so no change needed there; footer, Location
   section, Instagram section, and the JSON-LD block in `index.html`'s
   `<head>`).
3. **Google Map** — in `booking.html`'s Location section, replace the
   iframe `src` query (`?q=South%20Africa`) with your real address, e.g.
   `?q=123+Main+Road,+Sandton&output=embed`.
4. **Real photography** — drop JPGs into `assets/images/` using the exact
   filenames already referenced in the HTML (e.g.
   `assets/images/knotless-braids.jpg`, `assets/images/hero-portrait.jpg`,
   `assets/images/about-studio.jpg`, `assets/images/insta-1.jpg`, etc. —
   see the `<img src>` attributes in each page). Until a file exists, that
   spot shows an elegant gold-on-cream placeholder with the style name —
   the moment a matching file is added, the real photo takes over
   automatically with no code changes needed.
5. **Logo** — `assets/images/logo.jpg` is the actual uploaded Braids by
   Khanyi crest; no need to touch it.

## Design

Cream / blush-beige is now the site's base palette (matching the studio's
own length-guide photography), with black / dark chocolate kept as
deliberate accents in a few places: the home page hero, the site footer,
the mobile menu overlay, and the WhatsApp CTA band on the booking page.
Champagne gold ties it together — `--gold-dark` for text/icons on the
light sections, the fuller `--gold`/`--gold-pale` range on the dark ones.

## What's built in

- Fully responsive, mobile-first, four-page site with shared nav.
- Hero, About, an "Explore" section linking to the other pages, Signature
  Styles (Classics / Boho / Twist collections with the exact price list),
  Length Guide, Prep & Maintenance, Important Booking Information, Why Us,
  a booking form that also composes a pre-filled WhatsApp message, a
  floating WhatsApp button on every page, Instagram grid, Location & Hours
  with an embeddable Google Map, and a footer.
- Scroll-triggered fade-in animations, sticky/shrinking header (dark and
  transparent over the hero, light once scrolled or on any inner page),
  current-page nav highlighting, mobile menu.
- The booking form has no backend: on submit it shows the thank-you
  message and also builds a WhatsApp deep link with the submitted details
  so the client always lands in your WhatsApp inbox.

## Notes

- Google Fonts (Playfair Display, Cormorant Garamond, Alex Brush) are
  loaded from `fonts.googleapis.com` with serif/cursive system fallbacks,
  so the page still reads correctly if that request is ever blocked.
- No dependencies, no npm install — just `css/style.css`, `js/script.js`
  and the four HTML pages.
