// src/services/inmovilla.js - ARCHIVO COMPLETO
export { getPropertyTypes, getLocations } from "./api/enums";
export {
  getProperties,
  getPropertyDetailById, // ⚠️ NUEVO - Función actualizada
  searchProperties,
} from "./api/properties";
export { clearAllCache, getCacheInfo } from "./api/cache";

export { API_CONFIG } from "./api/config";

// Función de utilidad para limpiar caché específico
import { API_CONFIG } from "./api/config";

/**
 * Limpia el caché de un tipo específico
 * @param {'properties'|'types'|'locations'|'details'} type - Tipo de caché a limpiar
 */
export const clearSpecificCache = (type) => {
  const keyMap = {
    properties: API_CONFIG.CACHE_KEYS.PROPERTIES,
    types: API_CONFIG.CACHE_KEYS.PROPERTY_TYPES,
    locations: API_CONFIG.CACHE_KEYS.LOCATIONS,
    details: API_CONFIG.CACHE_KEYS.PROPERTY_DETAIL, // ⚠️ NUEVO
  };

  const key = keyMap[type];
  if (key) {
    // Limpiar todas las variaciones del caché
    if (type === "properties" || type === "details") {
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

/**
 * Función de utilidad para debugging - muestra estado de la API
 */
export const getAPIStatus = async () => {
  const { getRateLimitStatus } = await import("./api/client");
  const rateLimits = getRateLimitStatus();
  const cacheInfo = getCacheInfo();

  return {
    rateLimits,
    cacheInfo,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Función de utilidad para forzar recarga completa de datos
 */
export const forceReloadAllData = async () => {
  console.log("🔄 Force reloading all data...");

  // Limpiar todo el caché
  clearAllCache();

  // Recargar datos básicos
  try {
    const [types, locations, properties] = await Promise.allSettled([
      getPropertyTypes(),
      getLocations(),
      getProperties({ forceRefresh: true }),
    ]);

    return {
      types: types.status === "fulfilled" ? types.value : [],
      locations: locations.status === "fulfilled" ? locations.value : [],
      properties: properties.status === "fulfilled" ? properties.value : [],
    };
  } catch (error) {
    console.error("❌ Error in force reload:", error);
    throw error;
  }
};
