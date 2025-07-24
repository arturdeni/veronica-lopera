// src/services/api/properties.js - ARCHIVO COMPLETO
import { apiClient, getPropertyDetail, getPropertiesList } from "./client";
import { getFromCache, setToCache } from "./cache";
import { API_CONFIG } from "./config";

/**
 * Transforma una propiedad del listado añadiendo campos útiles
 * Según documentación, el listado incluye muchos más campos de los que esperábamos
 */
const enhancePropertyFromList = (property) => ({
  ...property,
  id: property.cod_ofer,

  // Formatear fecha
  formattedDate: property.fechaact
    ? new Date(property.fechaact).toLocaleDateString("es-ES")
    : null,

  // Precio formateado
  formattedPrice: property.precioinmo
    ? `${property.precioinmo.toLocaleString()}€`
    : property.precioalq
    ? `${property.precioalq.toLocaleString()}€/mes`
    : null,

  // Total de habitaciones (según documentación: habdobles + habitaciones)
  totalRooms: (property.habdobles || 0) + (property.habitaciones || 0),

  // URL de imagen principal (si existe)
  imageUrl: property.foto || null,

  // Tipo de operación formateado
  operationType:
    property.keyacci === 1
      ? "Venta"
      : property.keyacci === 2
      ? "Alquiler"
      : property.keyacci === 3
      ? "Traspaso"
      : "N/A",

  // Distancia al mar formateada
  distanceToSea: property.distmar ? `${property.distmar}m` : null,
});

/**
 * Transforma los datos de detalle de propiedad
 */
const enhancePropertyDetail = (property) => ({
  ...property,
  id: property.cod_ofer,

  // Información de imágenes
  images:
    property.numfotos > 0
      ? Array.from({ length: property.numfotos }, (_, i) => ({
          id: i + 1,
          url: property.foto || `/api/placeholder/800/600`, // URL temporal hasta resolver
          alt: `${property.ref} - Imagen ${i + 1}`,
        }))
      : [],

  // Datos formateados
  formattedPrice: property.precioinmo
    ? `${property.precioinmo.toLocaleString()}€`
    : property.precioalq
    ? `${property.precioalq.toLocaleString()}€/mes`
    : null,

  formattedDate: property.fechaact
    ? new Date(property.fechaact).toLocaleDateString("es-ES")
    : null,

  // Características organizadas según documentación
  features: {
    basic: {
      rooms: (property.habdobles || 0) + (property.habitaciones || 0),
      doubles: property.habdobles || 0,
      singles: property.habitaciones || 0,
      bathrooms: property.banyos || 0,
      toilets: property.aseos || 0,
      surface: property.m_cons || 0,
      usefulSurface: property.m_utiles || property.m_uties || 0, // Documentación muestra ambos nombres
      terraceSurface: property.m_terraza || 0,
      plotSurface: property.m_parcela || 0,
      floor: property.planta,
      year: property.antiguedad,
    },
    extras: {
      elevator: property.ascensor === 1,
      airConditioning: property.aire_con === 1,
      heating: property.calefaccion === 1,
      pool: property.piscina_com === 1 || property.piscina_prop === 1,
      communityPool: property.piscina_com === 1,
      privatePool: property.piscina_prop === 1,
      parking: property.parking > 0,
      parkingIncluded: property.parking === 2,
      parkingOptional: property.parking === 1,
      terrace: property.terraza === 1,
      balcony: property.balcon === 1,
      garden: property.jardin === 1,
      garage: property.garaje === 1,
      allExterior: property.todoext === 1,
      openPlan: property.diafano === 1,
    },
    location: {
      street: property.calle,
      city: property.ciudad,
      zone: property.zona,
      distanceToSea: property.distmar,
      centralLocation: property.centrico === 1,
      coastal: property.costa === 1,
    },
    energy: {
      energyRating: property.energialetra,
      energyValue: property.energiavalor,
      emissionsRating: property.emisionesletra,
      emissionsValue: property.emisionesvalor,
    },
  },

  // Estado y tipo
  available: property.nodisponible !== 1,
  isProspect: property.prospecto === 1,

  // Descripción
  description: property.descripciones || property.descripcioneses,
  title: property.tituloes,

  // Precio anterior (si hubo rebaja)
  previousPrice: property.outlet,

  // Tipo de operación
  operationType:
    property.keyacci === 1
      ? "Venta"
      : property.keyacci === 2
      ? "Alquiler"
      : property.keyacci === 3
      ? "Traspaso"
      : "N/A",
});

/**
 * Obtiene el listado de propiedades con filtros opcionales
 * @param {Object} filters - Filtros a aplicar
 * @returns {Promise<Array>} - Array de propiedades
 */
export const getProperties = async (filters = {}) => {
  try {
    // Construir clave de caché única basada en filtros
    const filterKey = JSON.stringify(filters);
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

    // Usar el cliente especializado
    const data = await getPropertiesList(filters);

    if (!Array.isArray(data)) {
      console.warn("⚠️ Expected array but got:", typeof data);
      return [];
    }

    // Filtrar propiedades no disponibles si se solicita
    const filteredData = filters.includeUnavailable
      ? data
      : data.filter((property) => property.nodisponible !== 1);

    // Mejorar datos de propiedades
    const enhancedData = filteredData.map(enhancePropertyFromList);

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
export const getPropertyDetailById = async (cod_ofer) => {
  try {
    const cacheKey = `${API_CONFIG.CACHE_KEYS.PROPERTY_DETAIL}_${cod_ofer}`;

    // Verificar caché
    const cachedData = getFromCache(
      cacheKey,
      API_CONFIG.CACHE_DURATION.PROPERTY_DETAIL
    );
    if (cachedData) return cachedData;

    console.log(`🔄 Fetching property detail: ${cod_ofer}`);

    // Usar el cliente especializado
    const data = await getPropertyDetail(cod_ofer);

    if (!data) {
      throw new Error("Property not found");
    }

    // Estructurar datos del detalle
    const enhancedDetail = enhancePropertyDetail(data);

    console.log(`✅ Property detail loaded: ${data.ref}`);

    // Guardar en caché
    setToCache(cacheKey, enhancedDetail);
    return enhancedDetail;
  } catch (error) {
    console.error("❌ Error fetching property detail:", error);
    throw error;
  }
};

/**
 * Búsqueda de propiedades por término de texto
 * Según documentación, podemos filtrar por referencia directamente
 */
export const searchProperties = async (searchTerm, filters = {}) => {
  try {
    if (!searchTerm) return await getProperties(filters);

    // Si parece una referencia (formato VL017-28 o similar), usar filtro directo
    if (
      /^[A-Z]{2}\d{3}-\d{2}$/i.test(searchTerm) ||
      /^\w+\d+$/i.test(searchTerm)
    ) {
      console.log(`🔍 Searching by reference: ${searchTerm}`);
      return await getProperties({
        ...filters,
        reference: searchTerm,
      });
    }

    // Para otros términos, obtener todas las propiedades y filtrar localmente
    // (La API no parece tener búsqueda de texto libre según documentación)
    console.log(`🔍 Searching properties locally for: ${searchTerm}`);
    const allProperties = await getProperties(filters);

    const searchLower = searchTerm.toLowerCase();
    return allProperties.filter(
      (property) =>
        property.ref?.toLowerCase().includes(searchLower) ||
        property.ciudad?.toLowerCase().includes(searchLower) ||
        property.zona?.toLowerCase().includes(searchLower) ||
        property.calle?.toLowerCase().includes(searchLower) ||
        property.nbtipo?.toLowerCase().includes(searchLower)
    );
  } catch (error) {
    console.error("❌ Error searching properties:", error);
    return [];
  }
};
