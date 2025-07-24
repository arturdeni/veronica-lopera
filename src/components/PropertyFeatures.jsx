// src/components/PropertyFeatures.jsx
import React from "react";
import {
  BedDouble,
  Bath,
  Square,
  MapPin,
  Car,
  Waves,
  Sun,
  Wind,
  Thermometer,
  Building,
  TreePine,
} from "lucide-react";

/**
 * Componente para mostrar las características principales de la propiedad
 * @param {Object} property - Datos de la propiedad
 */
const PropertyFeatures = ({ property }) => {
  const { features } = property;

  return (
    <div className="lg:col-span-2 space-y-8">
      {/* Header principal */}
      <div>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-4xl font-light text-primary mb-2">
              Ref: {property.ref}
            </h1>
            {property.tituloes && (
              <h2 className="text-xl text-gray-600">{property.tituloes}</h2>
            )}
          </div>
          {property.formattedPrice && (
            <div className="text-right">
              <div className="text-3xl font-light text-primary">
                {property.formattedPrice}
              </div>
            </div>
          )}
        </div>

        {/* Características principales */}
        <div className="flex flex-wrap gap-6 text-gray-600">
          {features.basic.rooms && (
            <div className="flex items-center gap-2">
              <BedDouble className="text-secondary" size={20} />
              <span>{features.basic.rooms} habitaciones</span>
            </div>
          )}
          {features.basic.bathrooms && (
            <div className="flex items-center gap-2">
              <Bath className="text-secondary" size={20} />
              <span>{features.basic.bathrooms} baños</span>
            </div>
          )}
          {features.basic.surface && (
            <div className="flex items-center gap-2">
              <Square className="text-secondary" size={20} />
              <span>{features.basic.surface} m²</span>
            </div>
          )}
          {features.location.city && (
            <div className="flex items-center gap-2">
              <MapPin className="text-secondary" size={20} />
              <span>{features.location.city}</span>
            </div>
          )}
        </div>
      </div>

      {/* Descripción */}
      {property.description && (
        <div>
          <h3 className="text-2xl font-light text-primary mb-4">Descripción</h3>
          <div className="prose max-w-none text-gray-700">
            <p>{property.description}</p>
          </div>
        </div>
      )}

      {/* Características detalladas */}
      <div>
        <h3 className="text-2xl font-light text-primary mb-6">
          Características detalladas
        </h3>

        {/* Grid de información básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Información básica */}
          <div>
            <h4 className="text-lg font-medium text-gray-800 mb-4">
              Información básica
            </h4>
            <div className="space-y-3">
              {features.basic.surface && (
                <DetailRow
                  label="Superficie construida"
                  value={`${features.basic.surface} m²`}
                />
              )}
              {features.basic.usefulSurface && (
                <DetailRow
                  label="Superficie útil"
                  value={`${features.basic.usefulSurface} m²`}
                />
              )}
              {features.basic.rooms && (
                <DetailRow label="Habitaciones" value={features.basic.rooms} />
              )}
              {features.basic.bathrooms && (
                <DetailRow label="Baños" value={features.basic.bathrooms} />
              )}
              {features.basic.floor !== undefined && (
                <DetailRow label="Planta" value={`${features.basic.floor}ª`} />
              )}
              {features.basic.year && (
                <DetailRow
                  label="Año construcción"
                  value={features.basic.year}
                />
              )}
            </div>
          </div>

          {/* Certificación energética */}
          {(features.energy.energyRating ||
            features.energy.emissionsRating) && (
            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-4">
                Certificación energética
              </h4>
              <div className="space-y-3">
                {features.energy.energyRating && (
                  <DetailRow
                    label="Certificación energética"
                    value={`${features.energy.energyRating}${
                      features.energy.energyValue
                        ? ` (${features.energy.energyValue} kWh/m²)`
                        : ""
                    }`}
                  />
                )}
                {features.energy.emissionsRating && (
                  <DetailRow
                    label="Emisiones CO2"
                    value={`${features.energy.emissionsRating}${
                      features.energy.emissionsValue
                        ? ` (${features.energy.emissionsValue} kg CO2/m²)`
                        : ""
                    }`}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Características y equipamiento */}
        <div>
          <h4 className="text-lg font-medium text-gray-800 mb-4">
            Características y equipamiento
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <FeatureIcon
              condition={features.extras.balcony}
              icon={<Building className="text-secondary" size={16} />}
              label="Balcón"
            />
            <FeatureIcon
              condition={features.extras.terrace}
              icon={<Sun className="text-secondary" size={16} />}
              label="Terraza"
            />
            <FeatureIcon
              condition={features.extras.garage}
              icon={<Car className="text-secondary" size={16} />}
              label="Garaje"
            />
            <FeatureIcon
              condition={features.extras.elevator}
              icon={<Building className="text-secondary" size={16} />}
              label="Ascensor"
            />
            <FeatureIcon
              condition={features.extras.airConditioning}
              icon={<Wind className="text-secondary" size={16} />}
              label="Aire acondicionado"
            />
            <FeatureIcon
              condition={features.extras.heating}
              icon={<Thermometer className="text-secondary" size={16} />}
              label="Calefacción"
            />
            <FeatureIcon
              condition={features.extras.pool}
              icon={<Waves className="text-secondary" size={16} />}
              label="Piscina"
            />
            <FeatureIcon
              condition={features.extras.garden}
              icon={<TreePine className="text-secondary" size={16} />}
              label="Jardín"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Componente para mostrar una fila de detalle
 */
const DetailRow = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b">
    <span className="text-gray-600">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

/**
 * Componente para mostrar un icono de característica
 */
const FeatureIcon = ({ condition, icon, label }) => {
  if (!condition) return null;

  return (
    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded">
      {icon}
      <span className="text-sm">{label}</span>
    </div>
  );
};

export default PropertyFeatures;
