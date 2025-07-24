// src/pages/AlquilerVenta.jsx - ARCHIVO COMPLETO
import React from "react";
import { Link } from "react-router-dom";
import { Home, AlertCircle, RefreshCw } from "lucide-react";

// Componentes
import SearchFilters from "../components/SearchFilters";
import PropertyCard from "../components/PropertyCard";
import RateLimitStatus from "../components/RateLimitStatus";

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
    rateLimitStatus,
    handleFilterChange,
    applyFilters,
    clearFilters,
    reloadData,
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
          <p className="mt-2 text-sm text-gray-500">
            Por favor, espera. Estamos respetando los límites de la API.
          </p>
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

      {/* Header de resultados con info adicional */}
      <section className="py-4 bg-white border-b">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600">
                {isSearching
                  ? "Buscando..."
                  : `${properties.length} propiedades encontradas`}
              </p>
              {properties.length > 0 && !isSearching && (
                <p className="text-sm text-gray-500 mt-1">
                  Tipos: {propertyTypes.length} | Ubicaciones:{" "}
                  {locations.length}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Botón de recarga */}
              <button
                onClick={reloadData}
                disabled={isSearching}
                className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
                title="Recargar propiedades"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isSearching ? "animate-spin" : ""}`}
                />
                Actualizar
              </button>

              {/* Indicador de rate limits si estamos cerca del límite */}
              {rateLimitStatus &&
                (!rateLimitStatus.properties.canRequest ||
                  !rateLimitStatus.enums.canRequest) && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm text-yellow-700">
                      Rate limit alcanzado
                    </span>
                  </div>
                )}
            </div>
          </div>
        </div>
      </section>

      {/* Mensaje de error */}
      {error && (
        <section className="py-4 bg-red-50 border-b border-red-200">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <div>
                <p className="font-medium">Error cargando propiedades</p>
                <p className="text-sm">{error}</p>
              </div>
              <button
                onClick={reloadData}
                className="ml-auto px-3 py-1 text-sm bg-red-100 hover:bg-red-200 rounded transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Grid de propiedades */}
      <section className="py-12">
        <div className="container mx-auto px-6">
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
                  resultados, o verifica que la API esté funcionando
                  correctamente.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={clearFilters}
                    className="bg-gray-100 text-gray-700 px-6 py-2 rounded hover:bg-gray-200 transition-colors"
                  >
                    Limpiar filtros
                  </button>
                  <button
                    onClick={reloadData}
                    className="bg-primary text-white px-6 py-2 rounded hover:bg-opacity-90 transition-colors"
                  >
                    Recargar datos
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading skeleton mientras se busca */}
          {isSearching && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="border rounded-lg overflow-hidden animate-pulse"
                >
                  <div className="w-full h-48 bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="flex gap-2">
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Componente de rate limits (solo en desarrollo o si hay problemas) */}
      {(process.env.NODE_ENV === "development" || error) && rateLimitStatus && (
        <RateLimitStatus
          rateLimitStatus={rateLimitStatus}
          onReload={reloadData}
        />
      )}
    </div>
  );
};

export default AlquilerVenta;
