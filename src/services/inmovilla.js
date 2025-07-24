// src/services/inmovilla.js
export { getPropertyTypes, getLocations } from "./api/enums";
export {
  getProperties,
  getPropertyDetail,
  searchProperties,
} from "./api/properties";
export { clearAllCache, getCacheInfo } from "./api/cache";

export { API_CONFIG } from "./api/config";

// Función de utilidad para limpiar caché específico
import { API_CONFIG } from "./api/config";

/**
 * Limpia el caché de un tipo específico
 * @param {'properties'|'types'|'locations'} type - Tipo de caché a limpiar
 */
export const clearSpecificCache = (type) => {
  const keyMap = {
    properties: API_CONFIG.CACHE_KEYS.PROPERTIES,
    types: API_CONFIG.CACHE_KEYS.PROPERTY_TYPES,
    locations: API_CONFIG.CACHE_KEYS.LOCATIONS,
  };

  const key = keyMap[type];
  if (key) {
    // Limpiar todas las variaciones del caché de propiedades
    if (type === "properties") {
      Object.keys(localStorage).forEach((storageKey) => {
        if (storageKey.startsWith(key)) {
          localStorage.removeItem(storageKey);
        }
      });
    } else {
      localStorage.removeItem(key);
    }
    console.log(`🧹 ${type} cache cleared`);
  }
};
