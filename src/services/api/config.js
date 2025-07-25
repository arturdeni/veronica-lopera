// src/services/api/config.js
const getBaseUrl = () => {
  // Si estamos en el navegador
  if (typeof window !== "undefined") {
    // En producción (Vercel u otros), usar la API route
    if (
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1"
    ) {
      return "/api/inmovilla";
    }
  }

  // En desarrollo local, usar el proxy de Vite
  return "/api-inmovilla";
};

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  TOKEN: "0F6399CF144116F22D567B761ABA2CEF",

  // Duración de caché
  CACHE_DURATION: {
    PROPERTIES: 30 * 60 * 1000, // 30 minutos
    ENUMS: 6 * 60 * 60 * 1000, // 6 horas
    PROPERTY_DETAIL: 15 * 60 * 1000, // 15 minutos
  },

  // Keys de caché
  CACHE_KEYS: {
    PROPERTY_TYPES: "inmovilla_tipos",
    LOCATIONS: "inmovilla_ciudades",
    PROPERTIES: "inmovilla_propiedades",
    PROPERTY_DETAIL: "inmovilla_detalle",
  },

  // Rate limits según documentación
  RATE_LIMITS: {
    ENUMS: {
      PER_MINUTE: 2,
      PER_10_MINUTES: 10,
    },
    PROPERTIES: {
      PER_MINUTE: 10,
      PER_10_MINUTES: 50,
    },
  },

  // Configuración de requests con delays
  REQUEST: {
    DELAY_BETWEEN_CALLS: 1000, // 1 segundo entre llamadas
    RETRY_ATTEMPTS: 2, // Intentos de reintento
    TIMEOUT: 15000, // 15 segundos timeout
  },

  // Endpoints documentados
  ENDPOINTS: {
    // Enums
    TIPOS: "/enums/?tipos",
    CIUDADES: "/enums/?ciudades=724", // 724 = España
    ZONAS: "/enums/?zonas=", // + key_loca

    // Propiedades
    LISTADO: "/propiedades/?listado=1",
    DETALLE: "/propiedades/", // + ?cod_ofer=

    // Imágenes (según documentación, deberían estar en el detalle)
    IMAGENES_BASE: "https://crm.inmovilla.com/imagenes/", // Base URL ejemplo
  },

  // Campos documentados para filtros
  FILTER_FIELDS: {
    TIPO: "key_tipo",
    CIUDAD: "key_loca",
    ZONA: "key_zona",
    PRECIO_MIN: "precio_min",
    PRECIO_MAX: "precio_max",
    HABITACIONES: "habitaciones",
    METROS_MIN: "metros_min",
    REFERENCIA: "ref",
    ASCENSOR: "ascensor",
    PISCINA: "piscina_com",
    GARAJE: "garaje",
    // Según documentación hay muchos más...
  },
};
