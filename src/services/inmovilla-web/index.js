// src/services/inmovilla-web/index.js - VERSIÓN CORREGIDA
import InmovillaWebClient from "./client.js";

// Configuración del cliente - CORREGIDO
const client = new InmovillaWebClient({
  // ✅ Usar variables REACT_APP_ que están disponibles en el cliente
  numagencia: process.env.REACT_APP_INMOVILLA_AGENCY,
  addnumagencia: process.env.REACT_APP_INMOVILLA_USER_SUFFIX || "",
  password: process.env.REACT_APP_INMOVILLA_PASSWORD,
  idioma: parseInt(process.env.REACT_APP_INMOVILLA_LANGUAGE) || 1,
});

/**
 * Obtiene tipos de propiedades
 * Compatible con la interfaz anterior
 */
export const getPropertyTypes = async () => {
  try {
    console.log("🔄 Loading property types...");
    const types = await client.getPropertyTypes();
    console.log(`✅ Property types loaded: ${types.length}`);
    return types;
  } catch (error) {
    console.error("❌ Error loading property types:", error);
    return [];
  }
};

/**
 * Obtiene ubicaciones/ciudades
 * Compatible con la interfaz anterior
 */
export const getLocations = async () => {
  try {
    console.log("🔄 Loading locations...");
    const cities = await client.getCities();
    console.log(`✅ Locations loaded: ${cities.length}`);
    return cities;
  } catch (error) {
    console.error("❌ Error loading locations:", error);
    return [];
  }
};

/**
 * Obtiene zonas de una ciudad
 */
export const getZones = async (cityId) => {
  try {
    console.log(`🔄 Loading zones for city: ${cityId}`);
    const zones = await client.getZones(cityId);
    console.log(`✅ Zones loaded: ${zones.length}`);
    return zones;
  } catch (error) {
    console.error("❌ Error loading zones:", error);
    return [];
  }
};

/**
 * Obtiene listado de propiedades con filtros
 * Compatible con la interfaz anterior pero con mucho más detalle
 */
export const getProperties = async (filters = {}) => {
  try {
    console.log("🔄 Loading properties with filters:", filters);

    // Convertir filtros del formato anterior al nuevo
    const webFilters = adaptFiltersToWebAPI(filters);

    const result = await client.getProperties(
      webFilters,
      filters.page || 1,
      filters.limit || 20
    );

    console.log(
      `✅ Properties loaded: ${result.items?.length || 0} / ${
        result.metadata?.total || 0
      }`
    );

    // Devolver en formato compatible con la interfaz anterior
    return result.items || [];
  } catch (error) {
    console.error("❌ Error loading properties:", error);
    return [];
  }
};

/**
 * Obtiene detalle completo de una propiedad por ID
 * Reemplaza a getPropertyDetailById
 */
export const getPropertyDetailById = async (codOfer) => {
  try {
    console.log(`🔄 Loading property detail: ${codOfer}`);
    const detail = await client.getPropertyDetail(codOfer);
    console.log(`✅ Property detail loaded: ${detail.ref}`);
    return detail;
  } catch (error) {
    console.error("❌ Error loading property detail:", error);
    throw error;
  }
};

/**
 * Búsqueda de propiedades por término de texto
 * Compatible con la interfaz anterior
 */
export const searchProperties = async (searchTerm, filters = {}) => {
  try {
    if (!searchTerm) return await getProperties(filters);

    console.log(`🔍 Searching properties for: ${searchTerm}`);

    // Para referencias exactas
    if (
      /^[A-Z]{2}\d{3}-\d{2}$/i.test(searchTerm) ||
      /^\w+\d+$/i.test(searchTerm)
    ) {
      return await getProperties({
        ...filters,
        reference: searchTerm,
      });
    }

    // Búsqueda más amplia por ciudades, zonas, etc.
    const searchFilters = {
      ...filters,
      searchTerm: searchTerm.toLowerCase(),
    };

    const results = await getProperties(searchFilters);

    // Filtro adicional en cliente si es necesario
    const filtered = results.filter(
      (property) =>
        property.ref?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.zone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.propertyType?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    console.log(`✅ Search results: ${filtered.length}`);
    return filtered;
  } catch (error) {
    console.error("❌ Error searching properties:", error);
    return [];
  }
};

/**
 * Obtiene propiedades destacadas
 */
export const getFeaturedProperties = async (limit = 10) => {
  try {
    console.log(`🔄 Loading featured properties (${limit})`);
    const procesos = [
      {
        tipo: "destacados",
        posinicial: 1,
        numelementos: limit,
        where: "",
        orden: "fechaact desc",
      },
    ];

    const result = await client.makeRequest(procesos);
    const formatted = client.formatPropertiesList(result.destacados || []);

    console.log(
      `✅ Featured properties loaded: ${formatted.items?.length || 0}`
    );
    return formatted.items || [];
  } catch (error) {
    console.error("❌ Error loading featured properties:", error);
    return [];
  }
};

/**
 * Adapta filtros del formato anterior al formato de la API Web
 */
function adaptFiltersToWebAPI(filters) {
  const adapted = {};

  // Mapear campos principales
  if (filters.propertyType) adapted.propertyType = filters.propertyType;
  if (filters.location) adapted.location = filters.location;
  if (filters.zone) adapted.zone = filters.zone;
  if (filters.minPrice) adapted.minPrice = parseInt(filters.minPrice);
  if (filters.maxPrice) adapted.maxPrice = parseInt(filters.maxPrice);
  if (filters.rooms) adapted.rooms = parseInt(filters.rooms);
  if (filters.minSurface) adapted.minSurface = parseInt(filters.minSurface);
  if (filters.reference) adapted.reference = filters.reference;

  // Características especiales
  if (filters.elevator)
    adapted.features = { ...adapted.features, elevator: true };
  if (filters.pool) adapted.features = { ...adapted.features, pool: true };
  if (filters.airConditioning)
    adapted.features = { ...adapted.features, airConditioning: true };
  if (filters.parking)
    adapted.features = { ...adapted.features, parking: true };

  // Incluir no disponibles
  if (filters.includeUnavailable !== undefined) {
    adapted.includeUnavailable = filters.includeUnavailable;
  }

  return adapted;
}

/**
 * Obtiene información del estado de la API (para debugging)
 */
export const getAPIStatus = async () => {
  return {
    type: "Inmovilla Web API",
    rateLimits: {
      general: "~70 peticiones/minuto",
      notes: "Más flexible que API REST",
    },
    cacheInfo: {
      enabled: true,
      duration: "30 minutos",
      status: "active",
    },
    timestamp: new Date().toISOString(),
  };
};

/**
 * Limpia el caché
 */
export const clearAllCache = () => {
  client.clearCache();
  console.log("🧹 All cache cleared");
};

/**
 * Fuerza recarga de todos los datos
 */
export const forceReloadAllData = async () => {
  console.log("🔄 Force reloading all data...");

  clearAllCache();

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

/**
 * Configuración de la API
 */
export const API_CONFIG = {
  type: "web",
  baseUrl: "/api/inmovilla-web",
  version: "1.0",
  capabilities: {
    fullPropertyList: true,
    imageUrls: true,
    extendedFilters: true,
    propertyDetail: true,
    search: true,
    featured: true,
  },
};

// Exportar el cliente por si se necesita acceso directo
export { client as webClient };
