// src/components/PropertyCard.jsx - ARCHIVO COMPLETO
import React from "react";
import { Link } from "react-router-dom";
import { Bath, BedDouble, Square, MapPin, Euro, Calendar } from "lucide-react";
import PropertyImage from "./PropertyImage";

/**
 * Card individual de propiedad - ACTUALIZADO según documentación API
 * @param {Object} property - Datos de la propiedad (campos actualizados)
 */
const PropertyCard = ({ property }) => {
  // Calcular habitaciones totales según documentación (habdobles + habitaciones)
  const totalRooms =
    property.totalRooms ||
    (property.habdobles || 0) + (property.habitaciones || 0);

  // Determinar precio a mostrar según tipo de operación
  const displayPrice =
    property.formattedPrice ||
    (property.precioinmo
      ? `${property.precioinmo.toLocaleString()}€`
      : property.precioalq
      ? `${property.precioalq.toLocaleString()}€/mes`
      : null);

  // Tipo de operación según keyacci (documentación: 1=Venta, 2=Alquiler, 3=Traspaso)
  const operationType =
    property.operationType ||
    (property.keyacci === 1
      ? "Venta"
      : property.keyacci === 2
      ? "Alquiler"
      : property.keyacci === 3
      ? "Traspaso"
      : null);

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

        {/* Estados según documentación */}
        <div className="absolute top-2 left-2 space-y-1">
          {(property.nodisponible === 1 || !property.available) && (
            <div className="bg-red-500 text-white text-xs px-2 py-1 rounded">
              No disponible
            </div>
          )}
          {property.prospecto === 1 && (
            <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
              Prospecto
            </div>
          )}
          {operationType && (
            <div className="bg-primary text-white text-xs px-2 py-1 rounded">
              {operationType}
            </div>
          )}
        </div>

        {/* Número de fotos si está disponible */}
        {property.numfotos > 1 && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            📷 {property.numfotos}
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        {/* Header con tipo de propiedad y precio */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-light text-primary">
              {property.nbtipo || "Propiedad"}
            </h3>
            <p className="text-sm text-gray-500">Ref: {property.ref}</p>
          </div>
          {displayPrice && (
            <div className="text-right">
              <span className="text-xl font-bold text-primary flex items-center gap-1">
                <Euro size={16} />
                {displayPrice}
              </span>
              {property.outlet &&
                property.outlet > (property.precioinmo || 0) && (
                  <span className="text-sm text-gray-500 line-through">
                    {property.outlet.toLocaleString()}€
                  </span>
                )}
            </div>
          )}
        </div>

        {/* Características básicas según campos documentados */}
        <div className="flex gap-4 text-sm text-gray-600 flex-wrap">
          {totalRooms > 0 && (
            <span className="flex items-center gap-1">
              <BedDouble size={16} />
              {totalRooms} hab
              {property.habdobles > 0 && (
                <span className="text-xs text-gray-400">
                  ({property.habdobles} dobles)
                </span>
              )}
            </span>
          )}
          {property.banyos > 0 && (
            <span className="flex items-center gap-1">
              <Bath size={16} />
              {property.banyos}
              {property.aseos > 0 && (
                <span className="text-xs text-gray-400">
                  +{property.aseos} aseos
                </span>
              )}
            </span>
          )}
          {(property.m_cons || property.m_utiles || property.m_uties) && (
            <span className="flex items-center gap-1">
              <Square size={16} />
              {property.m_cons || property.m_utiles || property.m_uties}m²
              {property.m_utiles &&
                property.m_cons &&
                property.m_utiles !== property.m_cons && (
                  <span className="text-xs text-gray-400">
                    ({property.m_utiles}m² útiles)
                  </span>
                )}
            </span>
          )}
        </div>

        {/* Ubicación */}
        {property.ciudad && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin size={16} />
            <span>
              {property.ciudad}
              {property.zona && (
                <span className="text-gray-400"> - {property.zona}</span>
              )}
            </span>
          </div>
        )}

        {/* Características destacadas */}
        <div className="flex flex-wrap gap-2 text-xs">
          {property.ascensor === 1 && (
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">
              Ascensor
            </span>
          )}
          {property.aire_con === 1 && (
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
              A/A
            </span>
          )}
          {(property.piscina_com === 1 || property.piscina_prop === 1) && (
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
              Piscina
            </span>
          )}
          {property.parking > 0 && (
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
              Parking {property.parking === 2 ? "✓" : "?"}
            </span>
          )}
          {property.distmar && property.distmar < 1000 && (
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
              🌊 {property.distanceToSea || `${property.distmar}m`}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 border-t">
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Calendar size={12} />
            {property.formattedDate && (
              <span>Act: {property.formattedDate}</span>
            )}
            {property.numagencia && (
              <span className="ml-2">Ag: {property.numagencia}</span>
            )}
          </div>
          <Link
            to={`/propiedad/${property.cod_ofer}`}
            className="text-primary hover:text-opacity-80 transition-colors font-medium text-sm px-3 py-1 border border-primary rounded hover:bg-primary hover:text-white"
          >
            Ver detalles →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
