// src/components/MigrationTest.jsx
import React, { useState, useEffect } from "react";
import { usePropertiesWeb } from "../hooks/usePropertiesWeb";

/**
 * Componente para probar la migración a API Web
 * Se puede usar temporalmente para verificar que todo funciona
 */
const MigrationTest = () => {
  const {
    properties,
    propertyTypes,
    locations,
    zones,
    featuredProperties,
    isLoading,
    isSearching,
    error,
    filters,
    apiStatus,
    handleFilterChange,
    applyFilters,
    clearFilters,
    searchByTerm,
    stats,
  } = usePropertiesWeb();

  const [testResults, setTestResults] = useState({
    apiConnection: false,
    dataLoading: false,
    imageUrls: false,
    extendedFields: false,
    filtering: false,
  });

  const [selectedProperty, setSelectedProperty] = useState(null);

  // Realizar tests automáticos
  useEffect(() => {
    const runTests = () => {
      const results = {
        apiConnection: !isLoading && !error,
        dataLoading: properties.length > 0 && propertyTypes.length > 0,
        imageUrls: properties.some(
          (p) => p.imageUrl && p.imageUrl.trim() !== ""
        ),
        extendedFields: properties.some(
          (p) => p.formattedPrice && p.rooms > 0 && p.builtSurface > 0
        ),
        filtering: Object.keys(filters).length > 0,
      };
      setTestResults(results);
    };

    if (!isLoading) {
      runTests();
    }
  }, [isLoading, error, properties, propertyTypes, filters]);

  const TestResult = ({ label, passed, description }) => (
    <div
      className={`p-3 rounded border ${
        passed ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`w-4 h-4 rounded-full ${
            passed ? "bg-green-500" : "bg-red-500"
          }`}
        ></span>
        <span className="font-medium">{label}</span>
        <span
          className={`text-sm ${passed ? "text-green-600" : "text-red-600"}`}
        >
          {passed ? "✓ PASS" : "✗ FAIL"}
        </span>
      </div>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
    </div>
  );

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Probando conexión con API Web...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-light text-primary mb-2">
          🚀 Migración API Web - Panel de Testing
        </h1>
        <p className="text-gray-600">
          Verificando que la nueva API Web funciona correctamente
        </p>
      </div>

      {/* Estado de la API */}
      {apiStatus && (
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-medium mb-4">📊 Estado de la API</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-600">Tipo</label>
              <p className="font-medium">{apiStatus.type}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Rate Limits</label>
              <p className="font-medium">{apiStatus.rateLimits.general}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Caché</label>
              <p className="font-medium">{apiStatus.cacheInfo.status}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tests automáticos */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-medium mb-4">🧪 Tests Automáticos</h2>
        <div className="space-y-3">
          <TestResult
            label="Conexión API"
            passed={testResults.apiConnection}
            description="Verificando que la API responde correctamente"
          />
          <TestResult
            label="Carga de Datos"
            passed={testResults.dataLoading}
            description="Verificando que se cargan propiedades y metadatos"
          />
          <TestResult
            label="URLs de Imágenes"
            passed={testResults.imageUrls}
            description="Verificando que las propiedades tienen imágenes"
          />
          <TestResult
            label="Campos Extendidos"
            passed={testResults.extendedFields}
            description="Verificando precio, habitaciones, superficie, etc."
          />
          <TestResult
            label="Sistema de Filtros"
            passed={testResults.filtering}
            description="Verificando que el sistema de filtros está activo"
          />
        </div>
      </div>

      {/* Estadísticas */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-medium mb-4">📈 Estadísticas</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {stats.totalProperties}
            </div>
            <div className="text-sm text-gray-600">Propiedades</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {stats.totalTypes}
            </div>
            <div className="text-sm text-gray-600">Tipos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {stats.totalLocations}
            </div>
            <div className="text-sm text-gray-600">Ciudades</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {stats.totalZones}
            </div>
            <div className="text-sm text-gray-600">Zonas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {stats.totalFeatured}
            </div>
            <div className="text-sm text-gray-600">Destacadas</div>
          </div>
        </div>
      </div>

      {/* Prueba de filtros */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-medium mb-4">🔍 Prueba de Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <select
            name="propertyType"
            value={filters.propertyType}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          >
            <option value="">Todos los tipos</option>
            {propertyTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          <select
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          >
            <option value="">Todas las ubicaciones</option>
            {locations.map((location) => (
              <option key={location.value} value={location.value}>
                {location.label}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="minPrice"
            placeholder="Precio mínimo"
            value={filters.minPrice}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          />

          <button
            onClick={clearFilters}
            disabled={isSearching}
            className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 disabled:opacity-50"
          >
            Limpiar Filtros
          </button>
        </div>

        {isSearching && (
          <div className="text-center py-4">
            <div className="inline-flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span>Aplicando filtros...</span>
            </div>
          </div>
        )}
      </div>

      {/* Grid de propiedades */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">🏠 Propiedades Cargadas</h2>
          <span className="text-sm text-gray-600">
            {properties.length} propiedades encontradas
          </span>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.slice(0, 6).map((property) => (
            <div
              key={property.id}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Imagen */}
              <div className="h-48 bg-gray-200 relative">
                {property.imageUrl ? (
                  <img
                    src={property.imageUrl}
                    alt={property.ref}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500"
                  style={{ display: property.imageUrl ? "none" : "flex" }}
                >
                  Sin imagen
                </div>

                {/* Badges */}
                <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                  {property.ref}
                </div>
                {property.operationType && (
                  <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                    {property.operationType}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-primary">
                    {property.propertyType}
                  </h3>
                  {property.formattedPrice && (
                    <span className="text-lg font-bold text-primary">
                      {property.formattedPrice}
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-2">
                  {property.city} {property.zone && `- ${property.zone}`}
                </p>

                <div className="flex gap-4 text-sm text-gray-600">
                  {property.rooms > 0 && <span>🛏️ {property.rooms}</span>}
                  {property.bathrooms > 0 && (
                    <span>🚿 {property.bathrooms}</span>
                  )}
                  {property.builtSurface > 0 && (
                    <span>📐 {property.builtSurface}m²</span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                  {property.features.elevator && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      Ascensor
                    </span>
                  )}
                  {property.features.airConditioning && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      A/A
                    </span>
                  )}
                  {(property.features.communityPool ||
                    property.features.privatePool) && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      Piscina
                    </span>
                  )}
                </div>

                <button
                  onClick={() =>
                    setSelectedProperty(
                      selectedProperty === property.id ? null : property.id
                    )
                  }
                  className="w-full mt-3 bg-primary text-white py-2 rounded hover:bg-opacity-90 transition-colors text-sm"
                >
                  {selectedProperty === property.id
                    ? "Ocultar detalles"
                    : "Ver detalles"}
                </button>

                {/* Detalles expandidos */}
                {selectedProperty === property.id && (
                  <div className="mt-3 p-3 bg-gray-50 rounded text-xs">
                    <pre className="whitespace-pre-wrap overflow-auto max-h-40">
                      {JSON.stringify(property, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {properties.length === 0 && !isSearching && (
          <div className="text-center py-8 text-gray-500">
            No se han cargado propiedades aún
          </div>
        )}
      </div>

      {/* Propiedades destacadas */}
      {featuredProperties.length > 0 && (
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-medium mb-4">
            ⭐ Propiedades Destacadas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredProperties.slice(0, 3).map((property) => (
              <div key={property.id} className="border rounded p-3">
                <h3 className="font-medium">{property.ref}</h3>
                <p className="text-sm text-gray-600">{property.city}</p>
                <p className="text-lg font-bold text-primary">
                  {property.formattedPrice}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Panel de debugging */}
      <details className="bg-gray-50 rounded-lg border">
        <summary className="p-4 cursor-pointer font-medium">
          🔧 Panel de Debugging (Click para expandir)
        </summary>
        <div className="p-4 border-t space-y-4">
          <div>
            <h3 className="font-medium mb-2">Filtros Actuales:</h3>
            <pre className="bg-white p-3 rounded border text-xs overflow-auto">
              {JSON.stringify(filters, null, 2)}
            </pre>
          </div>

          <div>
            <h3 className="font-medium mb-2">Estados:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>isLoading: {isLoading.toString()}</div>
              <div>isSearching: {isSearching.toString()}</div>
              <div>error: {error || "null"}</div>
              <div>properties.length: {properties.length}</div>
            </div>
          </div>
        </div>
      </details>
    </div>
  );
};

export default MigrationTest;
