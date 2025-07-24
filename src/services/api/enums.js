// src/services/api/enums.js
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

    // Delay para evitar rate limiting
    await delay(API_CONFIG.REQUEST.DELAY_BETWEEN_CALLS);
    console.log("🔄 Fetching property types from API");

    const data = await apiClient("/enums/?tipos");
    const formattedTypes = [];

    if (data && typeof data === "object") {
      // Procesar cada categoría de tipos
      Object.entries(data).forEach(([categoryKey, categoryArray]) => {
        if (Array.isArray(categoryArray)) {
          categoryArray.forEach((item) => {
            if (item?.nombre && item?.valor > 0) {
              formattedTypes.push({
                value: `${categoryKey}_${item.valor}`,
                label: item.nombre,
                category: categoryKey,
                originalValue: item.valor,
              });
            }
          });
        }
      });
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
 * Obtiene las ubicaciones (ciudades de Tarragona)
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

    const data = await apiClient("/enums/?ciudades=724");
    const formattedLocations = [];

    if (Array.isArray(data)) {
      // Buscar específicamente la provincia de Tarragona
      const tarragona = data.find((item) => item.provincia === "TARRAGONA");

      if (tarragona?.ciudades) {
        // Las ciudades vienen como objeto, convertir a array
        Object.values(tarragona.ciudades).forEach((ciudad) => {
          if (ciudad?.ciudad) {
            formattedLocations.push({
              value: ciudad.key_loca,
              label: ciudad.ciudad,
            });
          }
        });
      }
    }

    console.log(
      `✅ Locations loaded: ${formattedLocations.length} (Tarragona)`
    );

    // Guardar en caché
    setToCache(API_CONFIG.CACHE_KEYS.LOCATIONS, formattedLocations);
    return formattedLocations;
  } catch (error) {
    console.error("❌ Error fetching locations:", error);
    return [];
  }
};
