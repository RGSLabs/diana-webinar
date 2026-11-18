/* Landing Diana Guerrero · Webinar gratuito de pensiones */
(() => {
  "use strict";

  const CONFIG = window.DIANA_CONFIG;
  const doc = document;
  const root = doc.documentElement;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const $ = (selector, scope = doc) => scope.querySelector(selector);
  const $$ = (selector, scope = doc) => Array.from(scope.querySelectorAll(selector));

  let selectedSchedule = "";

  function ready(fn) {
    if (doc.readyState !== "loading") {
      fn();
    } else {
      doc.addEventListener("DOMContentLoaded", fn, { once: true });
    }
  }

  ready(() => {
    root.classList.add("js-ready");

    initYear();
    hydrateContent();
    initNavigation();
    initAnchorButtons();
    initScheduleChoices();
    initWhatsAppLinks();
    initRevealObserver();
    initParallax();
  });

  function initYear() {
    const year = $("#current-year");
    if (year) {
      year.textContent = String(CONFIG.legal.copyrightYear || new Date().getFullYear());
    }
  }

  function hydrateContent() {
    const setText = (selector, value) => {
      const element = $(selector);
      if (element && typeof value === "string") {
        element.textContent = value;
      }
    };

    setText("#evento .event__date", `${CONFIG.event.dateText}.`);

    const meta = $$(".hero__meta span");

    if (meta[0]) {
      meta[0].textContent = `Con ${CONFIG.speaker.publicName}`;
    }

    if (meta[1]) {
      meta[1].textContent = CONFIG.event.dateText;
    }

    if (meta[2]) {
      meta[2].textContent = CONFIG.event.schedules
        .map((schedule) => schedule.label)
        .join(" y ");
    }

    const scheduleButtons = $$("[data-schedule-choice]");

    scheduleButtons.forEach((button) => {
      const schedule = CONFIG.event.schedules.find(
        (item) => item.id === button.dataset.scheduleChoice
      );

      if (schedule) {
        button.textContent = schedule.label;
      }
    });

    const emailLinks = $$('a[href^="mailto:"]');

    emailLinks.forEach((link) => {
      link.href = `mailto:${CONFIG.speaker.email}`;
      link.textContent = CONFIG.speaker.email;
    });

    const whatsappDisplayLinks = $$(".speaker__facts a[href*='wa.me'], .footer__contact a[href*='wa.me']");

    whatsappDisplayLinks.forEach((link) => {
      link.href = `https://wa.me/${CONFIG.speaker.whatsappNumber}`;
      link.textContent = `WhatsApp ${CONFIG.speaker.whatsappDisplay}`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });

    renderPrivacyLink();
  }

  function renderPrivacyLink() {
    const link = $("[data-privacy-link]");
    if (!link) return;

    if (CONFIG.legal.privacyNoticeUrl) {
      link.href = CONFIG.legal.privacyNoticeUrl;
      link.hidden = false;
    } else {
      link.hidden = true;
    }
  }

  function initNavigation() {
    const nav = $("[data-nav]");
    const toggle = $("[data-menu-toggle]");
    const panel = $("[data-menu-panel]");

    if (!nav || !toggle || !panel) return;

    const links = $$("a[href^='#']", panel);
    let lastFocused = null;

    const openMenu = () => {
      lastFocused = doc.activeElement;

      nav.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      panel.removeAttribute("hidden");

      window.requestAnimationFrame(() => {
        panel.classList.add("is-visible");
      });

      const first = links[0] || toggle;
      first.focus({ preventScroll: true });
    };

    const closeMenu = (restoreFocus = true) => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      panel.classList.remove("is-visible");
      panel.setAttribute("hidden", "");

      if (restoreFocus && lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus({ preventScroll: true });
      }
    };

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      isOpen ? closeMenu(false) : openMenu();
    });

    links.forEach((link) => {
      link.addEventListener("click", () => closeMenu(false));
    });

    doc.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        event.preventDefault();
        closeMenu(true);
      }
    });

    doc.addEventListener("click", (event) => {
      if (!nav.classList.contains("is-open")) return;
      if (!nav.contains(event.target)) closeMenu(false);
    });

    panel.addEventListener("keydown", (event) => {
      if (event.key !== "Tab" || !nav.classList.contains("is-open")) return;

      const focusable = [toggle, ...links].filter(
        (element) => !element.hasAttribute("disabled")
      );

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && doc.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && doc.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 980 && nav.classList.contains("is-open")) {
        closeMenu(false);
      }
    }, { passive: true });
  }

  function initAnchorButtons() {
    $$("[data-scroll-target]").forEach((control) => {
      control.addEventListener("click", (event) => {
        const selector = control.getAttribute("data-scroll-target");
        const target = selector ? $(selector) : null;

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
          behavior: motionOK() ? "smooth" : "auto",
          block: "start"
        });
      });
    });
  }

  function initScheduleChoices() {
    const choices = $$("[data-schedule-choice]");
    if (!choices.length) return;

    choices.forEach((choice) => {
      choice.addEventListener("click", () => {
        selectedSchedule = choice.dataset.scheduleChoice || "";

        choices.forEach((item) => {
          const isSelected = item === choice;

          item.classList.toggle("is-selected", isSelected);
          item.setAttribute("aria-pressed", String(isSelected));
        });

        updateWhatsAppLinks();
      });
    });
  }

  function initWhatsAppLinks() {
    $$("[data-whatsapp-cta]").forEach((link) => {
      link.addEventListener("click", () => {
        updateWhatsAppLinks();
      });
    });

    updateWhatsAppLinks();
  }

  function updateWhatsAppLinks() {
    let message = CONFIG.whatsapp.defaultMessage;

    if (selectedSchedule) {
      const schedule = CONFIG.event.schedules.find(
        (item) => item.id === selectedSchedule
      );

      if (schedule) {
        message = CONFIG.whatsapp.scheduleMessage.replace(
          "{HORARIO}",
          schedule.label
        );
      }
    }

    const url = new URL(`https://wa.me/${CONFIG.speaker.whatsappNumber}`);
    url.searchParams.set("text", message);

    $$("[data-whatsapp-cta]").forEach((link) => {
      link.href = url.toString();
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });
  }

  function initRevealObserver() {
    const items = $$(".reveal");
    if (!items.length) return;

    if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px"
    });

    items.forEach((item, index) => {
      item.style.setProperty(
        "--reveal-delay",
        `${Math.min(index % 6, 5) * 70}ms`
      );

      observer.observe(item);
    });
  }

  function initParallax() {
    const items = $$("[data-parallax]");

    if (!items.length || prefersReducedMotion.matches || !motionOK()) return;

    let ticking = false;

    const update = () => {
      const viewport = window.innerHeight || 1;

      items.forEach((item) => {
        const rect = item.getBoundingClientRect();

        if (rect.bottom < 0 || rect.top > viewport) return;

        const progress =
          (rect.top + rect.height / 2 - viewport / 2) / viewport;

        const amount = Number(item.getAttribute("data-parallax")) || 10;

        item.style.setProperty(
          "--parallax-y",
          `${(progress * amount).toFixed(2)}px`
        );
      });

      ticking = false;
    };

    const request = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();

    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request, { passive: true });
  }

  function motionOK() {
    return !prefersReducedMotion.matches;
  }
})();
