// src/components/PropertyImage.jsx
import React, { useState } from "react";
import { Home } from "lucide-react";

/**
 * Componente para mostrar imágenes de propiedades con fallback
 * @param {Object} property - Objeto de la propiedad
 * @param {string} className - Clases CSS para la imagen
 */
const PropertyImage = ({ property, className }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // Si no hay URL de imagen o hay error, mostrar placeholder
  if (!property.imageUrl || imageError) {
    return (
      <div
        className={`${className} bg-gray-200 flex items-center justify-center`}
      >
        <div className="text-center text-gray-500">
          <Home size={32} className="mx-auto mb-2" />
          <span className="text-sm">Sin imagen</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div
          className={`${className} bg-gray-200 animate-pulse flex items-center justify-center absolute inset-0`}
        >
          <span className="text-gray-500 text-sm">Cargando...</span>
        </div>
      )}
      <img
        src={property.imageUrl}
        alt={`Propiedad ${property.ref}`}
        className={className}
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{ display: isLoading ? "none" : "block" }}
      />
    </div>
  );
};

export default PropertyImage;
