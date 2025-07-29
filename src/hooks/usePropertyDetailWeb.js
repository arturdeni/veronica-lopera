// src/hooks/usePropertyDetailWeb.js
import { useState, useEffect } from "react";
import { getPropertyDetailById } from "../services/inmovilla-web";

/**
 * Hook personalizado para manejar el detalle de una propiedad usando API Web
 * Compatible con la interfaz anterior pero con mucha más información
 */
export const usePropertyDetailWeb = (propertyId) => {
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
      console.log("✅ Property detail loaded:", data.ref);
    } catch (err) {
      console.error("❌ Error loading property:", err);

      // Mensajes de error más específicos
      if (err.message.includes("not found")) {
        setError(
          "Propiedad no encontrada. Es posible que haya sido retirada del mercado."
        );
      } else if (err.message.includes("timeout")) {
        setError(
          "Tiempo de espera agotado. La propiedad podría no estar disponible temporalmente."
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
      title: `${property.propertyType} en ${property.city} - Verónica Lopera`,
      text:
        property.title ||
        `${property.propertyType} de ${property.rooms} habitaciones en ${property.city}. ${property.formattedPrice}`,
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

      // Mostrar notificación temporal
      showNotification("¡Enlace copiado al portapapeles!");
      console.log("✅ URL copied to clipboard");
    } catch (error) {
      console.error("❌ Error copying to clipboard:", error);
      alert(
        "No se pudo copiar el enlace. Comparte manualmente esta URL: " +
          window.location.href
      );
    }
  };

  /**
   * Muestra una notificación temporal
   */
  const showNotification = (message) => {
    const notification = document.createElement("div");
    notification.textContent = message;
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
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  };

  /**
   * Obtiene propiedades relacionadas (del mismo tipo y zona)
   */
  const getRelatedProperties = () => {
    if (!property) return [];

    // Esta funcionalidad se podría implementar haciendo una búsqueda
    // con filtros similares a la propiedad actual
    return [];
  };

  /**
   * Calcula la puntuación de la propiedad basada en características
   */
  const getPropertyScore = () => {
    if (!property) return 0;

    let score = 50; // Base score

    // Características positivas
    if (property.features?.elevator) score += 10;
    if (property.features?.airConditioning) score += 10;
    if (property.features?.communityPool || property.features?.privatePool)
      score += 15;
    if (property.features?.parking) score += 10;
    if (property.distanceToSea && property.distanceToSea < 500) score += 20;
    if (property.rooms >= 3) score += 10;
    if (property.bathrooms >= 2) score += 5;

    // Limitar entre 0 y 100
    return Math.min(100, Math.max(0, score));
  };

  /**
   * Genera recomendaciones basadas en la propiedad
   */
  const getRecommendations = () => {
    if (!property) return [];

    const recommendations = [];

    if (!property.features?.airConditioning) {
      recommendations.push({
        type: "feature",
        message:
          "Considera verificar las opciones de climatización disponibles",
        priority: "medium",
      });
    }

    if (property.distanceToSea && property.distanceToSea > 1000) {
      recommendations.push({
        type: "location",
        message: "Esta propiedad está a más de 1km del mar",
        priority: "low",
      });
    }

    if (
      !property.features?.elevator &&
      property.extendedFeatures?.location?.floor > 2
    ) {
      recommendations.push({
        type: "accessibility",
        message: "No hay ascensor y está en una planta alta",
        priority: "high",
      });
    }

    return recommendations;
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
    // Datos principales
    property,
    isLoading,
    error,
    isFavorite,

    // Acciones
    toggleFavorite,
    shareProperty,
    loadPropertyDetail,

    // Funcionalidades extendidas
    relatedProperties: getRelatedProperties(),
    propertyScore: getPropertyScore(),
    recommendations: getRecommendations(),

    // Utilidades para la UI
    hasImages: property?.images?.length > 0,
    hasVideos: property?.videos?.length > 0,
    hasVirtualTour: property?.extendedFeatures?.virtualTour,
    hasEnergyRating: property?.extendedFeatures?.energy?.energyRating,

    // Información de contacto (desde la propiedad)
    contactInfo: property
      ? {
          phone: "+34 646 371 235",
          email: "info@veronicalopera.com",
          agency: "Verónica Lopera",
          agencyId: property.agencyId,
        }
      : null,

    // Estadísticas útiles
    stats: property
      ? {
          totalPhotos: property.images?.length || 0,
          totalVideos: property.videos?.length || 0,
          pricePerSquareMeter:
            property.salePrice && property.builtSurface
              ? Math.round(property.salePrice / property.builtSurface)
              : null,
          lastUpdate: property.formattedDate,
          isRecent: property.lastUpdate
            ? Date.now() - new Date(property.lastUpdate).getTime() <
              7 * 24 * 60 * 60 * 1000
            : false,
        }
      : null,
  };
};
