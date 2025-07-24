// src/services/api/config.js
export const API_CONFIG = {
  BASE_URL: "/api-inmovilla",
  TOKEN: "0F6399CF144116F22D567B761ABA2CEF",

  // Duración de caché
  CACHE_DURATION: {
    PROPERTIES: 60 * 60 * 1000, // 1 hora
    ENUMS: 48 * 60 * 60 * 1000, // 48 horas
  },

  // Keys de caché
  CACHE_KEYS: {
    PROPERTY_TYPES: "inmovilla_propertyTypes",
    LOCATIONS: "inmovilla_locations",
    PROPERTIES: "inmovilla_properties",
  },

  // Configuración de requests
  REQUEST: {
    DELAY_BETWEEN_CALLS: 500, // ms entre peticiones
    RETRY_ATTEMPTS: 3,
  },
};
