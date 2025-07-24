// src/services/api/cache.js
import { API_CONFIG } from "./config";

/**
 * Obtiene datos del caché si están disponibles y no han expirado
 * @param {string} key - Clave del caché
 * @param {number} duration - Duración en ms (opcional)
 * @returns {any|null} - Datos del caché o null
 */
export const getFromCache = (
  key,
  duration = API_CONFIG.CACHE_DURATION.PROPERTIES
) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const { data, timestamp } = JSON.parse(item);

    if (Date.now() - timestamp < duration) {
      console.log(`✅ Using cached data for ${key}`);
      return data;
    }

    // Limpiar caché expirado
    localStorage.removeItem(key);
    return null;
  } catch (error) {
    console.warn(`Cache read error for ${key}:`, error);
    return null;
  }
};

/**
 * Guarda datos en el caché
 * @param {string} key - Clave del caché
 * @param {any} data - Datos a guardar
 */
export const setToCache = (key, data) => {
  try {
    const cacheData = {
      data,
      timestamp: Date.now(),
    };

    localStorage.setItem(key, JSON.stringify(cacheData));
    console.log(`💾 Data cached for ${key}`);
  } catch (error) {
    console.warn(`Cache write error for ${key}:`, error);
  }
};

/**
 * Limpia todo el caché de la aplicación
 */
export const clearAllCache = () => {
  Object.values(API_CONFIG.CACHE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
  console.log("🧹 All cache cleared");
};

/**
 * Obtiene información sobre el estado del caché
 * @returns {Object} - Información del caché
 */
export const getCacheInfo = () => {
  const info = {};

  Object.entries(API_CONFIG.CACHE_KEYS).forEach(([name, key]) => {
    const item = localStorage.getItem(key);
    if (item) {
      try {
        const { timestamp } = JSON.parse(item);
        info[name] = {
          age: Date.now() - timestamp,
          expires:
            timestamp + API_CONFIG.CACHE_DURATION.PROPERTIES - Date.now(),
          key,
        };
      } catch (error) {
        info[name] = { error: "Invalid cache data" };
      }
    } else {
      info[name] = { status: "not cached" };
    }
  });

  return info;
};
