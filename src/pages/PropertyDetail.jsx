// src/pages/PropertyDetail.jsx - Versión refactorizada
import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, Share2 } from "lucide-react";

// Componentes
import PropertyGallery from "../components/PropertyGallery";
import PropertyFeatures from "../components/PropertyFeatures";
import PropertySidebar from "../components/PropertySidebar";

// Hooks
import { usePropertyDetail } from "../hooks/usePropertyDetail";

const PropertyDetail = () => {
  const { id } = useParams();
  const {
    property,
    isLoading,
    error,
    isFavorite,
    toggleFavorite,
    shareProperty,
  } = usePropertyDetail(id);

  // Estado de carga
  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error loading property: {error}</p>
          <Link
            to="/alquiler-venta"
            className="text-primary hover:underline mt-4 inline-block"
          >
            ← Volver al listado
          </Link>
        </div>
      </div>
    );
  }

  // No hay propiedad
  if (!property) {
    return null;
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Navegación superior */}
      <section className="py-4 bg-gray-50 border-b">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <Link
              to="/alquiler-venta"
              className="flex items-center gap-2 text-primary hover:text-opacity-80 transition-colors"
            >
              <ArrowLeft size={20} />
              Volver al listado
            </Link>

            {/* Acciones */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleFavorite}
                className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                  isFavorite
                    ? "bg-primary text-white"
                    : "bg-white text-gray-600 border hover:bg-gray-50"
                }`}
              >
                <Heart size={16} fill={isFavorite ? "white" : "none"} />
                {isFavorite ? "Guardado" : "Guardar"}
              </button>

              <button
                onClick={shareProperty}
                className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 border rounded hover:bg-gray-50 transition-colors"
              >
                <Share2 size={16} />
                Compartir
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Galería de imágenes */}
      <PropertyGallery property={property} />

      {/* Información de la propiedad */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Características principales */}
            <PropertyFeatures property={property} />

            {/* Sidebar */}
            <PropertySidebar property={property} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default PropertyDetail;
