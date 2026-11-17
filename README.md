# Diana Guerrero · Webinar gratuito sobre pensiones

Landing estática para promover el webinar **«¿Qué pasará con tu pensión?»**, preparada para abrirse localmente o publicarse en GitHub Pages.

## Estado de esta entrega

- `index.html` está completo y funciona visualmente sin backend.
- El formulario valida nombre, correo, teléfono y horario de interés.
- **No hay backend simulado**: si no se configura un endpoint real en `js/config.js`, el formulario muestra un aviso de desarrollo y no abre WhatsApp.
- No se guardan datos en `localStorage` ni en la URL.
- `forms.html`, `css/forms.css` y `js/forms.js` quedan reservados para una segunda fase.

## Estructura

```txt
diana-webinar/
├── index.html
├── forms.html
├── css/
│   ├── style.css
│   └── forms.css
├── js/
│   ├── config.js
│   ├── main.js
│   └── forms.js
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
└── docs/
    └── configuracion.md
```

## Cómo verla localmente

Opción directa: abrir `index.html` en un navegador.

Opción recomendada:

```bash
python3 -m http.server 8080
```

Luego visitar `http://localhost:8080`.

## Configuración rápida

Todos los datos editables están centralizados en `js/config.js`:

- WhatsApp: `speaker.whatsappNumber`
- Correo público: `speaker.email`
- Fecha, horarios y zona horaria: `event`
- Textos del evento: `event` y `messages`
- Credenciales verificables: `speaker.credentials`
- Redes sociales verificadas: `social`
- Aviso de privacidad y datos legales: `legal`
- Endpoint del backend: `backend.endpoint`

## Integración futura del registro

Contrato previsto para el backend real:

1. El frontend envía `POST` al endpoint configurado.
2. El cuerpo incluye: `fullName`, `email`, `phone`, `preferredSchedule`, `source`, `submittedAt`.
3. El backend debe responder `200` con JSON:

```json
{
  "ok": true,
  "registrationId": "ID-ALEATORIO"
}
```

4. Solo después de esa confirmación, el frontend abre WhatsApp con el mensaje definido en `messages.whatsappAfterConfirmation`.

Mientras `backend.endpoint` sea `null` o `app.mode` no sea `"production"`, el formulario permanece en modo de desarrollo y no confirma registros.

## Reglas para no inventar información

- No agregar premios, certificaciones o instituciones sin verificación.
- No mostrar enlaces de redes sociales hasta confirmar URL reales.
- No publicar un aviso de privacidad incompleto.
- No afirmar que Modalidad 40 será eliminada ni que alguien perderá su pensión.
