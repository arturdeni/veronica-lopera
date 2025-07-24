// src/hooks/useProperties.js
import { useState, useEffect } from "react";
import {
  getProperties,
  getPropertyTypes,
  getLocations,
  searchProperties,
} from "../services/inmovilla";

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

  /**
   * Carga inicial de datos
   */
  const loadInitialData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("🚀 Loading initial data...");

      const [propertiesResult, typesResult, locationsResult] =
        await Promise.allSettled([
          getProperties(),
          getPropertyTypes(),
          getLocations(),
        ]);

      // Procesar propiedades
      if (propertiesResult.status === "fulfilled") {
        setProperties(propertiesResult.value);
        console.log("✅ Properties loaded:", propertiesResult.value.length);
      } else {
        console.error("❌ Properties failed:", propertiesResult.reason);
      }

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
    } catch (error) {
      console.error("❌ Error loading initial data:", error);
      setError("Error loading data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Maneja cambios en los filtros
   */
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /**
   * Aplica filtros y busca propiedades
   */
  const applyFilters = async () => {
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
      setError("Error applying filters. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  /**
   * Limpia todos los filtros
   */
  const clearFilters = async () => {
    setFilters({
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

    setIsSearching(true);
    try {
      const allProperties = await getProperties();
      setProperties(allProperties);
    } catch (error) {
      setError("Error clearing filters.");
    } finally {
      setIsSearching(false);
    }
  };

  // Carga inicial cuando el hook se monta
  useEffect(() => {
    loadInitialData();
  }, []);

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

    // Acciones
    handleFilterChange,
    applyFilters,
    clearFilters,
    loadInitialData,
  };
};
