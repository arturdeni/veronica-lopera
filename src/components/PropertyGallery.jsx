// src/components/PropertyGallery.jsx
import React, { useState } from "react";

/**
 * Componente de galería de imágenes para el detalle de propiedad
 * @param {Object} property - Datos de la propiedad
 */
const PropertyGallery = ({ property }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!property.images || property.images.length === 0) {
    return (
      <div className="relative h-[60vh] bg-gray-200 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <span>Sin imágenes disponibles</span>
        </div>
      </div>
    );
  }

  return (
    <section className="relative">
      {/* Imagen principal */}
      <div className="relative h-[60vh]">
        <img
          src={
            property.images[currentImageIndex]?.url ||
            "/api/placeholder/1200/800"
          }
          alt={property.images[currentImageIndex]?.alt || property.ref}
          className="w-full h-full object-cover"
        />

        {/* Estados de la propiedad */}
        {!property.available && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded">
            No disponible
          </div>
        )}

        {property.isProspect && (
          <div className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded">
            Prospecto
          </div>
        )}

        {/* Navegación de imágenes */}
        {property.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex gap-2">
              {property.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Miniaturas */}
      {property.images.length > 1 && (
        <div className="bg-white p-4 border-b">
          <div className="container mx-auto px-6">
            <div className="flex gap-2 overflow-x-auto">
              {property.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-16 rounded overflow-hidden border-2 transition-colors ${
                    index === currentImageIndex
                      ? "border-primary"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PropertyGallery;
