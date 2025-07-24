// src/hooks/usePropertyDetail.js
import { useState, useEffect } from "react";
import { getPropertyDetail } from "../services/inmovilla";

/**
 * Hook personalizado para manejar el detalle de una propiedad
 * @param {string} propertyId - ID de la propiedad
 */
export const usePropertyDetail = (propertyId) => {
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  /**
   * Carga el detalle de la propiedad
   */
  const loadPropertyDetail = async () => {
    if (!propertyId) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log(`🔄 Loading property detail for: ${propertyId}`);
      const data = await getPropertyDetail(propertyId);
      setProperty(data);
      console.log("✅ Property detail loaded:", data);
    } catch (err) {
      console.error("❌ Error loading property:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Alterna el estado de favorito
   */
  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
    // TODO: Implementar lógica para guardar en favoritos
    console.log(
      `${isFavorite ? "Removed from" : "Added to"} favorites: ${property?.ref}`
    );
  };

  /**
   * Comparte la propiedad
   */
  const shareProperty = async () => {
    if (!property) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Propiedad ${property.ref}`,
          text:
            property.description ||
            `Propiedad en ${property.features?.location?.city}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copiar al portapapeles
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Enlace copiado al portapapeles");
      } catch (error) {
        console.error("Error copying to clipboard:", error);
      }
    }
  };

  // Cargar detalle cuando cambia el ID
  useEffect(() => {
    loadPropertyDetail();
  }, [propertyId]);

  // Verificar si está en favoritos al cargar
  useEffect(() => {
    if (property) {
      // TODO: Verificar si está en favoritos desde localStorage o API
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      setIsFavorite(favorites.includes(property.id));
    }
  }, [property]);

  // Guardar/quitar favorito cuando cambia
  useEffect(() => {
    if (property) {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      let newFavorites;

      if (isFavorite) {
        newFavorites = [...new Set([...favorites, property.id])];
      } else {
        newFavorites = favorites.filter((id) => id !== property.id);
      }

      localStorage.setItem("favorites", JSON.stringify(newFavorites));
    }
  }, [isFavorite, property]);

  return {
    property,
    isLoading,
    error,
    isFavorite,
    toggleFavorite,
    shareProperty,
    loadPropertyDetail,
  };
};
