const API_URL = "/api-inmovilla";
const TOKEN = "0F6399CF144116F22D567B761ABA2CEF";

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
const CACHE_KEYS = {
  propertyTypes: "inmovilla_propertyTypes",
  locations: "inmovilla_locations",
};

// Funciones de caché
const getFromCache = (key) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const { data, timestamp } = JSON.parse(item);
    if (Date.now() - timestamp < CACHE_DURATION) {
      console.log(`Using cached data for ${key}`);
      return data;
    }
    localStorage.removeItem(key); // Limpiar caché expirada
    return null;
  } catch {
    return null;
  }
};

const setToCache = (key, data) => {
  try {
    localStorage.setItem(
      key,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      })
    );
    console.log(`Data cached for ${key}`);
  } catch (error) {
    console.warn("Error saving to cache:", error);
  }
};

const fetchAPI = async (endpoint, options = {}) => {
  try {
    let finalEndpoint = endpoint;

    if (options.params) {
      const queryParams = new URLSearchParams();
      Object.keys(options.params).forEach((key) =>
        queryParams.append(key, options.params[key])
      );
      finalEndpoint +=
        (endpoint.includes("?") ? "&" : "?") + queryParams.toString();
    }

    const response = await fetch(`${API_URL}${finalEndpoint}`, {
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
    // Intentar obtener de caché
    const cachedData = getFromCache(CACHE_KEYS.propertyTypes);
    if (cachedData) return cachedData;

    await delay(1000);
    console.log("Fetching fresh property types data");

    const data = await fetchAPI("/enums/?tipos");
    setToCache(CACHE_KEYS.propertyTypes, data);
    return data;
  } catch (error) {
    if (error.message.includes("408")) {
      console.warn("Rate limit reached for property types");
      // Intentar usar caché incluso si está expirado en caso de error
      const cachedData = getFromCache(CACHE_KEYS.propertyTypes);
      return cachedData || [];
    }
    console.error("Error fetching property types:", error);
    return [];
  }
};

export const getLocations = async () => {
  try {
    // Intentar obtener de caché
    const cachedData = getFromCache(CACHE_KEYS.locations);
    if (cachedData) return cachedData;

    await delay(1000);
    console.log("Fetching fresh locations data");

    const data = await fetchAPI("/enums/?ciudades=724");
    setToCache(CACHE_KEYS.locations, data);
    return data;
  } catch (error) {
    if (error.message.includes("408")) {
      console.warn("Rate limit reached for locations");
      // Intentar usar caché incluso si está expirado en caso de error
      const cachedData = getFromCache(CACHE_KEYS.locations);
      return cachedData || [];
    }
    console.error("Error fetching locations:", error);
    return [];
  }
};

export const getProperties = async (filters = {}) => {
  try {
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
    const data = await fetchAPI(`/propiedades/?cod_ofer=${cod_ofer}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

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
