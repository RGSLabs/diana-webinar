/*
 * Configuración de la landing de Diana Guerrero.
 * Esta versión utiliza WhatsApp como único canal de contacto.
 */
window.DIANA_CONFIG = {
  event: {
    name: "¿Qué pasará con tu pensión?",
    dateISO: "2026-11-19",
    dateText: "Jueves 19 de noviembre de 2026",
    timezone: "America/Mexico_City",
    timezoneText: "Hora de Ciudad de México",
    duration: "1 hora",
    modality: "Online",
    schedules: [
      { id: "18:00", label: "6:00 p. m." },
      { id: "21:00", label: "9:00 p. m." }
    ]
  },

  speaker: {
    publicName: "Diana Guerrero",
    role: "Asesora Patrimonial",
    email: "dianaguerrero.asesorpatrimonial@gmail.com",
    whatsappDisplay: "+52 1 444 121 0220",
    whatsappNumber: "5214441210220"
  },

  whatsapp: {
    defaultMessage:
      "Hola, Diana. Vi la información del webinar «¿Qué pasará con tu pensión?» y me gustaría recibir el enlace del formulario para registrarme.",

    scheduleMessage:
      "Hola, Diana. Me interesa participar en el webinar «¿Qué pasará con tu pensión?» y prefiero el horario de {HORARIO}. ¿Me puedes compartir el enlace del formulario para registrarme?"
  },

  legal: {
    privacyNoticeUrl: null,
    copyrightYear: 2026
  }
};
