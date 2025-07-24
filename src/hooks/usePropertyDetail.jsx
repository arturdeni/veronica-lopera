// src/hooks/usePropertyDetail.js - ARCHIVO COMPLETO
import { useState, useEffect } from "react";
import { getPropertyDetailById } from "../services/inmovilla";

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
    if (!propertyId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log(`🔄 Loading property detail for: ${propertyId}`);
      const data = await getPropertyDetailById(propertyId);
      setProperty(data);
      console.log("✅ Property detail loaded:", data);
    } catch (err) {
      console.error("❌ Error loading property:", err);

      // Mensajes de error más específicos según documentación
      if (err.message.includes("Rate limit")) {
        setError(
          "Demasiadas peticiones. Por favor, espera un momento e intenta de nuevo."
        );
      } else if (
        err.message.includes("not found") ||
        err.message === "Property not found"
      ) {
        setError(
          "Propiedad no encontrada. Es posible que haya sido retirada del mercado."
        );
      } else if (err.message.includes("Bad request")) {
        setError(
          "Error en los parámetros de la petición. Contacta con soporte."
        );
      } else {
        setError(
          "Error cargando los detalles de la propiedad. Intenta de nuevo."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Alterna el estado de favorito
   */
  const toggleFavorite = () => {
    if (!property) return;

    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);

    // Gestionar favoritos en localStorage
    try {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      let newFavorites;

      if (newFavoriteStatus) {
        newFavorites = [...new Set([...favorites, property.id])];
        console.log(`❤️ Added to favorites: ${property.ref}`);
      } else {
        newFavorites = favorites.filter((id) => id !== property.id);
        console.log(`💔 Removed from favorites: ${property.ref}`);
      }

      localStorage.setItem("favorites", JSON.stringify(newFavorites));
    } catch (error) {
      console.error("Error managing favorites:", error);
    }
  };

  /**
   * Comparte la propiedad
   */
  const shareProperty = async () => {
    if (!property) return;

    const shareData = {
      title: `Propiedad ${property.ref} - Verónica Lopera`,
      text:
        property.title ||
        `${
          property.features?.basic?.rooms
            ? property.features.basic.rooms + " habitaciones"
            : "Propiedad"
        } en ${property.features?.location?.city || "Costa Dorada"}`,
      url: window.location.href,
    };

    // Usar Web Share API si está disponible
    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare(shareData)
    ) {
      try {
        await navigator.share(shareData);
        console.log("✅ Property shared successfully");
      } catch (error) {
        if (error.name !== "AbortError") {
          // Usuario canceló
          console.log("❌ Error sharing:", error);
          fallbackShare();
        }
      }
    } else {
      fallbackShare();
    }
  };

  /**
   * Compartir fallback (copiar al portapapeles)
   */
  const fallbackShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);

      // Mostrar notificación temporal (puedes mejorarlo con toast)
      const notification = document.createElement("div");
      notification.textContent = "¡Enlace copiado al portapapeles!";
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #093721;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-family: system-ui;
      `;
      document.body.appendChild(notification);

      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);

      console.log("✅ URL copied to clipboard");
    } catch (error) {
      console.error("❌ Error copying to clipboard:", error);
      alert(
        "No se pudo copiar el enlace. Comparte manualmente esta URL: " +
          window.location.href
      );
    }
  };

  // Cargar detalle cuando cambia el ID
  useEffect(() => {
    loadPropertyDetail();
  }, [propertyId]);

  // Verificar si está en favoritos al cargar la propiedad
  useEffect(() => {
    if (property) {
      try {
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        setIsFavorite(favorites.includes(property.id));
      } catch (error) {
        console.error("Error reading favorites:", error);
        setIsFavorite(false);
      }
    }
  }, [property]);

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
