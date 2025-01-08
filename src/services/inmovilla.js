// src/services/inmovilla.js
const API_URL = "/api-inmovilla";
const TOKEN = "0F6399CF144116F22D567B761ABA2CEF"; // Tu token aquí

// Cache para evitar peticiones repetidas
const cache = {
  propertyTypes: null,
  locations: null,
  lastPropertiesFetch: null,
  properties: null,
};

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutos en milisegundos

const fetchAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Token: TOKEN,
        ...options.headers,
      },
    });

    if (response.status === 408) {
      throw new Error("Rate limit reached. Please try again later.");
    }

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`API request failed:`, error);
    throw error;
  }
};

export const getPropertyTypes = async () => {
  try {
    // Usar cache si está disponible y es reciente
    if (
      cache.propertyTypes &&
      Date.now() - cache.lastPropertyTypesFetch < CACHE_DURATION
    ) {
      return cache.propertyTypes;
    }

    const data = await fetchAPI("/enums/?tipos");
    cache.propertyTypes = data;
    cache.lastPropertyTypesFetch = Date.now();
    return data;
  } catch (error) {
    console.error("Error fetching property types:", error);
    return cache.propertyTypes || [];
  }
};

export const getLocations = async () => {
  try {
    // Usar cache si está disponible y es reciente
    if (
      cache.locations &&
      Date.now() - cache.lastLocationsFetch < CACHE_DURATION
    ) {
      return cache.locations;
    }

    const data = await fetchAPI("/enums/?ciudades");
    cache.locations = data;
    cache.lastLocationsFetch = Date.now();
    return data;
  } catch (error) {
    console.error("Error fetching locations:", error);
    return cache.locations || [];
  }
};

export const getProperties = async (filters = {}) => {
  try {
    // Construir la query string para los filtros
    const queryParams = new URLSearchParams();

    if (filters.propertyType) {
      queryParams.append("key_tipo", filters.propertyType);
    }

    if (filters.location) {
      queryParams.append("key_loca", filters.location);
    }

    if (filters.reference) {
      queryParams.append("ref", filters.reference);
    }

    const endpoint = `/propiedades/?listado${
      queryParams.toString() ? "&" + queryParams.toString() : ""
    }`;
    const data = await fetchAPI(endpoint);

    // Filtrar las propiedades no disponibles si no se especifica lo contrario
    return data.filter(
      (property) => !property.nodisponible || filters.includeUnavailable
    );
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
};

export const getPropertyDetail = async (cod_ofer) => {
  try {
    const data = await fetchAPI(`/propiedades/?cod_ofer=${cod_ofer}`);
    return data;
  } catch (error) {
    console.error("Error fetching property detail:", error);
    return null;
  }
};
