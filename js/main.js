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

    if (!CONFIG) {
      console.error("No se encontró window.DIANA_CONFIG. Revisa js/config.js.");
      initRevealObserver();
      initFaq();
      return;
    }

    initYear();
    hydrateContent();
    initNavigation();
    initAnchorButtons();
    initScheduleChoices();
    initWhatsAppLinks();
    initRevealObserver();
    initParallax();
    initFaq();
  });

  function initYear() {
    const year = $("#current-year");

    if (year) {
      year.textContent = String(
        CONFIG.legal.copyrightYear || new Date().getFullYear()
      );
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

    const whatsappDisplayLinks = $$(
      ".speaker__facts a[href*='wa.me'], .footer__contact a[href*='wa.me']"
    );

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

  /* Menú con apertura y cierre animados */
  function initNavigation() {
    const nav = $("[data-nav]");
    const toggle = $("[data-menu-toggle]");
    const panel = $("[data-menu-panel]");

    if (!nav || !toggle || !panel) return;

    const links = $$("a[href^='#']", panel);
    let lastFocused = null;
    let closeTimer = null;

    const openMenu = () => {
      window.clearTimeout(closeTimer);

      lastFocused = doc.activeElement;

      panel.removeAttribute("hidden");
      panel.removeAttribute("inert");

      nav.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Cerrar menú");

      // Permite que el navegador registre el estado inicial antes de animar.
      panel.classList.remove("is-visible");
      void panel.offsetHeight;

      window.requestAnimationFrame(() => {
        panel.classList.add("is-visible");
      });

      const first = links[0] || toggle;

      window.setTimeout(() => {
        first.focus({ preventScroll: true });
      }, prefersReducedMotion.matches ? 0 : 30);
    };

    const closeMenu = (restoreFocus = true) => {
      if (panel.hasAttribute("hidden")) return;

      window.clearTimeout(closeTimer);

      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menú");

      panel.classList.remove("is-visible");
      panel.setAttribute("inert", "");

      const finishClose = () => {
        panel.setAttribute("hidden", "");
        panel.removeAttribute("inert");
      };

      if (prefersReducedMotion.matches) {
        finishClose();
      } else {
        // Respaldo por si transitionend no se dispara.
        closeTimer = window.setTimeout(finishClose, 320);

        panel.addEventListener("transitionend", (event) => {
          if (
            event.target === panel &&
            event.propertyName === "opacity" &&
            !panel.classList.contains("is-visible")
          ) {
            window.clearTimeout(closeTimer);
            finishClose();
          }
        }, { once: true });
      }

      if (
        restoreFocus &&
        lastFocused &&
        typeof lastFocused.focus === "function"
      ) {
        lastFocused.focus({ preventScroll: true });
      }
    };

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        closeMenu(false);
      } else {
        openMenu();
      }
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

  /* Desplazamiento a secciones */
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

  /* Selector de horarios */
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

  /* Enlaces de WhatsApp */
  function initWhatsAppLinks() {
    $$("[data-whatsapp-cta]").forEach((link) => {
      link.addEventListener("click", updateWhatsAppLinks);
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

    const url = new URL(
      `https://wa.me/${CONFIG.speaker.whatsappNumber}`
    );

    url.searchParams.set("text", message);

    $$("[data-whatsapp-cta]").forEach((link) => {
      link.href = url.toString();
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });
  }

  /* FAQ: permite varias respuestas abiertas y anima su contenido */
  function initFaq() {
    const items = $$(".faq details");

    if (!items.length) return;

    items.forEach((details) => {
      const summary = $("summary", details);
      if (!summary) return;

      // Evita envolver dos veces si la función se inicializa de nuevo.
      if ($(".faq__answer", details)) return;

      const answer = doc.createElement("div");
      answer.className = "faq__answer";

      const inner = doc.createElement("div");
      inner.className = "faq__answer-inner";

      const content = Array.from(details.children).filter(
        (child) => child !== summary
      );

      content.forEach((child) => inner.appendChild(child));

      answer.appendChild(inner);
      details.appendChild(answer);
    });
  }

  /* Aparición de elementos al entrar en pantalla */
  function initRevealObserver() {
    const items = $$(".reveal");
    if (!items.length) return;

    if (
      prefersReducedMotion.matches ||
      !("IntersectionObserver" in window)
    ) {
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
      threshold: 0.12,
      rootMargin: "0px 0px -6% 0px"
    });

    items.forEach((item, index) => {
      item.style.setProperty(
        "--reveal-delay",
        `${Math.min(index % 5, 4) * 60}ms`
      );

      observer.observe(item);
    });
  }

  /* Parallax ligero */
  function initParallax() {
    const items = $$("[data-parallax]");

    if (
      !items.length ||
      prefersReducedMotion.matches ||
      !motionOK()
    ) {
      return;
    }

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
