// src/services/api/client.js - ARCHIVO COMPLETO
import { API_CONFIG } from "./config";

// Rate limiting tracker
const rateLimitTracker = {
  enums: { count: 0, lastReset: Date.now() },
  properties: { count: 0, lastReset: Date.now() },
};

/**
 * Resetea contadores de rate limit si ha pasado el tiempo
 */
const resetRateLimitIfNeeded = (type) => {
  const now = Date.now();
  const tracker = rateLimitTracker[type];

  if (now - tracker.lastReset > 60000) {
    // 1 minuto
    tracker.count = 0;
    tracker.lastReset = now;
  }
};

/**
 * Verifica si podemos hacer la petición sin violar rate limits
 */
const canMakeRequest = (type) => {
  resetRateLimitIfNeeded(type);
  const tracker = rateLimitTracker[type];
  const limit = API_CONFIG.RATE_LIMITS[type.toUpperCase()].PER_MINUTE;

  return tracker.count < limit;
};

/**
 * Incrementa contador de rate limit
 */
const incrementRateLimit = (type) => {
  resetRateLimitIfNeeded(type);
  rateLimitTracker[type].count++;
};

/**
 * Utilidad para añadir delay entre peticiones
 */
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Cliente HTTP mejorado para la API Inmovilla
 */
export const apiClient = async (endpoint, options = {}) => {
  try {
    // Determinar tipo de petición para rate limiting
    const requestType = endpoint.includes("/enums/") ? "enums" : "properties";

    // Verificar rate limits
    if (!canMakeRequest(requestType)) {
      const waitTime =
        60000 - (Date.now() - rateLimitTracker[requestType].lastReset);
      console.warn(
        `⚠️ Rate limit reached for ${requestType}. Waiting ${Math.ceil(
          waitTime / 1000
        )}s`
      );
      await delay(waitTime + 1000); // Esperar un poco más por seguridad
    }

    let finalEndpoint = endpoint;

    // Construir parámetros de query
    if (options.params) {
      const queryParams = new URLSearchParams();
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          queryParams.append(key, value);
        }
      });

      const queryString = queryParams.toString();
      if (queryString) {
        finalEndpoint += (endpoint.includes("?") ? "&" : "?") + queryString;
      }
    }

    console.log(
      `🌐 API Request [${requestType}]: ${API_CONFIG.BASE_URL}${finalEndpoint}`
    );

    // Hacer la petición
    const response = await fetch(`${API_CONFIG.BASE_URL}${finalEndpoint}`, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        Token: API_CONFIG.TOKEN,
        ...options.headers,
      },
      signal: AbortSignal.timeout(API_CONFIG.REQUEST.TIMEOUT),
      ...options,
    });

    // Incrementar contador después de petición exitosa
    incrementRateLimit(requestType);

    // Manejo específico de errores de la API
    if (response.status === 408) {
      console.error("🚫 Rate limit exceeded (408). Waiting 10 minutes...");
      throw new Error("Rate limit exceeded. Please wait and try again later.");
    }

    if (response.status === 404) {
      console.warn("🔍 Resource not found (404)");
      throw new Error("Resource not found");
    }

    if (response.status === 400) {
      console.error("❌ Bad request (400)");
      throw new Error("Bad request - check parameters");
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Log según el tipo de respuesta
    if (Array.isArray(data)) {
      console.log(`📦 API Response: ${data.length} items`);
    } else if (data && typeof data === "object") {
      console.log(
        `📦 API Response: Object with keys: ${Object.keys(data)
          .slice(0, 5)
          .join(", ")}`
      );
    } else {
      console.log(`📦 API Response: ${typeof data}`);
    }

    return data;
  } catch (error) {
    console.error(`❌ API Error [${endpoint}]:`, error.message);

    // Si es un error de rate limit, agregar más contexto
    if (error.message.includes("Rate limit")) {
      console.log("💡 Tip: Implement caching or reduce request frequency");
    }

    throw error;
  }
};

/**
 * Cliente especializado para obtener detalles de propiedades
 * Usa parámetros específicos según la documentación
 */
export const getPropertyDetail = async (cod_ofer) => {
  console.log(`🔍 Fetching property detail: ${cod_ofer}`);

  return await apiClient("/propiedades/", {
    params: { cod_ofer },
  });
};

/**
 * Cliente especializado para listado con filtros
 * Usa los nombres de campos correctos según documentación
 */
export const getPropertiesList = async (filters = {}) => {
  const params = {
    listado: "1", // Parámetro requerido según documentación
  };

  // Mapear filtros a nombres de campos correctos
  if (filters.propertyType)
    params[API_CONFIG.FILTER_FIELDS.TIPO] = filters.propertyType;
  if (filters.location)
    params[API_CONFIG.FILTER_FIELDS.CIUDAD] = filters.location;
  if (filters.minPrice)
    params[API_CONFIG.FILTER_FIELDS.PRECIO_MIN] = filters.minPrice;
  if (filters.maxPrice)
    params[API_CONFIG.FILTER_FIELDS.PRECIO_MAX] = filters.maxPrice;
  if (filters.rooms)
    params[API_CONFIG.FILTER_FIELDS.HABITACIONES] = filters.rooms;
  if (filters.minSurface)
    params[API_CONFIG.FILTER_FIELDS.METROS_MIN] = filters.minSurface;
  if (filters.reference)
    params[API_CONFIG.FILTER_FIELDS.REFERENCIA] = filters.reference;

  console.log("🔍 Fetching properties list with filters:", params);

  return await apiClient("/propiedades/", { params });
};

/**
 * Información de rate limits actual
 */
export const getRateLimitStatus = () => {
  const now = Date.now();
  return {
    enums: {
      count: rateLimitTracker.enums.count,
      resetIn: 60000 - (now - rateLimitTracker.enums.lastReset),
      canRequest: canMakeRequest("enums"),
    },
    properties: {
      count: rateLimitTracker.properties.count,
      resetIn: 60000 - (now - rateLimitTracker.properties.lastReset),
      canRequest: canMakeRequest("properties"),
    },
  };
};
