// src/components/PropertyCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Bath, BedDouble, Square, MapPin } from "lucide-react";
import PropertyImage from "./PropertyImage";

/**
 * Card individual de propiedad
 * @param {Object} property - Datos de la propiedad
 */
const PropertyCard = ({ property }) => {
  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white">
      <div className="relative">
        <PropertyImage
          property={property}
          className="w-full h-48 object-cover"
        />

        {/* Referencia */}
        <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          {property.ref}
        </div>

        {/* Estados */}
        {property.nodisponible && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            No disponible
          </div>
        )}
        {property.prospecto && (
          <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
            Prospecto
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        {/* Header con título y precio */}
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-light text-primary">
            Ref: {property.ref}
          </h3>
          {property.precioinmo && (
            <span className="text-xl font-bold text-primary">
              {property.precioinmo.toLocaleString()}€
            </span>
          )}
        </div>

        {/* Características básicas */}
        <div className="flex gap-4 text-sm text-gray-600">
          {property.habitaciones && (
            <span className="flex items-center gap-1">
              <BedDouble size={16} />
              {property.habitaciones}
            </span>
          )}
          {property.banyos && (
            <span className="flex items-center gap-1">
              <Bath size={16} />
              {property.banyos}
            </span>
          )}
          {property.m_cons && (
            <span className="flex items-center gap-1">
              <Square size={16} />
              {property.m_cons}m²
            </span>
          )}
        </div>

        {/* Ubicación */}
        {property.ciudad && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin size={16} />
            {property.ciudad}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 border-t">
          <div className="text-xs text-gray-500">
            {property.formattedDate && (
              <span>Actualizado: {property.formattedDate}</span>
            )}
          </div>
          <Link
            to={`/propiedad/${property.cod_ofer}`}
            className="text-primary hover:text-opacity-80 transition-colors font-medium text-sm"
          >
            Ver detalles →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
