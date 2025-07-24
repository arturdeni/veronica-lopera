// src/components/PropertySidebar.jsx
import React from "react";
import { MapPin, Phone, Mail, Calendar, Waves } from "lucide-react";

/**
 * Sidebar con información de contacto y ubicación
 * @param {Object} property - Datos de la propiedad
 */
const PropertySidebar = ({ property }) => {
  const { features } = property;

  return (
    <div className="space-y-8">
      {/* Card de contacto */}
      <ContactCard />

      {/* Card de ubicación */}
      {features.location.city && <LocationCard location={features.location} />}

      {/* Card de información de la propiedad */}
      <PropertyInfoCard property={property} />
    </div>
  );
};

/**
 * Card de contacto
 */
const ContactCard = () => (
  <div className="border rounded-lg p-6 bg-white shadow-sm">
    <h3 className="text-xl font-light text-primary mb-4">
      Contacta con nosotras
    </h3>
    <div className="space-y-4">
      <button className="w-full bg-primary text-white py-3 px-4 rounded hover:bg-opacity-90 transition-colors">
        Solicitar información
      </button>
      <button className="w-full border border-primary text-primary py-3 px-4 rounded hover:bg-primary hover:text-white transition-colors">
        Solicitar visita
      </button>
      <div className="pt-4 border-t space-y-3">
        <div className="flex items-center gap-3">
          <Phone className="text-secondary" size={20} />
          <a
            href="tel:+34646371235"
            className="hover:text-primary transition-colors"
          >
            +34 646 371 235
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Mail className="text-secondary" size={20} />
          <a
            href="mailto:info@veronicalopera.com"
            className="hover:text-primary transition-colors"
          >
            info@veronicalopera.com
          </a>
        </div>
      </div>
    </div>
  </div>
);

/**
 * Card de ubicación
 */
const LocationCard = ({ location }) => (
  <div className="border rounded-lg p-6 bg-white shadow-sm">
    <h3 className="text-xl font-light text-primary mb-4">Ubicación</h3>
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <MapPin className="text-secondary mt-1" size={20} />
        <div>
          {location.street && <div>{location.street}</div>}
          <div>{location.city}</div>
          {location.zone && (
            <div className="text-sm text-gray-500">{location.zone}</div>
          )}
        </div>
      </div>
      {location.distanceToSea && (
        <div className="text-sm text-gray-600">
          <Waves className="inline mr-1" size={16} />A {location.distanceToSea}m
          del mar
        </div>
      )}
    </div>
  </div>
);

/**
 * Card de información de la propiedad
 */
const PropertyInfoCard = ({ property }) => (
  <div className="border rounded-lg p-6 bg-white shadow-sm">
    <h3 className="text-xl font-light text-primary mb-4">
      Información de la propiedad
    </h3>
    <div className="space-y-3 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600">Referencia:</span>
        <span className="font-medium">{property.ref}</span>
      </div>

      {property.formattedDate && (
        <div className="flex items-center gap-2 text-gray-500">
          <Calendar size={16} />
          <span>Actualizado: {property.formattedDate}</span>
        </div>
      )}

      <div className="flex justify-between">
        <span className="text-gray-600">Estado:</span>
        <span
          className={`font-medium ${
            property.available ? "text-green-600" : "text-red-600"
          }`}
        >
          {property.available ? "Disponible" : "No disponible"}
        </span>
      </div>

      {property.isProspect && (
        <div className="flex justify-between">
          <span className="text-gray-600">Tipo:</span>
          <span className="font-medium text-blue-600">Prospecto</span>
        </div>
      )}
    </div>
  </div>
);

export default PropertySidebar;
