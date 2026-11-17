/* Segundo paso del registro · Diana Guerrero */
(() => {
  "use strict";

  const CONFIG = window.DIANA_CONFIG;

  const $ = (selector, scope = document) =>
    scope.querySelector(selector);

  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");

  const loading = $("#registration-loading");
  const errorBox = $("#registration-error");
  const successBox = $("#registration-success");
  const content = $("#registration-content");
  const form = $("#completion-form");
  const status = $("[data-form-status]");
  const submit = $("button[type='submit']", form);

  function showError(message) {
    loading.hidden = true;
    errorBox.textContent = message;
    errorBox.hidden = false;
    content.hidden = true;
  }

  function announce(message, type) {
    status.textContent = message;
    status.classList.remove("is-error", "is-success");
    status.classList.add(
      type === "success" ? "is-success" : "is-error"
    );
    status.hidden = false;
  }

  function clearStatus() {
    status.textContent = "";
    status.hidden = true;
    status.classList.remove("is-error", "is-success");
  }

  function selected(name) {
    const item = form.querySelector(
      `input[name="${name}"]:checked`
    );

    return item ? item.value : "";
  }

  function updateConditionalFields() {
    const howHeard = $("#howHeard").value;

    const showInviter = [
      "Recomendación",
      "Invitación directa"
    ].includes(howHeard);

    $("#inviter-field").hidden = !showInviter;
    $("#inviter").required = showInviter;

    const knows = selected("knowsWeeks");
    const showWeeks = knows === "Sí";

    $("#weeks-field").hidden = !showWeeks;
    $("#weeks").required = showWeeks;

    if (!showWeeks) {
      $("#weeks").value = "";
    }
  }

  function validate() {
    let firstInvalid = null;

    const checks = [
      [
        "howHeard",
        Boolean($("#howHeard").value),
        "Selecciona cómo te enteraste."
      ],
      [
        "imssLaw",
        Boolean(selected("imssLaw")),
        "Selecciona una opción sobre tu ley del IMSS."
      ],
      [
        "concern",
        $("#concern").value.trim().length >= 5,
        "Cuéntanos brevemente cuál es tu principal duda."
      ],
      [
        "knowsWeeks",
        Boolean(selected("knowsWeeks")),
        "Indica si conoces tus semanas cotizadas."
      ],
      [
        "attendance",
        Boolean(selected("attendance")),
        "Selecciona si podrás asistir."
      ]
    ];

    if ($("#inviter").required) {
      checks.push([
        "inviter",
        $("#inviter").value.trim().length >= 2,
        "Escribe quién te invitó."
      ]);
    }

    if (selected("knowsWeeks") === "Sí") {
      const weeks = Number($("#weeks").value);

      checks.push([
        "weeks",
        Number.isInteger(weeks) && weeks >= 1 && weeks <= 9999,
        "Escribe un número válido de semanas."
      ]);
    }

    form.querySelectorAll("[data-error-for]").forEach((el) => {
      el.textContent = "";
      el.hidden = true;
    });

    checks.forEach(([name, valid, message]) => {
      if (valid) return;

      const error = $(`[data-error-for="${name}"]`, form);

      if (error) {
        error.textContent = message;
        error.hidden = false;
      }

      if (!firstInvalid) {
        const field = form.elements[name];

        if (field && typeof field.focus === "function") {
          firstInvalid = field;
        } else if (error) {
          firstInvalid = error;
        }
      }
    });

    if (firstInvalid) {
      firstInvalid.focus();
    }

    return !firstInvalid;
  }

  function setLoading(value) {
    submit.disabled = value;
    submit.setAttribute("aria-busy", String(value));

    $("[data-submit-label]", submit).textContent = value
      ? "Guardando tus respuestas…"
      : "Completar mi registro";
  }

  async function loadRegistration() {
    if (!ref || !/^[0-9a-f-]{36}$/i.test(ref)) {
      showError(
        "El enlace de registro no es válido. Revisa que hayas abierto el enlace completo que te compartió Diana."
      );
      return;
    }

    try {
      const url =
        CONFIG.backend.endpoint +
        "?action=getRegistration&ref=" +
        encodeURIComponent(ref);

      const response = await fetch(url, {
        method: "GET",
        redirect: "follow"
      });

      if (!response.ok) {
        throw new Error("No se pudo consultar el registro.");
      }

      const result = await response.json();

      if (
        !result ||
        result.ok !== true ||
        !result.registration
      ) {
        throw new Error(
          result && result.message
            ? result.message
            : "No encontramos un registro pendiente con ese enlace."
        );
      }

      const registration = result.registration;

      $("#registration-id").value = ref;

      $("#registrant-name").textContent =
        registration.fullName || "participante";

      const schedule = CONFIG.event.schedules.find(
        (item) => item.id === registration.preferredSchedule
      );

      $("#registrant-schedule").textContent =
        schedule
          ? schedule.label
          : registration.preferredSchedule || "Por confirmar";

      // Importante: el backend recibe 18:00 o 21:00, no la etiqueta visual.
      $("#preferred-schedule").value =
        registration.preferredSchedule || "";

      loading.hidden = true;
      content.hidden = false;

    } catch (err) {
      showError(
        err.message ||
        "No pudimos verificar tu registro. Contacta a Diana por WhatsApp para recibir ayuda."
      );
    }
  }

  $("#howHeard").addEventListener(
    "change",
    updateConditionalFields
  );

  form
    .querySelectorAll('input[name="knowsWeeks"]')
    .forEach((input) => {
      input.addEventListener(
        "change",
        updateConditionalFields
      );
    });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    clearStatus();
    updateConditionalFields();

    if (!validate()) {
      announce(
        "Revisa los campos marcados para continuar.",
        "error"
      );
      return;
    }

    const payload = {
      action: "completeRegistration",
      registrationId: ref,

      company: $("#company").value.trim(),
      howHeard: $("#howHeard").value,
      inviter: $("#inviter").value.trim(),

      imssLaw: selected("imssLaw"),
      concern: $("#concern").value.trim(),

      knowsWeeks: selected("knowsWeeks"),

      weeks:
        selected("knowsWeeks") === "Sí"
          ? Number($("#weeks").value)
          : "",

      preferredSchedule: $("#preferred-schedule").value,

      attendance: selected("attendance")
    };

    setLoading(true);

    try {
      const response = await fetch(
        CONFIG.backend.endpoint,
        {
          method: "POST",
          headers: {
            "Content-Type": "text/plain;charset=utf-8"
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        throw new Error("No se pudo guardar la información.");
      }

      const result = await response.json();

      if (!result || result.ok !== true) {
        throw new Error(
          result && result.message
            ? result.message
            : "No se pudieron guardar tus respuestas."
        );
      }

      content.hidden = true;
      successBox.hidden = false;

    } catch (err) {
      announce(
        err.message ||
        "Ocurrió un error al guardar. Inténtalo nuevamente o contacta a Diana.",
        "error"
      );

    } finally {
      setLoading(false);
    }
  });

  if (
    !CONFIG ||
    !CONFIG.backend ||
    !CONFIG.backend.endpoint ||
    CONFIG.app.mode !== "production"
  ) {
    showError(
      "El formulario no está disponible en este momento. Contacta a Diana por WhatsApp."
    );
  } else {
    loadRegistration();
  }
})();
