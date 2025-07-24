// src/services/api/enums.js - ARCHIVO COMPLETO
import { apiClient, delay } from "./client";
import { getFromCache, setToCache } from "./cache";
import { API_CONFIG } from "./config";

/**
 * Obtiene los tipos de propiedades disponibles
 * @returns {Promise<Array>} - Array de tipos formateados para select
 */
export const getPropertyTypes = async () => {
  try {
    // Intentar obtener del caché
    const cachedData = getFromCache(
      API_CONFIG.CACHE_KEYS.PROPERTY_TYPES,
      API_CONFIG.CACHE_DURATION.ENUMS
    );
    if (cachedData) return cachedData;

    // Delay para evitar rate limiting (más conservador)
    await delay(API_CONFIG.REQUEST.DELAY_BETWEEN_CALLS);
    console.log("🔄 Fetching property types from API");

    // Usar endpoint correcto según documentación
    const data = await apiClient(API_CONFIG.ENDPOINTS.TIPOS);
    const formattedTypes = [];

    if (data && typeof data === "object") {
      // Según documentación, key_tipo contiene los tipos principales
      // Buscar específicamente key_tipo en la respuesta
      const keyTipoData = data.key_tipo || data;

      if (Array.isArray(keyTipoData)) {
        keyTipoData.forEach((item) => {
          if (item?.nombre && item?.valor > 0) {
            formattedTypes.push({
              value: item.valor.toString(), // Solo el valor, no el prefijo
              label: item.nombre,
              originalValue: item.valor,
            });
          }
        });
      } else {
        // Si viene como objeto, procesar todas las categorías
        Object.entries(data).forEach(([categoryKey, categoryArray]) => {
          if (Array.isArray(categoryArray) && categoryKey === "key_tipo") {
            categoryArray.forEach((item) => {
              if (item?.nombre && item?.valor > 0) {
                formattedTypes.push({
                  value: item.valor.toString(),
                  label: item.nombre,
                  category: categoryKey,
                  originalValue: item.valor,
                });
              }
            });
          }
        });
      }
    }

    console.log(`✅ Property types loaded: ${formattedTypes.length}`);

    // Guardar en caché
    setToCache(API_CONFIG.CACHE_KEYS.PROPERTY_TYPES, formattedTypes);
    return formattedTypes;
  } catch (error) {
    console.error("❌ Error fetching property types:", error);
    return [];
  }
};

/**
 * Obtiene las ubicaciones (ciudades de España, específicamente Tarragona)
 * @returns {Promise<Array>} - Array de ubicaciones formateadas para select
 */
export const getLocations = async () => {
  try {
    // Intentar obtener del caché
    const cachedData = getFromCache(
      API_CONFIG.CACHE_KEYS.LOCATIONS,
      API_CONFIG.CACHE_DURATION.ENUMS
    );
    if (cachedData) return cachedData;

    // Delay para evitar rate limiting
    await delay(API_CONFIG.REQUEST.DELAY_BETWEEN_CALLS);
    console.log("🔄 Fetching locations from API");

    // Usar endpoint correcto (724 = España según documentación)
    const data = await apiClient(API_CONFIG.ENDPOINTS.CIUDADES);
    const formattedLocations = [];

    if (Array.isArray(data)) {
      // Buscar provincia de Tarragona (según vuestra ubicación)
      const tarragona = data.find(
        (prov) =>
          prov.provincia === "TARRAGONA" || prov.provincia === "Tarragona"
      );

      if (tarragona?.ciudades) {
        // Según documentación, ciudades es un array de objetos
        if (Array.isArray(tarragona.ciudades)) {
          tarragona.ciudades.forEach((ciudad) => {
            if (ciudad?.ciudad && ciudad?.key_loca) {
              formattedLocations.push({
                value: ciudad.key_loca.toString(),
                label: ciudad.ciudad,
              });
            }
          });
        } else if (typeof tarragona.ciudades === "object") {
          // Si viene como objeto, convertir a array
          Object.values(tarragona.ciudades).forEach((ciudad) => {
            if (ciudad?.ciudad && ciudad?.key_loca) {
              formattedLocations.push({
                value: ciudad.key_loca.toString(),
                label: ciudad.ciudad,
              });
            }
          });
        }
      }

      // Si no encontramos Tarragona, tomar todas las ciudades como fallback
      if (formattedLocations.length === 0) {
        console.warn("⚠️ Tarragona not found, loading all cities");
        data.forEach((provincia) => {
          if (provincia?.ciudades && Array.isArray(provincia.ciudades)) {
            provincia.ciudades.slice(0, 20).forEach((ciudad) => {
              // Limitar para testing
              if (ciudad?.ciudad && ciudad?.key_loca) {
                formattedLocations.push({
                  value: ciudad.key_loca.toString(),
                  label: `${ciudad.ciudad} (${provincia.provincia})`,
                });
              }
            });
          }
        });
      }
    }

    console.log(`✅ Locations loaded: ${formattedLocations.length}`);

    // Guardar en caché
    setToCache(API_CONFIG.CACHE_KEYS.LOCATIONS, formattedLocations);
    return formattedLocations;
  } catch (error) {
    console.error("❌ Error fetching locations:", error);
    return [];
  }
};
