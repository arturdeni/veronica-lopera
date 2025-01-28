// src/services/inmovilla.js
const API_URL = "/api-inmovilla";
const TOKEN = "0F6399CF144116F22D567B761ABA2CEF"; // Tu token aquí

// Cache para evitar peticiones repetidas
const cache = {
  propertyTypes: null,
  locations: null,
  lastPropertyTypesFetch: null,
  lastLocationsFetch: null,
};

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

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

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getPropertyTypes = async () => {
  try {
    // Usar cache si está disponible y es reciente
    if (
      cache.propertyTypes &&
      Date.now() - cache.lastPropertyTypesFetch < CACHE_DURATION
    ) {
      return cache.propertyTypes;
    }

    // Añadir un pequeño retraso antes de hacer la petición
    await delay(1000); // 1 segundo de retraso

    const data = await fetchAPI("/enums/?tipos");
    cache.propertyTypes = data;
    cache.lastPropertyTypesFetch = Date.now();
    return data;
  } catch (error) {
    if (error.message.includes("408")) {
      console.warn("Rate limit reached for property types, using cached data");
      return cache.propertyTypes || [];
    }
    console.error("Error fetching property types:", error);
    return cache.propertyTypes || [];
  }
};

export const getLocations = async () => {
  try {
    if (
      cache.locations &&
      Date.now() - cache.lastLocationsFetch < CACHE_DURATION
    ) {
      return cache.locations;
    }

    // Añadir un pequeño retraso antes de hacer la petición
    await delay(1000); // 1 segundo de retraso

    const data = await fetchAPI("/enums/?ciudades");
    cache.locations = data;
    cache.lastLocationsFetch = Date.now();
    return data;
  } catch (error) {
    if (error.message.includes("408")) {
      console.warn("Rate limit reached for locations, using cached data");
      return cache.locations || [];
    }
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
    // La petición base debería tener este formato según la documentación:
    const data = await fetchAPI(`/propiedades/?cod_ofer=${cod_ofer}`, {
      method: "GET", // Cambiamos a GET
      headers: {
        "Content-Type": "application/json",
        // El token ya lo estás añadiendo en fetchAPI
      },
    });

    // Aquí podríamos acceder a las fotos con una URL base + el código de la oferta
    // Esto es una suposición, necesitaríamos confirmar con la documentación
    const photos = Array.from(
      { length: data.numfotos },
      (_, i) => `/ruta-base-fotos/${data.cod_ofer}/foto_${i + 1}.jpg`
    );

    return {
      ...data,
      photos,
    };
  } catch (error) {
    console.error("Error fetching property detail:", error);
    throw error;
  }
};
