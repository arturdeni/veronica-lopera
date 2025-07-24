// src/pages/AlquilerVenta.jsx - Versión refactorizada
import React from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

// Componentes
import SearchFilters from "../components/SearchFilters";
import PropertyCard from "../components/PropertyCard";

// Hooks
import { useProperties } from "../hooks/useProperties";

const AlquilerVenta = () => {
  const {
    properties,
    propertyTypes,
    locations,
    isLoading,
    isSearching,
    error,
    filters,
    handleFilterChange,
    applyFilters,
    clearFilters,
  } = useProperties();

  // Manejador del formulario de búsqueda
  const handleSubmit = (e) => {
    e.preventDefault();
    applyFilters();
  };

  // Estado de carga inicial
  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando propiedades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[40vh]">
        <img
          src="/images/hero.jpg"
          alt="Properties"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative h-full flex flex-col justify-center">
          <div className="container mx-auto px-6">
            <h1 className="text-white text-6xl font-light mb-6">
              Alquiler y Venta
            </h1>
            <div className="flex gap-2 text-white/80">
              <Link to="/">Home</Link>
              <span>→</span>
              <span>Alquiler y Venta</span>
            </div>
          </div>
        </div>
      </section>

      {/* Componente de filtros */}
      <SearchFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSubmit={handleSubmit}
        onClearFilters={clearFilters}
        propertyTypes={propertyTypes}
        locations={locations}
        isSearching={isSearching}
      />

      {/* Header de resultados */}
      <section className="py-4 bg-white border-b">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              {isSearching
                ? "Buscando..."
                : `${properties.length} propiedades encontradas`}
            </p>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                Tipos: {propertyTypes.length} | Ubicaciones: {locations.length}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid de propiedades */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          {/* Mensaje de error */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Grid de propiedades */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={`property-${property.cod_ofer}-${property.ref}`}
                property={property}
              />
            ))}
          </div>

          {/* Estado vacío */}
          {properties.length === 0 && !isLoading && !isSearching && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-light text-gray-600 mb-2">
                  No se encontraron propiedades
                </h3>
                <p className="text-gray-500 mb-4">
                  Intenta ajustar los filtros de búsqueda para encontrar más
                  resultados.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-primary text-white px-6 py-2 rounded hover:bg-opacity-90 transition-colors"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AlquilerVenta;
