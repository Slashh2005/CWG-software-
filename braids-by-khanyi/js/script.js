/* ==========================================================================
   BRAIDS by KHANYI — site script
   ========================================================================== */
(function () {
  "use strict";

  /* ---------------------------------------------------------------------
     BUSINESS SETTINGS — edit these to make the site live.
     --------------------------------------------------------------------- */
  const SETTINGS = {
    // Digits only, country code first, no + or spaces. e.g. South Africa 082 123 4567 -> "27821234567"
    whatsappNumber: "27000000000",
    defaultWhatsappMessage:
      "Hi Braids by Khanyi! I would like to book an appointment. Please let me know your available dates and times.",
  };

  function waLink(message) {
    return `https://wa.me/${SETTINGS.whatsappNumber}?text=${encodeURIComponent(message)}`;
  }

  function bookingMessage(data) {
    const lines = [
      "Hi Braids by Khanyi! I'd like to request an appointment:",
      `Name: ${data.fullName || "-"}`,
      `Preferred Date: ${data.date || "-"}`,
      `Preferred Time: ${data.time || "-"}`,
      `Hairstyle: ${data.hairstyle || "-"}`,
      `Desired Length: ${data.length || "-"}`,
      `Hair Colour: ${data.colour || "-"}`,
      `Hairpiece Required: ${data.hairpiece || "No"}`,
      `WhatsApp: ${data.whatsapp || "-"}`,
      `Email: ${data.email || "-"}`,
    ];
    if (data.notes) lines.push(`Notes: ${data.notes}`);
    return lines.join("\n");
  }

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    wireWhatsappLinks();
    setYear();
    setupHeader();
    setupMobileMenu();
    setupActiveNav();
    setupReveal();
    setupBookingForm();
  }

  /* ---------------- WhatsApp links ---------------- */
  function wireWhatsappLinks() {
    const link = waLink(SETTINGS.defaultWhatsappMessage);
    ["waFloat", "waCtaLink", "footerWhatsapp", "footerWhatsappIcon"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.href = link;
    });
  }

  /* ---------------- Footer year ---------------- */
  function setYear() {
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ---------------- Sticky header ---------------- */
  function setupHeader() {
    const header = document.getElementById("siteHeader");
    if (!header) return;
    let ticking = false;
    function update() {
      header.classList.toggle("is-scrolled", window.scrollY > 40);
      ticking = false;
    }
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );
    update();
  }

  /* ---------------- Mobile menu ---------------- */
  function setupMobileMenu() {
    const toggle = document.getElementById("navToggle");
    const menu = document.getElementById("mobileMenu");
    if (!toggle || !menu) return;

    function close() {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
    function open() {
      menu.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }

    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.contains("is-open");
      isOpen ? close() : open();
    });
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  /* ---------------- Active nav link ----------------
     The site is split across a few pages now, so "active" is decided
     by matching each link's page against the current page rather than
     scroll position. */
  function setupActiveNav() {
    const links = document.querySelectorAll(".nav-links a, .mobile-menu a[href]:not(.btn)");
    if (!links.length) return;

    const current = location.pathname.replace(/\/index\.html$/, "/").replace(/\/$/, "") || "/";

    links.forEach((a) => {
      let linkPath;
      try {
        linkPath = new URL(a.getAttribute("href"), location.href).pathname
          .replace(/\/index\.html$/, "/")
          .replace(/\/$/, "") || "/";
      } catch {
        return;
      }
      if (linkPath === current) a.classList.add("active");
    });
  }

  /* ---------------- Fade-in on scroll ---------------- */
  function setupReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    items.forEach((el) => observer.observe(el));
  }

  /* ---------------- Booking form ---------------- */
  function setupBookingForm() {
    const form = document.getElementById("bookingForm");
    const success = document.getElementById("formSuccess");
    const waBtn = document.getElementById("formWhatsappLink");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const fd = new FormData(form);
      const data = Object.fromEntries(fd.entries());

      waBtn.href = waLink(bookingMessage(data));

      form.classList.add("is-submitted");
      success.classList.add("is-visible");
      success.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }
})();
