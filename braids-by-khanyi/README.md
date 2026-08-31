# Braids by Khanyi — Website

A premium, single-page website for **Braids by Khanyi**, built as plain
HTML/CSS/JS — no build step, no framework, works anywhere.

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
2. **Phone, email, address, Instagram handle** — search `index.html` for
   `+27 00 000 0000`, `hello@braidsbykhanyi.co.za`, `Insert studio address
   here`, and `braids.by_khanyi`, and update each occurrence (header,
   footer, Instagram section, JSON-LD block at the top of `<head>`).
3. **Google Map** — in the Location section, replace the iframe `src` query
   (`?q=South%20Africa`) with your real address, e.g.
   `?q=123+Main+Road,+Sandton&output=embed`.
4. **Real photography** — drop JPGs into `assets/images/` using the exact
   filenames already referenced in the HTML (e.g.
   `assets/images/knotless-braids.jpg`, `assets/images/hero-portrait.jpg`,
   `assets/images/gallery-box-braids.jpg`, `assets/images/insta-1.jpg`,
   etc. — see the `<img src>` attributes throughout `index.html` and the
   `GALLERY_ITEMS` list in `js/script.js`). Until a file exists, that spot
   shows an elegant gold-on-chocolate placeholder with the style name — the
   moment a matching file is added, the real photo takes over automatically
   with no code changes needed.
5. **Logo** — `assets/images/logo.jpg` is the actual uploaded Braids by
   Khanyi crest; no need to touch it.

## What's built in

- Fully responsive, mobile-first, single page with anchored navigation.
- Hero, About, Signature Styles (Classics / Boho / Twist collections with
  the exact price list), Length Guide, Prep & Maintenance, Important
  Booking Information, filterable Gallery with a lightbox, Why Us, a
  booking form that also composes a pre-filled WhatsApp message, a
  floating WhatsApp button site-wide, Instagram grid, Location & Hours with
  an embeddable Google Map, and a footer.
- Scroll-triggered fade-in animations, sticky/shrinking header, active-link
  highlighting, mobile menu, keyboard-accessible lightbox.
- The booking form has no backend: on submit it shows the thank-you
  message and also builds a WhatsApp deep link with the submitted details
  so the client always lands in your WhatsApp inbox.

## Notes

- Google Fonts (Playfair Display, Cormorant Garamond, Alex Brush) are
  loaded from `fonts.googleapis.com` with serif/cursive system fallbacks,
  so the page still reads correctly if that request is ever blocked.
- No dependencies, no npm install — just the three files under `css/` and
  `js/` plus `index.html`.
