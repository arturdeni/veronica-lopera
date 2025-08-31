// src/services/inmovilla.js - VERSIÓN COMPLETAMENTE CORREGIDA
import InmovillaWebClient from "./inmovilla-web/client.js";
import { validateInmovillaConfig } from "../config/env.js";

// ✅ SOLUCIÓN: Inicialización lazy del cliente usando configuración centralizada
let client = null;

/**
 * Obtiene o crea el cliente de Inmovilla
 */
const getClient = () => {
  if (!client) {
    console.log("🔧 Initializing Inmovilla Web Client...");

    // Usar la validación centralizada en lugar de process.env
    if (!validateInmovillaConfig()) {
      throw new Error(
        "Missing Inmovilla API credentials. Check your .env.local file and ensure variables start with VITE_"
      );
    }

    // El cliente ya usa la configuración centralizada internamente
    client = new InmovillaWebClient();

    console.log("✅ Inmovilla Web Client initialized successfully");
  }

  return client;
};

/**
 * Obtiene tipos de propiedades
 */
export const getPropertyTypes = async () => {
  try {
    console.log("🔄 Loading property types...");
    const client = getClient();
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
 */
export const getLocations = async () => {
  try {
    console.log("🔄 Loading locations...");
    const client = getClient();
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
    const client = getClient();
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
 */
export const getProperties = async (filters = {}) => {
  try {
    console.log("🔄 Loading properties with filters:", filters);
    const client = getClient();

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

    return result.items || [];
  } catch (error) {
    console.error("❌ Error loading properties:", error);
    return [];
  }
};

/**
 * Obtiene detalle completo de una propiedad por ID
 */
export const getPropertyDetailById = async (codOfer) => {
  try {
    console.log(`🔄 Loading property detail: ${codOfer}`);
    const client = getClient();
    const detail = await client.getPropertyDetail(codOfer);
    console.log(`✅ Property detail loaded`);
    return detail;
  } catch (error) {
    console.error("❌ Error loading property detail:", error);
    throw error;
  }
};

/**
 * Búsqueda de propiedades por término de texto
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

    // Búsqueda más amplia
    const searchFilters = {
      ...filters,
      searchTerm: searchTerm.toLowerCase(),
    };

    const results = await getProperties(searchFilters);

    // Filtro adicional en cliente si es necesario
    const filtered = results.filter(
      (property) =>
        property.ref?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.ciudad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.zona?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.nbtipo?.toLowerCase().includes(searchTerm.toLowerCase())
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
    const client = getClient();

    const result = await client.makeRequest([
      {
        tipo: "destacados",
        posinicial: 1,
        numelementos: limit,
        where: "",
        orden: "fechaact DESC",
      },
    ]);

    const items = result.destacados ? result.destacados.slice(1) : [];
    console.log(`✅ Featured properties loaded: ${items.length}`);
    return items;
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
  if (filters.propertyType) adapted.tipo = filters.propertyType;
  if (filters.location) adapted.ciudad = filters.location;
  if (filters.zone) adapted.zona = filters.zone;
  if (filters.minPrice) adapted.precioMin = parseInt(filters.minPrice);
  if (filters.maxPrice) adapted.precioMax = parseInt(filters.maxPrice);
  if (filters.rooms) adapted.habitaciones = parseInt(filters.rooms);
  if (filters.minSurface) adapted.metrosMin = parseInt(filters.minSurface);
  if (filters.maxSurface) adapted.metrosMax = parseInt(filters.maxSurface);
  if (filters.reference) adapted.reference = filters.reference;

  // Características especiales
  if (filters.elevator) adapted.ascensor = true;
  if (filters.pool) adapted.piscina = true;
  if (filters.airConditioning) adapted.aireAcondicionado = true;
  if (filters.parking) adapted.parking = true;

  return adapted;
}

/**
 * Obtiene información del estado de la API
 */
export const getAPIStatus = async () => {
  return {
    type: "Inmovilla Web API",
    rateLimits: {
      general: "Limitado por IP y peticiones por minuto",
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
  if (client) {
    client.clearCache();
    console.log("🧹 All cache cleared");
  }
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
      getProperties({ limit: 20 }),
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

/**
 * Exportar el cliente para acceso directo
 */
export const getWebClient = () => getClient();
