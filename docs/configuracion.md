# Guía breve de configuración

Editar únicamente `js/config.js` para mantener centralizados los datos.

## WhatsApp y correo

```js
speaker: {
  email: "dianaguerrero.asesorpatrimonial@gmail.com",
  whatsappDisplay: "+52 444 121 0220",
  whatsappNumber: "524441210220"
}
```

Para cambiar el número de WhatsApp, actualiza solo `whatsappNumber` con formato internacional sin `+`, espacios ni guiones.

## Fecha y horarios

```js
event: {
  dateISO: "2026-11-19",
  dateText: "Jueves 19 de noviembre de 2026",
  timezone: "America/Mexico_City",
  schedules: [
    { id: "18:00", label: "6:00 p. m." },
    { id: "21:00", label: "9:00 p. m." }
  ]
}
```

Si cambian los horarios, mantén los `id` en formato `HH:mm` y actualiza también los radio buttons de `index.html`.

## Modo desarrollo / producción

```js
app: { mode: "development" },
backend: { endpoint: null }
```

- En `development`, el formulario valida pero muestra un aviso claro de que no hay backend.
- Para producción: configura `backend.endpoint` y cambia `mode` a `"production"`.
- No habilites producción sin aviso de privacidad validado e integración probada.

## Credenciales

```js
speaker: {
  credentials: []
}
```

Agregar solo reconocimientos verificados con este formato:

```js
{
  title: "Nombre del reconocimiento",
  issuer: "Institución emisora",
  year: "2026",
  description: "Descripción breve verificable",
  image: "assets/images/reconocimiento.jpg" // opcional
}
```

Si el arreglo está vacío, la sección de credenciales permanece oculta.

## Redes sociales

No publiques botones hasta tener URL reales:

```js
social: {
  facebook: "https://facebook.com/...",
  instagram: "https://instagram.com/..."
}
```

## Aviso de privacidad y datos legales

Cuando existan datos confirmados:

```js
legal: {
  privacyNoticeUrl: "aviso-de-privacidad.html",
  dataController: "Responsable confirmado",
  controllerAddress: "Domicilio confirmado",
  privacyEmail: "correo-de-privacidad@confirmado"
}
```

Mientras sean `null`, no se deben mostrar textos legales ficticios.
