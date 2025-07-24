// src/services/api/client.js
import { API_CONFIG } from "./config";

/**
 * Utilidad para añadir delay entre peticiones
 * @param {number} ms - Milisegundos de delay
 */
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Cliente HTTP base para la API Inmovilla
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} options - Opciones de la petición
 * @returns {Promise<any>} - Respuesta de la API
 */
export const apiClient = async (endpoint, options = {}) => {
  try {
    let finalEndpoint = endpoint;

    // Añadir parámetros de query si existen
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

    console.log(`🌐 API Request: ${API_CONFIG.BASE_URL}${finalEndpoint}`);

    const response = await fetch(`${API_CONFIG.BASE_URL}${finalEndpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Token: API_CONFIG.TOKEN,
        ...options.headers,
      },
      ...options,
    });

    // Manejo de errores HTTP
    if (response.status === 408) {
      throw new Error("Rate limit reached. Please try again later.");
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`📦 API Response: ${data?.length || "N/A"} items`);

    return data;
  } catch (error) {
    console.error(`❌ API Error [${endpoint}]:`, error.message);
    throw error;
  }
};
