// src/pages/PropertyDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Home,
  Bath,
  BedDouble,
  Square,
  MapPin,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
import { getPropertyDetail } from "../services/inmovilla"; // Importamos el servicio

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPropertyDetail = async () => {
      setIsLoading(true);
      try {
        const data = await getPropertyDetail(id); // Usamos el servicio en lugar de fetch directo
        setProperty(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPropertyDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error loading property: {error}</p>
          <a
            href="/alquiler-venta"
            className="text-primary hover:underline mt-4 inline-block"
          >
            Volver al listado
          </a>
        </div>
      </div>
    );
  }

  if (!property) {
    return null;
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section with main image */}
      <section className="relative h-[60vh]">
        <img
          src="/api/placeholder/1200/800" // Reemplazar con property.imagen cuando esté disponible
          alt={property.ref}
          className="w-full h-full object-cover"
        />
        {property.nodisponible && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded">
            No disponible
          </div>
        )}
      </section>

      {/* Property Info */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <div className="flex items-center gap-4">
                  <h1 className="text-4xl font-light text-primary">
                    Ref: {property.ref}
                  </h1>
                  {property.precioinmo && (
                    <span className="text-2xl font-light">
                      {property.precioinmo.toLocaleString()}€
                    </span>
                  )}
                </div>
                {property.tituloes && (
                  <h2 className="text-xl text-gray-600 mt-2">
                    {property.tituloes}
                  </h2>
                )}
              </div>

              {/* Características principales */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {property.m_cons && (
                  <div className="flex items-center gap-2">
                    <Square className="text-secondary" size={20} />
                    <span>{property.m_cons}m²</span>
                  </div>
                )}
                {property.habitaciones && (
                  <div className="flex items-center gap-2">
                    <BedDouble className="text-secondary" size={20} />
                    <span>{property.habitaciones} hab.</span>
                  </div>
                )}
                {property.banyos && (
                  <div className="flex items-center gap-2">
                    <Bath className="text-secondary" size={20} />
                    <span>{property.banyos} baños</span>
                  </div>
                )}
              </div>

              {/* Descripción */}
              {property.descripciones && (
                <div className="prose max-w-none">
                  <h3 className="text-2xl font-light text-primary mb-4">
                    Descripción
                  </h3>
                  <p>{property.descripciones}</p>
                </div>
              )}

              {/* Características adicionales */}
              <div>
                <h3 className="text-2xl font-light text-primary mb-4">
                  Características
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.ascensor && (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-secondary rounded-full"></span>
                      <span>Ascensor</span>
                    </div>
                  )}
                  {property.aire_con && (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-secondary rounded-full"></span>
                      <span>Aire acondicionado</span>
                    </div>
                  )}
                  {/* Añadir más características según la API */}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Ubicación */}
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-light text-primary mb-4">
                  Ubicación
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-secondary mt-1" size={20} />
                    <div>
                      {property.calle && <div>{property.calle}</div>}
                      {property.ciudad && <div>{property.ciudad}</div>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contacto */}
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-light text-primary mb-4">
                  Contacto
                </h3>
                <div className="space-y-4">
                  <button className="w-full bg-primary text-white py-3 px-4 rounded hover:bg-opacity-90 transition-colors">
                    Solicitar información
                  </button>
                  <div className="flex items-center gap-3">
                    <Phone className="text-secondary" size={20} />
                    <span>+34 646 371 235</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="text-secondary" size={20} />
                    <span>info@veronicalopera.com</span>
                  </div>
                </div>
              </div>

              {/* Última actualización */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar size={16} />
                <span>
                  Actualizado:{" "}
                  {new Date(property.fechaact).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PropertyDetail;
