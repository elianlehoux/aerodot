import * as Sentry from '@sentry/astro';

const dsn = import.meta.env.PUBLIC_SENTRY_DSN;

// Sin DSN el SDK no arranca: el build y el dev local siguen igual.
if (dsn) {
  Sentry.init({
    dsn,
    environment: import.meta.env.PROD ? 'production' : 'development',
    // Local manda todo el trace para poder verificar. Producción, 10%.
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1,
    dataCollection: {
      userInfo: false,
      cookies: false,
    },
    beforeSend(event) {
      try {
        // Misma elección que el botón de /privacidad (y el opt-out viejo de PostHog).
        if (localStorage.getItem('aerodot:telemetry') === 'off') return null;
        if (window.posthog?.has_opted_out_capturing?.()) return null;
      } catch {
        // Si el almacenamiento está bloqueado, el error igual se reporta.
      }
      return event;
    },
  });
}
