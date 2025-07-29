// src/hooks/usePropertiesWeb.js
import { useState, useEffect, useCallback } from "react";
import {
  getProperties,
  getPropertyTypes,
  getLocations,
  getZones,
  searchProperties,
  getFeaturedProperties,
  getAPIStatus,
  forceReloadAllData,
} from "../services/inmovilla-web";

/**
 * Hook personalizado para manejar propiedades usando la API Web de Inmovilla
 * Compatible con la interfaz anterior pero con funcionalidades extendidas
 */
export const usePropertiesWeb = () => {
  // Estados principales
  const [properties, setProperties] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [zones, setZones] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);

  // Estados de carga
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingZones, setIsLoadingZones] = useState(false);
  const [error, setError] = useState(null);

  // Estados de filtros
  const [filters, setFilters] = useState({
    propertyType: "",
    location: "",
    zone: "",
    minPrice: "",
    maxPrice: "",
    rooms: "",
    minSurface: "",
    reference: "",
    searchTerm: "",
    includeUnavailable: false,
  });

  // Estado de la API
  const [apiStatus, setApiStatus] = useState(null);

  /**
   * Actualiza el estado de la API
   */
  const updateApiStatus = useCallback(async () => {
    try {
      const status = await getAPIStatus();
      setApiStatus(status);
    } catch (error) {
      console.error("Error getting API status:", error);
    }
  }, []);

  /**
   * Carga inicial de datos
   */
  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("🚀 Starting initial data load with Web API...");

      // Cargar datos básicos en paralelo
      const [typesResult, locationsResult, propertiesResult, featuredResult] =
        await Promise.allSettled([
          getPropertyTypes(),
          getLocations(),
          getProperties({ limit: 20 }),
          getFeaturedProperties(6),
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

      // Procesar propiedades
      if (propertiesResult.status === "fulfilled") {
        setProperties(propertiesResult.value);
        console.log("✅ Properties loaded:", propertiesResult.value.length);
      } else {
        console.error("❌ Properties failed:", propertiesResult.reason);
        setProperties([]);
      }

      // Procesar destacadas
      if (featuredResult.status === "fulfilled") {
        setFeaturedProperties(featuredResult.value);
        console.log(
          "✅ Featured properties loaded:",
          featuredResult.value.length
        );
      } else {
        console.error("❌ Featured properties failed:", featuredResult.reason);
        setFeaturedProperties([]);
      }

      // Actualizar estado de API
      await updateApiStatus();
    } catch (error) {
      console.error("❌ Error loading initial data:", error);
      setError("Error cargando datos. Por favor, recarga la página.");
    } finally {
      setIsLoading(false);
    }
  }, [updateApiStatus]);

  /**
   * Carga zonas para una ciudad específica
   */
  const loadZonesForCity = useCallback(async (cityId) => {
    if (!cityId) {
      setZones([]);
      return;
    }

    setIsLoadingZones(true);
    try {
      console.log(`🔄 Loading zones for city: ${cityId}`);
      const cityZones = await getZones(cityId);
      setZones(cityZones);
      console.log(`✅ Zones loaded: ${cityZones.length}`);
    } catch (error) {
      console.error("❌ Error loading zones:", error);
      setZones([]);
    } finally {
      setIsLoadingZones(false);
    }
  }, []);

  /**
   * Maneja cambios en los filtros
   */
  const handleFilterChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === "checkbox" ? checked : value;

      setFilters((prev) => {
        const newFilters = {
          ...prev,
          [name]: newValue,
        };

        // Si cambió la ciudad, cargar sus zonas y limpiar zona seleccionada
        if (name === "location" && newValue !== prev.location) {
          newFilters.zone = "";
          loadZonesForCity(newValue);
        }

        return newFilters;
      });
    },
    [loadZonesForCity]
  );

  /**
   * Aplica filtros y busca propiedades
   */
  const applyFilters = useCallback(async () => {
    setIsSearching(true);
    setError(null);

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
      setError("Error aplicando filtros. Intenta de nuevo.");
    } finally {
      setIsSearching(false);
      await updateApiStatus();
    }
  }, [filters, updateApiStatus]);

  /**
   * Limpia todos los filtros
   */
  const clearFilters = useCallback(async () => {
    const resetFilters = {
      propertyType: "",
      location: "",
      zone: "",
      minPrice: "",
      maxPrice: "",
      rooms: "",
      minSurface: "",
      reference: "",
      searchTerm: "",
      includeUnavailable: false,
    };

    setFilters(resetFilters);
    setZones([]); // Limpiar zonas también

    setIsSearching(true);
    try {
      const allProperties = await getProperties();
      setProperties(allProperties);
      console.log("✅ Filters cleared");
    } catch (error) {
      console.error("❌ Error clearing filters:", error);
      setError("Error limpiando filtros.");
    } finally {
      setIsSearching(false);
    }
  }, []);

  /**
   * Recarga todos los datos (con fuerza)
   */
  const reloadData = useCallback(async () => {
    try {
      setIsSearching(true);
      const freshData = await forceReloadAllData();

      setPropertyTypes(freshData.types);
      setLocations(freshData.locations);
      setProperties(freshData.properties);

      console.log("✅ Data reloaded successfully");
    } catch (error) {
      console.error("❌ Error reloading data:", error);
      setError("Error recargando datos.");
    } finally {
      setIsSearching(false);
      await updateApiStatus();
    }
  }, [updateApiStatus]);

  /**
   * Busca propiedades por término específico
   */
  const searchByTerm = useCallback(
    async (searchTerm) => {
      if (!searchTerm.trim()) {
        return await applyFilters();
      }

      setIsSearching(true);
      try {
        const results = await searchProperties(searchTerm, filters);
        setProperties(results);
        console.log(`✅ Search results for "${searchTerm}":`, results.length);
      } catch (error) {
        console.error("❌ Error searching:", error);
        setError("Error en la búsqueda.");
      } finally {
        setIsSearching(false);
      }
    },
    [filters, applyFilters]
  );

  /**
   * Obtiene propiedades destacadas
   */
  const loadFeaturedProperties = useCallback(async (limit = 6) => {
    try {
      const featured = await getFeaturedProperties(limit);
      setFeaturedProperties(featured);
      console.log(`✅ Featured properties loaded: ${featured.length}`);
    } catch (error) {
      console.error("❌ Error loading featured properties:", error);
    }
  }, []);

  // Carga inicial cuando el hook se monta
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Auto-aplicar filtros cuando cambian (con debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Solo auto-aplicar si hay algún filtro activo
      const hasActiveFilters = Object.values(filters).some(
        (value) => value !== "" && value !== false
      );

      if (hasActiveFilters && !isLoading) {
        applyFilters();
      }
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timeoutId);
  }, [filters, applyFilters, isLoading]);

  return {
    // Datos
    properties,
    propertyTypes,
    locations,
    zones,
    featuredProperties,

    // Estados
    isLoading,
    isSearching,
    isLoadingZones,
    error,
    filters,
    apiStatus,

    // Acciones
    handleFilterChange,
    applyFilters,
    clearFilters,
    reloadData,
    searchByTerm,
    loadFeaturedProperties,
    loadZonesForCity,

    // Funciones de utilidad
    setFilters,
    setError,

    // Metadatos
    stats: {
      totalProperties: properties.length,
      totalTypes: propertyTypes.length,
      totalLocations: locations.length,
      totalZones: zones.length,
      totalFeatured: featuredProperties.length,
    },
  };
};
