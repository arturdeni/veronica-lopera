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
import { getPropertyDetail } from "../services/inmovilla";

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPropertyDetail = async () => {
      setIsLoading(true);
      try {
        const data = await getPropertyDetail(id);
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
          src="/api/placeholder/1200/800"
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

              {/* Detalles completos */}
              <div>
                <h3 className="text-2xl font-light text-primary mb-6">
                  Detalles completos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {/* Detalles básicos */}
                  <div className="space-y-3">
                    {property.m_cons && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">
                          Superficie construida
                        </span>
                        <span className="font-medium">
                          {property.m_cons} m²
                        </span>
                      </div>
                    )}
                    {property.m_uties && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Superficie útil</span>
                        <span className="font-medium">
                          {property.m_uties} m²
                        </span>
                      </div>
                    )}
                    {property.habitaciones && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Habitaciones</span>
                        <span className="font-medium">
                          {property.habitaciones}
                        </span>
                      </div>
                    )}
                    {property.banyos && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Baños</span>
                        <span className="font-medium">{property.banyos}</span>
                      </div>
                    )}
                    {property.antiguedad && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Año construcción</span>
                        <span className="font-medium">
                          {property.antiguedad}
                        </span>
                      </div>
                    )}
                    {property.planta !== undefined && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Planta</span>
                        <span className="font-medium">{property.planta}ª</span>
                      </div>
                    )}
                  </div>

                  {/* Certificación energética */}
                  <div className="space-y-3">
                    {property.energialetra && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">
                          Certificación energética
                        </span>
                        <span className="font-medium">
                          {property.energialetra} ({property.energiavalor}{" "}
                          kWh/m²)
                        </span>
                      </div>
                    )}
                    {property.emisionesletra && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Emisiones CO2</span>
                        <span className="font-medium">
                          {property.emisionesletra} ({property.emisionesvalor}{" "}
                          kg CO2/m²)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Características y equipamiento */}
                <div className="mt-8">
                  <h4 className="text-xl font-light text-primary mb-4">
                    Características y equipamiento
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {property.cocina_inde === 1 && (
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        <span>Cocina independiente</span>
                      </div>
                    )}
                    {property.balcon === 1 && (
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        <span>Balcón</span>
                      </div>
                    )}
                    {property.terraza === 1 && (
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        <span>Terraza</span>
                      </div>
                    )}
                    {property.arma_empo === 1 && (
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        <span>Armarios empotrados</span>
                      </div>
                    )}
                    {property.luz === 1 && (
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        <span>Luz</span>
                      </div>
                    )}
                    {property.agua === 1 && (
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        <span>Agua</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ubicación y entorno */}
                <div className="mt-8">
                  <h4 className="text-xl font-light text-primary mb-4">
                    Entorno
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {property.centrico === 1 && (
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        <span>Céntrico</span>
                      </div>
                    )}
                    {property.costa === 1 && (
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        <span>Costa</span>
                      </div>
                    )}
                    {property.autobuses === 1 && (
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        <span>Autobuses</span>
                      </div>
                    )}
                    {property.colegios === 1 && (
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        <span>Colegios</span>
                      </div>
                    )}
                    {property.supermercados === 1 && (
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        <span>Supermercados</span>
                      </div>
                    )}
                    {property.distmar && (
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        <span>A {property.distmar}m del mar</span>
                      </div>
                    )}
                  </div>
                </div>
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
