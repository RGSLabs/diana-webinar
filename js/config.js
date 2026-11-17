/*
 * Configuración central de la landing del webinar.
 * Modifica este archivo para actualizar datos sin tocar la lógica visual.
 */
window.DIANA_CONFIG = {
  app: {
    mode: "development", // "development" | "production". En development no se confirma registro ni se abre WhatsApp.
    source: "landing-webinar-pensiones",
    reducedMotionSafe: true
  },
  event: {
    name: "¿Qué pasará con tu pensión?",
    label: "Webinar gratuito",
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
  copy: {
    heroEyebrow: "Webinar gratuito · 19 de noviembre",
    heroTitle: "¿Qué pasará con tu pensión?",
    heroSubtitle: "Entiende los cambios y conoce qué opciones tienes para prepararte.",
    heroText: "Una sesión informativa para conocer mejor el panorama de las pensiones del IMSS, distinguir información confiable de rumores y resolver dudas importantes sobre tu futuro.",
    heroPrimaryCta: "Reserva tu lugar gratuitamente",
    contextTitle: "Tu futuro merece información clara.",
    contextLead: "Los cambios, las noticias y la información que circula sobre las pensiones del IMSS pueden generar muchas dudas, especialmente si estás cerca de pensionarte o habías considerado alternativas para mejorar tu pensión.",
    contextBody: "Antes de tomar decisiones, necesitas entender qué está pasando, qué información es confiable y qué opciones podrían aplicar a tu situación.",
    learningsTitle: "¿Qué descubrirás durante el webinar?",
    learningsIntro: "Una hora para comprender mejor el panorama y conocer los aspectos que conviene revisar antes de tomar decisiones sobre tu pensión.",
    speakerTitle: "Conoce a quien te acompañará en esta sesión.",
    eventTitle: "Aparta una hora para entender mejor tu futuro.",
    eventCta: "Quiero reservar mi lugar",
    registrationTitle: "Registra tu lugar gratuitamente.",
    registrationIntro: "Completa tus datos para iniciar tu registro. Diana podrá ponerse en contacto contigo para continuar el proceso y compartirte los detalles de acceso."
  },
  speaker: {
    publicName: "Diana Guerrero",
    role: "Asesora Patrimonial",
    experience: "Más de cinco años de experiencia en el sector",
    email: "dianaguerrero.asesorpatrimonial@gmail.com",
    whatsappDisplay: "+52 444 121 0220",
    whatsappNumber: "524441210220",
    portrait: "assets/images/diana-guerrero.png",
    logo: "assets/icons/logo-diana.png",
    // Pendiente de verificación. Mantener como arreglo vacío para no mostrar credenciales ficticias.
    credentials: []
  },
  social: {
    // No publicar enlaces hasta verificar URL reales.
    facebook: null,
    instagram: null
  },
  legal: {
    privacyNoticeUrl: null,
    privacyNoticeText: null,
    copyrightYear: 2026,
    // Datos legales pendientes: responsable, domicilio y correo de privacidad.
    dataController: null,
    controllerAddress: null,
    privacyEmail: null
  },
  assets: {
    couple: "assets/images/pareja-adulta.jpg",
    planning: "assets/images/planificacion-retiro.jpg",
    advisory: "assets/images/asesoria-diana.jpg",
    adultAlone: "assets/images/persona-adulta.jpg"
  },
  backend: {
    // IMPORTANTE: primera entrega sin backend real. Dejar null evita falsos registros.
    endpoint: "https://script.google.com/macros/s/AKfycbyXdCLmmdtVac8ezQ4Kmja6QjKQB5lCAlYX4dZzJfRDXs0tFvZ2ZJF5_bbSc8IWhoeirg/exec",
    expectedResponse: {
      ok: true,
      registrationId: "identificador-aleatorio-devuelto-por-apps-script"
    }
  },
  messages: {
    whatsappAfterConfirmation: "Hola, Diana. Acabo de iniciar mi registro para el webinar «¿Qué pasará con mi pensión?».\n\nMi nombre es {NOMBRE}.\n\nMi identificador de registro es {ID}.\n\nMe gustaría continuar con el proceso. ¡Gracias!"
  }
};
