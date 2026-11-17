/* Landing Diana Guerrero · Webinar gratuito de pensiones */
(() => {
  "use strict";

  const CONFIG = window.DIANA_CONFIG;
  const doc = document;
  const root = doc.documentElement;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const $ = (selector, scope = doc) => scope.querySelector(selector);
  const $$ = (selector, scope = doc) => Array.from(scope.querySelectorAll(selector));

  function ready(fn) {
    if (doc.readyState !== "loading") fn();
    else doc.addEventListener("DOMContentLoaded", fn, { once: true });
  }

  ready(() => {
    root.classList.add("js-ready");
    initYear();
    hydrateConfigurableContent();
    initNavigation();
    initAnchorButtons();
    initScheduleChoices();
    initRevealObserver();
    initParallax();
    initRegistrationForm();
    setDevelopmentNotice();
  });

  function initYear() {
    const year = $("#current-year");
    if (year) year.textContent = String(CONFIG.legal.copyrightYear || new Date().getFullYear());
  }

  function hydrateConfigurableContent() {
    const setText = (selector, value) => {
      const el = $(selector);
      if (el && typeof value === "string" && value.trim()) el.textContent = value;
    };

    setText(".hero .eyebrow", CONFIG.copy.heroEyebrow);
    setText("#hero-title", CONFIG.copy.heroTitle);
    setText(".hero__subtitle", CONFIG.copy.heroSubtitle);
    setText(".hero__text", CONFIG.copy.heroText);
    $$(".hero__actions .button--primary").forEach((el) => { el.textContent = CONFIG.copy.heroPrimaryCta; });
    setText("#context-title", CONFIG.copy.contextTitle);
    const contextParagraphs = $$("#contexto .context__copy p:not(.section-kicker)");
    if (contextParagraphs[0]) contextParagraphs[0].textContent = CONFIG.copy.contextLead;
    if (contextParagraphs[1]) contextParagraphs[1].textContent = CONFIG.copy.contextBody;
    setText("#learnings-title", CONFIG.copy.learningsTitle);
    setText("#aprendizajes .section-heading p:not(.section-kicker)", CONFIG.copy.learningsIntro);
    setText("#speaker-title", CONFIG.copy.speakerTitle);
    setText("#event-title", CONFIG.copy.eventTitle);
    setText("#evento .event__date", CONFIG.event.dateText + ".");
    setText("#registration-title", CONFIG.copy.registrationTitle);
    setText("#registro .registration__intro > p:not(.section-kicker):not(.development-notice)", CONFIG.copy.registrationIntro);

    const meta = $$(".hero__meta span");
    if (meta[0]) meta[0].textContent = `Con ${CONFIG.speaker.publicName}`;
    if (meta[1]) meta[1].textContent = CONFIG.event.dateText;
    if (meta[2]) meta[2].textContent = CONFIG.event.schedules.map((item) => item.label).join(" y ");

    const facts = $$("#evento .event__facts li");
    const factText = [
      "Webinar gratuito.",
      `Duración: ${CONFIG.event.duration}.`,
      `Modalidad: ${CONFIG.event.modality.toLowerCase()}.`,
      `Zona horaria: ${CONFIG.event.timezoneText.replace("Hora de ", "")}.`
    ];
    facts.forEach((item, index) => { if (factText[index]) item.textContent = factText[index]; });

    const scheduleButtons = $$("[data-schedule-choice]");
    scheduleButtons.forEach((button, index) => {
      const schedule = CONFIG.event.schedules[index];
      if (!schedule) return;
      button.setAttribute("data-schedule-choice", schedule.id);
      button.textContent = schedule.label;
    });

    const radios = $$('input[name="preferredSchedule"]');
    radios.forEach((radio, index) => {
      const schedule = CONFIG.event.schedules[index];
      const label = radio.parentElement;
      if (!schedule || !label) return;
      radio.value = schedule.id;
      label.textContent = "";
      label.appendChild(radio);
      label.appendChild(doc.createTextNode(` ${schedule.label}`));
    });

    const contactLinks = $$('.speaker__facts a, .footer__contact a, .floating-contact');
    contactLinks.forEach((link) => {
      const isEmail = link.getAttribute("href") && link.getAttribute("href").startsWith("mailto:");
      if (isEmail) {
        link.setAttribute("href", `mailto:${CONFIG.speaker.email}`);
        link.textContent = CONFIG.speaker.email;
      } else {
        link.setAttribute("href", `https://wa.me/${CONFIG.speaker.whatsappNumber}`);
        link.setAttribute("aria-label", `Contactar a ${CONFIG.speaker.publicName} por WhatsApp`);
        link.textContent = link.classList.contains("floating-contact") ? "WhatsApp" : `WhatsApp ${CONFIG.speaker.whatsappDisplay}`;
      }
    });

    renderCredentials();
    renderPrivacyLink();
  }

  function renderCredentials() {
    const section = $("[data-credentials]");
    const list = $("[data-credentials-list]");
    const credentials = Array.isArray(CONFIG.speaker.credentials) ? CONFIG.speaker.credentials.filter(Boolean) : [];
    if (!section || !list) return;
    list.innerHTML = "";
    if (!credentials.length) {
      section.hidden = true;
      return;
    }
    credentials.forEach((item) => {
      if (!item.title || !item.issuer || !item.year) return;
      const article = doc.createElement("article");
      article.className = "credential";
      const title = doc.createElement("h4");
      title.textContent = item.title;
      const meta = doc.createElement("p");
      meta.textContent = `${item.issuer} · ${item.year}`;
      const description = doc.createElement("p");
      description.textContent = item.description || "";
      article.append(title, meta, description);
      if (item.image) {
        const img = doc.createElement("img");
        img.src = item.image;
        img.alt = item.title;
        img.loading = "lazy";
        article.prepend(img);
      }
      list.append(article);
    });
    section.hidden = list.children.length === 0;
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
      requestAnimationFrame(() => panel.classList.add("is-visible"));
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
      const focusable = [toggle, ...links].filter((el) => !el.hasAttribute("disabled"));
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

    // Cerrar menú si la pantalla cambia de tamaño.
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 980 && nav.classList.contains("is-open")) closeMenu(false);
    }, { passive: true });
  }

  function initAnchorButtons() {
    $$("[data-scroll-target]").forEach((control) => {
      control.addEventListener("click", (event) => {
        const target = $(control.getAttribute("data-scroll-target"));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: motionOK() ? "smooth" : "auto", block: "start" });
        const firstField = $("input, select, textarea, button", target);
        if (firstField && control.hasAttribute("data-focus-form")) {
          window.setTimeout(() => firstField.focus({ preventScroll: true }), motionOK() ? 450 : 0);
        }
      });
    });
  }

  function initScheduleChoices() {
    const choices = $$("[data-schedule-choice]");
    const radios = $$('input[name="preferredSchedule"]');
    if (!choices.length || !radios.length) return;

    choices.forEach((choice) => {
      choice.addEventListener("click", () => {
        const value = choice.getAttribute("data-schedule-choice");
        const radio = radios.find((item) => item.value === value);
        if (radio) radio.checked = true;
        clearGroupError("preferredSchedule");
      });
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
    }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });

    items.forEach((item, index) => {
      item.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 70}ms`);
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
        const progress = (rect.top + rect.height / 2 - viewport / 2) / viewport;
        const amount = Number(item.getAttribute("data-parallax")) || 10;
        item.style.setProperty("--parallax-y", `${(progress * amount).toFixed(2)}px`);
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

  function setDevelopmentNotice() {
    const notice = $("[data-dev-notice]");
    if (!notice) return;
    const backendReady = Boolean(CONFIG.backend && CONFIG.backend.endpoint && CONFIG.app.mode === "production");
    notice.hidden = backendReady;
    notice.textContent = backendReady
      ? "Registro conectado al backend configurado."
      : "Modo de desarrollo: la integración con Google Sheets/Apps Script todavía no está conectada. No se guardarán datos ni se abrirá WhatsApp desde este formulario.";
  }

  function initRegistrationForm() {
    const form = $("#registration-form");
    if (!form) return;

    const status = $("[data-form-status]");
    const submit = $("button[type='submit']", form);

    const validators = {
      fullName: (value) => value.trim().length >= 3 || "Escribe tu nombre completo.",
      email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()) || "Escribe un correo electrónico válido.",
      phone: (value) => {
        const digits = value.replace(/\D/g, "");
        return (digits.length >= 10 && digits.length <= 15) || "Escribe un número de celular válido, con clave de país si aplica.";
      }
    };

    Object.keys(validators).forEach((name) => {
      const field = form.elements[name];
      if (!field) return;
      field.addEventListener("blur", () => validateField(form, name, validators[name]));
      field.addEventListener("input", () => {
        if (field.getAttribute("aria-invalid") === "true") validateField(form, name, validators[name]);
      });
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      clearStatus(status);

      const names = Object.keys(validators);
      const results = names.map((name) => validateField(form, name, validators[name]));
      const scheduleValid = validateSchedule(form);
      if (results.includes(false) || !scheduleValid) {
        announce(status, "Revisa los campos marcados para continuar.", "error");
        const firstInvalid = $("[aria-invalid='true'], input[name='preferredSchedule']", form);
        if (firstInvalid) firstInvalid.focus({ preventScroll: false });
        return;
      }

      const payload = buildPayload(form);
      setLoading(submit, true);

      try {
        const response = await registrationAdapter.submit(payload);
        if (!response || response.ok !== true || !response.registrationId) {
          throw new Error("La respuesta del backend no confirmó el registro.");
        }
        announce(status, "Registro confirmado. Se abrirá WhatsApp para continuar la conversación.", "success");
        openWhatsAppAfterConfirmation(payload, response.registrationId);
        form.reset();
      } catch (error) {
        const backendReady = Boolean(CONFIG.backend && CONFIG.backend.endpoint && CONFIG.app.mode === "production");
        const message = backendReady
          ? "No se pudo confirmar el registro en este momento. Inténtalo nuevamente."
          : "Modo de desarrollo: no hay backend configurado. No se registraron datos ni se abrió WhatsApp.";
        announce(status, message, "error");
      } finally {
        setLoading(submit, false);
      }
    });
  }

  function buildPayload(form) {
    const data = new FormData(form);
    return {
      fullName: String(data.get("fullName") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      preferredSchedule: String(data.get("preferredSchedule") || "").trim(),
      source: CONFIG.app.source,
      submittedAt: new Date().toISOString()
    };
  }

  function validateField(form, name, validator) {
    const field = form.elements[name];
    const error = $(`[data-error-for="${name}"]`, form);
    if (!field) return false;
    const result = validator(field.value);
    const valid = result === true;
    field.setAttribute("aria-invalid", valid ? "false" : "true");
    if (error) {
      error.textContent = valid ? "" : result;
      error.hidden = valid;
    }
    return valid;
  }

  function validateSchedule(form) {
    const checked = form.querySelector('input[name="preferredSchedule"]:checked');
    const groupError = $('[data-error-for="preferredSchedule"]', form);
    const valid = Boolean(checked);
    if (groupError) {
      groupError.textContent = valid ? "" : "Selecciona un horario de interés.";
      groupError.hidden = valid;
    }
    return valid;
  }

  function clearGroupError(name) {
    const error = $(`[data-error-for="${name}"]`);
    if (error) {
      error.textContent = "";
      error.hidden = true;
    }
  }

  function announce(status, message, type) {
    if (!status) return;
    status.textContent = message;
    status.classList.remove("is-error", "is-success");
    status.classList.add(type === "success" ? "is-success" : "is-error");
    status.hidden = false;
  }

  function clearStatus(status) {
    if (!status) return;
    status.textContent = "";
    status.hidden = true;
    status.classList.remove("is-error", "is-success");
  }

  function setLoading(button, isLoading) {
    if (!button) return;
    button.disabled = isLoading;
    button.setAttribute("aria-busy", String(isLoading));
    const label = $("[data-submit-label]", button);
    if (label) label.textContent = isLoading ? "Verificando registro…" : "Continuar por WhatsApp";
  }

  const registrationAdapter = {
    async submit(payload) {
      const endpoint = CONFIG.backend && CONFIG.backend.endpoint;
      const production = CONFIG.app.mode === "production";
      if (!endpoint || !production) {
        const error = new Error("Backend not configured");
        error.code = "BACKEND_NOT_CONFIGURED";
        throw error;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`Backend responded ${response.status}`);
      return response.json();
    }
  };

  function openWhatsAppAfterConfirmation(payload, registrationId) {
    const template = CONFIG.messages.whatsappAfterConfirmation;
    const message = template
      .replaceAll("{NOMBRE}", payload.fullName)
      .replaceAll("{ID}", registrationId);
    const url = `https://wa.me/${CONFIG.speaker.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function motionOK() {
    return !prefersReducedMotion.matches;
  }
})();
