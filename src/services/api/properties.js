// src/services/api/properties.js
import { apiClient } from "./client";
import { getFromCache, setToCache } from "./cache";
import { API_CONFIG } from "./config";

/**
 * Transforma una propiedad básica añadiendo campos útiles
 * @param {Object} property - Propiedad original de la API
 * @returns {Object} - Propiedad mejorada
 */
const enhanceProperty = (property) => ({
  ...property,
  id: property.cod_ofer,
  formattedDate: property.fechaact
    ? new Date(property.fechaact).toLocaleDateString()
    : null,
});

/**
 * Obtiene el listado de propiedades con filtros opcionales
 * @param {Object} filters - Filtros a aplicar
 * @returns {Promise<Array>} - Array de propiedades
 */
export const getProperties = async (filters = {}) => {
  try {
    // Construir parámetros de la petición
    const params = { listado: "1" };

    // Añadir filtros si existen
    if (filters.propertyType) params.key_tipo = filters.propertyType;
    if (filters.location) params.key_loca = filters.location;
    if (filters.minPrice) params.precio_min = filters.minPrice;
    if (filters.maxPrice) params.precio_max = filters.maxPrice;
    if (filters.reference) params.ref = filters.reference;
    if (filters.rooms) params.habitaciones = filters.rooms;
    if (filters.minSurface) params.metros_min = filters.minSurface;

    // Crear clave de caché única basada en filtros
    const filterKey = JSON.stringify(params);
    const cacheKey = `${API_CONFIG.CACHE_KEYS.PROPERTIES}_${filterKey}`;

    // Verificar caché (salvo si se fuerza refresh)
    if (!filters.forceRefresh) {
      const cachedData = getFromCache(
        cacheKey,
        API_CONFIG.CACHE_DURATION.PROPERTIES
      );
      if (cachedData) return cachedData;
    }

    console.log("🔄 Fetching properties with filters:", filters);

    // Hacer petición a la API
    const data = await apiClient("/propiedades/", { params });

    // Filtrar propiedades no disponibles si se solicita
    const filteredData = filters.includeUnavailable
      ? data
      : data.filter((property) => !property.nodisponible);

    // Mejorar datos de propiedades
    const enhancedData = filteredData.map(enhanceProperty);

    console.log(`✅ Properties loaded: ${enhancedData.length}`);

    // Guardar en caché
    setToCache(cacheKey, enhancedData);
    return enhancedData;
  } catch (error) {
    console.error("❌ Error fetching properties:", error);
    return [];
  }
};

/**
 * Obtiene el detalle completo de una propiedad
 * @param {string} cod_ofer - Código de la propiedad
 * @returns {Promise<Object>} - Detalle de la propiedad
 */
export const getPropertyDetail = async (cod_ofer) => {
  try {
    console.log(`🔄 Fetching property detail: ${cod_ofer}`);

    const data = await apiClient("/propiedades/", {
      params: { cod_ofer },
    });

    if (!data) {
      throw new Error("Property not found");
    }

    // Estructurar datos del detalle
    const enhancedDetail = {
      ...data,
      id: data.cod_ofer,

      // Información de imágenes (pendiente implementar URLs reales)
      images:
        data.numfotos > 0
          ? Array.from({ length: data.numfotos }, (_, i) => ({
              id: i + 1,
              url: `/api/placeholder/800/600`, // Temporal
              alt: `${data.ref} - Imagen ${i + 1}`,
            }))
          : [],

      // Datos formateados
      formattedPrice: data.precioinmo
        ? `${data.precioinmo.toLocaleString()}€`
        : null,
      formattedDate: data.fechaact
        ? new Date(data.fechaact).toLocaleDateString()
        : null,

      // Características organizadas
      features: {
        basic: {
          rooms: data.habitaciones,
          bathrooms: data.banyos,
          surface: data.m_cons,
          usefulSurface: data.m_utiles,
          floor: data.planta,
          year: data.antiguedad,
        },
        extras: {
          balcony: data.balcon === 1,
          terrace: data.terraza === 1,
          garage: data.garaje === 1,
          elevator: data.ascensor === 1,
          airConditioning: data.aire_acon === 1,
          heating: data.calefaccion === 1,
          pool: data.piscina === 1,
          garden: data.jardin === 1,
        },
        location: {
          street: data.calle,
          city: data.ciudad,
          zone: data.zona,
          distanceToSea: data.distmar,
        },
        energy: {
          energyRating: data.energialetra,
          energyValue: data.energiavalor,
          emissionsRating: data.emisionesletra,
          emissionsValue: data.emisionesvalor,
        },
      },

      // Estado y descripción
      description: data.descripciones,
      available: !data.nodisponible,
      isProspect: data.prospecto === 1,
    };

    console.log(`✅ Property detail loaded: ${data.ref}`);
    return enhancedDetail;
  } catch (error) {
    console.error("❌ Error fetching property detail:", error);
    throw error;
  }
};

/**
 * Búsqueda de propiedades por término de texto
 * @param {string} searchTerm - Término de búsqueda
 * @param {Object} filters - Filtros adicionales
 * @returns {Promise<Array>} - Propiedades que coinciden
 */
export const searchProperties = async (searchTerm, filters = {}) => {
  try {
    // Obtener todas las propiedades con filtros
    const allProperties = await getProperties(filters);

    if (!searchTerm) return allProperties;

    // Filtrar localmente por término de búsqueda
    const searchLower = searchTerm.toLowerCase();
    return allProperties.filter(
      (property) =>
        property.ref?.toLowerCase().includes(searchLower) ||
        property.ciudad?.toLowerCase().includes(searchLower) ||
        property.zona?.toLowerCase().includes(searchLower) ||
        property.calle?.toLowerCase().includes(searchLower)
    );
  } catch (error) {
    console.error("❌ Error searching properties:", error);
    return [];
  }
};
