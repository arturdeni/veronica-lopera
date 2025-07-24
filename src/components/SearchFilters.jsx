// src/components/SearchFilters.jsx
import React, { useState } from "react";
import { Search, Filter, X } from "lucide-react";

/**
 * Componente de filtros de búsqueda
 * @param {Object} filters - Estado actual de filtros
 * @param {Function} onFilterChange - Callback para cambios en filtros
 * @param {Function} onSubmit - Callback para envío del formulario
 * @param {Function} onClearFilters - Callback para limpiar filtros
 * @param {Array} propertyTypes - Lista de tipos de propiedades
 * @param {Array} locations - Lista de ubicaciones
 * @param {boolean} isSearching - Estado de búsqueda activa
 */
const SearchFilters = ({
  filters,
  onFilterChange,
  onSubmit,
  onClearFilters,
  propertyTypes,
  locations,
  isSearching,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-6">
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Búsqueda principal */}
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                name="searchTerm"
                placeholder="Buscar por referencia, ciudad, zona..."
                value={filters.searchTerm}
                onChange={onFilterChange}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="bg-primary text-white px-6 py-3 rounded hover:bg-opacity-90 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isSearching ? (
                "Buscando..."
              ) : (
                <>
                  <Search size={20} />
                  Buscar
                </>
              )}
            </button>
          </div>

          {/* Filtros básicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Tipo de propiedad */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Tipo de propiedad</label>
              <select
                name="propertyType"
                value={filters.propertyType}
                onChange={onFilterChange}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Todos los tipos</option>
                {propertyTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Ubicación */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Ubicación</label>
              <select
                name="location"
                value={filters.location}
                onChange={onFilterChange}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Todas las ubicaciones</option>
                {locations.map((location) => (
                  <option key={location.value} value={location.value}>
                    {location.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Precio mínimo */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Precio mínimo</label>
              <input
                type="number"
                name="minPrice"
                placeholder="€"
                value={filters.minPrice}
                onChange={onFilterChange}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Precio máximo */}
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Precio máximo</label>
              <input
                type="number"
                name="maxPrice"
                placeholder="€"
                value={filters.maxPrice}
                onChange={onFilterChange}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Controles de filtros avanzados */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-primary hover:text-opacity-80 transition-colors"
            >
              <Filter size={16} />
              {showAdvanced
                ? "Ocultar filtros avanzados"
                : "Mostrar filtros avanzados"}
            </button>

            <button
              type="button"
              onClick={onClearFilters}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <X size={16} />
              Limpiar filtros
            </button>
          </div>

          {/* Filtros avanzados */}
          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded border">
              {/* Habitaciones */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Habitaciones</label>
                <select
                  name="rooms"
                  value={filters.rooms}
                  onChange={onFilterChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Cualquiera</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5+</option>
                </select>
              </div>

              {/* Superficie mínima */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600">
                  Superficie mínima (m²)
                </label>
                <input
                  type="number"
                  name="minSurface"
                  placeholder="m²"
                  value={filters.minSurface}
                  onChange={onFilterChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Referencia */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Referencia</label>
                <input
                  type="text"
                  name="reference"
                  placeholder="Ej: VL017-28"
                  value={filters.reference}
                  onChange={onFilterChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Incluir no disponibles */}
              <div className="col-span-full flex items-center gap-2">
                <input
                  type="checkbox"
                  name="includeUnavailable"
                  id="includeUnavailable"
                  checked={filters.includeUnavailable}
                  onChange={onFilterChange}
                  className="rounded text-primary focus:ring-primary"
                />
                <label
                  htmlFor="includeUnavailable"
                  className="text-sm text-gray-600"
                >
                  Incluir propiedades no disponibles
                </label>
              </div>
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

export default SearchFilters;
