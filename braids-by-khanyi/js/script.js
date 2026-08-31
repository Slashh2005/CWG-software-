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
    buildGallery();
    setupGalleryFilters();
    setupLightbox();
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

  /* ---------------- Active nav link on scroll ---------------- */
  function setupActiveNav() {
    const links = Array.from(document.querySelectorAll(".nav-links a"));
    if (!links.length || !("IntersectionObserver" in window)) return;
    const map = new Map();
    links.forEach((a) => {
      const id = a.getAttribute("href").replace("#", "");
      const section = document.getElementById(id);
      if (section) map.set(section, a);
    });
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = map.get(entry.target);
          if (!link) return;
          if (entry.isIntersecting) {
            links.forEach((a) => a.classList.remove("active"));
            link.classList.add("active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    map.forEach((_, section) => observer.observe(section));
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

  /* ---------------- Gallery data + build ---------------- */
  const GALLERY_ITEMS = [
    { file: "gallery-knotless.jpg", label: "Knotless Braids", cats: ["knotless"] },
    { file: "gallery-box-braids.jpg", label: "Box Braids", cats: ["box"] },
    { file: "gallery-bob.jpg", label: "Bob Braids", cats: ["box"] },
    { file: "gallery-boho-knotless.jpg", label: "Boho Knotless", cats: ["boho", "knotless"] },
    { file: "gallery-goddess.jpg", label: "Goddess Braids", cats: ["boho"] },
    { file: "gallery-butterfly.jpg", label: "Butterfly Braids", cats: ["boho"] },
    { file: "gallery-mermaid-curls.jpg", label: "Mermaid Curls / Curly Braids", cats: ["boho"] },
    { file: "gallery-french-curls.jpg", label: "French Curls", cats: ["boho"] },
    { file: "gallery-passion-twists.jpg", label: "Passion Twists", cats: ["twists"] },
    { file: "gallery-senegalese-twists.jpg", label: "Senegalese Twists", cats: ["twists"] },
    { file: "gallery-spring-twists.jpg", label: "Spring Twists", cats: ["twists"] },
    { file: "gallery-cornrows.jpg", label: "Cornrows", cats: ["other"] },
  ];

  function buildGallery() {
    const grid = document.getElementById("galleryGrid");
    if (!grid) return;
    grid.innerHTML = GALLERY_ITEMS.map((item, i) => `
      <button type="button" class="gallery-item" data-index="${i}" data-category="${item.cats.join(" ")}" aria-label="View ${item.label} photo">
        <figure class="photo-frame" data-label="${item.label}">
          <img src="assets/images/${item.file}" alt="${item.label} styled by Braids by Khanyi" loading="lazy" onerror="this.remove()">
        </figure>
        <span class="caption">${item.label}</span>
      </button>
    `).join("");
  }

  /* ---------------- Gallery filters ---------------- */
  function setupGalleryFilters() {
    const buttons = document.querySelectorAll(".filter-btn");
    if (!buttons.length) return;
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => {
          b.classList.remove("active");
          b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");

        const filter = btn.dataset.filter;
        document.querySelectorAll(".gallery-item").forEach((item) => {
          const cats = (item.dataset.category || "").split(" ");
          const show = filter === "all" || cats.includes(filter);
          item.classList.toggle("is-hidden", !show);
        });
      });
    });
  }

  /* ---------------- Lightbox ---------------- */
  function setupLightbox() {
    const lightbox = document.getElementById("lightbox");
    const imgWrap = document.getElementById("lightboxImageWrap");
    const img = document.getElementById("lightboxImage");
    const caption = document.getElementById("lightboxCaption");
    const closeBtn = document.getElementById("lightboxClose");
    const prevBtn = document.getElementById("lightboxPrev");
    const nextBtn = document.getElementById("lightboxNext");
    if (!lightbox) return;

    let currentIndex = 0;

    function visibleItems() {
      return Array.from(document.querySelectorAll(".gallery-item:not(.is-hidden)"));
    }

    function show(index) {
      const items = visibleItems();
      if (!items.length) return;
      currentIndex = (index + items.length) % items.length;
      const el = items[currentIndex];
      const label = el.querySelector(".photo-frame").dataset.label;
      const srcImg = el.querySelector("img");

      imgWrap.dataset.label = label;
      caption.textContent = label;
      const existing = imgWrap.querySelector("img");
      if (existing) existing.remove();
      if (srcImg) {
        const clone = document.createElement("img");
        clone.src = srcImg.src;
        clone.alt = srcImg.alt;
        clone.onerror = function () { this.remove(); };
        imgWrap.appendChild(clone);
      }
    }

    function open(index) {
      show(index);
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    }
    function close() {
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
    }

    document.addEventListener("click", (e) => {
      const item = e.target.closest(".gallery-item");
      if (!item) return;
      const items = visibleItems();
      const idx = items.indexOf(item);
      if (idx > -1) open(idx);
    });

    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", () => show(currentIndex - 1));
    nextBtn.addEventListener("click", () => show(currentIndex + 1));
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) close();
    });
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(currentIndex - 1);
      if (e.key === "ArrowRight") show(currentIndex + 1);
    });
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
