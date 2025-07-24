// src/hooks/useProperties.js - ARCHIVO COMPLETO
import { useState, useEffect, useCallback } from "react";
import {
  getProperties,
  getPropertyTypes,
  getLocations,
  searchProperties,
} from "../services/inmovilla";
import { getRateLimitStatus } from "../services/api/client";

/**
 * Hook personalizado para manejar propiedades y filtros
 */
export const useProperties = () => {
  // Estados principales
  const [properties, setProperties] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [locations, setLocations] = useState([]);

  // Estados de carga
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  // Estados de filtros
  const [filters, setFilters] = useState({
    propertyType: "",
    location: "",
    minPrice: "",
    maxPrice: "",
    rooms: "",
    minSurface: "",
    reference: "",
    searchTerm: "",
    includeUnavailable: false,
  });

  // Estado de rate limits
  const [rateLimitStatus, setRateLimitStatus] = useState(null);

  /**
   * Actualiza el estado de rate limits
   */
  const updateRateLimitStatus = useCallback(() => {
    const status = getRateLimitStatus();
    setRateLimitStatus(status);
  }, []);

  /**
   * Carga inicial de datos con manejo de errores mejorado
   */
  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    updateRateLimitStatus();

    try {
      console.log("🚀 Starting initial data load...");

      // Cargar enums primero (tienen rate limit más estricto)
      console.log("📋 Loading property types and locations...");
      const [typesResult, locationsResult] = await Promise.allSettled([
        getPropertyTypes(),
        getLocations(),
      ]);

      // Procesar tipos
      if (typesResult.status === "fulfilled") {
        setPropertyTypes(typesResult.value);
        console.log("✅ Property types loaded:", typesResult.value.length);
      } else {
        console.error("❌ Property types failed:", typesResult.reason);
        setPropertyTypes([]);
      }

      // Procesar ubicaciones
      if (locationsResult.status === "fulfilled") {
        setLocations(locationsResult.value);
        console.log("✅ Locations loaded:", locationsResult.value.length);
      } else {
        console.error("❌ Locations failed:", locationsResult.reason);
        setLocations([]);
      }

      // Esperar un poco antes de cargar propiedades (rate limiting)
      console.log("⏱️ Waiting before loading properties...");
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Cargar propiedades
      console.log("🏠 Loading properties...");
      const propertiesResult = await getProperties();
      setProperties(propertiesResult);
      console.log("✅ Properties loaded:", propertiesResult.length);
    } catch (error) {
      console.error("❌ Error loading initial data:", error);

      // Establecer mensaje de error más específico
      if (error.message.includes("Rate limit")) {
        setError(
          "Límite de peticiones alcanzado. Por favor, espera unos minutos e intenta de nuevo."
        );
      } else if (error.message.includes("not found")) {
        setError(
          "No se pudieron cargar los datos. Verifica la configuración de la API."
        );
      } else {
        setError("Error cargando datos. Por favor, recarga la página.");
      }
    } finally {
      setIsLoading(false);
      updateRateLimitStatus();
    }
  }, [updateRateLimitStatus]);

  /**
   * Maneja cambios en los filtros
   */
  const handleFilterChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  /**
   * Aplica filtros y busca propiedades
   */
  const applyFilters = useCallback(async () => {
    setIsSearching(true);
    setError(null);
    updateRateLimitStatus();

    try {
      console.log("🔍 Applying filters:", filters);

      let filteredProperties;

      if (filters.searchTerm) {
        // Búsqueda por texto + filtros
        filteredProperties = await searchProperties(
          filters.searchTerm,
          filters
        );
      } else {
        // Solo filtros
        filteredProperties = await getProperties(filters);
      }

      setProperties(filteredProperties);
      console.log(
        "✅ Filters applied, properties found:",
        filteredProperties.length
      );
    } catch (error) {
      console.error("❌ Error applying filters:", error);

      if (error.message.includes("Rate limit")) {
        setError(
          "Demasiadas búsquedas. Por favor, espera un momento antes de buscar de nuevo."
        );
      } else {
        setError("Error aplicando filtros. Intenta de nuevo.");
      }
    } finally {
      setIsSearching(false);
      updateRateLimitStatus();
    }
  }, [filters, updateRateLimitStatus]);

  /**
   * Limpia todos los filtros
   */
  const clearFilters = useCallback(async () => {
    const resetFilters = {
      propertyType: "",
      location: "",
      minPrice: "",
      maxPrice: "",
      rooms: "",
      minSurface: "",
      reference: "",
      searchTerm: "",
      includeUnavailable: false,
    };

    setFilters(resetFilters);

    setIsSearching(true);
    try {
      const allProperties = await getProperties();
      setProperties(allProperties);
    } catch (error) {
      console.error("❌ Error clearing filters:", error);
      setError("Error limpiando filtros.");
    } finally {
      setIsSearching(false);
      updateRateLimitStatus();
    }
  }, [updateRateLimitStatus]);

  /**
   * Recarga todos los datos (con fuerza)
   */
  const reloadData = useCallback(async () => {
    try {
      setIsSearching(true);
      const freshProperties = await getProperties({
        ...filters,
        forceRefresh: true,
      });
      setProperties(freshProperties);
    } catch (error) {
      console.error("❌ Error reloading data:", error);
      setError("Error recargando datos.");
    } finally {
      setIsSearching(false);
      updateRateLimitStatus();
    }
  }, [filters, updateRateLimitStatus]);

  // Carga inicial cuando el hook se monta
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Actualizar rate limits cada 30 segundos
  useEffect(() => {
    const interval = setInterval(updateRateLimitStatus, 30000);
    return () => clearInterval(interval);
  }, [updateRateLimitStatus]);

  return {
    // Datos
    properties,
    propertyTypes,
    locations,

    // Estados
    isLoading,
    isSearching,
    error,
    filters,
    rateLimitStatus,

    // Acciones
    handleFilterChange,
    applyFilters,
    clearFilters,
    loadInitialData,
    reloadData,
  };
};
